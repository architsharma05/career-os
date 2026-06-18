# CareerOS Architecture

CareerOS is a Next.js App Router application backed by PostgreSQL through Prisma. The MVP uses a single seeded demo user and server actions for database-backed workflows.

## High-Level Structure

```text
src/app              App Router pages and layouts
src/components       Reusable UI, layout, table, form, and dashboard components
src/components/ui    Local shadcn-style primitives
src/lib              Prisma client, utilities, constants, demo helpers
src/server/actions   Server actions for CRUD and workflow mutations
src/server/ai        AI service boundary, mock provider, structured types
prisma               Database schema and seed script
docs                 Project handoff/reference docs
```

## Runtime Requirements

- Node.js: `>=20.9.0`
- Database: PostgreSQL
- Package manager: npm

Useful commands:

```bash
npm install
npm run lint
npm run build
npm run dev
npm run prisma:migrate
npm run prisma:seed
```

## Data Layer

Prisma is the source of truth for the database schema in `prisma/schema.prisma`.

Main models:

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

Important enums:

- `WorkPreference`
- `ApplicationStatus`
- `RecommendedAction`

Flexible list-like and AI output fields use PostgreSQL JSON columns. This keeps the early schema flexible for role template skills, search priorities, keywords, match reasoning, and draft metadata.

## Server Actions

Existing server action files:

- `src/server/actions/jobs.ts`
- `src/server/actions/companies.ts`
- `src/server/actions/contacts.ts`
- `src/server/actions/search-profiles.ts`
- `src/server/actions/applications.ts`
- `src/server/actions/notes.ts`
- `src/server/actions/reminders.ts`

Conventions:

- Keep mutation logic in server actions.
- Validate user-facing input before writing to the database.
- Revalidate affected routes after successful mutations.
- Use the seeded demo user helper until auth is added.
- Keep deletes explicit and scoped.

## AI Boundary

AI code lives in `src/server/ai`.

Current intent:

- `types.ts`: structured input/output contracts
- `mock-ai.ts`: deterministic mock provider
- `index.ts`: provider boundary for calling mock AI now and OpenAI later

Future OpenAI integration should preserve this boundary so UI and server actions do not depend directly on OpenAI SDK calls.

Environment variable:

- `OPENAI_API_KEY`: optional; when absent, use mock mode

Expected AI modules:

- resume-to-role recommendation
- role expansion
- job match scoring
- resume gap analysis
- outreach draft generation
- cover letter generation
- interview prep generation
- weekly coaching summary

## UI Architecture

The UI is built as a SaaS CRM with:

- sidebar navigation
- dashboard summary cards
- table/list pages
- detail pages
- edit/create forms
- Kanban-style pipeline
- badges for statuses and scores
- empty states and loading-friendly layouts

Current route areas:

- `/`
- `/jobs`
- `/jobs/new`
- `/jobs/[id]`
- `/companies`
- `/companies/new`
- `/companies/[id]`
- `/contacts`
- `/contacts/new`
- `/contacts/[id]`
- `/search-profiles`
- `/search-profiles/new`
- `/search-profiles/[id]`
- `/pipeline`
- `/applications`
- `/reminders`

## Auth Strategy

MVP uses a seeded demo user. Future auth can be added with NextAuth or a simple local auth flow.

Reserved environment variables:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

When auth is added, replace the demo user lookup with the authenticated user context and audit all server actions for authorization checks.

## Local Database Flow

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL with Docker Compose.
3. Run Prisma migration.
4. Seed demo data.

```bash
cp .env.example .env
docker compose up -d
npm run prisma:migrate
npm run prisma:seed
```

## Deployment Notes

Target deployment is Vercel plus hosted PostgreSQL. Before deployment:

- replace local `DATABASE_URL` with hosted database URL
- configure environment variables in Vercel
- run migrations against the hosted database
- keep mock AI enabled unless `OPENAI_API_KEY` is configured

## Engineering Guidelines

- Prefer small, direct server actions over complex service layers unless reuse is clear.
- Keep AI logic isolated in `src/server/ai`.
- Keep UI primitives reusable but avoid premature abstraction.
- Follow existing component and route naming patterns.
- Do not hardcode secrets.
- Preserve ethical product constraints in any connector or automation work.
