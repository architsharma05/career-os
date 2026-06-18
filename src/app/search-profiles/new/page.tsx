import { SearchProfileForm } from "@/components/forms/search-profile-form";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSearchProfile } from "@/server/actions/search-profiles";

export const dynamic = "force-dynamic";

export default function NewSearchProfilePage() {
  return (
    <PageShell>
      <PageHeader
        title="Add Search Profile"
        description="Create a scoring lens for a target role, location, skill set, and career goal."
        badge="Role target"
      />
      <div className="px-5 py-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Search Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchProfileForm action={createSearchProfile} submitLabel="Create profile" />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
