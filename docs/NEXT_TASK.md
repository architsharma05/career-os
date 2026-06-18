# CareerOS Next Task

## Recommended Next Task: Phase 4 Mock AI Workflows

Implement user-facing mock AI workflows while preserving the existing AI service boundary.

## Why This Is Next

The core CRM and pipeline are in place. The project now needs visible AI-assisted workflows to demonstrate the central CareerOS value proposition without requiring an OpenAI API key.

## Scope

Build mock AI actions and UI for:

- job match scoring
- resume-to-role recommendations
- outreach draft generation
- cover letter draft generation
- interview prep generation

Start with job match scoring if time is limited.

## Suggested First Slice

Add a "Score job" workflow on the job detail page.

Implementation outline:

1. Let the user choose a Search Profile or use the active one.
2. Call the existing AI service boundary with resume/profile, job, and selected Search Profile context.
3. Persist the returned structured result in `JobMatch`.
4. Show the score breakdown on the job detail page.
5. Revalidate the job detail and jobs list routes.
6. Keep the UI clear that the score is AI-assisted and advisory.

## Files To Inspect First

- `src/server/ai/index.ts`
- `src/server/ai/mock-ai.ts`
- `src/server/ai/types.ts`
- `src/server/actions/jobs.ts`
- `src/app/jobs/[id]/page.tsx`
- `src/components/jobs-table.tsx`
- `prisma/schema.prisma`

## Acceptance Criteria

- The app still runs without `OPENAI_API_KEY`.
- User can score a job against a Search Profile.
- A `JobMatch` row is created or updated for the job/profile pair.
- The job detail page displays match score, score breakdown, strengths, gaps, missing keywords, next action, outreach angle, and summary.
- The jobs table continues showing match score badges where data exists.
- `npm run lint` passes.
- `npm run build` passes.

## Follow-Up Slices

After job scoring:

- Add resume-to-role recommendation UI.
- Add generated drafts list/detail UI.
- Add outreach generator.
- Add cover letter generator.
- Add interview prep generator for interview-stage applications.

## Guardrails

- Do not send messages automatically.
- Do not apply to jobs automatically.
- Do not claim the user has skills or experience they did not provide.
- Keep generated text editable and clearly review-only.
- Keep real OpenAI integration out of this task unless explicitly requested.
