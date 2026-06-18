import { notFound } from "next/navigation";

import { JobForm } from "@/components/forms/job-form";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { updateJob } from "@/server/actions/jobs";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

type EditJobPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;
  const user = await getDemoUser();
  const [job, companies] = await Promise.all([
    prisma.job.findFirst({ where: { id, userId: user.id } }),
    prisma.company.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } })
  ]);

  if (!job) {
    notFound();
  }

  return (
    <PageShell>
      <PageHeader
        title="Edit Job"
        description="Update the structured role details used by the CRM and AI scoring workflow."
        badge={job.title}
      />
      <div className="px-5 py-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <JobForm action={updateJob} companies={companies} job={job} submitLabel="Save changes" />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
