import { Badge } from "@/components/ui/badge";
import { jobs, pipelineStages } from "@/lib/demo-data";

export function PipelinePreview() {
  const visibleStages = pipelineStages.slice(0, 6);

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {visibleStages.map((stage) => {
        const stageJobs = jobs.filter((job) => job.stage === stage);

        return (
          <section key={stage} className="min-h-44 rounded-lg border bg-card p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-semibold">{stage}</h3>
              <Badge tone="neutral">{stageJobs.length}</Badge>
            </div>
            <div className="space-y-2">
              {stageJobs.length === 0 ? (
                <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                  Empty
                </div>
              ) : (
                stageJobs.map((job) => (
                  <article key={job.id} className="rounded-md border bg-background p-3">
                    <p className="text-sm font-medium leading-5">{job.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{job.company}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge tone={job.matchScore >= 85 ? "green" : "amber"}>
                        {job.matchScore}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">{job.deadline}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
