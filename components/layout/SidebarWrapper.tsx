import { cookies } from "next/headers";
import { getApiUrl } from "@/lib/api-url";
import Sidebar from "./Sidebar";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
}

async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();

    const res = await fetch(getApiUrl("/api/auth/me"), {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const result = await res.json();

    return result.data ?? null;
  } catch {
    return null;
  }
}

export default async function SidebarWrapper() {
  const user = await getCurrentUser();

  return (
    <div className="w-64">
      <Sidebar user={user} />
    </div>
  );
}