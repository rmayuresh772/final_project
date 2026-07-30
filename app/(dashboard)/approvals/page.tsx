import ApprovalList from "@/components/approvals/ApprovalList";
import { cookies } from "next/headers";


async function getPendingExpenses() {

  const cookieStore = await cookies();

  const res = await fetch(
    "http://localhost:3000/api/dashboard/pending",
    {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  const result = await res.json();

  return result.data ?? [];

}



export default async function ApprovalsPage() {

  const expenses = await getPendingExpenses();


  return (

    <div className="min-h-screen bg-gray-50 p-6">


      <div className="mb-8">


        <h1
          className="
          text-3xl
          font-bold
          text-black
          "
        >
          Pending Approval
        </h1>


        <p
          className="
          mt-2
          text-base
          text-gray-700
          "
        >
          Review employee expenses and take action.
        </p>


      </div>



      <ApprovalList
        initialExpenses={expenses}
      />


    </div>

  );

}