export type ConnectorKind =
  | "rss"
  | "public_api"
  | "email_alert"
  | "manual_save";

export type DiscoveredJob = {
  title: string;
  companyName?: string;
  url?: string;
  source: string;
  location?: string;
  description: string;
  discoveredAt: Date;
};

export type ConnectorRunResult = {
  kind: ConnectorKind;
  imported: DiscoveredJob[];
  skipped: { reason: string; reference: string }[];
  requiresUserReview: true;
};

export type JobDiscoveryConnector = {
  kind: ConnectorKind;
  label: string;
  ethicalBoundary: string;
  run(): Promise<ConnectorRunResult>;
};
