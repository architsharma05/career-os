import type { JobDiscoveryConnector } from "./types";

const notConfigured = (
  kind: JobDiscoveryConnector["kind"],
  label: string,
  ethicalBoundary: string,
): JobDiscoveryConnector => ({
  kind,
  label,
  ethicalBoundary,
  async run() {
    return {
      kind,
      imported: [],
      skipped: [
        {
          reason:
            "Connector scaffold only; no external source configured for the MVP.",
          reference: label,
        },
      ],
      requiresUserReview: true,
    };
  },
});

export const jobDiscoveryConnectors: JobDiscoveryConnector[] = [
  notConfigured(
    "rss",
    "RSS job feed connector",
    "Only read feeds that are public and explicitly intended for syndication.",
  ),
  notConfigured(
    "public_api",
    "Public jobs API connector",
    "Only use documented APIs with valid credentials and published rate limits.",
  ),
  notConfigured(
    "email_alert",
    "Email job alert parser",
    "Only parse user-authorized job-alert emails; never log into third-party inboxes without consent.",
  ),
  notConfigured(
    "manual_save",
    "Manual save/browser-extension handoff",
    "User-triggered saves only; no background scraping or automated applications.",
  ),
];
