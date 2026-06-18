import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { formatShortDate } from "@/lib/utils";
import { applicationStages, statusTone } from "@/lib/pipeline";
import { prisma } from "@/lib/prisma";
import { moveApplication } from "@/server/actions/applications";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const user = await getDemoUser();
  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    include: {
      job: {
        include: {
          company: true,
          matches: { orderBy: { matchScore: "desc" }, take: 1 },
        },
      },
      searchProfile: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <PageShell>
      <PageHeader
        title="Kanban Pipeline"
        description="Move applications across the CRM stages while keeping every apply and outreach action human-approved."
        badge={`${applications.length} applications`}
      />
      <div className="px-5 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {applicationStages.map((stage) => {
            const stageApplications = applications.filter(
              (application) => application.status === stage.value,
            );
            return (
              <section
                key={stage.value}
                className="min-h-72 rounded-xl border bg-card p-3"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">{stage.label}</h2>
                  <Badge tone="neutral">{stageApplications.length}</Badge>
                </div>
                <div className="space-y-3">
                  {stageApplications.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                      No applications in this stage.
                    </div>
                  ) : null}
                  {stageApplications.map((application) => {
                    const match = application.job.matches[0];
                    return (
                      <Card key={application.id} className="bg-background">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Link
                                className="text-sm font-semibold hover:text-primary"
                                href={`/jobs/${application.jobId}`}
                              >
                                {application.job.title}
                              </Link>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {application.job.company?.name ?? "No company"}{" "}
                                ·{" "}
                                {application.job.location ?? "Location not set"}
                              </p>
                            </div>
                            {match ? (
                              <Badge
                                tone={
                                  match.matchScore >= 85 ? "green" : "amber"
                                }
                              >
                                {match.matchScore}%
                              </Badge>
                            ) : null}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge tone={statusTone(application.status)}>
                              {stage.label}
                            </Badge>
                            <Badge tone="blue">
                              {application.searchProfile?.targetRole ??
                                "No profile"}
                            </Badge>
                          </div>
                          <p className="mt-3 text-xs text-muted-foreground">
                            Next follow-up:{" "}
                            {formatShortDate(application.nextFollowUpDate)}
                          </p>
                          <form
                            action={moveApplication}
                            className="mt-3 flex gap-2"
                          >
                            <input
                              name="id"
                              type="hidden"
                              value={application.id}
                            />
                            <Select
                              className="h-9"
                              defaultValue={application.status}
                              name="status"
                            >
                              {applicationStages.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                            <Button
                              className="h-9"
                              type="submit"
                              variant="secondary"
                            >
                              Move
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
