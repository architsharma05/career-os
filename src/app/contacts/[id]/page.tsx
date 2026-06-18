import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShortDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { deleteContact } from "@/server/actions/contacts";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

type ContactDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  const { id } = await params;
  const user = await getDemoUser();
  const contact = await prisma.contact.findFirst({
    where: { id, userId: user.id },
    include: {
      company: true,
      drafts: { orderBy: { updatedAt: "desc" } }
    }
  });

  if (!contact) {
    notFound();
  }

  return (
    <PageShell>
      <PageHeader
        title={contact.name}
        description={`${contact.title ?? "Title not set"} · ${contact.company?.name ?? "No company selected"}`}
        badge={contact.relationshipType}
        actions={
          <>
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-secondary px-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
              href="/contacts"
            >
              <ArrowLeft className="h-4 w-4" />
              Contacts
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              href={`/contacts/${contact.id}/edit`}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </>
        }
      />

      <div className="grid gap-6 px-5 py-6 lg:px-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {contact.notes ?? "No notes yet."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Drafts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contact.drafts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No drafts connected to this contact yet.</p>
              ) : (
                contact.drafts.map((draft) => (
                  <div key={draft.id} className="rounded-lg border p-3">
                    <p className="text-sm font-medium">{draft.title}</p>
                    <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">{draft.content}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relationship Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Status</span>
                <Badge tone="neutral">{contact.status}</Badge>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Last contacted</span>
                <span className="text-right font-medium">{formatShortDate(contact.lastContactedDate)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Next follow-up</span>
                <span className="text-right font-medium">{formatShortDate(contact.nextFollowUpDate)}</span>
              </div>
              {contact.email ? (
                <a className="text-primary hover:underline" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              ) : null}
              {contact.linkedinUrl ? (
                <a className="inline-flex items-center gap-2 text-primary hover:underline" href={contact.linkedinUrl} rel="noreferrer" target="_blank">
                  Open LinkedIn profile
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={deleteContact}>
                <input name="id" type="hidden" value={contact.id} />
                <Button className="w-full" type="submit" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                  Delete contact
                </Button>
              </form>
            </CardContent>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}
