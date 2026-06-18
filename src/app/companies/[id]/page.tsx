import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { deleteCompany } from "@/server/actions/companies";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

type CompanyDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { id } = await params;
  const user = await getDemoUser();
  const company = await prisma.company.findFirst({
    where: { id, userId: user.id },
    include: {
      jobs: { orderBy: { updatedAt: "desc" } },
      contacts: { orderBy: { updatedAt: "desc" } }
    }
  });

  if (!company) {
    notFound();
  }

  return (
    <PageShell>
      <PageHeader
        title={company.name}
        description={`${company.industry ?? "Industry not set"} · ${company.location ?? "Location not set"}`}
        badge={company.isTargetCompany ? "Target company" : "Company"}
        actions={
          <>
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-secondary px-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
              href="/companies"
            >
              <ArrowLeft className="h-4 w-4" />
              Companies
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              href={`/companies/${company.id}/edit`}
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
              <CardTitle>Open Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {company.jobs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No jobs linked yet.</p>
              ) : (
                company.jobs.map((job) => (
                  <Link key={job.id} className="block rounded-lg border p-3 hover:border-primary" href={`/jobs/${job.id}`}>
                    <p className="text-sm font-medium">{job.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{job.location ?? "Location not set"}</p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {company.contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No contacts linked yet.</p>
              ) : (
                company.contacts.map((contact) => (
                  <Link key={contact.id} className="block rounded-lg border p-3 hover:border-primary" href={`/contacts/${contact.id}`}>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{contact.title ?? "Title not set"}</p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Priority</span>
                <Badge tone={company.priority === "high" ? "green" : "neutral"}>{company.priority}</Badge>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Size</span>
                <span className="text-right font-medium">{company.size ?? "Not set"}</span>
              </div>
              {company.website ? (
                <a className="inline-flex items-center gap-2 text-primary hover:underline" href={company.website} rel="noreferrer" target="_blank">
                  Open website
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {company.notes ?? "No notes yet."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={deleteCompany}>
                <input name="id" type="hidden" value={company.id} />
                <Button className="w-full" type="submit" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                  Delete company
                </Button>
              </form>
            </CardContent>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}
