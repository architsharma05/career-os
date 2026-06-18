"use server";

import { revalidatePath } from "next/cache";

import { optionalString, requiredString } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/server/demo-user";

export async function createNote(formData: FormData) {
  const user = await getDemoUser();
  const jobId = optionalString(formData.get("jobId"));

  await prisma.note.create({
    data: {
      userId: user.id,
      jobId,
      companyId: optionalString(formData.get("companyId")),
      contactId: optionalString(formData.get("contactId")),
      applicationId: optionalString(formData.get("applicationId")),
      content: requiredString(formData, "content"),
    },
  });

  revalidatePath("/applications");
  revalidatePath("/pipeline");
  if (jobId) revalidatePath(`/jobs/${jobId}`);
}

export async function deleteNote(formData: FormData) {
  const user = await getDemoUser();
  await prisma.note.delete({
    where: { id: requiredString(formData, "id"), userId: user.id },
  });
  revalidatePath("/applications");
  revalidatePath("/pipeline");
}
