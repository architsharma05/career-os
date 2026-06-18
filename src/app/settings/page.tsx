import { Settings } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jobDiscoveryConnectors } from "@/server/connectors/registry";

export default function SettingsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Settings"
        description="Configure safe future integrations and review ethical automation boundaries."
        badge="Phase 7 scaffolding"
      />
      <div className="space-y-6 px-5 py-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Job discovery connectors
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {jobDiscoveryConnectors.map((connector) => (
              <div key={connector.kind} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{connector.label}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {connector.ethicalBoundary}
                    </p>
                  </div>
                  <Badge tone="amber">scaffold</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ethical product boundaries</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground md:grid-cols-2">
            <p>
              No LinkedIn scraping, CAPTCHA solving, or automated third-party
              login.
            </p>
            <p>
              No mass applying or auto-sending messages; every action remains
              user reviewed.
            </p>
            <p>
              Only public feeds, documented APIs, user-authorized email alerts,
              and manual-save flows are planned.
            </p>
            <p>
              See `docs/connector-architecture.md` for the implementation
              contract.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
