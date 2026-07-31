import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();

    requireRole(user, [Role.ADMIN]);

    const invitations = await prisma.invitation.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        invitedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const data = invitations.map((invite) => ({
      id: invite.id,
      email: invite.email,
      role: invite.role,
      accepted: invite.accepted,
      token: invite.token,
      expiresAt: invite.expiresAt,
      createdAt: invite.createdAt,
      status: invite.accepted
        ? "ACCEPTED"
        : invite.expiresAt < new Date()
        ? "EXPIRED"
        : "PENDING",
      invitedBy: invite.invitedBy,
      inviteLink: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/users/accept-invite?token=${invite.token}`,
    }));

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
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