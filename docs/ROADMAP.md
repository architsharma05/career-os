# CareerOS Roadmap

This roadmap is the working implementation plan for future cloud tasks.

## Phase 1: Foundation

Status: Complete

- Create Next.js app.
- Set up TypeScript, Tailwind, and local shadcn-style UI primitives.
- Set up Prisma and PostgreSQL.
- Create the core database schema.
- Add seed data.
- Create basic layout and sidebar navigation.
- Create README and `.env.example`.

## Phase 2: Core CRM

Status: Complete

- CRUD for jobs.
- CRUD for companies.
- CRUD for contacts.
- CRUD for Search Profiles.
- Basic job detail page.
- Basic company detail page.
- Basic contact detail page.
- Active Search Profile switching.

## Phase 3: Pipeline, Notes, and Reminders

Status: Implemented locally/current codebase

- Application model usage.
- Kanban-style pipeline page.
- Move applications across statuses.
- Applications tracker page.
- Shared status badge metadata.
- Job-linked notes.
- Job-linked reminders.
- Reminder queue page with completion workflow.

Recommended follow-up:

- Add application detail pages if needed.
- Add application create/edit flows.
- Add notes/reminders to company, contact, and application detail pages.
- Add drag-and-drop if desired; current implementation can use explicit controls.

## Phase 4: AI Mock Workflows

Status: Next major phase

Goal: make AI workflows usable in mock mode without requiring an OpenAI API key.

Tasks:

- Add UI entry points for scoring a job against a selected Search Profile.
- Persist or update `JobMatch` records from mock AI output.
- Add resume-to-role recommendation workflow.
- Add outreach draft generation workflow.
- Add cover letter generation workflow.
- Add interview prep generation workflow.
- Store generated drafts in `GeneratedDraft`.
- Add loading, success, error, and empty states around AI actions.

Acceptance criteria:

- App works without `OPENAI_API_KEY`.
- Mock responses are structured, realistic, deterministic enough for demos, and human-review oriented.
- No AI action sends messages or applies to jobs automatically.

## Phase 5: Real OpenAI Integration

Status: Planned

Goal: add a real provider behind the existing AI service boundary.

Tasks:

- Add OpenAI SDK dependency if not already present.
- Add provider selection based on `OPENAI_API_KEY` and/or explicit mock mode env var.
- Use structured JSON outputs.
- Add error handling and fallback behavior.
- Keep mock mode available for demos.
- Add conservative prompts that enforce honesty and human review.

Acceptance criteria:

- Missing API key does not break the app.
- Real AI output matches TypeScript contracts.
- Failed AI calls show useful UI errors.
- Outputs are persisted only when appropriate.

## Phase 6: Analytics and Polish

Status: Planned

Tasks:

- Dashboard stats from live database data.
- Analytics page.
- Pipeline stats.
- Applications per week.
- Response rates.
- Top matching jobs.
- Better filters/search.
- Empty states.
- Responsive polish.
- README screenshots.

## Phase 7: Optional Future Enhancements

Status: Backlog

Potential additions:

- Gmail integration for application confirmations and recruiter messages.
- Google Calendar integration for interviews and reminders.
- Browser extension/manual save button.
- RSS feed connectors.
- Public job API connectors.
- Company career page connector only where allowed.
- Email job alert parser.
- pgvector semantic matching.
- Resume version manager.
- Team/shared job hunt mode.
- Full auth with NextAuth.

## Non-Goals

- LinkedIn scraping.
- Automated job applications.
- CAPTCHA solving.
- Hidden background outreach.
- Scraping websites that disallow crawling.
