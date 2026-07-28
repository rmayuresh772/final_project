import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

interface CreateUserParams {
  organizationId: string;
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export async function createUser(data: CreateUserParams) {
  return prisma.user.create({
    data: {
      organizationId: data.organizationId,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role ?? Role.ADMIN,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}