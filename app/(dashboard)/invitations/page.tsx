import { cookies } from "next/headers";

import InvitationTable from "@/components/invitations/InvitationTable";

async function getInvitations() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  const headers = {
    Cookie: `token=${token}`,
  };

  const response = await fetch(
    "http://localhost:3000/api/organizations/invitations",
    {
      headers,
      cache: "no-store",
    }
  );

  const result = await response.json();

  return result.data ?? [];
}

export default async function InvitationsPage() {
  const invitations = await getInvitations();

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Invitations
          </h1>

          <p className="mt-2 text-slate-500">
            View all invitations sent to employees and managers.
          </p>
        </div>

        <a
          href="/users/invite"
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          + Invite User
        </a>
      </div>

      <InvitationTable invitations={invitations} />
    </div>
  );
}