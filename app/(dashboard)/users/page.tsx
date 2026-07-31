export default function UsersPage() {
  return (
    <div>


      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1
            className="
            text-3xl
            font-bold
            text-black
            "
          >
            Users
          </h1>


          <p
            className="
            mt-2
            text-gray-700
            "
          >
            Manage employees and organization members.
          </p>

        </div>



        <a
          href="/users/invite"
          className="
          rounded-lg
          bg-blue-600
          px-5
          py-3
          font-medium
          text-white
          transition
          hover:bg-blue-700
          "
        >
          + Invite User
        </a>


      </div>




      {/* Users Table */}

      <div
        className="
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-sm
        "
      >


        <table className="min-w-full">


          <thead
            className="
            bg-gray-100
            "
          >

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>


              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Email
              </th>


              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Role
              </th>


              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>


            </tr>

          </thead>



          <tbody className="divide-y divide-gray-200">


            <tr className="hover:bg-gray-50">


              <td className="px-6 py-4 text-gray-900">
                Mayuresh
              </td>


              <td className="px-6 py-4 text-gray-700">
                admin@acme.com
              </td>


              <td className="px-6 py-4">

                <span
                  className="
                  rounded-full
                  bg-blue-100
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-blue-700
                  "
                >
                  ADMIN
                </span>

              </td>


              <td className="px-6 py-4">

                <span
                  className="
                  rounded-full
                  bg-green-100
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-green-700
                  "
                >
                  Active
                </span>

              </td>


            </tr>



            <tr className="hover:bg-gray-50">


              <td className="px-6 py-4 text-gray-900">
                Employee User
              </td>


              <td className="px-6 py-4 text-gray-700">
                employee@example.com
              </td>


              <td className="px-6 py-4">

                <span
                  className="
                  rounded-full
                  bg-purple-100
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-purple-700
                  "
                >
                  EMPLOYEE
                </span>

              </td>


              <td className="px-6 py-4">

                <span
                  className="
                  rounded-full
                  bg-green-100
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-green-700
                  "
                >
                  Active
                </span>

              </td>


            </tr>


          </tbody>


        </table>


      </div>


    </div>
  );
}