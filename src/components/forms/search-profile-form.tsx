import type { SearchProfile } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { listInputValue } from "@/lib/utils";

type SearchProfileFormProps = {
  action: (formData: FormData) => Promise<void>;
  profile?: SearchProfile;
  submitLabel: string;
};

export function SearchProfileForm({ action, profile, submitLabel }: SearchProfileFormProps) {
  return (
    <form action={action} className="space-y-5">
      {profile ? <input name="id" type="hidden" value={profile.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Profile name">
          <Input name="name" required defaultValue={profile?.name ?? ""} placeholder="Solutions Engineer Search" />
        </Field>
        <Field label="Target role">
          <Input name="targetRole" required defaultValue={profile?.targetRole ?? ""} placeholder="Solutions Engineer" />
        </Field>
        <Field label="Experience level">
          <Select name="experienceLevel" defaultValue={profile?.experienceLevel ?? "entry-level"}>
            <option value="student">Student</option>
            <option value="new grad">New grad</option>
            <option value="entry-level">Entry-level</option>
            <option value="0-2 years">0-2 years</option>
            <option value="2-5 years">2-5 years</option>
            <option value="senior">Senior</option>
            <option value="career switcher">Career switcher</option>
          </Select>
        </Field>
        <Field label="Work preference">
          <Select name="workPreference" defaultValue={profile?.workPreference ?? "FLEXIBLE"}>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">Onsite</option>
            <option value="FLEXIBLE">Flexible</option>
          </Select>
        </Field>
        <Field label="Salary min">
          <Input name="salaryMin" type="number" defaultValue={profile?.salaryMin ?? ""} />
        </Field>
        <Field label="Salary max">
          <Input name="salaryMax" type="number" defaultValue={profile?.salaryMax ?? ""} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Related roles" helper="Comma-separated">
          <Input name="relatedRoles" defaultValue={listInputValue(profile?.relatedRoles)} placeholder="Sales Engineer, Technical Consultant" />
        </Field>
        <Field label="Industries" helper="Comma-separated">
          <Input name="industries" defaultValue={listInputValue(profile?.industries)} placeholder="SaaS, AI tools, developer tools" />
        </Field>
        <Field label="Locations" helper="Comma-separated">
          <Input name="locations" defaultValue={listInputValue(profile?.locations)} placeholder="Chicago, Remote" />
        </Field>
        <Field label="Target companies" helper="Comma-separated">
          <Input name="targetCompanies" defaultValue={listInputValue(profile?.targetCompanies)} placeholder="OpenAI, Datadog, Stripe" />
        </Field>
        <Field label="Required skills" helper="Comma-separated">
          <Input name="requiredSkills" defaultValue={listInputValue(profile?.requiredSkills)} placeholder="communication, APIs, SQL" />
        </Field>
        <Field label="Preferred skills" helper="Comma-separated">
          <Input name="preferredSkills" defaultValue={listInputValue(profile?.preferredSkills)} placeholder="SaaS, demos, workflow automation" />
        </Field>
        <Field label="Excluded keywords" helper="Comma-separated">
          <Input name="excludedKeywords" defaultValue={listInputValue(profile?.excludedKeywords)} placeholder="senior, principal" />
        </Field>
        <Field label="Scoring priorities" helper="Comma-separated">
          <Input name="scoringPriorities" defaultValue={listInputValue(profile?.scoringPriorities)} placeholder="role fit, customer-facing work, APIs" />
        </Field>
      </div>

      <Field label="Job search goal">
        <Textarea name="jobSearchGoal" defaultValue={profile?.jobSearchGoal ?? ""} placeholder="customer-facing technical role" />
      </Field>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          className="h-4 w-4 accent-primary"
          defaultChecked={profile?.isActive ?? false}
          name="isActive"
          type="checkbox"
        />
        Make this the active Search Profile
      </label>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
