import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import crypto from "crypto";

import { requireAuth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    requireRole(user, [Role.ADMIN]);

    const body = await req.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { success: false, message: "Email and role are required" },
        { status: 400 }
      );
    }

    if (![Role.ADMIN, Role.MANAGER, Role.EMPLOYEE].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 400 }
      );
    }

    // Check if user already exists in this org
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        organizationId: user.organizationId,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already belongs to this organization" },
        { status: 400 }
      );
    }

    // Check for existing pending invitation
    const existingInvite = await prisma.invitation.findFirst({
      where: {
        email,
        organizationId: user.organizationId,
        accepted: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        { success: false, message: "An active invitation already exists for this email" },
        { status: 400 }
      );
    }

    // Create invitation with 48hr expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    const invitation = await prisma.invitation.create({
      data: {
        organizationId: user.organizationId,
        email,
        role,
        token,
        expiresAt,
        invitedById: user.userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          token: invitation.token,
          expiresAt: invitation.expiresAt,
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