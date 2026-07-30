import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { generateToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, name, email, password } = body;

    if (!token || !name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Token, name, email, and password are required" },
        { status: 400 }
      );
    }

    // Find the invitation
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { organization: true },
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, message: "Invalid invitation token" },
        { status: 400 }
      );
    }

    if (invitation.accepted) {
      return NextResponse.json(
        { success: false, message: "Invitation has already been accepted" },
        { status: 400 }
      );
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, message: "Invitation has expired" },
        { status: 400 }
      );
    }

    if (invitation.email !== email) {
      return NextResponse.json(
        { success: false, message: "Email does not match invitation" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create the user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        organizationId: invitation.organizationId,
        name,
        email,
        password: hashedPassword,
        role: invitation.role,
      },
    });

    // Mark invitation as accepted
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { accepted: true },
    });

    // Generate token
    const jwtToken = generateToken({
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
    });

    const { password: _, ...safeUser } = user;

    return NextResponse.json(
      {
        success: true,
        data: {
          user: safeUser,
          token: jwtToken,
          organization: invitation.organization,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}