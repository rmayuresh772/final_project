import InviteUserForm from "@/components/users/InviteUserForm";


export default function InviteUserPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">


      {/* Center Header + Form */}

      <div
        className="
        mx-auto
        max-w-xl
        "
      >

        <div
          className="
          mb-8
          text-center
          "
        >

          <h1
            className="
            text-3xl
            font-bold
            text-black
            "
          >
            Invite Team Member
          </h1>


          <p
            className="
            mt-2
            text-base
            text-gray-700
            "
          >
            Invite a new member to your organization.
          </p>

        </div>



        <div
          className="
          rounded-xl
          bg-white
          border
          border-gray-200
          p-8
          shadow-sm
          "
        >

          <h2
            className="
            text-xl
            font-semibold
            text-black
            "
          >
            Invite User
          </h2>


          <p
            className="
            mt-2
            mb-6
            text-gray-600
            "
          >
            Send an invitation to join your organization.
          </p>


          <InviteUserForm />

        </div>


      </div>


    </div>
  );
}