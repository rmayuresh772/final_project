import { Role } from "@prisma/client";

import { hashPassword, comparePassword } from "@/lib/password";
import { generateToken } from "@/lib/jwt";

import {
  createOrganization,
  findOrganizationBySlug,
} from "@/repositories/organization.repository";

import {
  createUser,
  findUserByEmail,
} from "@/repositories/user.repository";

interface RegisterInput {
  organizationName: string;
  organizationSlug: string;
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export async function register(data: RegisterInput) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const existingOrg = await findOrganizationBySlug(
    data.organizationSlug
  );

  if (existingOrg) {
    throw new Error("Organization slug already exists");
  }

  const organization = await createOrganization(
    data.organizationName,
    data.organizationSlug
  );

  const hashedPassword = await hashPassword(data.password);

  const user = await createUser({
    organizationId: organization.id,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: Role.ADMIN,
  });

  const token = generateToken({
    userId: user.id,
    organizationId: organization.id,
    role: user.role,
  });

  const { password, ...safeUser } = user;

  return {
  token,
  user: safeUser,
  organization,
};
}

export async function login(data: LoginInput) {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const validPassword = await comparePassword(
    data.password,
    user.password
  );

  if (!validPassword) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    userId: user.id,
    organizationId: user.organizationId,
    role: user.role,
  });

  const { password, ...safeUser } = user;

  return {
  token,
  user: safeUser,
};
}