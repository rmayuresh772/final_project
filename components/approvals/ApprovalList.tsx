"use client";

import { useState } from "react";
import ApprovalCard from "./ApprovalCard";

interface Expense {
  id: string;
  title: string;
  description: string;
  amount: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function ApprovalList({
  initialExpenses,
}: {
  initialExpenses: Expense[];
}) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  function handleComplete(id: string) {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500">
        No pending approvals.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {expenses.map((expense) => (
        <ApprovalCard
          key={expense.id}
          expense={expense}
          onComplete={handleComplete}
        />
      ))}
    </div>
  );
}