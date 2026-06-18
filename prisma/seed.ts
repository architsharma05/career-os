import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roleTemplates = [
  {
    name: "Software Engineer",
    description: "Builds production software across product, platform, or infrastructure teams.",
    relatedTitles: ["Software Engineer", "Software Developer", "Application Developer"],
    keywords: ["APIs", "testing", "debugging", "systems design", "Git"],
    coreSkills: ["programming", "data structures", "APIs", "testing"],
    preferredSkills: ["cloud", "CI/CD", "observability"],
    commonIndustries: ["SaaS", "fintech", "healthtech", "enterprise software"],
    scoringHints: ["Prioritize production experience, testing habits, and clear ownership."],
    interviewTopics: ["coding fundamentals", "system design", "debugging", "behavioral ownership"]
  },
  {
    name: "Java Developer",
    description: "Backend-focused role using Java, Spring Boot, SQL, and service architecture.",
    relatedTitles: ["Java Developer", "Backend Engineer", "Software Engineer I", "Application Developer"],
    keywords: ["Java", "Spring Boot", "REST APIs", "SQL", "microservices", "JUnit"],
    coreSkills: ["Java", "OOP", "APIs", "databases", "debugging", "Git"],
    preferredSkills: ["Spring Security", "Kafka", "Docker", "AWS"],
    commonIndustries: ["financial services", "enterprise software", "insurance", "commerce"],
    scoringHints: ["Prioritize Java, backend, database, API, and production engineering skills."],
    interviewTopics: ["Java collections", "Spring Boot", "SQL queries", "REST design", "testing"]
  },
  {
    name: "Solutions Engineer",
    description: "Customer-facing technical role that connects product capabilities to business needs.",
    relatedTitles: ["Solutions Engineer", "Sales Engineer", "Technical Consultant", "Implementation Consultant", "Customer Engineer", "Forward Deployed Engineer"],
    keywords: ["APIs", "demos", "discovery", "technical sales", "solution design", "integrations", "customers", "proof of concept"],
    coreSkills: ["communication", "APIs", "SQL", "cloud basics", "technical explanation", "product knowledge"],
    preferredSkills: ["SaaS", "stakeholder management", "workflow automation", "CRM"],
    commonIndustries: ["SaaS", "AI tools", "data platforms", "developer tools"],
    scoringHints: ["Prioritize customer-facing technical work, communication, SaaS experience, and integration experience."],
    interviewTopics: ["discovery calls", "product demos", "technical deep dives", "handling objections"]
  },
  {
    name: "AI Automation Engineer",
    description: "Builds AI-assisted workflows, integrations, agents, and operational automation.",
    relatedTitles: ["AI Automation Engineer", "AI Engineer", "Automation Engineer", "Workflow Engineer"],
    keywords: ["LLM", "agents", "workflow automation", "APIs", "Python", "Zapier", "LangChain"],
    coreSkills: ["API integration", "prompt design", "workflow design", "data modeling"],
    preferredSkills: ["OpenAI API", "queues", "RAG", "evals", "TypeScript"],
    commonIndustries: ["AI", "operations", "SaaS", "consulting"],
    scoringHints: ["Prioritize practical automation projects, API fluency, and production-minded AI workflow design."],
    interviewTopics: ["structured outputs", "tool calling", "automation failure modes", "human-in-the-loop review"]
  }
];

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@careeros.dev" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@careeros.dev",
      resumeProfile: {
        create: {
          fullName: "Demo User",
          email: "demo@careeros.dev",
          location: "Chicago, IL",
          resumeText:
            "Technical early-career candidate with Java, TypeScript, API integration, CRM workflow, and AI automation project experience.",
          education: ["B.S. Computer Science"],
          skills: ["Java", "TypeScript", "React", "SQL", "APIs", "OpenAI API", "CRM automation"],
          projects: ["CareerOS job search CRM", "AI support triage workflow", "Java inventory API"],
          experience: ["Built full-stack dashboards and automation workflows for portfolio projects."],
          certifications: ["AWS Cloud Practitioner - in progress"],
          links: ["https://github.com/demo/careeros"]
        }
      }
    }
  });

  await prisma.roleTemplate.createMany({
    data: roleTemplates,
    skipDuplicates: true
  });

  const profiles = await Promise.all([
    prisma.searchProfile.upsert({
      where: { id: "demo-solutions-engineer" },
      update: {},
      create: {
        id: "demo-solutions-engineer",
        userId: user.id,
        name: "Solutions Engineer Search",
        targetRole: "Solutions Engineer",
        relatedRoles: ["Sales Engineer", "Technical Consultant", "Forward Deployed Engineer"],
        experienceLevel: "entry-level",
        industries: ["SaaS", "AI tools", "developer tools"],
        locations: ["Chicago", "Remote"],
        workPreference: "FLEXIBLE",
        targetCompanies: ["OpenAI", "Datadog", "Stripe"],
        salaryMin: 85000,
        salaryMax: 135000,
        requiredSkills: ["communication", "APIs", "SQL"],
        preferredSkills: ["SaaS", "demos", "workflow automation"],
        excludedKeywords: ["senior", "principal"],
        jobSearchGoal: "customer-facing technical role",
        scoringPriorities: ["role fit", "customer-facing work", "API integrations"],
        isActive: true
      }
    }),
    prisma.searchProfile.upsert({
      where: { id: "demo-java-developer" },
      update: {},
      create: {
        id: "demo-java-developer",
        userId: user.id,
        name: "Java Developer Search",
        targetRole: "Java Developer",
        relatedRoles: ["Backend Engineer", "Software Engineer I"],
        experienceLevel: "0-2 years",
        industries: ["enterprise software", "fintech"],
        locations: ["Chicago", "Remote"],
        workPreference: "HYBRID",
        targetCompanies: ["Capital One", "JPMorgan Chase", "ServiceNow"],
        salaryMin: 80000,
        salaryMax: 125000,
        requiredSkills: ["Java", "SQL", "REST APIs"],
        preferredSkills: ["Spring Boot", "JUnit", "Docker"],
        excludedKeywords: ["10+ years", "staff"],
        jobSearchGoal: "maximize chance of interview",
        scoringPriorities: ["Java", "backend", "entry-level fit"],
        isActive: false
      }
    })
  ]);

  const companies = await Promise.all(
    [
      ["Northstar AI", "https://northstar.example", "AI SaaS", "201-500", "Remote", true, "high"],
      ["CivicCloud", "https://civiccloud.example", "GovTech", "51-200", "Chicago, IL", true, "medium"],
      ["Finaptic", "https://finaptic.example", "Fintech", "1001-5000", "New York, NY", false, "medium"],
      ["DataHarbor", "https://dataharbor.example", "Data Platform", "501-1000", "Remote", true, "high"],
      ["BrightCart", "https://brightcart.example", "Commerce", "201-500", "Austin, TX", false, "low"]
    ].map(([name, website, industry, size, location, isTargetCompany, priority]) =>
      prisma.company.create({
        data: {
          userId: user.id,
          name: String(name),
          website: String(website),
          industry: String(industry),
          size: String(size),
          location: String(location),
          isTargetCompany: Boolean(isTargetCompany),
          priority: String(priority),
          notes: "Demo company record for CareerOS."
        }
      })
    )
  );

  const jobSeeds = [
    {
      title: "Solutions Engineer",
      company: companies[0],
      location: "Remote",
      workPreference: "REMOTE" as const,
      score: 92,
      status: "OUTREACH_STARTED" as const
    },
    {
      title: "Implementation Consultant",
      company: companies[1],
      location: "Chicago, IL",
      workPreference: "HYBRID" as const,
      score: 86,
      status: "INTERESTED" as const
    },
    {
      title: "Junior Java Developer",
      company: companies[2],
      location: "New York, NY",
      workPreference: "HYBRID" as const,
      score: 78,
      status: "APPLIED" as const
    },
    {
      title: "AI Workflow Engineer",
      company: companies[3],
      location: "Remote",
      workPreference: "REMOTE" as const,
      score: 90,
      status: "TECHNICAL_INTERVIEW" as const
    },
    {
      title: "Backend Software Engineer I",
      company: companies[4],
      location: "Austin, TX",
      workPreference: "ONSITE" as const,
      score: 68,
      status: "SAVED" as const
    }
  ];

  const jobs = await Promise.all(
    jobSeeds.map(async ({ title, company, location, workPreference, score, status }) => {
      const job = await prisma.job.create({
        data: {
          userId: user.id,
          companyId: company.id,
          title,
          url: `https://${company.name.toLowerCase().replaceAll(" ", "")}.example/jobs/demo`,
          source: "demo seed",
          location,
          workPreference,
          salaryMin: 85000,
          salaryMax: 130000,
          employmentType: "Full-time",
          experienceLevel: "Entry-level",
          description: `Demo ${title} role focused on APIs, customer outcomes, implementation quality, and cross-functional collaboration.`,
          requiredSkills: ["APIs", "SQL", "communication"],
          preferredSkills: ["SaaS", "automation", "technical writing"]
        }
      });

      await prisma.jobMatch.create({
        data: {
          jobId: job.id,
          searchProfileId: profiles[0].id,
          matchScore: score,
          roleFitScore: score - 2,
          skillMatchScore: score - 5,
          experienceMatchScore: score - 8,
          locationMatchScore: score - 3,
          careerGoalScore: score,
          strengths: ["API exposure", "customer-facing scope", "strong portfolio alignment"],
          gaps: ["Add one more measurable implementation result"],
          missingKeywords: ["proof of concept", "stakeholder management"],
          suggestedResumeKeywords: ["technical discovery", "integration design"],
          recommendedNextAction: score > 85 ? "NETWORK_FIRST" : "SAVE_FOR_LATER",
          outreachAngle: "Lead with your API automation project and interest in customer-facing technical work.",
          shouldApply: score >= 75,
          reasonSummary: "Strong match for the active Solutions Engineer profile in demo mode."
        }
      });

      await prisma.application.create({
        data: {
          userId: user.id,
          jobId: job.id,
          searchProfileId: profiles[0].id,
          status,
          resumeVersion: "resume-v1-solutions",
          notes: "Seeded application record."
        }
      });

      return job;
    })
  );

  await prisma.contact.createMany({
    data: [
      {
        userId: user.id,
        companyId: companies[0].id,
        name: "Maya Patel",
        title: "Senior Solutions Engineer",
        email: "maya@example.com",
        linkedinUrl: "https://linkedin.com/in/example-maya",
        relationshipType: "employee",
        source: "manual",
        notes: "Potential coffee chat about SE interview process."
      },
      {
        userId: user.id,
        companyId: companies[3].id,
        name: "Jordan Lee",
        title: "Recruiter",
        email: "jordan@example.com",
        relationshipType: "recruiter",
        source: "manual",
        notes: "Follow up after sending portfolio link."
      }
    ]
  });

  await prisma.reminder.create({
    data: {
      userId: user.id,
      jobId: jobs[0].id,
      companyId: companies[0].id,
      title: "Send referral ask draft",
      description: "Review AI outreach draft before sending manually.",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      type: "networking check-in"
    }
  });

  await prisma.generatedDraft.create({
    data: {
      userId: user.id,
      jobId: jobs[0].id,
      type: "outreach",
      title: "Referral ask for Northstar AI",
      content:
        "Hi Maya, I noticed your work as a Solutions Engineer at Northstar AI. I am exploring customer-facing technical roles and would value your perspective on the team. Would you be open to a brief chat?",
      aiMetadata: { provider: "mock", reviewed: false }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
