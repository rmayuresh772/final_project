"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";


interface Invitation {
  id: string;
  email: string;
  role: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  accepted: boolean;
  createdAt: string;
  expiresAt: string;
  inviteLink: string;

  invitedBy: {
    id: string;
    name: string;
    email: string;
  };
}


interface Props {
  invitations: Invitation[];
}



export default function InvitationTable({
  invitations,
}: Props) {


  const [copiedId, setCopiedId] =
    useState<string | null>(null);


  const [deleteId, setDeleteId] =
    useState<string | null>(null);



  async function copyLink(
    id: string,
    link: string
  ) {

    await navigator.clipboard.writeText(link);


    setCopiedId(id);


    setTimeout(() => {

      setCopiedId(null);

    }, 2000);

  }




  async function deleteInvitation() {


    if (!deleteId) return;


    const response = await fetch(
      `/api/organizations/invitations/${deleteId}`,
      {
        method: "DELETE",
      }
    );



    if (response.ok) {

      window.location.reload();

    }
    else {

      alert(
        "Failed to delete invitation"
      );

    }


    setDeleteId(null);

  }





  function badge(status: string) {


    switch (status) {


      case "PENDING":

        return (
          <span
            className="
            rounded-full
            bg-yellow-100
            px-3
            py-1
            text-xs
            font-semibold
            text-yellow-800
            "
          >
            Pending
          </span>
        );



      case "ACCEPTED":

        return (
          <span
            className="
            rounded-full
            bg-green-100
            px-3
            py-1
            text-xs
            font-semibold
            text-green-800
            "
          >
            Accepted
          </span>
        );



      case "EXPIRED":

        return (
          <span
            className="
            rounded-full
            bg-red-100
            px-3
            py-1
            text-xs
            font-semibold
            text-red-800
            "
          >
            Expired
          </span>
        );


      default:
        return null;

    }

  }





  if (invitations.length === 0) {

    return (

      <div
        className="
        rounded-xl
        bg-white
        p-10
        shadow
        "
      >

        <p
          className="
          text-center
          text-gray-500
          "
        >
          No invitations found.
        </p>


      </div>

    );

  }





  return (

    <>

      <div
        className="
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-lg
        "
      >


        <div className="overflow-x-auto">


          <table className="min-w-full text-gray-900">


            <thead
              className="
              bg-slate-100
              text-slate-900
              "
            >

              <tr>


                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Email
                </th>


                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Role
                </th>


                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Status
                </th>


                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Invited By
                </th>


                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Created
                </th>


                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Expires
                </th>


                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Action
                </th>


              </tr>


            </thead>





            <tbody
              className="
              divide-y
              divide-gray-200
              "
            >


              {invitations.map((invite) => (

                <tr
                  key={invite.id}
                  className="
                  transition-colors
                  hover:bg-gray-50
                  "
                >


                  <td className="px-4 py-4">
                    {invite.email}
                  </td>



                  <td
                    className="
                    px-4
                    py-4
                    font-medium
                    "
                  >
                    {invite.role}
                  </td>




                  <td className="px-4 py-4">

                    {badge(invite.status)}

                  </td>




                  <td className="px-4 py-4">

                    {invite.invitedBy.name}

                  </td>




                  <td className="px-4 py-4 text-gray-700">

                    {new Date(
                      invite.createdAt
                    ).toLocaleDateString()}

                  </td>




                  <td className="px-4 py-4 text-gray-700">

                    {new Date(
                      invite.expiresAt
                    ).toLocaleDateString()}

                  </td>





                  <td className="px-4 py-4">


                    <div
                      className="
                      flex
                      justify-center
                      gap-2
                      "
                    >


                      <button
                        onClick={() =>
                          copyLink(
                            invite.id,
                            invite.inviteLink
                          )
                        }
                        className="
                        rounded-lg
                        bg-blue-600
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-white
                        hover:bg-blue-700
                        "
                      >

                        {copiedId === invite.id
                          ? "Copied!"
                          : "Copy Link"}

                      </button>





                      <button
                        onClick={() =>
                          setDeleteId(invite.id)
                        }
                        className="
                        flex
                        items-center
                        gap-1
                        rounded-lg
                        bg-red-600
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-white
                        hover:bg-red-700
                        "
                      >

                        <Trash2 size={16} />

                        Delete

                      </button>


                    </div>


                  </td>


                </tr>

              ))}


            </tbody>


          </table>


        </div>


      </div>





      <ConfirmDeleteModal
        open={deleteId !== null}
        onClose={() =>
          setDeleteId(null)
        }
        onConfirm={
          deleteInvitation
        }
      />


    </>

  );

}