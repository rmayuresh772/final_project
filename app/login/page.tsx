"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");



  async function handleLogin(){

    try {

      const res = await fetch("/api/auth/login", {

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        credentials:"include",

        body:JSON.stringify({
          email,
          password
        })

      });


      const data = await res.json();


      console.log(data);


      if(data.success){

        router.push("/dashboard");

      }
      else{

        alert(data.message);

      }


    } catch(error){

      console.log(error);

    }

  }



  return (

    <div className="flex min-h-screen items-center justify-center">


      <div className="space-y-4 w-96">


        <h1 className="text-2xl font-bold">
          Login
        </h1>


        <input

          className="border p-2 w-full"

          placeholder="Email"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

        />



        <input

          className="border p-2 w-full"

          placeholder="Password"

          type="password"

          value={password}

          onChange={(e)=>setPassword(e.target.value)}

        />



        <button

          className="bg-black text-white px-4 py-2 w-full"

          onClick={handleLogin}

        >

          Login

        </button>


      </div>


    </div>

  );

}