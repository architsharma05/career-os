import type { Company, Contact } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDateInput } from "@/lib/utils";

type ContactFormProps = {
  action: (formData: FormData) => Promise<void>;
  companies: Company[];
  contact?: Contact;
  submitLabel: string;
};

export function ContactForm({ action, companies, contact, submitLabel }: ContactFormProps) {
  return (
    <form action={action} className="space-y-5">
      {contact ? <input name="id" type="hidden" value={contact.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <Input name="name" required defaultValue={contact?.name ?? ""} placeholder="Maya Patel" />
        </Field>
        <Field label="Company">
          <Select name="companyId" defaultValue={contact?.companyId ?? ""}>
            <option value="">No company selected</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Title">
          <Input name="title" defaultValue={contact?.title ?? ""} placeholder="Senior Solutions Engineer" />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" defaultValue={contact?.email ?? ""} placeholder="maya@example.com" />
        </Field>
        <Field label="LinkedIn URL">
          <Input name="linkedinUrl" defaultValue={contact?.linkedinUrl ?? ""} placeholder="https://linkedin.com/in/..." />
        </Field>
        <Field label="Relationship type">
          <Select name="relationshipType" defaultValue={contact?.relationshipType ?? "employee"}>
            <option value="recruiter">Recruiter</option>
            <option value="hiring manager">Hiring manager</option>
            <option value="employee">Employee</option>
            <option value="alumni">Alumni</option>
            <option value="friend">Friend</option>
            <option value="second-degree connection">Second-degree connection</option>
            <option value="referral possibility">Referral possibility</option>
            <option value="other">Other</option>
          </Select>
        </Field>
        <Field label="Source">
          <Input name="source" defaultValue={contact?.source ?? "manual"} placeholder="manual" />
        </Field>
        <Field label="Status">
          <Input name="status" defaultValue={contact?.status ?? "active"} placeholder="active" />
        </Field>
        <Field label="Last contacted">
          <Input name="lastContactedDate" type="date" defaultValue={formatDateInput(contact?.lastContactedDate)} />
        </Field>
        <Field label="Next follow-up">
          <Input name="nextFollowUpDate" type="date" defaultValue={formatDateInput(contact?.nextFollowUpDate)} />
        </Field>
      </div>

      <Field label="Notes">
        <Textarea name="notes" defaultValue={contact?.notes ?? ""} placeholder="Conversation context, referral angle, or next step." />
      </Field>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
