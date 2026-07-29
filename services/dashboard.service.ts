import { getDashboardSummary, getMonthlyExpenses, getPendingExpenses, getRecentExpenses } from "@/repositories/dashboard.repository";

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

  const expenses =
    await getMonthlyExpenses(organizationId);


  const monthly: Record<string, number> = {};


  expenses.forEach((expense)=>{

    const month =
      expense.createdAt.toLocaleString(
        "en-US",
        {
          month:"short"
        }
      );


    monthly[month] =
      (monthly[month] || 0)
      + Number(expense.amount);

  });


  return Object.entries(monthly)
    .map(([month,total])=>({
      month,
      total,
    }));

}