"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";


export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  async function handleLogin(e: React.FormEvent) {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");


      const res = await fetch(
        "/api/auth/login",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({
            email,
            password,
          }),
        }
      );


      const data = await res.json();


      if(!data.success){

        setError(data.message || "Login failed");

        return;

      }


      setUser({
        id: data.data.user.id,
        name: data.data.user.name,
        email: data.data.user.email,
        role: data.data.user.role,
        organizationId: data.data.user.organizationId,
      });

      router.push("/dashboard");


    } catch(error){

      setError("Something went wrong");

    } finally {

      setLoading(false);

    }

  }



  return (

    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-gray-900
      via-gray-800
      to-gray-900
      px-4
      "
    >


      <div
        className="
        w-full
        max-w-md
        rounded-2xl
        bg-white
        p-8
        shadow-2xl
        "
      >



        {/* Logo */}

        <div
          className="
          text-center
          mb-8
          "
        >

          <div
            className="
            mx-auto
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-xl
            bg-blue-600
            text-2xl
            text-white
            "
          >
            💳
          </div>


          <h1
            className="
            mt-4
            text-3xl
            font-bold
            text-gray-900
            "
          >
            Expense Tracker
          </h1>


          <p
            className="
            mt-2
            text-gray-500
            "
          >
            Sign in to manage your expenses
          </p>


        </div>





        {
          error && (

            <div
              className="
              mb-5
              rounded-lg
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
              "
            >
              {error}
            </div>

          )
        }





        <form
          onSubmit={handleLogin}
          className="
          space-y-5
          "
        >



          <div>

            <label
              className="
              mb-2
              block
              text-sm
              font-medium
              text-gray-700
              "
            >
              Email
            </label>


            <input

              type="email"

              value={email}

              onChange={(e)=>setEmail(e.target.value)}

              placeholder="admin@acme.com"

              className="
              w-full
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              py-3
              text-gray-900
              placeholder:text-gray-400
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              "

              required

            />

          </div>





          <div>

            <label
              className="
              mb-2
              block
              text-sm
              font-medium
              text-gray-700
              "
            >
              Password
            </label>


            <input

              type="password"

              value={password}

              onChange={(e)=>setPassword(e.target.value)}

              placeholder="••••••••"

              className="
              w-full
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              py-3
              text-gray-900
              placeholder:text-gray-400
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              "

              required

            />


          </div>





          <button

            type="submit"

            disabled={loading}

            className="
            w-full
            rounded-xl
            bg-blue-600
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-50
            "

          >

            {
              loading
              ? "Signing in..."
              : "Login"
            }

          </button>

            <div className="mt-5 text-center">

  <p className="text-sm text-gray-500">
    Don't have an account?
  </p>


  <button
    type="button"
    onClick={() => router.push("/register")}
    className="
    mt-2
    w-full
    rounded-xl
    border
    border-blue-600
    py-3
    font-semibold
    text-blue-600
    hover:bg-blue-50
    "
  >
    Create Account
  </button>

</div>


        </form>





        <p
          className="
          mt-6
          text-center
          text-sm
          text-gray-500
          "
        >
          Secure company expense management
        </p>



      </div>


    </div>

  );

}