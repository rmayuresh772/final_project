import { headers } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function getCurrentUser() {
  const headerList = await headers();

  const authorization = headerList.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authorization.substring(7);

  return verifyToken(token);
}