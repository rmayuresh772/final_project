import { cookies } from "next/headers";

import ProfileCard from "@/components/profile/ProfileCard";
import LogoutButton from "@/components/profile/LogoutButton";



async function getProfile(){


  const cookieStore = await cookies();


  const res = await fetch(
    "http://localhost:3000/api/auth/me",
    {
      cache:"no-store",
      headers:{
        Cookie: cookieStore.toString()
      }
    }
  );


  const result = await res.json();


  return result.data ?? null;


}




export default async function ProfilePage(){


  const user = await getProfile();




  return (

    <div
      className="
      min-h-screen
      bg-gray-50
      p-6
      "
    >



      <h1
        className="
        text-3xl
        font-bold
        text-gray-900
        "
      >
        Profile
      </h1>




      <p
        className="
        mt-2
        text-gray-600
        "
      >
        User information.
      </p>






      {
        user ? (

          <>

            <ProfileCard
              user={user}
            />


            <div
              className="
              mt-6
              max-w-md
              "
            >

              <LogoutButton />

            </div>


          </>


        ) : (


          <div
            className="
            mt-8
            rounded-xl
            bg-white
            p-6
            text-gray-600
            "
          >

            Unable to load profile.

          </div>


        )
      }




    </div>

  );

}