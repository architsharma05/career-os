export type RecommendedNextAction =
  | "apply now"
  | "network first"
  | "save for later"
  | "skip"
  | "improve resume first";

export type JobMatchScore = {
  match_score: number;
  role_fit_score: number;
  skill_match_score: number;
  experience_match_score: number;
  location_match_score: number;
  career_goal_score: number;
  strengths: string[];
  gaps: string[];
  missing_keywords: string[];
  suggested_resume_keywords: string[];
  recommended_next_action: RecommendedNextAction;
  outreach_angle: string;
  should_apply: boolean;
  reason_summary: string;
};

export type RoleRecommendation = {
  role_template: string;
  confidence_score: number;
  reasoning: string;
  missing_skills: string[];
  suggested_next_steps: string[];
};

export type GeneratedDraftResult = {
  title: string;
  content: string;
  review_notes: string[];
};

export type InterviewPrep = {
  company_summary_placeholder: string;
  likely_technical_questions: string[];
  likely_behavioral_questions: string[];
  role_specific_preparation_topics: string[];
  star_story_suggestions: string[];
  questions_to_ask_interviewer: string[];
};

export type AiJobInput = {
  resumeText: string;
  searchProfile: string;
  jobDescription: string;
  jobTitle: string;
  companyName?: string | null;
};

export type AiDraftInput = AiJobInput & {
  draftType: "outreach" | "cover_letter";
  contactName?: string | null;
};
