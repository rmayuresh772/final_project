"use client";

interface ExpenseData {
  category: string;
  amount: string | number;
}

export default function CategoryBreakdown({
  expenses,
}: {
  expenses: ExpenseData[];
}) {
  const categories: Record<string, number> = {};

  if (Array.isArray(expenses)) {
    expenses.forEach((expense) => {
      const cat = expense.category;
      if (!categories[cat]) {
        categories[cat] = 0;
      }
      categories[cat] += Number(expense.amount);
    });
  }

  const data = Object.entries(categories);

  if (data.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Category Spending</h2>
        <p className="mt-4 text-gray-500">No expense data available.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Category Spending</h2>

      <div className="mt-6 space-y-5">
        {data.map(([category, total]) => (
          <div key={category}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-700">{category}</span>
              <span className="font-semibold text-gray-900">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="h-4 rounded-full bg-gray-100">
              <div
                className="h-4 rounded-full bg-blue-600"
                style={{
                  width: `${(total / Math.max(...data.map(([, value]) => value))) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}