import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, jsonList } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { deleteSearchProfile, setActiveSearchProfile } from "@/server/actions/search-profiles";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

type SearchProfileDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SearchProfileDetailPage({ params }: SearchProfileDetailPageProps) {
  const { id } = await params;
  const user = await getDemoUser();
  const profile = await prisma.searchProfile.findFirst({
    where: { id, userId: user.id },
    include: {
      jobMatches: {
        include: { job: { include: { company: true } } },
        orderBy: { matchScore: "desc" }
      },
      applications: {
        include: { job: { include: { company: true } } },
        orderBy: { updatedAt: "desc" }
      }
    }
  });

  if (!profile) {
    notFound();
  }

  const salary =
    profile.salaryMin && profile.salaryMax
      ? `${formatCurrency(profile.salaryMin)} - ${formatCurrency(profile.salaryMax)}`
      : "Not set";

  return (
    <PageShell>
      <PageHeader
        title={profile.name}
        description={`${profile.targetRole} · ${profile.jobSearchGoal}`}
        badge={profile.isActive ? "Active profile" : "Saved profile"}
        actions={
          <>
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-secondary px-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
              href="/search-profiles"
            >
              <ArrowLeft className="h-4 w-4" />
              Profiles
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              href={`/search-profiles/${profile.id}/edit`}
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
              <CardTitle>Scoring Inputs</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <ListBlock title="Related roles" values={jsonList(profile.relatedRoles)} tone="blue" />
              <ListBlock title="Industries" values={jsonList(profile.industries)} tone="green" />
              <ListBlock title="Locations" values={jsonList(profile.locations)} tone="amber" />
              <ListBlock title="Target companies" values={jsonList(profile.targetCompanies)} tone="blue" />
              <ListBlock title="Required skills" values={jsonList(profile.requiredSkills)} tone="green" />
              <ListBlock title="Preferred skills" values={jsonList(profile.preferredSkills)} tone="blue" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Matched Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.jobMatches.length === 0 ? (
                <p className="text-sm text-muted-foreground">No jobs have been scored against this profile yet.</p>
              ) : (
                profile.jobMatches.slice(0, 6).map((match) => (
                  <Link key={match.id} className="block rounded-lg border p-3 hover:border-primary" href={`/jobs/${match.job.id}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{match.job.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {match.job.company?.name ?? "No company"}
                        </p>
                      </div>
                      <Badge tone={match.matchScore >= 85 ? "green" : "amber"}>{match.matchScore}%</Badge>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Experience</span>
                <span className="text-right font-medium">{profile.experienceLevel}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Work style</span>
                <Badge tone="neutral">{profile.workPreference}</Badge>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Salary</span>
                <span className="text-right font-medium">{salary}</span>
              </div>
              {!profile.isActive ? (
                <form action={setActiveSearchProfile}>
                  <input name="id" type="hidden" value={profile.id} />
                  <Button className="w-full" type="submit" variant="secondary">
                    Set active profile
                  </Button>
                </form>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Excluded Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {jsonList(profile.excludedKeywords).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No excluded keywords.</p>
                ) : (
                  jsonList(profile.excludedKeywords).map((keyword) => (
                    <Badge key={keyword} tone="red">
                      {keyword}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={deleteSearchProfile}>
                <input name="id" type="hidden" value={profile.id} />
                <Button className="w-full" type="submit" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                  Delete profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}

function ListBlock({
  title,
  values,
  tone
}: {
  title: string;
  values: string[];
  tone: "blue" | "green" | "amber";
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <div className="flex flex-wrap gap-2">
        {values.length === 0 ? (
          <span className="text-sm text-muted-foreground">Not set</span>
        ) : (
          values.map((value) => (
            <Badge key={value} tone={tone}>
              {value}
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}
