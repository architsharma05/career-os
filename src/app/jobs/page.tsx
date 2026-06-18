import Link from "next/link";
import { BriefcaseBusiness, Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { quickAddJob } from "@/server/actions/jobs";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const user = await getDemoUser();
  const jobs = await prisma.job.findMany({
    where: { userId: user.id },
    include: {
      company: true,
      applications: {
        orderBy: { updatedAt: "desc" },
        take: 1
      },
      matches: {
        orderBy: { matchScore: "desc" },
        take: 1
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <PageShell>
      <PageHeader
        title="Jobs"
        description="Add, review, and organize roles before any application or outreach leaves your hands."
        badge={`${jobs.length} tracked`}
        actions={
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            href="/jobs/new"
          >
            <Plus className="h-4 w-4" />
            New job
          </Link>
        }
      />

      <div className="grid gap-6 px-5 py-6 lg:px-8 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-primary" />
              Job Inbox
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="font-medium">No jobs yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add your first role manually, then score it against a Search Profile.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Role</th>
                        <th className="px-4 py-3 font-semibold">Company</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Match</th>
                        <th className="px-4 py-3 font-semibold">Salary</th>
                        <th className="px-4 py-3 font-semibold">Deadline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {jobs.map((job) => {
                        const application = job.applications[0];
                        const match = job.matches[0];
                        const salary =
                          job.salaryMin && job.salaryMax
                            ? `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}`
                            : "Not listed";

                        return (
                          <tr key={job.id} className="hover:bg-muted/40">
                            <td className="px-4 py-3">
                              <Link className="font-medium hover:text-primary" href={`/jobs/${job.id}`}>
                                {job.title}
                              </Link>
                              <p className="text-xs text-muted-foreground">{job.location ?? "Location not set"}</p>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {job.company?.name ?? "No company"}
                            </td>
                            <td className="px-4 py-3">
                              <Badge tone="neutral">{application?.status.replaceAll("_", " ") ?? "SAVED"}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              {match ? <Badge tone={match.matchScore >= 85 ? "green" : "amber"}>{match.matchScore}%</Badge> : <Badge>Unscored</Badge>}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{salary}</td>
                            <td className="px-4 py-3 text-muted-foreground">{formatShortDate(job.deadline)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Add</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={quickAddJob} className="space-y-4">
              <Field label="Role title">
                <Input name="title" required placeholder="Forward Deployed Engineer" />
              </Field>
              <Field label="Location">
                <Input name="location" placeholder="Remote" />
              </Field>
              <Field label="Notes or pasted snippet">
                <Textarea name="description" placeholder="Short role context for now." />
              </Field>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input className="h-4 w-4 accent-primary" defaultChecked name="createApplication" type="checkbox" />
                Add to saved pipeline
              </label>
              <Button type="submit">Add job</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
