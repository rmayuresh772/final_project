import { prisma } from "@/lib/prisma";
import { ExpenseStatus } from "@prisma/client";

export async function getDashboardSummary(
  organizationId: string
) {
  const [
    totalExpenses,
    draft,
    submitted,
    approved,
    rejected,
    amountResult,
  ] = await Promise.all([
    prisma.expense.count({
      where: {
        organizationId,
        isDeleted: false,
      },
    }),

    prisma.expense.count({
      where: {
        organizationId,
        status: ExpenseStatus.DRAFT,
        isDeleted: false,
      },
    }),

    prisma.expense.count({
      where: {
        organizationId,
        status: ExpenseStatus.SUBMITTED,
        isDeleted: false,
      },
    }),

    prisma.expense.count({
      where: {
        organizationId,
        status: ExpenseStatus.APPROVED,
        isDeleted: false,
      },
    }),

    prisma.expense.count({
      where: {
        organizationId,
        status: ExpenseStatus.REJECTED,
        isDeleted: false,
      },
    }),

    prisma.expense.aggregate({
      where: {
        organizationId,
        isDeleted: false,
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    totalExpenses,
    draft,
    submitted,
    approved,
    rejected,
    totalAmount: amountResult._sum.amount ?? 0,
  };
}

export async function getRecentExpenses(
  organizationId: string
) {
  return prisma.expense.findMany({
    where: {
      organizationId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getPendingExpenses(
  organizationId: string
) {
  return prisma.expense.findMany({
    where: {
      organizationId,
      status: ExpenseStatus.SUBMITTED,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}



export async function getMonthlyExpenses(
  organizationId: string
) {
  return prisma.expense.findMany({
    where: {
      organizationId,
      status: ExpenseStatus.APPROVED,
      isDeleted: false,
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}