import { NextResponse } from "next/server";

import { requireAuth, requireRole } from "@/lib/auth";
import { approveExpenseService } from "@/services/expense.service";
import { Role } from "@prisma/client";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  req: Request,
  { params }: Params
) {
  try {
    const user = await requireAuth();

    requireRole(user, [Role.ADMIN, Role.MANAGER]);

    const { id } = await params;

    const expense = await approveExpenseService(
      id,
      user.organizationId
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
      { status: 400 }
    );
  }
}