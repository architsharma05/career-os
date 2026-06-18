export const pipelineStages = [
  "Saved",
  "Interested",
  "Outreach Started",
  "Applied",
  "Recruiter Screen",
  "Technical Interview",
  "Final Round",
  "Offer",
  "Rejected",
  "Archived"
] as const;

export type PipelineStage = (typeof pipelineStages)[number];

export const demoUser = {
  name: "Demo User",
  email: "demo@careeros.dev",
  location: "Chicago, IL",
  headline: "Technical candidate targeting customer-facing engineering and AI automation roles"
};

export const searchProfiles = [
  {
    name: "Solutions Engineer",
    role: "Solutions Engineer",
    goal: "Customer-facing technical role",
    matchFocus: ["APIs", "technical demos", "SaaS", "customer discovery"],
    active: true
  },
  {
    name: "Java Developer",
    role: "Backend / Java Developer",
    goal: "Maximize chance of interview",
    matchFocus: ["Java", "Spring Boot", "SQL", "REST APIs"],
    active: false
  },
  {
    name: "AI Automation Engineer",
    role: "AI Automation Engineer",
    goal: "AI-focused career",
    matchFocus: ["OpenAI API", "workflow design", "integrations", "agents"],
    active: false
  }
];

export const roleTemplates = [
  "Software Engineer",
  "Java Developer",
  "Full-Stack Developer",
  "Solutions Engineer",
  "Sales Engineer",
  "Forward Deployed Engineer",
  "Technical Consultant",
  "Implementation Consultant",
  "Data Analyst",
  "Product Manager",
  "AI Automation Engineer",
  "Customer Success Engineer",
  "Technical Account Manager",
  "Embedded Engineer",
  "Cloud Engineer"
];

export const jobs = [
  {
    id: "job-1",
    title: "Solutions Engineer",
    company: "Northstar AI",
    location: "Remote",
    source: "Demo seed",
    stage: "Outreach Started" as PipelineStage,
    matchScore: 92,
    deadline: "Jun 25",
    nextAction: "Network first",
    tags: ["SaaS", "APIs", "AI"]
  },
  {
    id: "job-2",
    title: "Implementation Consultant",
    company: "CivicCloud",
    location: "Chicago, IL",
    source: "Manual entry",
    stage: "Interested" as PipelineStage,
    matchScore: 86,
    deadline: "Jun 30",
    nextAction: "Apply now",
    tags: ["GovTech", "SQL", "Client-facing"]
  },
  {
    id: "job-3",
    title: "Junior Java Developer",
    company: "Finaptic",
    location: "New York, NY",
    source: "CSV import",
    stage: "Applied" as PipelineStage,
    matchScore: 78,
    deadline: "Jul 2",
    nextAction: "Follow up",
    tags: ["Java", "Spring", "Fintech"]
  },
  {
    id: "job-4",
    title: "AI Workflow Engineer",
    company: "DataHarbor",
    location: "Remote",
    source: "Demo seed",
    stage: "Technical Interview" as PipelineStage,
    matchScore: 90,
    deadline: "Jul 5",
    nextAction: "Interview prep",
    tags: ["OpenAI", "Automation", "APIs"]
  },
  {
    id: "job-5",
    title: "Backend Software Engineer I",
    company: "BrightCart",
    location: "Austin, TX",
    source: "Pasted JD",
    stage: "Saved" as PipelineStage,
    matchScore: 68,
    deadline: "Jul 8",
    nextAction: "Improve resume first",
    tags: ["Backend", "Commerce", "TypeScript"]
  }
];

export const companies = [
  { name: "Northstar AI", industry: "AI SaaS", priority: "High", openJobs: 2 },
  { name: "CivicCloud", industry: "GovTech", priority: "Medium", openJobs: 1 },
  { name: "DataHarbor", industry: "Data Platform", priority: "High", openJobs: 1 }
];

export const contacts = [
  {
    name: "Maya Patel",
    company: "Northstar AI",
    title: "Senior Solutions Engineer",
    relationship: "Employee",
    nextStep: "Ask for a 15-minute coffee chat"
  },
  {
    name: "Jordan Lee",
    company: "DataHarbor",
    title: "Recruiter",
    relationship: "Recruiter",
    nextStep: "Send portfolio link follow-up"
  }
];

export const reminders = [
  { title: "Review Northstar outreach draft", due: "Jun 19", type: "Networking" },
  { title: "Prepare DataHarbor API demo story", due: "Jun 21", type: "Interview prep" },
  { title: "Follow up with Finaptic recruiter", due: "Jun 24", type: "Follow up" }
];
