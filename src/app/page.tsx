import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ClipboardCheck,
  Search,
  Trophy
} from "lucide-react";

import { AppMobileNav, AppSidebar } from "@/components/app-sidebar";
import { AssistantPanel } from "@/components/assistant-panel";
import { JobsTable } from "@/components/jobs-table";
import { PipelinePreview } from "@/components/pipeline-preview";
import { SearchProfilePanel } from "@/components/search-profile-panel";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { companies, contacts, demoUser, jobs, reminders, roleTemplates } from "@/lib/demo-data";

const averageMatch = Math.round(
  jobs.reduce((total, job) => total + job.matchScore, 0) / jobs.length
);

export default function Home() {
  const activeApplications = jobs.filter(
    (job) => !["Saved", "Rejected", "Archived"].includes(job.stage)
  ).length;
  const interviews = jobs.filter((job) => job.stage.includes("Interview")).length;

  return (
    <main className="flex min-h-screen">
      <AppSidebar />
      <section className="min-w-0 flex-1">
        <AppMobileNav />
        <header className="border-b bg-card px-5 py-4 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="green">Demo mode</Badge>
                <Badge tone="blue">Seeded user</Badge>
                <Badge tone="amber">Human-in-the-loop</Badge>
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-normal">Job Search Command Center</h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                Welcome back, {demoUser.name}. CareerOS is prioritizing the roles, contacts,
                reminders, and AI review queues most likely to move your search forward.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" type="button">
                <Search className="h-4 w-4" />
                Add job
              </Button>
              <Button type="button">
                <ClipboardCheck className="h-4 w-4" />
                Score queue
              </Button>
            </div>
          </div>
        </header>

        <div className="space-y-6 px-5 py-6 lg:px-8">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Saved jobs"
              value={String(jobs.length)}
              helper="Across manual, CSV, pasted JD, and demo sources"
              icon={BriefcaseBusiness}
              tone="blue"
            />
            <StatCard
              label="Active applications"
              value={String(activeApplications)}
              helper="Roles currently moving through the CRM"
              icon={ClipboardCheck}
              tone="green"
            />
            <StatCard
              label="Interviews"
              value={String(interviews)}
              helper="Prep packets should be reviewed this week"
              icon={Trophy}
              tone="amber"
            />
            <StatCard
              label="Average match"
              value={`${averageMatch}%`}
              helper="Mock AI scoring against the active profile"
              icon={BarChart3}
              tone="neutral"
            />
          </section>

          <section className="grid min-w-0 gap-6 2xl:grid-cols-[1fr_380px]">
            <div className="min-w-0 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle>Application Pipeline</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Phase 1 preview of the Kanban workflow. Drag-and-drop movement comes in
                        Phase 3.
                      </p>
                    </div>
                    <Badge tone="blue">Solutions Engineer active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <PipelinePreview />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle>Job Inbox</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Jobs stay reviewable before any application or outreach action happens.
                      </p>
                    </div>
                    <Badge tone="green">{jobs.length} jobs</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <JobsTable />
                </CardContent>
              </Card>
            </div>

            <aside className="grid min-w-0 gap-6 lg:grid-cols-2 2xl:block 2xl:space-y-6">
              <AssistantPanel />
              <SearchProfilePanel />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    Upcoming Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reminders.map((reminder) => (
                    <div key={reminder.title} className="rounded-lg border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">{reminder.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{reminder.type}</p>
                        </div>
                        <Badge tone="amber">{reminder.due}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </aside>
          </section>

          <section className="grid min-w-0 gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Target Companies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {companies.map((company) => (
                  <div key={company.name} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.industry}</p>
                    </div>
                    <Badge tone={company.priority === "High" ? "green" : "neutral"}>
                      {company.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Warm Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.name} className="border-b pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {contact.title} at {contact.company}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">{contact.nextStep}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role Template Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {roleTemplates.slice(0, 10).map((role) => (
                    <Badge key={role} tone="blue">
                      {role}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Templates seed Search Profiles with related titles, common skills, scoring hints,
                  and interview topics.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </section>
    </main>
  );
}
