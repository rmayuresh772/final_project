"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SubmitExpenseButton({
  id,
}: {
  id: string;
}) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);



  async function submitExpense() {

    try {

      setLoading(true);


      const res = await fetch(
        `/api/expenses/${id}/submit`,
        {
          method: "POST",
        }
      );


      const data = await res.json();


      if (data.success) {

        router.refresh();

      } else {

        console.error(data.message);

      }


    } catch (error) {

      console.error(
        "Submit expense failed:",
        error
      );

    } finally {

      setLoading(false);

    }

  }



  return (

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
      text-sm
      font-semibold
      text-white
      hover:bg-blue-700
      disabled:cursor-not-allowed
      disabled:opacity-50
      "

    >

      {
        loading
          ? "Submitting..."
          : "Submit Expense"
      }


    </button>

  );

}