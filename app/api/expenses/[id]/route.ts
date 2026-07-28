import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { deleteExpenseService, getExpenseByIdService, updateExpenseService } from "@/services/expense.service";
import { updateExpenseSchema } from "@/validators/expense.validator";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: Params
) {
  try {
    const user = await requireAuth();

    const { id } = await params;

    const expense = await getExpenseByIdService(
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
      {
        status: 404,
      }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: Params
) {
  try {
    const user = await requireAuth();

    const { id } = await params;

    const body = await req.json();

    const data = updateExpenseSchema.parse(body);

    const expense = await updateExpenseService(
      id,
      user.organizationId,
      data
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

export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  try {
    const user = await requireAuth();

    const { id } = await params;

    const result = await deleteExpenseService(
      id,
      user.organizationId
    );

    return NextResponse.json({
      success: true,
      ...result,
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