import type { Company } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type CompanyFormProps = {
  action: (formData: FormData) => Promise<void>;
  company?: Company;
  submitLabel: string;
};

export function CompanyForm({ action, company, submitLabel }: CompanyFormProps) {
  return (
    <form action={action} className="space-y-5">
      {company ? <input name="id" type="hidden" value={company.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Company name">
          <Input name="name" required defaultValue={company?.name ?? ""} placeholder="Northstar AI" />
        </Field>
        <Field label="Website">
          <Input name="website" defaultValue={company?.website ?? ""} placeholder="https://company.com" />
        </Field>
        <Field label="Industry">
          <Input name="industry" defaultValue={company?.industry ?? ""} placeholder="AI SaaS" />
        </Field>
        <Field label="Company size">
          <Input name="size" defaultValue={company?.size ?? ""} placeholder="201-500" />
        </Field>
        <Field label="Location">
          <Input name="location" defaultValue={company?.location ?? ""} placeholder="Remote, Chicago, New York" />
        </Field>
        <Field label="Priority">
          <Select name="priority" defaultValue={company?.priority ?? "medium"}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          className="h-4 w-4 accent-primary"
          defaultChecked={company?.isTargetCompany ?? false}
          name="isTargetCompany"
          type="checkbox"
        />
        Target company
      </label>

      <Field label="Notes">
        <Textarea name="notes" defaultValue={company?.notes ?? ""} placeholder="What matters about this company?" />
      </Field>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
