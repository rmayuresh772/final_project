import { cookies } from "next/headers";
import { requireAuth } from "@/lib/auth";
import { getApiUrl } from "@/lib/api-url";

import ApprovalList from "@/components/approvals/ApprovalList";

async function getPendingExpenses() {
  const cookieStore = await cookies();

  const res = await fetch(getApiUrl("/api/dashboard/pending"), {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const result = await res.json();

  return result.data ?? [];
}

export default async function ApprovalsPage() {
  const user = await requireAuth();

  if (user.role !== "ADMIN" && user.role !== "MANAGER") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          You do not have permission to view approvals.
        </div>
      </div>
    );
  }

  const expenses = await getPendingExpenses();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Pending Approval</h1>
        <p className="mt-2 text-base text-gray-700">
          Review employee expenses and take action.
        </p>
      </div>

      <ApprovalList initialExpenses={expenses} />
    </div>
  );
}