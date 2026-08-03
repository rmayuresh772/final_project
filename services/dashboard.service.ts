import {
  getAdminBudgetStatus,
  getAdminCategoryBreakdown,
  getDashboardSummary,
  getEmployeeExpenseStats,
  getEmployeeMonthlyComparison,
  getManagerCategorySpend,
  getMonthlyExpenses,
  getPendingExpenses,
  getRecentExpenses,
  getTopSpenders,
} from "@/repositories/dashboard.repository";

export async function getDashboardService(
  organizationId: string
) {
  return getDashboardSummary(organizationId);
}

export async function getRecentExpensesService(
  organizationId: string
) {
  return getRecentExpenses(organizationId);
}

export async function getPendingExpensesService(
  organizationId: string
) {
  return getPendingExpenses(organizationId);
}

export async function getMonthlyExpensesService(
  organizationId: string
) {
  return getMonthlyExpenses(organizationId);
}

export async function getEmployeeExpenseStatsService(
  organizationId: string,
  userId: string
) {
  return getEmployeeExpenseStats(organizationId, userId);
}

export async function getEmployeeMonthlyComparisonService(
  organizationId: string,
  userId: string
) {
  return getEmployeeMonthlyComparison(organizationId, userId);
}

export async function getManagerCategorySpendService(
  organizationId: string
) {
  return getManagerCategorySpend(organizationId);
}

export async function getTopSpendersService(
  organizationId: string
) {
  return getTopSpenders(organizationId);
}

export async function getAdminBudgetStatusService(
  organizationId: string
) {
  return getAdminBudgetStatus(organizationId);
}

export async function getAdminCategoryBreakdownService(
  organizationId: string
) {
  return getAdminCategoryBreakdown(organizationId);
}