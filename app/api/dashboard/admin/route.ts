import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import {
  getAdminBudgetStatusService,
  getAdminCategoryBreakdownService,
  getMonthlyExpensesService,
} from "@/services/dashboard.service";

export async function GET() {
  try {
    const user = await requireAuth();

    const [budgetStatus, categoryBreakdown, monthlyTrend] = await Promise.all([
      getAdminBudgetStatusService(user.organizationId),
      getAdminCategoryBreakdownService(user.organizationId),
      getMonthlyExpensesService(user.organizationId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        budgetStatus,
        categoryBreakdown,
        monthlyTrend,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 401,
      }
    );
  }
}