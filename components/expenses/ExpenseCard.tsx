"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";


interface ExpenseCardProps {
  expense: {
    id: string;
    title: string;
    description: string;
    amount: string;
    category: string;
    status: string;
    createdAt: string;
  };
}


export default function ExpenseCard({
  expense,
}: ExpenseCardProps) {


  const router = useRouter();

  const [loading, setLoading] = useState(false);



  async function submitExpense() {

    try {

      setLoading(true);


      const res = await fetch(
        `/api/expenses/${expense.id}/submit`,
        {
          method: "POST",
        }
      );


      const data = await res.json();


      if (data.success) {

        router.refresh();

      }


    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }



  return (

    <div
      className="
      rounded-xl
      bg-white
      p-5
      shadow-sm
      border
      border-gray-200
      "
    >


      <div className="flex justify-between">


        <div>

          <h2
            className="
            text-lg
            font-semibold
            text-gray-900
            "
          >
            {expense.title}
          </h2>


          <p
            className="
            mt-1
            text-sm
            text-gray-600
            "
          >
            {expense.description}
          </p>


        </div>



        <span
          className="
          rounded-full
          bg-gray-100
          px-3
          py-1
          text-sm
          font-medium
          text-gray-700
          "
        >
          {expense.category}
        </span>


      </div>




      <div className="mt-4 flex items-center justify-between">


        <div>


          <p
            className="
            text-xl
            font-bold
            text-gray-900
            "
          >
            ${expense.amount}
          </p>


          <p
            className="
            mt-1
            text-sm
            text-gray-500
            "
          >
            {new Date(
              expense.createdAt
            ).toLocaleDateString("en-US")}
          </p>


        </div>




        <span
          className={`
          rounded-full
          px-3
          py-1
          text-sm
          font-semibold
          ${
            expense.status === "APPROVED"
              ? "bg-green-100 text-green-700"
              : expense.status === "REJECTED"
              ? "bg-red-100 text-red-700"
              : expense.status === "SUBMITTED"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }
          `}
        >
          {expense.status}
        </span>


      </div>




      {
        expense.status === "DRAFT" && (

          <button
            onClick={submitExpense}
            disabled={loading}
            className="
            mt-5
            w-full
            rounded-lg
            bg-blue-600
            px-4
            py-2
            font-medium
            text-white
            hover:bg-blue-700
            disabled:opacity-50
            "
          >

            {
              loading
              ? "Submitting..."
              : "Submit Expense"
            }


          </button>

        )
      }



    </div>

  );

}