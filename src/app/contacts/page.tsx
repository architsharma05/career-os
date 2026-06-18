import Link from "next/link";
import { ContactRound, Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShortDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const user = await getDemoUser();
  const contacts = await prisma.contact.findMany({
    where: { userId: user.id },
    include: { company: true },
    orderBy: [{ nextFollowUpDate: "asc" }, { updatedAt: "desc" }]
  });

  return (
    <PageShell>
      <PageHeader
        title="Contacts"
        description="Manage manually-added recruiters, employees, alumni, hiring managers, and referral possibilities."
        badge={`${contacts.length} contacts`}
        actions={
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            href="/contacts/new"
          >
            <Plus className="h-4 w-4" />
            New contact
          </Link>
        }
      />

      <div className="px-5 py-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ContactRound className="h-4 w-4 text-primary" />
              Relationship Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="font-medium">No contacts yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add contacts manually as you build warm paths into target companies.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-sm">
                    <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Contact</th>
                        <th className="px-4 py-3 font-semibold">Company</th>
                        <th className="px-4 py-3 font-semibold">Relationship</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Next follow-up</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {contacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-muted/40">
                          <td className="px-4 py-3">
                            <Link className="font-medium hover:text-primary" href={`/contacts/${contact.id}`}>
                              {contact.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">{contact.title ?? "Title not set"}</p>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {contact.company?.name ?? "No company"}
                          </td>
                          <td className="px-4 py-3">
                            <Badge tone="blue">{contact.relationshipType}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge tone="neutral">{contact.status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {formatShortDate(contact.nextFollowUpDate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
