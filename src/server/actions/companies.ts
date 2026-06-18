"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { checkboxValue, optionalString, requiredString } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/server/demo-user";

function parseCompanyForm(formData: FormData) {
  return {
    name: requiredString(formData, "name"),
    website: optionalString(formData.get("website")),
    industry: optionalString(formData.get("industry")),
    size: optionalString(formData.get("size")),
    location: optionalString(formData.get("location")),
    notes: optionalString(formData.get("notes")),
    isTargetCompany: checkboxValue(formData.get("isTargetCompany")),
    priority: optionalString(formData.get("priority")) ?? "medium"
  };
}

export async function createCompany(formData: FormData) {
  const user = await getDemoUser();
  const company = await prisma.company.create({
    data: {
      userId: user.id,
      ...parseCompanyForm(formData)
    }
  });

  revalidatePath("/companies");
  revalidatePath("/");
  redirect(`/companies/${company.id}`);
}

export async function updateCompany(formData: FormData) {
  const user = await getDemoUser();
  const id = requiredString(formData, "id");

  await prisma.company.update({
    where: { id, userId: user.id },
    data: parseCompanyForm(formData)
  });

  revalidatePath("/companies");
  revalidatePath(`/companies/${id}`);
  revalidatePath("/");
  redirect(`/companies/${id}`);
}

export async function deleteCompany(formData: FormData) {
  const user = await getDemoUser();
  const id = requiredString(formData, "id");

  await prisma.company.delete({
    where: { id, userId: user.id }
  });

  revalidatePath("/companies");
  revalidatePath("/");
  redirect("/companies");
}
