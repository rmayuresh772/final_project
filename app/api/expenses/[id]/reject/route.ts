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
      reason
    );

    return NextResponse.json({
      success: true,
      data: expense,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}