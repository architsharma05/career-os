import { notFound } from "next/navigation";

import { SearchProfileForm } from "@/components/forms/search-profile-form";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { updateSearchProfile } from "@/server/actions/search-profiles";
import { getDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

type EditSearchProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSearchProfilePage({ params }: EditSearchProfilePageProps) {
  const { id } = await params;
  const user = await getDemoUser();
  const profile = await prisma.searchProfile.findFirst({
    where: { id, userId: user.id }
  });

  if (!profile) {
    notFound();
  }

  return (
    <PageShell>
      <PageHeader
        title="Edit Search Profile"
        description="Tune the role target and scoring priorities CareerOS uses for job matching."
        badge={profile.name}
      />
      <div className="px-5 py-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Search Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchProfileForm action={updateSearchProfile} profile={profile} submitLabel="Save changes" />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
