import InviteUserForm from "@/components/users/InviteUserForm";

export default function InviteUserPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Invite Team Member
          </h1>

          <p className="mt-2 text-slate-600">
            Invite a new member to your organization.
          </p>

          <div className="mt-8">
            <InviteUserForm />
          </div>
        </div>
      </div>
    </div>
  );
}