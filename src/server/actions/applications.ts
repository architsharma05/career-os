"use server";

import { revalidatePath } from "next/cache";
import { ApplicationStatus } from "@prisma/client";

import { optionalDate, optionalString, requiredString } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/server/demo-user";

export async function moveApplication(formData: FormData) {
  const user = await getDemoUser();
  const id = requiredString(formData, "id");
  const status = requiredString(formData, "status") as ApplicationStatus;

  await prisma.application.update({
    where: { id, userId: user.id },
    data: { status },
  });

  revalidatePath("/pipeline");
  revalidatePath("/applications");
  revalidatePath("/jobs");
  revalidatePath("/");
}

export async function updateApplicationDetails(formData: FormData) {
  const user = await getDemoUser();
  const id = requiredString(formData, "id");

  await prisma.application.update({
    where: { id, userId: user.id },
    data: {
      status: requiredString(formData, "status") as ApplicationStatus,
      resumeVersion: optionalString(formData.get("resumeVersion")),
      coverLetterDraft: optionalString(formData.get("coverLetterDraft")),
      appliedDate: optionalDate(formData.get("appliedDate")),
      nextFollowUpDate: optionalDate(formData.get("nextFollowUpDate")),
      interviewDate: optionalDate(formData.get("interviewDate")),
      notes: optionalString(formData.get("notes")),
    },
  });

  revalidatePath("/applications");
  revalidatePath("/pipeline");
}
