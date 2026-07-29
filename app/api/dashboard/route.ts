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
  } catch (error: any) {
  console.error(error);

  return NextResponse.json(
    {
      success: false,
      message: error.message,
    },
    {
      status: 500,
    }
  );
}
}