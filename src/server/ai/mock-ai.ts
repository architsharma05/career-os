import type { JobMatchScore, RoleRecommendation } from "./types";

export function mockScoreJob(): JobMatchScore {
  return {
    match_score: 88,
    role_fit_score: 91,
    skill_match_score: 84,
    experience_match_score: 79,
    location_match_score: 95,
    career_goal_score: 90,
    strengths: ["Strong API exposure", "Clear customer-facing project narrative", "Good fit for SaaS implementation work"],
    gaps: ["Add more proof-of-concept language", "Quantify one technical project outcome"],
    missing_keywords: ["stakeholder management", "technical discovery", "solution design"],
    suggested_resume_keywords: ["API integration", "customer workflow", "implementation plan"],
    recommended_next_action: "network first",
    outreach_angle:
      "Lead with the CareerOS project and ask how the team evaluates early-career technical storytellers.",
    should_apply: true,
    reason_summary:
      "This role maps well to the active profile because it blends API fluency, technical communication, and customer-facing implementation work."
  };
}

export function mockRecommendRoles(): RoleRecommendation[] {
  return [
    {
      role_template: "Solutions Engineer",
      confidence_score: 94,
      reasoning: "Your resume combines technical build work with communication-heavy project framing.",
      missing_skills: ["formal discovery process", "enterprise stakeholder examples"],
      suggested_next_steps: ["Add a demo walkthrough link", "Prepare a technical customer story"]
    },
    {
      role_template: "AI Automation Engineer",
      confidence_score: 89,
      reasoning: "Your projects show workflow design, API integration, and practical AI tooling.",
      missing_skills: ["evals", "queue-based automation"],
      suggested_next_steps: ["Document error handling", "Add one structured-output example"]
    },
    {
      role_template: "Java Developer",
      confidence_score: 77,
      reasoning: "You have Java and API fundamentals, but the resume should emphasize production backend depth.",
      missing_skills: ["Spring Boot", "JUnit", "database indexing"],
      suggested_next_steps: ["Add a Java service project", "Include test coverage metrics"]
    }
  ];
}
