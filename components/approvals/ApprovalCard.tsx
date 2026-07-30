"use client";

import { useState } from "react";

interface ApprovalCardProps {
  expense: {
    id: string;
    title: string;
    description: string;
    amount: string;
    category: string;
    status: string;
    createdAt: string;
  };
  onComplete: (id: string) => void;
}

export default function ApprovalCard({
  expense,
  onComplete,
}: ApprovalCardProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function approveExpense() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/expenses/${expense.id}/approve`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (data.success) {
        onComplete(expense.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function rejectExpense() {
    if (!reason.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `/api/expenses/${expense.id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setShowRejectModal(false);
        setReason("");
        onComplete(expense.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {expense.title}
            </h2>

            <p className="mt-2 text-gray-600">
              {expense.description}
            </p>

            <div className="mt-4 flex gap-3">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {expense.category}
              </span>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                {expense.status}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              ${expense.amount}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {new Date(expense.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={approveExpense}
            disabled={loading}
            className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            Approve
          </button>

          <button
            onClick={() => setShowRejectModal(true)}
            disabled={loading}
            className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              Reject Expense
            </h2>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason"
              className="mt-4 min-h-32 w-full rounded-lg border border-gray-300 p-3 text-gray-900"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setReason("");
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-900"
              >
                Cancel
              </button>

              <button
                onClick={rejectExpense}
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                {loading ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}