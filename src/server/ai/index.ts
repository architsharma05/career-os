import { mockRecommendRoles, mockScoreJob } from "./mock-ai";

export const aiProvider = process.env.OPENAI_API_KEY ? "openai-ready" : "mock";

export const ai = {
  scoreJob: mockScoreJob,
  recommendRoles: mockRecommendRoles
};
