import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";

import { getMonthlyExpensesService } from "@/services/dashboard.service";

export async function GET() {
  try {
    const user = await requireAuth();

    const data = await getMonthlyExpensesService(
      user.organizationId
    );

    return NextResponse.json({
      success: true,
      data,
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