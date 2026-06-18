import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiProvider } from "@/server/ai";
import { mockRecommendRoles, mockScoreJob } from "@/server/ai/mock-ai";

export function AssistantPanel() {
  const score = mockScoreJob();
  const recommendations = mockRecommendRoles();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Copilot
          </CardTitle>
          <Badge tone="amber">{aiProvider}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="text-sm font-semibold">Recommended next action</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{score.reason_summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="green">{score.match_score}% match</Badge>
            <Badge tone="blue">{score.recommended_next_action}</Badge>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {recommendations.map((item) => (
            <div key={item.role_template} className="flex items-start justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium">{item.role_template}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.reasoning}</p>
              </div>
              <Badge tone="green">{item.confidence_score}%</Badge>
            </div>
          ))}
        </div>

        <Button className="mt-5 w-full" type="button">
          Generate review-only draft
        </Button>
      </CardContent>
    </Card>
  );
}
