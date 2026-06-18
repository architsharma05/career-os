"use server";

import { revalidatePath } from "next/cache";

import { checkboxValue, optionalString, requiredString } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/server/demo-user";

export async function createReminder(formData: FormData) {
  const user = await getDemoUser();

  await prisma.reminder.create({
    data: {
      userId: user.id,
      jobId: optionalString(formData.get("jobId")),
      companyId: optionalString(formData.get("companyId")),
      contactId: optionalString(formData.get("contactId")),
      applicationId: optionalString(formData.get("applicationId")),
      title: requiredString(formData, "title"),
      description: optionalString(formData.get("description")),
      dueDate: new Date(requiredString(formData, "dueDate")),
      type: requiredString(formData, "type"),
      isCompleted: checkboxValue(formData.get("isCompleted")),
    },
  });

  revalidatePath("/reminders");
  revalidatePath("/");
}

export async function toggleReminderComplete(formData: FormData) {
  const user = await getDemoUser();
  await prisma.reminder.update({
    where: { id: requiredString(formData, "id"), userId: user.id },
    data: { isCompleted: checkboxValue(formData.get("isCompleted")) },
  });
  revalidatePath("/reminders");
  revalidatePath("/");
}
