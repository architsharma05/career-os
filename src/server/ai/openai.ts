import type {
  AiDraftInput,
  AiJobInput,
  GeneratedDraftResult,
  InterviewPrep,
  JobMatchScore,
  RoleRecommendation,
} from "./types";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

async function structuredJson<T>(prompt: string, fallback: T): Promise<T> {
  if (!process.env.OPENAI_API_KEY) return fallback;

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        input: prompt,
        text: { format: { type: "json_object" } },
      }),
    });

    if (!response.ok) {
      console.error(
        `OpenAI request failed: ${response.status} ${await response.text()}`,
      );
      return fallback;
    }

    const payload = await response.json();
    const output =
      payload.output_text ??
      payload.output
        ?.flatMap(
          (item: { content?: { text?: string }[] }) => item.content ?? [],
        )
        .map((item: { text?: string }) => item.text)
        .filter(Boolean)
        .join("\n");

    return output ? (JSON.parse(output) as T) : fallback;
  } catch (error) {
    console.error("OpenAI structured output failed", error);
    return fallback;
  }
}

export function openAiScoreJob(input: AiJobInput, fallback: JobMatchScore) {
  return structuredJson<JobMatchScore>(
    `Return only JSON for an ethical job match score. Schema keys: match_score, role_fit_score, skill_match_score, experience_match_score, location_match_score, career_goal_score, strengths, gaps, missing_keywords, suggested_resume_keywords, recommended_next_action, outreach_angle, should_apply, reason_summary. Use 0-100 integers. Never suggest fabricating experience.\n\nResume:\n${input.resumeText}\n\nSearch profile:\n${input.searchProfile}\n\nJob: ${input.jobTitle} at ${input.companyName ?? "Unknown company"}\n${input.jobDescription}`,
    fallback,
  );
}

export function openAiRecommendRoles(
  resumeText: string,
  fallback: RoleRecommendation[],
) {
  return structuredJson<RoleRecommendation[]>(
    `Return only a JSON array of 3-5 role recommendations with keys role_template, confidence_score, reasoning, missing_skills, suggested_next_steps. Resume:\n${resumeText}`,
    fallback,
  );
}

export function openAiGenerateDraft(
  input: AiDraftInput,
  fallback: GeneratedDraftResult,
) {
  return structuredJson<GeneratedDraftResult>(
    `Return only JSON with title, content, review_notes. Generate an editable ${input.draftType} draft. It must be honest, concise, human-review-only, and must not claim unverified experience.\n\nResume:\n${input.resumeText}\n\nSearch profile:\n${input.searchProfile}\n\nJob: ${input.jobTitle} at ${input.companyName ?? "Unknown company"}\nContact: ${input.contactName ?? "not specified"}\nDescription:\n${input.jobDescription}`,
    fallback,
  );
}

export function openAiInterviewPrep(
  input: AiJobInput,
  fallback: InterviewPrep,
) {
  return structuredJson<InterviewPrep>(
    `Return only JSON with company_summary_placeholder, likely_technical_questions, likely_behavioral_questions, role_specific_preparation_topics, star_story_suggestions, questions_to_ask_interviewer. Keep advice honest and preparation-focused.\n\nSearch profile:\n${input.searchProfile}\n\nJob: ${input.jobTitle} at ${input.companyName ?? "Unknown company"}\n${input.jobDescription}`,
    fallback,
  );
}
