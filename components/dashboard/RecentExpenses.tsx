"use client";

interface RecentExpense {
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

export default function RecentExpenses({
  expenses,
}: {
  expenses: RecentExpense[];
}) {
  if (!Array.isArray(expenses) || expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
        <p className="mt-4 text-gray-500">No recent expenses.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
      <div className="mt-4 space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
          >
            <div>
              <p className="font-medium text-gray-900">{expense.title}</p>
              <p className="text-sm text-gray-500">
                {expense.category} • {new Date(expense.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="font-semibold text-gray-900">
              ₹{Number(expense.amount).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}