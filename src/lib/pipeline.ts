import { ApplicationStatus } from "@prisma/client";

export const applicationStages: { value: ApplicationStatus; label: string }[] =
  [
    { value: "SAVED", label: "Saved" },
    { value: "INTERESTED", label: "Interested" },
    { value: "OUTREACH_STARTED", label: "Outreach Started" },
    { value: "APPLIED", label: "Applied" },
    { value: "RECRUITER_SCREEN", label: "Recruiter Screen" },
    { value: "TECHNICAL_INTERVIEW", label: "Technical Interview" },
    { value: "FINAL_ROUND", label: "Final Round" },
    { value: "OFFER", label: "Offer" },
    { value: "REJECTED", label: "Rejected" },
    { value: "ARCHIVED", label: "Archived" },
  ];

export function statusLabel(status: ApplicationStatus | string) {
  return (
    applicationStages.find((stage) => stage.value === status)?.label ??
    String(status).replaceAll("_", " ")
  );
}

export function statusTone(status: ApplicationStatus) {
  if (["OFFER"].includes(status)) return "green" as const;
  if (
    ["TECHNICAL_INTERVIEW", "FINAL_ROUND", "RECRUITER_SCREEN"].includes(status)
  )
    return "blue" as const;
  if (["REJECTED", "ARCHIVED"].includes(status)) return "red" as const;
  if (["APPLIED", "OUTREACH_STARTED"].includes(status)) return "amber" as const;
  return "neutral" as const;
}
