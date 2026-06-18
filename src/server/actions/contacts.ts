"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { optionalDate, optionalString, requiredString } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/server/demo-user";

function parseContactForm(formData: FormData) {
  return {
    name: requiredString(formData, "name"),
    companyId: optionalString(formData.get("companyId")),
    title: optionalString(formData.get("title")),
    email: optionalString(formData.get("email")),
    linkedinUrl: optionalString(formData.get("linkedinUrl")),
    relationshipType: optionalString(formData.get("relationshipType")) ?? "other",
    source: optionalString(formData.get("source")) ?? "manual",
    status: optionalString(formData.get("status")) ?? "active",
    lastContactedDate: optionalDate(formData.get("lastContactedDate")),
    nextFollowUpDate: optionalDate(formData.get("nextFollowUpDate")),
    notes: optionalString(formData.get("notes"))
  };
}

export async function createContact(formData: FormData) {
  const user = await getDemoUser();
  const contact = await prisma.contact.create({
    data: {
      userId: user.id,
      ...parseContactForm(formData)
    }
  });

  revalidatePath("/contacts");
  revalidatePath("/");
  redirect(`/contacts/${contact.id}`);
}

export async function updateContact(formData: FormData) {
  const user = await getDemoUser();
  const id = requiredString(formData, "id");

  await prisma.contact.update({
    where: { id, userId: user.id },
    data: parseContactForm(formData)
  });

  revalidatePath("/contacts");
  revalidatePath(`/contacts/${id}`);
  revalidatePath("/");
  redirect(`/contacts/${id}`);
}

export async function deleteContact(formData: FormData) {
  const user = await getDemoUser();
  const id = requiredString(formData, "id");

  await prisma.contact.delete({
    where: { id, userId: user.id }
  });

  revalidatePath("/contacts");
  revalidatePath("/");
  redirect("/contacts");
}
