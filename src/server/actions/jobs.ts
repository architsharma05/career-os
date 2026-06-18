"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApplicationStatus, WorkPreference } from "@prisma/client";

import { checkboxValue, commaList, optionalDate, optionalNumber, optionalString, requiredString } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/server/demo-user";

function parseJobForm(formData: FormData) {
  return {
    title: requiredString(formData, "title"),
    companyId: optionalString(formData.get("companyId")),
    url: optionalString(formData.get("url")),
    source: optionalString(formData.get("source")) ?? "manual entry",
    location: optionalString(formData.get("location")),
    workPreference: (optionalString(formData.get("workPreference")) ?? "FLEXIBLE") as WorkPreference,
    salaryMin: optionalNumber(formData.get("salaryMin")),
    salaryMax: optionalNumber(formData.get("salaryMax")),
    employmentType: optionalString(formData.get("employmentType")),
    experienceLevel: optionalString(formData.get("experienceLevel")),
    description: requiredString(formData, "description"),
    requiredSkills: commaList(formData.get("requiredSkills")),
    preferredSkills: commaList(formData.get("preferredSkills")),
    deadline: optionalDate(formData.get("deadline"))
  };
}

export async function createJob(formData: FormData) {
  const user = await getDemoUser();
  const activeProfile = await prisma.searchProfile.findFirst({
    where: { userId: user.id, isActive: true }
  });

  const job = await prisma.job.create({
    data: {
      userId: user.id,
      ...parseJobForm(formData),
      applications: {
        create: {
          userId: user.id,
          searchProfileId: activeProfile?.id,
          status: ApplicationStatus.SAVED,
          notes: "Created from the Phase 2 job form."
        }
      }
    }
  });

  revalidatePath("/jobs");
  revalidatePath("/");
  redirect(`/jobs/${job.id}`);
}

export async function updateJob(formData: FormData) {
  const user = await getDemoUser();
  const id = requiredString(formData, "id");

  await prisma.job.update({
    where: { id, userId: user.id },
    data: parseJobForm(formData)
  });

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);
  revalidatePath("/");
  redirect(`/jobs/${id}`);
}

export async function deleteJob(formData: FormData) {
  const user = await getDemoUser();
  const id = requiredString(formData, "id");

  await prisma.job.delete({
    where: { id, userId: user.id }
  });

  revalidatePath("/jobs");
  revalidatePath("/");
  redirect("/jobs");
}

export async function quickAddJob(formData: FormData) {
  const shouldApply = checkboxValue(formData.get("createApplication"));
  const user = await getDemoUser();
  const activeProfile = await prisma.searchProfile.findFirst({
    where: { userId: user.id, isActive: true }
  });

  await prisma.job.create({
    data: {
      userId: user.id,
      title: requiredString(formData, "title"),
      source: "quick add",
      location: optionalString(formData.get("location")),
      workPreference: WorkPreference.FLEXIBLE,
      description: optionalString(formData.get("description")) ?? "Quick-added role. Paste the full job description when ready.",
      requiredSkills: [],
      preferredSkills: [],
      applications: shouldApply
        ? {
            create: {
              userId: user.id,
              searchProfileId: activeProfile?.id,
              status: ApplicationStatus.SAVED
            }
          }
        : undefined
    }
  });

  revalidatePath("/jobs");
  redirect("/jobs");
}
