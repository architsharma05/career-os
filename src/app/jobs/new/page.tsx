import { JobForm } from "@/components/forms/job-form";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { createJob } from "@/server/actions/jobs";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

export default async function NewJobPage() {
  const user = await getDemoUser();
  const companies = await prisma.company.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" }
  });

  return (
    <PageShell>
      <PageHeader
        title="Add Job"
        description="Create a structured job record from a manual lead or pasted job description."
        badge="Manual entry"
      />
      <div className="px-5 py-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <JobForm action={createJob} companies={companies} submitLabel="Create job" />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
