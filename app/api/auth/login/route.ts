import { NextRequest, NextResponse } from "next/server";

import { loginSchema } from "@/validators/auth.validator";
import { login } from "@/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedData = loginSchema.parse(body);

    const result = await login(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 401 }
    );
  }
}