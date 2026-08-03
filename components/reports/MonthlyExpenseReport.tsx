"use client";

interface MonthlyData {
  month: string;
  total: number;
}

export default function MonthlyExpenseReport({
  data,
}: {
  data: MonthlyData[];
}) {
  const safeData = Array.isArray(data) ? data : [];

  const maxValue = Math.max(
    ...safeData.map((item) => Number(item.total)),
    1
  );

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Monthly Expenses</h2>

      <p className="mt-1 text-sm text-gray-600">
        Track your spending month by month.
      </p>

      <div className="mt-8 space-y-6">
        {safeData.map((item) => (
          <div key={item.month}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-700">{item.month}</span>
              <span className="font-semibold text-gray-900">
                ₹{Number(item.total).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="h-5 w-full rounded-full bg-gray-100">
              <div
                className="h-5 rounded-full bg-blue-600"
                style={{
                  width: `${(Number(item.total) / maxValue) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}

        {safeData.length === 0 && (
          <p className="text-gray-500">No monthly data available.</p>
        )}
      </div>
    </div>
  );
}