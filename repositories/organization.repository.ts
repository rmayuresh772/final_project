import { prisma } from "@/lib/prisma";

export async function createOrganization(
  name: string,
  slug: string
) {
  return prisma.organization.create({
    data: {
      name,
      slug,
    },
  });
}

export async function findOrganizationBySlug(slug: string) {
  return prisma.organization.findUnique({
    where: {
      slug,
    },
  });
}