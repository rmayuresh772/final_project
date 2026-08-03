"use client";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  organization?: {
    name: string;
  } | null;
}

export default function ProfileCard({
  user,
}: {
  user: Profile;
}) {
  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      {/* Profile Header */}
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="mt-8 space-y-6">
        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <div className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900">
            {user.role}
          </div>
        </div>

        {/* Organization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization
          </label>
          <div className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900">
            {user.organization?.name ?? "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}