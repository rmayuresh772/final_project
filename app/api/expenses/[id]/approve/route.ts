import { NextRequest, NextResponse } from "next/server";

import { requireAuth, requireRole } from "@/lib/auth";
import { approveExpenseService } from "@/services/expense.service";
import { Role } from "@prisma/client";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  req: NextRequest,
  { params }: Params
) {
  try {
    const user = await requireAuth();

    requireRole(user, [Role.ADMIN, Role.MANAGER]);

    const { id } = await params;

    const body = await req.json().catch(() => ({}));
    const overrideBudget = body.overrideBudget === true;

    const expense = await approveExpenseService(
      id,
      user.organizationId,
      user.userId,
      overrideBudget
    );

    return NextResponse.json({
      success: true,
      data: expense,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    const statusCode =
      error instanceof Error &&
      "statusCode" in error &&
      typeof (error as Error & { statusCode?: number }).statusCode === "number"
        ? (error as Error & { statusCode?: number }).statusCode
        : 400;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode }
    );
  }
}