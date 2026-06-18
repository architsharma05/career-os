import { prisma } from "@/lib/prisma";

export const DEMO_USER_EMAIL = "demo@careeros.dev";

export async function getDemoUser() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL }
  });

  if (user) {
    return user;
  }

  return prisma.user.create({
    data: {
      name: "Demo User",
      email: DEMO_USER_EMAIL
    }
  });
}
