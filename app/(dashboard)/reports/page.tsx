import { cookies } from "next/headers";
import { getApiUrl } from "@/lib/api-url";

import ReportCards from "@/components/reports/ReportCards";
import MonthlyExpenseReport from "@/components/reports/MonthlyExpenseReport";
import CategoryBreakdown from "@/components/reports/CategoryBreakdown";
import StatusOverview from "@/components/reports/StatusOverview";

async function fetchAPI(url: string) {
  const cookieStore = await cookies();

  const res = await fetch(getApiUrl(url), {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const result = await res.json();

  return result.data ?? [];
}

export default async function ReportsPage() {
  const dashboard = await fetchAPI("/api/dashboard");
  const monthly = await fetchAPI("/api/dashboard/monthly");
  const expenses = await fetchAPI("/api/expenses");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="mt-2 text-gray-600">
          Expense analytics and spending insights.
        </p>
      </div>

      {/* Summary Cards */}
      <ReportCards data={dashboard} />

      {/* Monthly Report */}
      <MonthlyExpenseReport data={monthly} />

      {/* Category Report */}
      <CategoryBreakdown expenses={expenses} />

      {/* Status Report */}
      <StatusOverview expenses={expenses} />
    </div>
  );
}