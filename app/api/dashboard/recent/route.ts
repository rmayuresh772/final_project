import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";

import { getRecentExpensesService } from "@/services/dashboard.service";

export async function GET() {
  try {
    const user = await requireAuth();
    // const user = await requireAuth();

    console.log("Logged in user:", user);

    const expenses = await getRecentExpensesService(
      user.organizationId
    );

    return NextResponse.json({
      success: true,
      data: expenses,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 401,
      }
    );
  }
}