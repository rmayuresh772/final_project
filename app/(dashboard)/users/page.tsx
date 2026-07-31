import Link from "next/link";
import { cookies } from "next/headers";


async function getUsers() {

    console.log("GET USERS FUNCTION CALLED");
  try {

    const cookieStore = await cookies();
console.log("COOKIE:", cookieStore.toString());

    const res = await fetch(
      "http://localhost:3000/api/users",
      {
        cache: "no-store",

        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );


    if (!res.ok) {

      console.log(
        "Users API failed:",
        res.status
      );

      return [];

    }



    const result = await res.json();


    console.log(
      "USERS RESPONSE:",
      result
    );



    return (
      result.users ??
      result.data ??
      result ??
      []
    );


  } catch (error) {

    console.log(
      "GET USERS ERROR:",
      error
    );


    return [];

  }

}





export default async function UsersPage() {


  const users = await getUsers();




  return (

    <div
      className="
      min-h-screen
      bg-gray-50
      p-8
      "
    >


      <div
        className="
        max-w-5xl
        mx-auto
        "
      >




        {/* Header */}


        <div
          className="
          mb-8
          flex
          items-center
          justify-between
          "
        >


          <div>


            <h1
              className="
              text-3xl
              font-bold
              text-gray-900
              "
            >
              Users
            </h1>



            <p
              className="
              mt-2
              text-gray-500
              "
            >
              Manage employees and organization members.
            </p>


          </div>





          <Link

            href="/users/invite"

            className="
            rounded-xl
            bg-blue-600
            px-5
            py-3
            font-medium
            text-white
            hover:bg-blue-700
            "

          >

            + Invite User

          </Link>



        </div>








        {/* Table */}


        <div
          className="
          overflow-hidden
          rounded-2xl
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


                <th
                  className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                  "
                >
                  Name
                </th>



                <th
                  className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                  "
                >
                  Email
                </th>




                <th
                  className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                  "
                >
                  Role
                </th>




                <th
                  className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                  "
                >
                  Status
                </th>



              </tr>


            </thead>







            <tbody
              className="
              divide-y
              divide-gray-200
              "
            >



              {
                users.length > 0 ? (


                  users.map((user:any)=>(


                    <tr
                      key={user.id}
                      className="
                      hover:bg-gray-50
                      "
                    >



                      <td
                        className="
                        px-6
                        py-4
                        text-gray-900
                        "
                      >

                        {
                          user.name ?? "N/A"
                        }

                      </td>





                      <td
                        className="
                        px-6
                        py-4
                        text-gray-700
                        "
                      >

                        {
                          user.email
                        }

                      </td>







                      <td
                        className="
                        px-6
                        py-4
                        "
                      >


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

                          {
                            user.role
                          }

                        </span>


                      </td>







                      <td
                        className="
                        px-6
                        py-4
                        "
                      >


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


                  ))



                ) : (


                  <tr>


                    <td
                      colSpan={4}
                      className="
                      px-6
                      py-8
                      text-center
                      text-gray-500
                      "
                    >

                      No users found.

                    </td>


                  </tr>


                )
              }





            </tbody>



          </table>



        </div>




      </div>



    </div>


  );

}