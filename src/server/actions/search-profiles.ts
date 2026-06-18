"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { WorkPreference } from "@prisma/client";

import { checkboxValue, commaList, optionalNumber, optionalString, requiredString } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/server/demo-user";

function parseSearchProfileForm(formData: FormData) {
  return {
    name: requiredString(formData, "name"),
    targetRole: requiredString(formData, "targetRole"),
    relatedRoles: commaList(formData.get("relatedRoles")),
    experienceLevel: optionalString(formData.get("experienceLevel")) ?? "entry-level",
    industries: commaList(formData.get("industries")),
    locations: commaList(formData.get("locations")),
    workPreference: (optionalString(formData.get("workPreference")) ?? "FLEXIBLE") as WorkPreference,
    targetCompanies: commaList(formData.get("targetCompanies")),
    salaryMin: optionalNumber(formData.get("salaryMin")),
    salaryMax: optionalNumber(formData.get("salaryMax")),
    requiredSkills: commaList(formData.get("requiredSkills")),
    preferredSkills: commaList(formData.get("preferredSkills")),
    excludedKeywords: commaList(formData.get("excludedKeywords")),
    jobSearchGoal: optionalString(formData.get("jobSearchGoal")) ?? "maximize chance of interview",
    scoringPriorities: commaList(formData.get("scoringPriorities")),
    isActive: checkboxValue(formData.get("isActive"))
  };
}

async function clearOtherActiveProfiles(userId: string, shouldActivate: boolean) {
  if (!shouldActivate) {
    return;
  }

  await prisma.searchProfile.updateMany({
    where: { userId },
    data: { isActive: false }
  });
}

export async function createSearchProfile(formData: FormData) {
  const user = await getDemoUser();
  const data = parseSearchProfileForm(formData);
  await clearOtherActiveProfiles(user.id, data.isActive);

  const profile = await prisma.searchProfile.create({
    data: {
      userId: user.id,
      ...data
    }
  });

  revalidatePath("/search-profiles");
  revalidatePath("/");
  redirect(`/search-profiles/${profile.id}`);
}

export async function updateSearchProfile(formData: FormData) {
  const user = await getDemoUser();
  const id = requiredString(formData, "id");
  const data = parseSearchProfileForm(formData);
  await clearOtherActiveProfiles(user.id, data.isActive);

  await prisma.searchProfile.update({
    where: { id, userId: user.id },
    data
  });

  revalidatePath("/search-profiles");
  revalidatePath(`/search-profiles/${id}`);
  revalidatePath("/");
  redirect(`/search-profiles/${id}`);
}

export async function deleteSearchProfile(formData: FormData) {
  const user = await getDemoUser();
  const id = requiredString(formData, "id");

  await prisma.searchProfile.delete({
    where: { id, userId: user.id }
  });

  revalidatePath("/search-profiles");
  revalidatePath("/");
  redirect("/search-profiles");
}

export async function setActiveSearchProfile(formData: FormData) {
  const user = await getDemoUser();
  const id = requiredString(formData, "id");

  await prisma.$transaction([
    prisma.searchProfile.updateMany({
      where: { userId: user.id },
      data: { isActive: false }
    }),
    prisma.searchProfile.update({
      where: { id, userId: user.id },
      data: { isActive: true }
    })
  ]);

  revalidatePath("/search-profiles");
  revalidatePath("/");
}
