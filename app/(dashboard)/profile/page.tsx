import { cookies } from "next/headers";
import { getApiUrl } from "@/lib/api-url";

import ProfileCard from "@/components/profile/ProfileCard";
import LogoutButton from "@/components/profile/LogoutButton";

async function getProfile() {
  const cookieStore = await cookies();

  const res = await fetch(getApiUrl("/api/auth/me"), {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const result = await res.json();

  return result.data ?? null;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: {
    name: string;
  };
}

export default async function ProfilePage() {
  const user = await getProfile() as Profile | null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 mt-2">
            Manage your profile information
          </p>
        </div>

        {user ? (
          <>
            <ProfileCard user={user} />

            <LogoutButton />
          </>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-600 shadow-sm">
            Unable to load profile.
          </div>
        )}
      </div>
    </div>
  );
}