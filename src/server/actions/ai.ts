"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RecommendedAction } from "@prisma/client";

import { requiredString } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { ai, aiProvider } from "@/server/ai";
import { getDemoUser } from "@/server/demo-user";
import type { RecommendedNextAction } from "@/server/ai/types";

const actionMap: Record<RecommendedNextAction, RecommendedAction> = {
  "apply now": RecommendedAction.APPLY_NOW,
  "network first": RecommendedAction.NETWORK_FIRST,
  "save for later": RecommendedAction.SAVE_FOR_LATER,
  skip: RecommendedAction.SKIP,
  "improve resume first": RecommendedAction.IMPROVE_RESUME_FIRST,
};

async function buildJobInput(jobId: string, searchProfileId?: string) {
  const user = await getDemoUser();
  const [resume, job, profile] = await Promise.all([
    prisma.resumeProfile.findUnique({ where: { userId: user.id } }),
    prisma.job.findFirst({
      where: { id: jobId, userId: user.id },
      include: { company: true },
    }),
    searchProfileId
      ? prisma.searchProfile.findFirst({
          where: { id: searchProfileId, userId: user.id },
        })
      : prisma.searchProfile.findFirst({
          where: { userId: user.id, isActive: true },
        }),
  ]);

  if (!job || !profile)
    throw new Error("Job and search profile are required for AI generation.");

  return {
    user,
    job,
    profile,
    input: {
      resumeText:
        resume?.resumeText ?? "No resume profile has been created yet.",
      searchProfile: JSON.stringify({
        name: profile.name,
        targetRole: profile.targetRole,
        relatedRoles: profile.relatedRoles,
        requiredSkills: profile.requiredSkills,
        preferredSkills: profile.preferredSkills,
        goal: profile.jobSearchGoal,
      }),
      jobDescription: job.description,
      jobTitle: job.title,
      companyName: job.company?.name,
    },
  };
}

export async function scoreJobWithAi(formData: FormData) {
  const jobId = requiredString(formData, "jobId");
  const searchProfileId = requiredString(formData, "searchProfileId");
  const { job, profile, input } = await buildJobInput(jobId, searchProfileId);
  const score = await ai.scoreJob(input);

  await prisma.jobMatch.upsert({
    where: {
      jobId_searchProfileId: { jobId: job.id, searchProfileId: profile.id },
    },
    update: {
      matchScore: score.match_score,
      roleFitScore: score.role_fit_score,
      skillMatchScore: score.skill_match_score,
      experienceMatchScore: score.experience_match_score,
      locationMatchScore: score.location_match_score,
      careerGoalScore: score.career_goal_score,
      strengths: score.strengths,
      gaps: score.gaps,
      missingKeywords: score.missing_keywords,
      suggestedResumeKeywords: score.suggested_resume_keywords,
      recommendedNextAction: actionMap[score.recommended_next_action],
      outreachAngle: score.outreach_angle,
      shouldApply: score.should_apply,
      reasonSummary: score.reason_summary,
    },
    create: {
      jobId: job.id,
      searchProfileId: profile.id,
      matchScore: score.match_score,
      roleFitScore: score.role_fit_score,
      skillMatchScore: score.skill_match_score,
      experienceMatchScore: score.experience_match_score,
      locationMatchScore: score.location_match_score,
      careerGoalScore: score.career_goal_score,
      strengths: score.strengths,
      gaps: score.gaps,
      missingKeywords: score.missing_keywords,
      suggestedResumeKeywords: score.suggested_resume_keywords,
      recommendedNextAction: actionMap[score.recommended_next_action],
      outreachAngle: score.outreach_angle,
      shouldApply: score.should_apply,
      reasonSummary: score.reason_summary,
    },
  });

  revalidatePath(`/jobs/${job.id}`);
  revalidatePath("/ai");
}

export async function generateDraftWithAi(formData: FormData) {
  const jobId = requiredString(formData, "jobId");
  const draftType = requiredString(formData, "draftType") as
    | "outreach"
    | "cover_letter";
  const { user, job, input } = await buildJobInput(jobId);
  const draft = await ai.generateDraft({ ...input, draftType });

  await prisma.generatedDraft.create({
    data: {
      userId: user.id,
      jobId: job.id,
      type: draftType,
      title: draft.title,
      content: draft.content,
      aiMetadata: { provider: aiProvider, reviewNotes: draft.review_notes },
    },
  });

  revalidatePath(`/jobs/${job.id}`);
  revalidatePath("/ai");
}

export async function generateInterviewPrepWithAi(formData: FormData) {
  const jobId = requiredString(formData, "jobId");
  const { user, job, input } = await buildJobInput(jobId);
  const prep = await ai.interviewPrep(input);

  await prisma.generatedDraft.create({
    data: {
      userId: user.id,
      jobId: job.id,
      type: "interview_prep",
      title: `Interview prep for ${job.title}`,
      content: JSON.stringify(prep, null, 2),
      aiMetadata: { provider: aiProvider, structured: true },
    },
  });

  revalidatePath(`/jobs/${job.id}`);
  revalidatePath("/ai");
}

export async function recommendRolesWithAi() {
  const user = await getDemoUser();
  const resume = await prisma.resumeProfile.findUnique({
    where: { userId: user.id },
  });
  const recommendations = await ai.recommendRoles(
    resume?.resumeText ?? "No resume profile has been created yet.",
  );

  await prisma.generatedDraft.create({
    data: {
      userId: user.id,
      type: "role_recommendations",
      title: "Resume-to-role recommendations",
      content: JSON.stringify(recommendations, null, 2),
      aiMetadata: { provider: aiProvider, structured: true },
    },
  });

  revalidatePath("/ai");
  redirect("/ai");
}
