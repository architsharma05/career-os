import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatShortDate, jsonList } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import {
  generateDraftWithAi,
  generateInterviewPrepWithAi,
  scoreJobWithAi,
} from "@/server/actions/ai";
import { deleteJob } from "@/server/actions/jobs";
import { createNote } from "@/server/actions/notes";
import { createReminder } from "@/server/actions/reminders";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const user = await getDemoUser();
  const job = await prisma.job.findFirst({
    where: { id, userId: user.id },
    include: {
      company: true,
      applications: {
        include: { searchProfile: true },
        orderBy: { updatedAt: "desc" },
      },
      matches: {
        include: { searchProfile: true },
        orderBy: { matchScore: "desc" },
      },
      notes: { orderBy: { createdAt: "desc" } },
      reminders: { orderBy: { dueDate: "asc" } },
      drafts: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!job) {
    notFound();
  }

  const searchProfiles = await prisma.searchProfile.findMany({
    where: { userId: user.id },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });

  const salary =
    job.salaryMin && job.salaryMax
      ? `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}`
      : "Not listed";

  return (
    <PageShell>
      <PageHeader
        title={job.title}
        description={`${job.company?.name ?? "No company selected"} · ${job.location ?? "Location not set"}`}
        badge={job.source}
        actions={
          <>
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-secondary px-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
              href="/jobs"
            >
              <ArrowLeft className="h-4 w-4" />
              Jobs
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              href={`/jobs/${job.id}/edit`}
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
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {job.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={createNote} className="space-y-3">
                <input name="jobId" type="hidden" value={job.id} />
                <Textarea
                  name="content"
                  required
                  placeholder="Add interview, recruiter, or application context."
                />
                <Button type="submit" variant="secondary">
                  Add note
                </Button>
              </form>
              <div className="space-y-2">
                {job.notes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No notes yet.</p>
                ) : null}
                {job.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border p-3 text-sm leading-6 text-muted-foreground"
                  >
                    {note.content}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold">Required</p>
                <div className="flex flex-wrap gap-2">
                  {jsonList(job.requiredSkills).map((skill) => (
                    <Badge key={skill} tone="blue">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Preferred</p>
                <div className="flex flex-wrap gap-2">
                  {jsonList(job.preferredSkills).map((skill) => (
                    <Badge key={skill} tone="green">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Work style</span>
                <Badge tone="neutral">{job.workPreference}</Badge>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Salary</span>
                <span className="text-right font-medium">{salary}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Deadline</span>
                <span className="text-right font-medium">
                  {formatShortDate(job.deadline)}
                </span>
              </div>
              {job.url ? (
                <a
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                  href={job.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open posting
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <form
                action={scoreJobWithAi}
                className="space-y-3 rounded-lg border p-3"
              >
                <input name="jobId" type="hidden" value={job.id} />
                <Field label="Search profile">
                  <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    name="searchProfileId"
                    defaultValue={
                      searchProfiles.find((profile) => profile.isActive)?.id ??
                      searchProfiles[0]?.id
                    }
                  >
                    {searchProfiles.map((profile) => (
                      <option key={profile.id} value={profile.id}>
                        {profile.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Button className="w-full" type="submit">
                  Score job match
                </Button>
              </form>
              <form
                action={generateDraftWithAi}
                className="grid gap-2 sm:grid-cols-2"
              >
                <input name="jobId" type="hidden" value={job.id} />
                <input name="draftType" type="hidden" value="outreach" />
                <Button type="submit" variant="secondary">
                  Generate outreach
                </Button>
              </form>
              <form action={generateDraftWithAi}>
                <input name="jobId" type="hidden" value={job.id} />
                <input name="draftType" type="hidden" value="cover_letter" />
                <Button className="w-full" type="submit" variant="secondary">
                  Generate cover letter
                </Button>
              </form>
              <form action={generateInterviewPrepWithAi}>
                <input name="jobId" type="hidden" value={job.id} />
                <Button className="w-full" type="submit" variant="secondary">
                  Generate interview prep
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Match Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.matches.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No match scores yet.
                </p>
              ) : (
                job.matches.map((match) => (
                  <div key={match.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">
                        {match.searchProfile.name}
                      </p>
                      <Badge tone={match.matchScore >= 85 ? "green" : "amber"}>
                        {match.matchScore}%
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {match.reasonSummary}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New Reminder</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createReminder} className="space-y-3">
                <input name="jobId" type="hidden" value={job.id} />
                <Field label="Title">
                  <Input
                    name="title"
                    required
                    placeholder="Follow up after applying"
                  />
                </Field>
                <Field label="Type">
                  <Input name="type" required defaultValue="follow up" />
                </Field>
                <Field label="Due date">
                  <Input name="dueDate" required type="date" />
                </Field>
                <Field label="Description">
                  <Textarea name="description" placeholder="Optional context" />
                </Field>
                <Button type="submit" variant="secondary">
                  Create reminder
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Drafts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.drafts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No AI drafts yet. Generate one above; every draft is
                  review-only.
                </p>
              ) : (
                job.drafts.map((draft) => (
                  <div key={draft.id} className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{draft.title}</p>
                      <Badge tone="blue">{draft.type}</Badge>
                    </div>
                    <pre className="whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                      {draft.content}
                    </pre>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={deleteJob}>
                <input name="id" type="hidden" value={job.id} />
                <Button className="w-full" type="submit" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                  Delete job
                </Button>
              </form>
            </CardContent>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}
