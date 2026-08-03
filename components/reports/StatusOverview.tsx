"use client";

interface ExpenseData {
  status: string;
}

export default function StatusOverview({
  expenses,
}: {
  expenses: ExpenseData[];
}) {
  const status: Record<string, number> = {};

  if (Array.isArray(expenses)) {
    expenses.forEach((expense) => {
      status[expense.status] = (status[expense.status] || 0) + 1;
    });
  }

  const entries = Object.entries(status);

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Expense Status</h2>

      <div className="mt-6 space-y-4">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
          >
            <span className="font-medium text-gray-700">{key}</span>
            <span className="text-xl font-bold text-gray-900">{value}</span>
          </div>
        ))}

        {entries.length === 0 && (
          <p className="text-gray-500">No status data available.</p>
        )}
      </div>
    </div>
  );
}