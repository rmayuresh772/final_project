import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { getDashboardService } from "@/services/dashboard.service";

export async function GET() {
  try {
    const user = await requireAuth();

    const dashboard = await getDashboardService(
      user.organizationId
    );

    return NextResponse.json({
      success: true,
      data: dashboard,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 500,
      }
    );
  }
}