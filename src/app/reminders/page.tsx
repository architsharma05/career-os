import { Bell } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDateInput, formatShortDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import {
  createReminder,
  toggleReminderComplete,
} from "@/server/actions/reminders";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

export default async function RemindersPage() {
  const user = await getDemoUser();
  const [reminders, jobs] = await Promise.all([
    prisma.reminder.findMany({
      where: { userId: user.id },
      include: {
        job: { include: { company: true } },
        company: true,
        contact: true,
        application: true,
      },
      orderBy: [{ isCompleted: "asc" }, { dueDate: "asc" }],
    }),
    prisma.job.findMany({
      where: { userId: user.id },
      include: { company: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <PageShell>
      <PageHeader
        title="Reminders"
        description="Keep follow-ups, deadlines, interview prep, and thank-you notes visible without automating user actions."
        badge={`${reminders.filter((reminder) => !reminder.isCompleted).length} open`}
      />
      <div className="grid gap-6 px-5 py-6 lg:px-8 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Reminder Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                No reminders yet.
              </div>
            ) : null}
            {reminders.map((reminder) => (
              <div key={reminder.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{reminder.title}</h2>
                      <Badge tone={reminder.isCompleted ? "green" : "amber"}>
                        {reminder.isCompleted ? "Done" : "Open"}
                      </Badge>
                      <Badge tone="neutral">{reminder.type}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Due {formatShortDate(reminder.dueDate)}
                      {reminder.job
                        ? ` · ${reminder.job.title} at ${reminder.job.company?.name ?? "No company"}`
                        : ""}
                    </p>
                    {reminder.description ? (
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {reminder.description}
                      </p>
                    ) : null}
                  </div>
                  <form
                    action={toggleReminderComplete}
                    className="flex shrink-0 items-center gap-2"
                  >
                    <input name="id" type="hidden" value={reminder.id} />
                    <input
                      defaultChecked={!reminder.isCompleted}
                      name="isCompleted"
                      type="hidden"
                      value={reminder.isCompleted ? "" : "on"}
                    />
                    <Button type="submit" variant="secondary">
                      {reminder.isCompleted ? "Reopen" : "Mark done"}
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Create reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createReminder} className="space-y-4">
              <Field label="Title">
                <Input
                  name="title"
                  required
                  placeholder="Follow up with recruiter"
                />
              </Field>
              <Field label="Type">
                <Select name="type" required defaultValue="follow up">
                  <option>follow up</option>
                  <option>apply by deadline</option>
                  <option>interview prep</option>
                  <option>send thank-you note</option>
                  <option>networking check-in</option>
                  <option>custom</option>
                </Select>
              </Field>
              <Field label="Due date">
                <Input
                  name="dueDate"
                  required
                  type="date"
                  defaultValue={formatDateInput(new Date())}
                />
              </Field>
              <Field label="Related job">
                <Select name="jobId" defaultValue="">
                  <option value="">No job</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} · {job.company?.name ?? "No company"}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Description">
                <Textarea
                  name="description"
                  placeholder="What should you do next?"
                />
              </Field>
              <Button type="submit">Create reminder</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
