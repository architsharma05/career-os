import {
  mockGenerateDraft,
  mockInterviewPrep,
  mockRecommendRoles,
  mockScoreJob,
} from "./mock-ai";
import {
  openAiGenerateDraft,
  openAiInterviewPrep,
  openAiRecommendRoles,
  openAiScoreJob,
} from "./openai";
import type { AiDraftInput, AiJobInput } from "./types";

export const aiProvider = process.env.OPENAI_API_KEY ? "openai" : "mock";

export const ai = {
  async scoreJob(input: AiJobInput) {
    const fallback = mockScoreJob(input);
    return aiProvider === "openai" ? openAiScoreJob(input, fallback) : fallback;
  },
  async recommendRoles(resumeText: string) {
    const fallback = mockRecommendRoles();
    return aiProvider === "openai"
      ? openAiRecommendRoles(resumeText, fallback)
      : fallback;
  },
  async generateDraft(input: AiDraftInput) {
    const fallback = mockGenerateDraft(input);
    return aiProvider === "openai"
      ? openAiGenerateDraft(input, fallback)
      : fallback;
  },
  async interviewPrep(input: AiJobInput) {
    const fallback = mockInterviewPrep(input);
    return aiProvider === "openai"
      ? openAiInterviewPrep(input, fallback)
      : fallback;
  },
};
