import { Badge } from "@/components/ui/badge";
import { jobs } from "@/lib/demo-data";

function scoreTone(score: number) {
  if (score >= 88) return "green";
  if (score >= 75) return "blue";
  if (score >= 65) return "amber";
  return "red";
}

export function JobsTable() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Stage</th>
              <th className="px-4 py-3 font-semibold">Match</th>
              <th className="px-4 py-3 font-semibold">Next action</th>
              <th className="px-4 py-3 font-semibold">Deadline</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-muted/40">
                <td className="px-4 py-3">
                  <p className="font-medium">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.location}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{job.company}</td>
                <td className="px-4 py-3">
                  <Badge tone="neutral">{job.stage}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={scoreTone(job.matchScore)}>{job.matchScore}%</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{job.nextAction}</td>
                <td className="px-4 py-3 text-muted-foreground">{job.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
