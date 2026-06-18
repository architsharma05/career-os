import Link from "next/link";
import { ClipboardCheck } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShortDate } from "@/lib/utils";
import { statusLabel, statusTone } from "@/lib/pipeline";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const user = await getDemoUser();
  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    include: {
      job: { include: { company: true } },
      searchProfile: true,
      notesList: true,
      reminders: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <PageShell>
      <PageHeader
        title="Applications"
        description="Track resume versions, follow-ups, interviews, notes, and reminders for every opportunity."
        badge={`${applications.length} records`}
      />
      <div className="px-5 py-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              Application Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Profile</th>
                      <th className="px-4 py-3">Applied</th>
                      <th className="px-4 py-3">Follow-up</th>
                      <th className="px-4 py-3">Notes</th>
                      <th className="px-4 py-3">Reminders</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {applications.map((application) => (
                      <tr key={application.id} className="hover:bg-muted/40">
                        <td className="px-4 py-3">
                          <Link
                            className="font-medium hover:text-primary"
                            href={`/jobs/${application.jobId}`}
                          >
                            {application.job.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {application.job.company?.name ?? "No company"}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge tone={statusTone(application.status)}>
                            {statusLabel(application.status)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {application.searchProfile?.name ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatShortDate(application.appliedDate)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatShortDate(application.nextFollowUpDate)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {application.notesList.length}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {application.reminders.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
