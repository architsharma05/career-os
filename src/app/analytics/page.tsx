import Link from "next/link";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ClipboardCheck,
  Trophy,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShortDate } from "@/lib/utils";
import { getDashboardAnalytics } from "@/lib/analytics";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const user = await getDemoUser();
  const analytics = await getDashboardAnalytics(user.id);
  const maxStageCount = Math.max(
    ...analytics.pipeline.map((stage) => stage.count),
    1,
  );

  return (
    <PageShell>
      <PageHeader
        title="Analytics"
        description="Measure search momentum, pipeline health, match quality, reminders, and target-company focus."
        badge={`${analytics.responseRate}% response rate`}
      />
      <div className="space-y-6 px-5 py-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Tracked jobs"
            value={String(analytics.totalJobs)}
            helper="Total roles in the CRM"
            icon={BriefcaseBusiness}
            tone="blue"
          />
          <StatCard
            label="Active applications"
            value={String(analytics.activeApplications)}
            helper="Excludes saved, rejected, and archived"
            icon={ClipboardCheck}
            tone="green"
          />
          <StatCard
            label="Interviews"
            value={String(analytics.interviews)}
            helper="Recruiter, technical, and final rounds"
            icon={Trophy}
            tone="amber"
          />
          <StatCard
            label="Average match"
            value={`${analytics.averageMatchScore}%`}
            helper="Average persisted AI match score"
            icon={BarChart3}
            tone="neutral"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline by stage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.pipeline.map((stage) => (
                <div key={stage.value} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{stage.label}</span>
                    <span className="text-muted-foreground">{stage.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.max((stage.count / maxStageCount) * 100, stage.count ? 8 : 0)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Reminder focus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">
                  {analytics.overdueReminders} overdue reminders
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Use this to protect follow-up and prep deadlines.
                </p>
              </div>
              {analytics.openReminders.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No open reminders. Add follow-ups from job detail pages.
                </p>
              ) : (
                analytics.openReminders.map((reminder) => (
                  <div key={reminder.id} className="rounded-lg border p-3">
                    <div className="flex justify-between gap-3">
                      <p className="text-sm font-medium">{reminder.title}</p>
                      <Badge tone="amber">
                        {formatShortDate(reminder.dueDate)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {reminder.job?.title ??
                        reminder.company?.name ??
                        reminder.contact?.name ??
                        reminder.type}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Best matching jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.topMatches.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No scored jobs yet. Open a job and run AI scoring.
                </p>
              ) : (
                analytics.topMatches.map((match) => (
                  <Link
                    key={match.id}
                    className="block rounded-lg border p-3 transition-colors hover:bg-muted/40"
                    href={`/jobs/${match.jobId}`}
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{match.job.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {match.job.company?.name ?? "No company"} ·{" "}
                          {match.searchProfile.name}
                        </p>
                      </div>
                      <Badge tone={match.matchScore >= 85 ? "green" : "amber"}>
                        {match.matchScore}%
                      </Badge>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top target companies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.targetCompanies.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No target companies marked yet.
                </p>
              ) : (
                analytics.targetCompanies.map((company) => (
                  <Link
                    key={company.id}
                    className="block rounded-lg border p-3 transition-colors hover:bg-muted/40"
                    href={`/companies/${company.id}`}
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{company.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {company.industry ?? "Industry not set"}
                        </p>
                      </div>
                      <Badge tone="blue">
                        {company.jobs.length} jobs · {company.contacts.length}{" "}
                        contacts
                      </Badge>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </PageShell>
  );
}
