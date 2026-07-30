"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LogoutButton(){

  const router = useRouter();

  const [open, setOpen] = useState(false);



async function handleLogout(){

  await fetch("/api/auth/logout", {
    method:"POST",
  });


  router.push("/login");

  router.refresh();

}



  return (

    <>


      {/* Logout Button */}

      <button

        onClick={()=>setOpen(true)}

        className="
        flex
        items-center
        justify-center
        gap-3
        rounded-xl
        border
        border-red-200
        bg-red-50
        px-6
        py-3
        text-sm
        font-semibold
        text-red-600
        shadow-sm
        transition
        hover:bg-red-600
        hover:text-white
        "

      >

        <span>
          ⇥
        </span>

        Logout

      </button>






      {/* Confirmation Modal */}

      {
        open && (

          <div
            className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            px-4
            "
          >



            <div
              className="
              w-full
              max-w-sm
              rounded-2xl
              bg-white
              p-6
              shadow-2xl
              "
            >



              <h2
                className="
                text-xl
                font-bold
                text-gray-900
                "
              >
                Confirm Logout
              </h2>




              <p
                className="
                mt-3
                text-gray-600
                "
              >
                Are you sure you want to logout from your account?
              </p>





              <div
                className="
                mt-6
                flex
                justify-end
                gap-3
                "
              >



                <button

                  onClick={()=>setOpen(false)}

                  className="
                  rounded-xl
                  border
                  border-gray-300
                  px-5
                  py-2.5
                  font-medium
                  text-gray-700
                  hover:bg-gray-100
                  "

                >

                  No

                </button>





                <button

                  onClick={handleLogout}

                  className="
                  rounded-xl
                  bg-red-600
                  px-5
                  py-2.5
                  font-medium
                  text-white
                  hover:bg-red-700
                  "

                >

                  Yes, Logout

                </button>




              </div>



            </div>



          </div>

        )
      }



    </>

  );

}