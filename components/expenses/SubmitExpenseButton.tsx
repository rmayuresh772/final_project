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
  const [error, setError] = useState("");



  async function submitExpense() {

    try {

      setLoading(true);
      setError("");

      const res = await fetch(
        `/api/expenses/${id}/submit`,
        {
          method: "POST",
        }
      );

      const text = await res.text();
      let data: { success?: boolean; message?: string };
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned ${res.status} ${res.statusText}. Expected JSON but got: ${text.slice(0, 100)}`
        );
      }

      if (data.success) {
        router.refresh();
      } else {
        setError(data.message || "Failed to submit expense");
      }


    } catch (error) {

      console.error(
        "Submit expense failed:",
        error
      );
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  }



  return (
    <div>
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

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );

}