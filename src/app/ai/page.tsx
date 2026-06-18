import { Sparkles } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { aiProvider } from "@/server/ai";
import { recommendRolesWithAi } from "@/server/actions/ai";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

export default async function AiAssistantPage() {
  const user = await getDemoUser();
  const [drafts, jobs] = await Promise.all([
    prisma.generatedDraft.findMany({
      where: { userId: user.id },
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.job.findMany({
      where: { userId: user.id },
      include: { company: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <PageShell>
      <PageHeader
        title="AI Assistant"
        description="Generate structured, review-only job search support with mock mode or OpenAI when configured."
        badge={aiProvider === "openai" ? "OpenAI enabled" : "Mock AI mode"}
      />
      <div className="grid gap-6 px-5 py-6 lg:px-8 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Resume-to-role AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Create persisted role recommendations from the demo resume
                profile. Outputs are saved as GeneratedDraft records for
                auditability.
              </p>
              <form action={recommendRolesWithAi}>
                <Button className="w-full" type="submit">
                  Recommend roles
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick job actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">{job.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.company?.name ?? "No company"}
                  </p>
                  <a
                    className="mt-2 inline-flex text-xs font-medium text-primary hover:underline"
                    href={`/jobs/${job.id}`}
                  >
                    Open AI actions
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Persisted AI outputs</h2>
            <Badge tone="blue">{drafts.length} saved</Badge>
          </div>
          {drafts.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No AI outputs yet. Generate role recommendations here or open a
                job to score matches and create drafts.
              </CardContent>
            </Card>
          ) : (
            drafts.map((draft) => (
              <Card key={draft.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle>{draft.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge tone="blue">{draft.type}</Badge>
                      <Badge tone="neutral">
                        {draft.job?.company?.name ?? "workspace"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
                    {draft.content}
                  </pre>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </div>
    </PageShell>
  );
}
