import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { findUserById } from "@/repositories/user.repository";

export async function GET() {
  try {
    const payload = await getCurrentUser();

    const user = await findUserById(payload.userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const { password, ...safeUser } = user;

    return NextResponse.json(
      {
        success: true,
        data: safeUser,
      },
      { status: 200 }
    );
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