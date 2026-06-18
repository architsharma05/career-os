# CareerOS Project Spec

CareerOS is a full-stack, portfolio-quality SaaS application for managing a job search as a CRM. It helps users organize roles, companies, contacts, applications, reminders, notes, AI-assisted drafts, and job match scoring across multiple personalized search profiles.

## Product Goal

Build a generalized AI-powered job search CRM that works for any user and any target role. The application should demonstrate full-stack engineering, clean data modeling, AI workflow design, ethical automation boundaries, CRM pipeline thinking, and a polished modern SaaS interface.

## Ethical Boundaries

CareerOS must remain human-in-the-loop.

- Do not scrape LinkedIn.
- Do not bypass job board terms of service.
- Do not solve CAPTCHAs.
- Do not log into third-party websites automatically.
- Do not mass-apply to jobs.
- Do not send emails, LinkedIn messages, applications, or outreach without explicit user review and approval.
- Do not encourage users to fabricate experience.

The app can help users discover, organize, score, prepare, and draft, but final actions must stay under user control.

## Target Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- UI: shadcn-style local primitives and lucide-react icons
- Backend: Next.js App Router with server actions
- Database: PostgreSQL
- ORM: Prisma
- AI: Mock AI first, OpenAI structured JSON outputs later
- Auth: Demo user for MVP; NextAuth or local auth later
- DevOps: Docker Compose for local PostgreSQL
- Testing/linting: ESLint, production build, focused tests later
- Deployment target: Vercel plus hosted PostgreSQL

## Core Concepts

### Demo Mode

The MVP uses a seeded demo user so reviewers can run and explore the app immediately without account setup. Full authentication can be added later.

### Resume Profile

Stores the user's background and source material for AI-assisted recommendations and scoring.

Core fields:

- full name
- email
- location
- resume text
- education
- skills
- projects
- experience
- certifications
- links

### Search Profiles

A Search Profile defines a user's target role strategy and scoring preferences. A user can have multiple Search Profiles, and the same job can receive different match scores under different profiles.

Example profiles:

- Solutions Engineer
- Java Developer
- AI Automation Engineer

Core fields:

- profile name
- target role
- related role titles
- experience level
- target industries
- target locations
- remote/hybrid/onsite preference
- target companies
- salary range
- required skills
- preferred skills
- excluded keywords
- job search goal
- scoring priorities
- active flag

### Role Templates

Starter templates help users bootstrap Search Profiles. Required starter templates include:

- Software Engineer
- Java Developer
- Full-Stack Developer
- Solutions Engineer
- Sales Engineer
- Forward Deployed Engineer
- Technical Consultant
- Implementation Consultant
- Data Analyst
- Product Manager
- AI Automation Engineer
- Customer Success Engineer
- Technical Account Manager
- Embedded Engineer
- Cloud Engineer

Each template should include related titles, keywords, core skills, preferred skills, common industries, scoring hints, and interview topics.

### Job CRM

Users should be able to manually add jobs, review match scores, track notes and reminders, and move applications through a pipeline.

MVP job sources:

- manual entry
- pasted job descriptions
- CSV import later
- demo seed data

Risky scraping is out of scope.

### Application Pipeline

Canonical stages:

- Saved
- Interested
- Outreach Started
- Applied
- Recruiter Screen
- Technical Interview
- Final Round
- Offer
- Rejected
- Archived

## MVP Acceptance Criteria

- App runs locally with clear setup instructions.
- Database can be seeded with demo data.
- User can create and edit core CRM records.
- User can create multiple Search Profiles.
- User can view jobs in list/detail views.
- User can view applications in a Kanban-style pipeline.
- User can move applications across statuses.
- User can add companies and contacts.
- User can create notes and reminders.
- User can score jobs with mock AI.
- User can generate editable drafts in later AI phases.
- Dashboard analytics are available in later polish phases.
- README and docs explain architecture, setup, features, ethics, and roadmap.
- No secrets are hardcoded.

## Current MVP Emphasis

The project currently prioritizes a simple working demo over broad infrastructure. Prefer direct, readable server actions and reusable components over over-engineered abstractions.
