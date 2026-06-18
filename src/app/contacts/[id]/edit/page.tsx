import { notFound } from "next/navigation";

import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { updateContact } from "@/server/actions/contacts";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

type EditContactPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditContactPage({ params }: EditContactPageProps) {
  const { id } = await params;
  const user = await getDemoUser();
  const [contact, companies] = await Promise.all([
    prisma.contact.findFirst({ where: { id, userId: user.id } }),
    prisma.company.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } })
  ]);

  if (!contact) {
    notFound();
  }

  return (
    <PageShell>
      <PageHeader
        title="Edit Contact"
        description="Update relationship context, follow-up dates, and contact details."
        badge={contact.name}
      />
      <div className="px-5 py-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm action={updateContact} companies={companies} contact={contact} submitLabel="Save changes" />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
