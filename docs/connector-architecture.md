# Connector Architecture

CareerOS connector work should import opportunities into a review queue. A connector should never directly apply to jobs, message contacts, or bypass source restrictions.

## Connector Contract

Each connector returns:

- imported jobs normalized into a `DiscoveredJob` shape
- skipped references with reasons
- `requiresUserReview: true`

This keeps Phase 7 integrations human-in-the-loop and auditable.

## Planned Connector Types

1. RSS job feeds
2. Public jobs APIs
3. User-authorized email job alerts
4. Manual save/browser-extension handoff

## Safety Rules

- Respect robots.txt, site terms, and API rate limits.
- Do not scrape LinkedIn.
- Do not solve CAPTCHAs.
- Do not automate sign-in to third-party job boards.
- Do not auto-apply or auto-send outreach.
