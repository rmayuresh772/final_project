import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import {
  getManagerCategorySpendService,
  getPendingExpensesService,
  getTopSpendersService,
} from "@/services/dashboard.service";

export async function GET() {
  try {
    const user = await requireAuth();

    const [categorySpend, topSpenders, pendingExpenses] = await Promise.all([
      getManagerCategorySpendService(user.organizationId),
      getTopSpendersService(user.organizationId),
      getPendingExpensesService(user.organizationId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        categorySpend,
        topSpenders,
        pendingCount: pendingExpenses.length,
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