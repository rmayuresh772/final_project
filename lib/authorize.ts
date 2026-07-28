import { Role } from "@prisma/client";
import { requireAuth } from "./auth";

export async function requireRole(...roles: Role[]) {
  const user = await requireAuth();

  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}