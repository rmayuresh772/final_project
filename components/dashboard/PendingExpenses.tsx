"use client";

interface PendingExpense {
  id: string;
  title: string;
  amount: string;
  category: string;
  status: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

export default function PendingExpenses({
  expenses,
}: {
  expenses: PendingExpense[];
}) {
  if (!Array.isArray(expenses) || expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
        <p className="mt-4 text-gray-500">No pending approvals.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
      <div className="mt-4 space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
          >
            <div>
              <p className="font-medium text-gray-900">{expense.title}</p>
              <p className="text-sm text-gray-500">
                {expense.category} • {expense.user?.name ?? "Unknown"}
              </p>
            </div>
            <p className="font-semibold text-yellow-600">
              ₹{Number(expense.amount).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}