"use client";

interface DashboardData {
  totalExpenses: number;
  draft: number;
  submitted: number;
  approved: number;
  rejected: number;
  totalAmount: number;
}

export default function ReportCards({
  data,
}: {
  data: DashboardData;
}) {
  if (!data) {
    return null;
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Total</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{data.totalExpenses}</p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Draft</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{data.draft}</p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Submitted</p>
        <p className="mt-2 text-2xl font-bold text-yellow-600">{data.submitted}</p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Approved</p>
        <p className="mt-2 text-2xl font-bold text-green-600">{data.approved}</p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Rejected</p>
        <p className="mt-2 text-2xl font-bold text-red-600">{data.rejected}</p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Total Amount</p>
        <p className="mt-2 text-2xl font-bold text-blue-600">
          ₹{Number(data.totalAmount).toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}