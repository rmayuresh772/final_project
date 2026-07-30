import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { submitExpenseService } from "@/services/expense.service";

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

    const { id } = await params;

    const expense = await submitExpenseService(
      id,
      user.organizationId,
      user.userId
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
      { status: 400 }
    );
  }
}
