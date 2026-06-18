# CareerOS

CareerOS is an AI-powered job search CRM for managing a full job hunt from role discovery through follow-up, interviews, offers, and analytics.

The project is designed as a portfolio-quality full-stack SaaS application that demonstrates CRM modeling, AI workflow design, automation judgment, ethical product boundaries, and clean TypeScript engineering.

## Problem Statement

Job hunting creates scattered data: target companies, job descriptions, resume versions, contacts, reminders, outreach drafts, interview notes, and application statuses often live in different tools. CareerOS centralizes that workflow and adds human-reviewed AI assistance for scoring jobs, preparing applications, generating drafts, and deciding what to do next.

## MVP Direction

The MVP prioritizes demo mode and core functionality over complex authentication. CareerOS starts with a single seeded demo user so the app can be explored immediately. Full auth can be added later without blocking the product loop.

## Key Features

- Seeded demo workspace with realistic fake jobs, companies, contacts, reminders, applications, and drafts
- Resume profile and Search Profile data model
- Role Template library for common job targets
- Job inbox with AI match score badges
- Prisma-backed CRUD pages for jobs, companies, contacts, and Search Profiles
- Detail and edit pages for core CRM records
- Active Search Profile switching through server actions
- CRM pipeline stages from Saved through Offer, Rejected, and Archived
- Mock AI service layer for job scoring and role recommendations
- PostgreSQL-ready Prisma schema
- Ethical human-in-the-loop design: no LinkedIn scraping, no CAPTCHA bypassing, no auto-apply

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- UI approach: shadcn-style local primitives with lucide-react icons
- Backend: Next.js routes/server actions in later phases
- Database: PostgreSQL
- ORM: Prisma
- AI: Mock provider first, OpenAI integration later through environment variables
- DevOps: Docker Compose for local PostgreSQL

## Architecture Overview

```text
src/app              Next.js app routes and layouts
src/components       Reusable dashboard and UI components
src/lib              Demo data, utilities, shared constants
src/server/actions   Server actions for Phase 2 CRUD workflows
src/server/ai        AI provider boundary, mock outputs, structured types
prisma               PostgreSQL schema and seed script
```

## Database Schema Summary

The Prisma schema includes:

- `User`
- `ResumeProfile`
- `SearchProfile`
- `RoleTemplate`
- `Company`
- `Job`
- `JobMatch`
- `Application`
- `Contact`
- `Note`
- `Reminder`
- `GeneratedDraft`

Flexible list-like fields use PostgreSQL JSON columns so role templates, search profiles, skills, tags, and AI outputs can evolve without early over-modeling.

## Setup

CareerOS targets Node.js `>=20.9.0` because the app uses the current secure Next.js line. If you use `nvm`, run:

```bash
nvm use
```

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Start PostgreSQL:

```bash
docker compose up -d
```

4. Run Prisma migration and seed:

```bash
npm run prisma:migrate
npm run prisma:seed
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: optional; when absent, CareerOS uses mock AI mode
- `NEXTAUTH_SECRET`: reserved for later auth
- `NEXTAUTH_URL`: reserved for later auth

## AI Mock Mode

CareerOS currently uses deterministic mock AI outputs so the app works without an API key. The mock provider returns structured job match scoring and role recommendations. The OpenAI provider will be added behind the same service boundary in a later phase.

## Ethical Use Note

CareerOS is intentionally human-in-the-loop. It does not scrape LinkedIn, bypass job board terms, solve CAPTCHAs, log into third-party websites automatically, or mass-apply to roles. The app may help draft, score, organize, and prepare, but the user must review and approve applications or messages.

## Screenshots

Screenshots will be added after the first verified UI pass.

## Roadmap

- Phase 1: Foundation, schema, seed data, layout, demo dashboard
- Phase 2: CRUD for jobs, companies, contacts, and Search Profiles
- Phase 3: Application pipeline with status movement
- Phase 4: Mock AI workflows for scoring, drafts, cover letters, and interview prep
- Phase 5: OpenAI structured-output integration
- Phase 6: Analytics, filters, responsive polish, and demo screenshots
- Phase 7: Optional Gmail, calendar, browser extension/manual save, public API/RSS connectors, pgvector

## Skills Demonstrated

- Full-stack TypeScript application architecture
- Prisma data modeling for a SaaS CRM
- Next.js server actions for database-backed CRUD
- AI workflow boundaries and structured outputs
- Ethical automation design
- Product-first demo mode strategy
- Dashboard UI composition with reusable components
