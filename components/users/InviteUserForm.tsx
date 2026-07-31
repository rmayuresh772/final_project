"use client";

import { useState } from "react";

type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

export default function InviteUserForm() {

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("EMPLOYEE");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");



  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);
    setMessage("");
    setInviteLink("");


    try {

      const response = await fetch(
        "/api/organizations/invite",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            role,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create invitation"
        );
      }


      setMessage(
        "Invitation created successfully."
      );


      setInviteLink(
        `${window.location.origin}/users/accept-invite?token=${data.data.token}`
      );


      setEmail("");
      setRole("EMPLOYEE");


    } catch (err) {

      if (err instanceof Error) {
        setMessage(err.message);
      }
      else {
        setMessage("Something went wrong.");
      }

    } finally {

      setLoading(false);

    }

  }




  async function copyLink() {

    if (!inviteLink) return;

    await navigator.clipboard.writeText(inviteLink);

    alert("Invitation link copied.");

  }




  return (

    <div
      className="
      bg-white
      rounded-2xl
      shadow-sm
      border
      border-gray-200
      p-8
      "
    >


      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >


        {/* Email */}

        <div>

          <label
            className="
            block
            text-sm
            font-medium
            text-gray-700
            mb-2
            "
          >
            Email
          </label>


          <input

            type="email"

            required

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            placeholder="employee@example.com"

            className="
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            text-gray-900
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            "

          />

        </div>





        {/* Role */}

        <div>


          <label
            className="
            block
            text-sm
            font-medium
            text-gray-700
            mb-2
            "
          >
            Role
          </label>



          <select

            value={role}

            onChange={(e)=>setRole(e.target.value as Role)}

            className="
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            text-gray-900
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            "

          >

            <option value="EMPLOYEE">
              Employee
            </option>


            <option value="MANAGER">
              Manager
            </option>


            <option value="ADMIN">
              Administrator
            </option>


          </select>


        </div>





        {/* Button */}

        <button

          type="submit"

          disabled={loading}

          className="
          w-full
          bg-blue-600
          hover:bg-blue-700
          text-white
          font-medium
          py-3
          rounded-xl
          transition
          disabled:opacity-50
          "

        >

          {
            loading
            ? "Creating Invitation..."
            : "Send Invitation"
          }


        </button>



      </form>





      {/* Message */}

      {message && (

        <div
          className="
          mt-8
          rounded-xl
          border
          bg-gray-50
          p-4
          "
        >

          <p
            className="
            font-medium
            text-gray-800
            "
          >
            {message}
          </p>

        </div>

      )}






      {/* Invitation Link */}

      {inviteLink && (

        <div
          className="
          mt-6
          rounded-xl
          border
          border-blue-200
          bg-blue-50
          p-5
          "
        >


          <h2
            className="
            font-semibold
            text-blue-900
            mb-3
            "
          >
            Invitation Link
          </h2>



          <input

            readOnly

            value={inviteLink}

            className="
            w-full
            rounded-xl
            border
            bg-white
            px-4
            py-3
            text-sm
            text-gray-900
            "

          />



          <button

            onClick={copyLink}

            className="
            mt-4
            bg-green-600
            hover:bg-green-700
            text-white
            font-medium
            px-5
            py-3
            rounded-xl
            "

          >
            Copy Invitation Link

          </button>



        </div>

      )}



    </div>

  );

}