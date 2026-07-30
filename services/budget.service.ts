import { prisma } from "@/lib/prisma";

/**
 * Checks if approving an expense would exceed the organization's monthly budget.
 * Returns a warning message if budget would be exceeded, or null if it's within budget.
 */
export async function checkBudget(
  organizationId: string,
  expenseAmount: number
): Promise<string | null> {
  const budget = await prisma.budget.findUnique({
    where: { organizationId },
  });

  if (!budget) {
    return null; // No budget set, no check needed
  }

  // Get current month's start and end
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Aggregate total approved expenses this month
  const monthlyTotal = await prisma.expense.aggregate({
    where: {
      organizationId,
      status: "APPROVED",
      approvedAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      deletedAt: null,
    },
    _sum: {
      amount: true,
    },
  });

  const currentSpend = Number(monthlyTotal._sum.amount ?? 0);
  const monthlyLimit = Number(budget.monthlyLimit);
  const projectedSpend = currentSpend + expenseAmount;

  if (projectedSpend > monthlyLimit) {
    return `Budget warning: Approving this expense (₹${expenseAmount}) would exceed the monthly budget of ₹${monthlyLimit}. Current spend: ₹${currentSpend}. Use override flag to approve anyway.`;
  }

  return null;
}

/**
 * Creates or updates the budget for an organization.
 */
export async function setBudget(
  organizationId: string,
  monthlyLimit: number,
  yearlyLimit: number
) {
  return prisma.budget.upsert({
    where: { organizationId },
    update: { monthlyLimit, yearlyLimit },
    create: { organizationId, monthlyLimit, yearlyLimit },
  });
}

/**
 * Gets the budget for an organization.
 */
export async function getBudget(organizationId: string) {
  return prisma.budget.findUnique({
    where: { organizationId },
  });
}