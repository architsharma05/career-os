import type {
  AiDraftInput,
  AiJobInput,
  GeneratedDraftResult,
  InterviewPrep,
  JobMatchScore,
  RoleRecommendation,
} from "./types";

export function mockScoreJob(input?: Partial<AiJobInput>): JobMatchScore {
  const title = input?.jobTitle ?? "this role";
  return {
    match_score: 88,
    role_fit_score: 91,
    skill_match_score: 84,
    experience_match_score: 79,
    location_match_score: 95,
    career_goal_score: 90,
    strengths: [
      "Strong API exposure",
      "Clear customer-facing project narrative",
      "Good fit for SaaS implementation work",
    ],
    gaps: [
      "Add more proof-of-concept language",
      "Quantify one technical project outcome",
    ],
    missing_keywords: [
      "stakeholder management",
      "technical discovery",
      "solution design",
    ],
    suggested_resume_keywords: [
      "API integration",
      "customer workflow",
      "implementation plan",
    ],
    recommended_next_action: "network first",
    outreach_angle: `Lead with CareerOS and ask how the team evaluates early-career fit for ${title}.`,
    should_apply: true,
    reason_summary:
      "This role maps well to the active profile because it blends API fluency, technical communication, and customer-facing implementation work.",
  };
}

export function mockRecommendRoles(): RoleRecommendation[] {
  return [
    {
      role_template: "Solutions Engineer",
      confidence_score: 94,
      reasoning:
        "Your resume combines technical build work with communication-heavy project framing.",
      missing_skills: [
        "formal discovery process",
        "enterprise stakeholder examples",
      ],
      suggested_next_steps: [
        "Add a demo walkthrough link",
        "Prepare a technical customer story",
      ],
    },
    {
      role_template: "AI Automation Engineer",
      confidence_score: 89,
      reasoning:
        "Your projects show workflow design, API integration, and practical AI tooling.",
      missing_skills: ["evals", "queue-based automation"],
      suggested_next_steps: [
        "Document error handling",
        "Add one structured-output example",
      ],
    },
    {
      role_template: "Java Developer",
      confidence_score: 77,
      reasoning:
        "You have Java and API fundamentals, but the resume should emphasize production backend depth.",
      missing_skills: ["Spring Boot", "JUnit", "database indexing"],
      suggested_next_steps: [
        "Add a Java service project",
        "Include test coverage metrics",
      ],
    },
  ];
}

export function mockGenerateDraft(
  input: Partial<AiDraftInput> = {},
): GeneratedDraftResult {
  const company = input.companyName ?? "your team";
  const title =
    input.draftType === "cover_letter"
      ? "Editable cover letter draft"
      : "Editable outreach draft";
  return {
    title,
    content: `Hi ${input.contactName ?? "there"},\n\nI’m exploring ${input.jobTitle ?? "the open role"} at ${company}. My recent work includes building CareerOS, a full-stack AI job-search CRM with structured scoring, CRM workflows, and human-reviewed AI drafts. I’d value the chance to learn what strong candidates demonstrate for this team.\n\nBest,\nDemo User`,
    review_notes: [
      "Verify the recipient and company details before sending.",
      "Replace any placeholder details with your own specifics.",
      "Do not add claims you cannot support in an interview.",
    ],
  };
}

export function mockInterviewPrep(
  input: Partial<AiJobInput> = {},
): InterviewPrep {
  return {
    company_summary_placeholder: `Research ${input.companyName ?? "the company"}'s product, customers, funding/news, and engineering or go-to-market priorities before the interview.`,
    likely_technical_questions: [
      "Explain an API integration you designed.",
      "How would you debug an unreliable workflow?",
      "How do you validate AI-generated output?",
    ],
    likely_behavioral_questions: [
      "Tell me about a time you learned a new domain quickly.",
      "Describe a difficult stakeholder conversation.",
      "How do you prioritize ambiguous work?",
    ],
    role_specific_preparation_topics: [
      "CareerOS architecture",
      "structured JSON outputs",
      "CRM pipeline data modeling",
    ],
    star_story_suggestions: [
      "A project where you shipped end-to-end",
      "A time you improved reliability",
      "A time you explained technical tradeoffs",
    ],
    questions_to_ask_interviewer: [
      "What separates good from great performers in this role?",
      "How does the team measure customer impact?",
      "What should the first 90 days accomplish?",
    ],
  };
}
