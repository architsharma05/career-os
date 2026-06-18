# CareerOS Current Status

Last updated: 2026-06-18

## Branch Context

The latest visible local state when this file was created was clean on `main`. If a future task starts from GitHub, confirm whether the Phase 3 PR has been merged before continuing.

Useful checks:

```bash
git status --short --branch
git log --oneline --decorate -5
```

## Completed

### Foundation

- Next.js app is in place.
- TypeScript, Tailwind, and local UI primitives are configured.
- Prisma schema exists for the major CareerOS entities.
- PostgreSQL is expected through Docker Compose/local `DATABASE_URL`.
- Seed script exists.
- README and `.env.example` exist.
- Node engine is `>=20.9.0`.

### Core CRM

Implemented route areas include:

- jobs list/create/detail/edit
- companies list/create/detail/edit
- contacts list/create/detail/edit
- Search Profiles list/create/detail/edit
- dashboard/home

Server actions exist for:

- jobs
- companies
- contacts
- Search Profiles

### Pipeline and Tracking

Implemented route areas include:

- `/pipeline`
- `/applications`
- `/reminders`

Server actions exist for:

- applications
- notes
- reminders

Job detail pages include job-linked notes and reminders.

## Current Technical Shape

### Data Models

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

### AI

Mock AI service files exist under `src/server/ai`. The README describes mock AI mode. Full UI workflows for mock scoring/drafts are the next major area to implement.

### Auth

The MVP currently uses a seeded demo user. Full auth is not implemented yet.

## Verification Commands

Run these before and after meaningful changes:

```bash
npm run lint
npm run build
```

If the shell's Node version is too old for Next.js, use Node `>=20.9.0` or the Codex bundled Node runtime.

## Known Gaps

- Resume Profile page/workflow is not fully listed in current routes.
- Role Template UI may need expansion depending on current implementation.
- AI workflows need UI and persistence work.
- Application create/edit/detail flows can be improved.
- Notes/reminders should be expanded beyond job details to companies, contacts, and applications.
- Analytics page and richer dashboard stats are planned.
- Full authentication is deferred.

## Important Constraints

- Do not hardcode secrets.
- Keep mock AI working without `OPENAI_API_KEY`.
- Keep all AI outputs editable/review-only.
- Do not add scraping or auto-apply behavior.
- Preserve the existing code style and route patterns.
