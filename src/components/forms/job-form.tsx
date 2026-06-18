import type { Company, Job } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDateInput, listInputValue } from "@/lib/utils";

type JobFormProps = {
  action: (formData: FormData) => Promise<void>;
  companies: Company[];
  job?: Job;
  submitLabel: string;
};

export function JobForm({ action, companies, job, submitLabel }: JobFormProps) {
  return (
    <form action={action} className="space-y-5">
      {job ? <input name="id" type="hidden" value={job.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Role title">
          <Input name="title" required defaultValue={job?.title ?? ""} placeholder="Solutions Engineer" />
        </Field>
        <Field label="Company">
          <Select name="companyId" defaultValue={job?.companyId ?? ""}>
            <option value="">No company selected</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Job URL">
          <Input name="url" defaultValue={job?.url ?? ""} placeholder="https://company.com/careers/role" />
        </Field>
        <Field label="Source">
          <Input name="source" defaultValue={job?.source ?? "manual entry"} placeholder="manual entry" />
        </Field>
        <Field label="Location">
          <Input name="location" defaultValue={job?.location ?? ""} placeholder="Remote, Chicago, New York" />
        </Field>
        <Field label="Work preference">
          <Select name="workPreference" defaultValue={job?.workPreference ?? "FLEXIBLE"}>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">Onsite</option>
            <option value="FLEXIBLE">Flexible</option>
          </Select>
        </Field>
        <Field label="Salary min">
          <Input name="salaryMin" type="number" defaultValue={job?.salaryMin ?? ""} placeholder="85000" />
        </Field>
        <Field label="Salary max">
          <Input name="salaryMax" type="number" defaultValue={job?.salaryMax ?? ""} placeholder="130000" />
        </Field>
        <Field label="Employment type">
          <Input name="employmentType" defaultValue={job?.employmentType ?? "Full-time"} />
        </Field>
        <Field label="Experience level">
          <Input name="experienceLevel" defaultValue={job?.experienceLevel ?? ""} placeholder="Entry-level" />
        </Field>
        <Field label="Deadline">
          <Input name="deadline" type="date" defaultValue={formatDateInput(job?.deadline)} />
        </Field>
      </div>

      <Field label="Job description">
        <Textarea name="description" required defaultValue={job?.description ?? ""} placeholder="Paste the role description here." />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Required skills" helper="Comma-separated for the MVP">
          <Input name="requiredSkills" defaultValue={listInputValue(job?.requiredSkills)} placeholder="APIs, SQL, communication" />
        </Field>
        <Field label="Preferred skills" helper="Comma-separated for the MVP">
          <Input name="preferredSkills" defaultValue={listInputValue(job?.preferredSkills)} placeholder="SaaS, automation, demos" />
        </Field>
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
