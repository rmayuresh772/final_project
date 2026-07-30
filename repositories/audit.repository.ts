import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

interface CreateAuditLogParams {
  organizationId: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  fromStatus?: string;
  toStatus?: string;
  metadata?: Prisma.InputJsonValue;
}

export async function createAuditLog(data: CreateAuditLogParams) {
  return prisma.auditLog.create({
    data: {
      organizationId: data.organizationId,
      userId: data.userId,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      fromStatus: data.fromStatus,
      toStatus: data.toStatus,
      metadata: data.metadata ?? {},
    },
  });
}

export async function getAuditLogsByOrganization(
  organizationId: string
) {
  return prisma.auditLog.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getAuditLogsByEntity(
  entityId: string
) {
  return prisma.auditLog.findMany({
    where: { entityId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}