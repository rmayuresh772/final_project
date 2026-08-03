import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import {
  getEmployeeExpenseStatsService,
  getEmployeeMonthlyComparisonService,
} from "@/services/dashboard.service";

export async function GET() {
  try {
    const user = await requireAuth();

    const [stats, comparison] = await Promise.all([
      getEmployeeExpenseStatsService(user.organizationId, user.userId),
      getEmployeeMonthlyComparisonService(user.organizationId, user.userId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats,
        comparison,
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