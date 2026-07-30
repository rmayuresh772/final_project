import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { requireAuth, requireRole } from "@/lib/auth";
import { getBudget, setBudget } from "@/services/budget.service";

export async function GET() {
  try {
    const user = await requireAuth();

    const budget = await getBudget(user.organizationId);

    return NextResponse.json({
      success: true,
      data: budget,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    requireRole(user, [Role.ADMIN]);

    const body = await req.json();
    const { monthlyLimit, yearlyLimit } = body;

    if (!monthlyLimit || !yearlyLimit) {
      return NextResponse.json(
        { success: false, message: "Monthly and yearly limits are required" },
        { status: 400 }
      );
    }

    const budget = await setBudget(
      user.organizationId,
      monthlyLimit,
      yearlyLimit
    );

    return NextResponse.json({
      success: true,
      data: budget,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}