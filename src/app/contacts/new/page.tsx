import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { createContact } from "@/server/actions/contacts";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

export default async function NewContactPage() {
  const user = await getDemoUser();
  const companies = await prisma.company.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" }
  });

  return (
    <PageShell>
      <PageHeader
        title="Add Contact"
        description="Create a manually-entered networking contact connected to your job search."
        badge="Manual entry"
      />
      <div className="px-5 py-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm action={createContact} companies={companies} submitLabel="Create contact" />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
