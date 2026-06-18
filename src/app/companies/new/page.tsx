import { CompanyForm } from "@/components/forms/company-form";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCompany } from "@/server/actions/companies";

export const dynamic = "force-dynamic";

export default function NewCompanyPage() {
  return (
    <PageShell>
      <PageHeader
        title="Add Company"
        description="Create a company record for saved roles, contacts, reminders, and notes."
        badge="Manual entry"
      />
      <div className="px-5 py-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyForm action={createCompany} submitLabel="Create company" />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
