"use client";

import ApprovalCard from "./ApprovalCard";
import { useState } from "react";


export default function ApprovalList({
  initialExpenses,
}: {
  initialExpenses: any[];
}) {

  const [expenses, setExpenses] = useState(initialExpenses);


  function removeExpense(id: string) {

    setExpenses((prev) =>
      prev.filter(
        (expense) => expense.id !== id
      )
    );

  }



  if (expenses.length === 0) {

    return (

      <div
        className="
        mt-8
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-10
        text-center
        shadow-sm
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
          rounded-full
          bg-gray-100
          "
        >

          <span
            className="
            text-2xl
            text-gray-500
            "
          >
            ✓
          </span>

        </div>


        <h2
          className="
          mt-4
          text-xl
          font-semibold
          text-gray-900
          "
        >
          No pending approvals
        </h2>


        <p
          className="
          mt-2
          text-sm
          text-gray-600
          "
        >
          All expense requests have been reviewed.
        </p>


      </div>

    );

  }



  return (

    <div
      className="
      mt-8
      grid
      gap-6
      md:grid-cols-2
      "
    >

      {
        expenses.map((expense) => (

          <ApprovalCard

            key={expense.id}

            expense={expense}

            onComplete={removeExpense}

          />

        ))
      }


    </div>

  );

}