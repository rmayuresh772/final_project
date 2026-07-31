import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { generateToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { token, name, password } = body;

    if (!token || !name || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Token, name and password are required",
        },
        {
          status: 400,
        }
      );
    }

    // Find invitation
    const invitation = await prisma.invitation.findUnique({
      where: {
        token,
      },
      include: {
        organization: true,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid invitation token",
        },
        {
          status: 400,
        }
      );
    }

    if (invitation.accepted) {
      return NextResponse.json(
        {
          success: false,
          message: "Invitation has already been accepted",
        },
        {
          status: 400,
        }
      );
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Invitation has expired",
        },
        {
          status: 400,
        }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: invitation.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create user using email from invitation
    const user = await prisma.user.create({
      data: {
        organizationId: invitation.organizationId,
        name,
        email: invitation.email,
        password: hashedPassword,
        role: invitation.role,
      },
    });

    // Mark invitation accepted
    await prisma.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        accepted: true,
      },
    });

    const jwtToken = generateToken({
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
    });

    const { password: _, ...safeUser } = user;

    return NextResponse.json(
      {
        success: true,
        message: "Invitation accepted successfully",
        data: {
          user: safeUser,
          token: jwtToken,
          organization: invitation.organization,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      {
        status: 400,
      }
    );
  }
}