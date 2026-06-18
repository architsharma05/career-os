import Link from "next/link";
import { Plus, Target } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jsonList } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { setActiveSearchProfile } from "@/server/actions/search-profiles";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

export default async function SearchProfilesPage() {
  const user = await getDemoUser();
  const profiles = await prisma.searchProfile.findMany({
    where: { userId: user.id },
    include: {
      _count: {
        select: { jobMatches: true, applications: true }
      }
    },
    orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }]
  });

  return (
    <PageShell>
      <PageHeader
        title="Search Profiles"
        description="Define the role targets and scoring priorities CareerOS uses to evaluate jobs."
        badge={`${profiles.length} profiles`}
        actions={
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            href="/search-profiles/new"
          >
            <Plus className="h-4 w-4" />
            New profile
          </Link>
        }
      />

      <div className="px-5 py-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Role Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profiles.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="font-medium">No Search Profiles yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create one target profile so CareerOS can score jobs against your goals.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {profiles.map((profile) => (
                  <article key={profile.id} className="rounded-lg border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link className="font-semibold hover:text-primary" href={`/search-profiles/${profile.id}`}>
                          {profile.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">{profile.targetRole}</p>
                      </div>
                      {profile.isActive ? <Badge tone="green">Active</Badge> : <Badge>Saved</Badge>}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {jsonList(profile.requiredSkills).slice(0, 4).map((skill) => (
                        <Badge key={skill} tone="blue">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex gap-2">
                        <Badge tone="neutral">{profile._count.jobMatches} scores</Badge>
                        <Badge tone="neutral">{profile._count.applications} applications</Badge>
                      </div>
                      {!profile.isActive ? (
                        <form action={setActiveSearchProfile}>
                          <input name="id" type="hidden" value={profile.id} />
                          <Button type="submit" variant="secondary">
                            Set active
                          </Button>
                        </form>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
