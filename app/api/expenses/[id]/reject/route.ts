import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { requireAuth, requireRole } from "@/lib/auth";
import { rejectExpenseService } from "@/services/expense.service";
import { rejectExpenseSchema } from "@/validators/expense.validator";

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

    const body = await req.json();

    const { reason } = rejectExpenseSchema.parse(body);

    const expense = await rejectExpenseService(
      id,
      user.organizationId,
      user.userId,
      reason
    );

    return NextResponse.json({
      success: true,
      data: expense,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
      }
    );
  }
}