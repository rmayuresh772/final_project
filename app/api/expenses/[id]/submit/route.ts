import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { submitExpenseService } from "@/services/expense.service";

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

    const { id } = await params;

    const expense = await submitExpenseService(
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