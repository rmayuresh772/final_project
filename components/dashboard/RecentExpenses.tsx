import Link from "next/link";

interface RecentExpensesProps {
  expenses: any[];
}

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Recent Expenses</h2>

        <Link
          href="/expenses"
          className="
            text-sm
            font-semibold
            text-blue-600
            hover:text-blue-700
            hover:underline
            transition
          "
        >
          View all →
        </Link>
      </div>

      <div className="space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="
    flex
    items-center
    justify-between
    py-4
    border-b
    border-gray-100
    last:border-0
  "
          >
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{expense.title}</h3>

              <p className="mt-1 text-sm text-gray-500">{expense.category}</p>
            </div>

            <div className="text-right ml-6 shrink-0">
              <p className="text-lg font-bold text-gray-900">
                ${expense.amount}
              </p>

              <span
                className={`
        mt-2
        inline-block
        rounded-full
        px-3
        py-1
        text-xs
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
          </div>
        ))}
      </div>
    </div>
  );
}
