import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";

import { createExpenseSchema } from "@/validators/expense.validator";

import {
  createExpenseService,
  getExpensesService,
} from "@/services/expense.service";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await req.json();

    const data = createExpenseSchema.parse(body);

    const expense = await createExpenseService(user, data);

    return NextResponse.json(
      {
        success: true,
        data: expense,
      },
      { status: 201 }
    );
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

export async function GET() {
  try {
    const user = await requireAuth();

    const expenses = await getExpensesService(
      user.organizationId
    );

    return NextResponse.json({
      success: true,
      data: expenses,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
}