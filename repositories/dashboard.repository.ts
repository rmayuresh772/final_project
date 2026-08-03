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
        deletedAt: null,
      },
    }),

    prisma.expense.count({
      where: {
        organizationId,
        status: ExpenseStatus.DRAFT,
        deletedAt: null,
      },
    }),

    prisma.expense.count({
      where: {
        organizationId,
        status: ExpenseStatus.SUBMITTED,
        deletedAt: null,
      },
    }),

    prisma.expense.count({
      where: {
        organizationId,
        status: ExpenseStatus.APPROVED,
        deletedAt: null,
      },
    }),

    prisma.expense.count({
      where: {
        organizationId,
        status: ExpenseStatus.REJECTED,
        deletedAt: null,
      },
    }),

    prisma.expense.aggregate({
      where: {
        organizationId,
        deletedAt: null,
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
      deletedAt: null,
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
      deletedAt: null,
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

/**
 * Monthly aggregation done in SQL via Prisma groupBy.
 * Returns last 6 months of approved expense totals.
 */
export async function getMonthlyExpenses(
  organizationId: string
) {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const grouped = await prisma.expense.groupBy({
    by: ["approvedAt"],
    where: {
      organizationId,
      status: ExpenseStatus.APPROVED,
      deletedAt: null,
      approvedAt: {
        gte: sixMonthsAgo,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      approvedAt: "asc",
    },
  });

  // Build a map of month -> total
  const monthMap = new Map<string, number>();

  for (const row of grouped) {
    if (!row.approvedAt) continue;
    const key = `${row.approvedAt.getFullYear()}-${row.approvedAt.getMonth()}`;
    const total = Number(row._sum.amount ?? 0);
    monthMap.set(key, (monthMap.get(key) ?? 0) + total);
  }

  // Fill in all 6 months (including empty ones)
  const result: { month: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    result.push({
      month: d.toLocaleString("en-US", { month: "short" }),
      total: monthMap.get(key) ?? 0,
    });
  }

  return result;
}

/**
 * Employee dashboard: expenses grouped by status (SQL count).
 */
export async function getEmployeeExpenseStats(
  organizationId: string,
  userId: string
) {
  const [draft, submitted, approved, rejected] = await Promise.all([
    prisma.expense.count({
      where: {
        organizationId,
        userId,
        status: ExpenseStatus.DRAFT,
        deletedAt: null,
      },
    }),
    prisma.expense.count({
      where: {
        organizationId,
        userId,
        status: ExpenseStatus.SUBMITTED,
        deletedAt: null,
      },
    }),
    prisma.expense.count({
      where: {
        organizationId,
        userId,
        status: ExpenseStatus.APPROVED,
        deletedAt: null,
      },
    }),
    prisma.expense.count({
      where: {
        organizationId,
        userId,
        status: ExpenseStatus.REJECTED,
        deletedAt: null,
      },
    }),
  ]);

  return { draft, submitted, approved, rejected };
}

/**
 * Employee dashboard: total spend this month vs last month (SQL aggregate).
 */
export async function getEmployeeMonthlyComparison(
  organizationId: string,
  userId: string
) {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const [thisMonth, lastMonth] = await Promise.all([
    prisma.expense.aggregate({
      where: {
        organizationId,
        userId,
        status: ExpenseStatus.APPROVED,
        deletedAt: null,
        approvedAt: {
          gte: startOfThisMonth,
        },
      },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: {
        organizationId,
        userId,
        status: ExpenseStatus.APPROVED,
        deletedAt: null,
        approvedAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _sum: { amount: true },
    }),
  ]);

  return {
    thisMonth: Number(thisMonth._sum.amount ?? 0),
    lastMonth: Number(lastMonth._sum.amount ?? 0),
  };
}

/**
 * Manager dashboard: team spend by category this month (SQL groupBy).
 */
export async function getManagerCategorySpend(
  organizationId: string
) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const grouped = await prisma.expense.groupBy({
    by: ["category"],
    where: {
      organizationId,
      status: ExpenseStatus.APPROVED,
      deletedAt: null,
      approvedAt: {
        gte: startOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return grouped.map((row) => ({
    category: row.category,
    total: Number(row._sum.amount ?? 0),
  }));
}

/**
 * Manager dashboard: top 5 spenders (SQL groupBy + orderBy + take).
 */
export async function getTopSpenders(
  organizationId: string
) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const grouped = await prisma.expense.groupBy({
    by: ["userId"],
    where: {
      organizationId,
      status: ExpenseStatus.APPROVED,
      deletedAt: null,
      approvedAt: {
        gte: startOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
    take: 5,
  });

  // Fetch user names for the top spenders
  const userIds = grouped.map((row) => row.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));

  return grouped.map((row) => ({
    userId: row.userId,
    name: userMap.get(row.userId)?.name ?? "Unknown",
    email: userMap.get(row.userId)?.email ?? "",
    total: Number(row._sum.amount ?? 0),
  }));
}

/**
 * Admin dashboard: total monthly spend vs budget (SQL aggregate).
 */
export async function getAdminBudgetStatus(
  organizationId: string
) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [budget, monthlySpend] = await Promise.all([
    prisma.budget.findUnique({
      where: { organizationId },
    }),
    prisma.expense.aggregate({
      where: {
        organizationId,
        status: ExpenseStatus.APPROVED,
        deletedAt: null,
        approvedAt: {
          gte: startOfMonth,
        },
      },
      _sum: { amount: true },
    }),
  ]);

  const monthlyLimit = budget ? Number(budget.monthlyLimit) : 0;
  const spent = Number(monthlySpend._sum.amount ?? 0);
  const percentage = monthlyLimit > 0 ? (spent / monthlyLimit) * 100 : 0;

  return {
    monthlyLimit,
    spent,
    percentage,
    over80Percent: percentage > 80,
    overBudget: percentage > 100,
  };
}

/**
 * Admin dashboard: organisation-wide category breakdown (SQL groupBy).
 */
export async function getAdminCategoryBreakdown(
  organizationId: string
) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const grouped = await prisma.expense.groupBy({
    by: ["category"],
    where: {
      organizationId,
      status: ExpenseStatus.APPROVED,
      deletedAt: null,
      approvedAt: {
        gte: startOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return grouped.map((row) => ({
    category: row.category,
    total: Number(row._sum.amount ?? 0),
  }));
}