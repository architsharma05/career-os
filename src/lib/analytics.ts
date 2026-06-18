import { ApplicationStatus } from "@prisma/client";

import { applicationStages } from "@/lib/pipeline";
import { prisma } from "@/lib/prisma";

export type DashboardAnalytics = Awaited<
  ReturnType<typeof getDashboardAnalytics>
>;

function percentage(numerator: number, denominator: number) {
  return denominator === 0 ? 0 : Math.round((numerator / denominator) * 100);
}

export async function getDashboardAnalytics(userId: string) {
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const [
    totalJobs,
    applications,
    interviews,
    offers,
    rejections,
    avgMatch,
    openReminders,
    overdueReminders,
    pipelineGroups,
    topMatches,
    targetCompanies,
    recentApplications,
  ] = await Promise.all([
    prisma.job.count({ where: { userId } }),
    prisma.application.findMany({
      where: { userId },
      select: { status: true, appliedDate: true, createdAt: true },
    }),
    prisma.application.count({
      where: {
        userId,
        status: {
          in: [
            ApplicationStatus.RECRUITER_SCREEN,
            ApplicationStatus.TECHNICAL_INTERVIEW,
            ApplicationStatus.FINAL_ROUND,
          ],
        },
      },
    }),
    prisma.application.count({
      where: { userId, status: ApplicationStatus.OFFER },
    }),
    prisma.application.count({
      where: { userId, status: ApplicationStatus.REJECTED },
    }),
    prisma.jobMatch.aggregate({
      where: { job: { userId } },
      _avg: { matchScore: true },
    }),
    prisma.reminder.findMany({
      where: { userId, isCompleted: false },
      include: {
        job: { include: { company: true } },
        company: true,
        contact: true,
      },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
    prisma.reminder.count({
      where: { userId, isCompleted: false, dueDate: { lt: new Date() } },
    }),
    prisma.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
    prisma.jobMatch.findMany({
      where: { job: { userId } },
      include: { job: { include: { company: true } }, searchProfile: true },
      orderBy: { matchScore: "desc" },
      take: 5,
    }),
    prisma.company.findMany({
      where: { userId, isTargetCompany: true },
      include: { jobs: true, contacts: true },
      orderBy: { priority: "asc" },
      take: 5,
    }),
    prisma.application.count({ where: { userId, createdAt: { gte: since } } }),
  ]);

  const inactiveStatuses = new Set<ApplicationStatus>([
    ApplicationStatus.SAVED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.ARCHIVED,
  ]);
  const activeApplications = applications.filter(
    (application) => !inactiveStatuses.has(application.status),
  ).length;
  const responded = interviews + offers + rejections;
  const submitted = applications.filter(
    (application) => application.status !== ApplicationStatus.SAVED,
  ).length;
  const pipeline = applicationStages.map((stage) => ({
    ...stage,
    count:
      pipelineGroups.find((group) => group.status === stage.value)?._count
        .status ?? 0,
  }));

  return {
    totalJobs,
    activeApplications,
    interviews,
    offers,
    rejections,
    averageMatchScore: Math.round(avgMatch._avg.matchScore ?? 0),
    responseRate: percentage(responded, submitted),
    applicationsThisWeek: recentApplications,
    openReminders,
    overdueReminders,
    pipeline,
    topMatches,
    targetCompanies,
  };
}
