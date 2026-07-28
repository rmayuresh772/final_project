import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

interface TokenPayload {
  userId: string;
  organizationId: string;
  role: Role;
}

export function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}