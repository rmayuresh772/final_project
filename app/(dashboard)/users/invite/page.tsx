import InviteUserForm from "@/components/users/InviteUserForm";


export default function InviteUserPage() {

  return (

    <div className="min-h-screen bg-gray-50 p-8">


      <div className="max-w-3xl mx-auto">


        {/* Header */}

        <div className="mb-8">


          <h1
            className="
            text-3xl
            font-bold
            text-gray-900
            "
          >
            Invite Team Member
          </h1>


          <p
            className="
            text-gray-500
            mt-2
            "
          >
            Invite a new member to your organization.
          </p>


        </div>



        {/* Form Header */}




        {/* Form */}

        <InviteUserForm />


      </div>


    </div>

  );

}