import { NextRequest, NextResponse } from "next/server";

import { registerSchema } from "@/validators/auth.validator";
import { register } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedData = registerSchema.parse(body);

    const result = await register(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: result,
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