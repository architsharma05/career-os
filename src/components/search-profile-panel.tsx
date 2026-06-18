import { Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { searchProfiles } from "@/lib/demo-data";

export function SearchProfilePanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Search Profiles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {searchProfiles.map((profile) => (
          <div key={profile.name} className="rounded-lg border p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{profile.name}</p>
              {profile.active ? <Badge tone="green">Active</Badge> : <Badge>Saved</Badge>}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{profile.goal}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.matchFocus.slice(0, 3).map((item) => (
                <Badge key={item} tone="blue">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
