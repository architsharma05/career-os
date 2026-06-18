import Link from "next/link";
import { Building2, Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const user = await getDemoUser();
  const companies = await prisma.company.findMany({
    where: { userId: user.id },
    include: {
      _count: {
        select: { jobs: true, contacts: true }
      }
    },
    orderBy: [{ isTargetCompany: "desc" }, { name: "asc" }]
  });

  return (
    <PageShell>
      <PageHeader
        title="Companies"
        description="Track target companies, priorities, notes, linked jobs, and relationship context."
        badge={`${companies.length} companies`}
        actions={
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            href="/companies/new"
          >
            <Plus className="h-4 w-4" />
            New company
          </Link>
        }
      />

      <div className="px-5 py-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Company Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            {companies.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="font-medium">No companies yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add companies you want CareerOS to watch and prioritize.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {companies.map((company) => (
                  <Link
                    key={company.id}
                    className="rounded-lg border bg-background p-4 transition-colors hover:border-primary"
                    href={`/companies/${company.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{company.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {company.industry ?? "Industry not set"}
                        </p>
                      </div>
                      <Badge tone={company.isTargetCompany ? "green" : "neutral"}>
                        {company.priority}
                      </Badge>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Badge tone="blue">{company._count.jobs} jobs</Badge>
                      <Badge tone="amber">{company._count.contacts} contacts</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
