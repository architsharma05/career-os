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
