import { notFound } from "next/navigation";

import { CompanyForm } from "@/components/forms/company-form";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { updateCompany } from "@/server/actions/companies";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

type EditCompanyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCompanyPage({ params }: EditCompanyPageProps) {
  const { id } = await params;
  const user = await getDemoUser();
  const company = await prisma.company.findFirst({
    where: { id, userId: user.id }
  });

  if (!company) {
    notFound();
  }

  return (
    <PageShell>
      <PageHeader
        title="Edit Company"
        description="Update target-company context used across jobs, contacts, and reminders."
        badge={company.name}
      />
      <div className="px-5 py-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyForm action={updateCompany} company={company} submitLabel="Save changes" />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
