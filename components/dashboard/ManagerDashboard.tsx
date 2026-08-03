"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatINR } from "@/utils/currency";

interface ManagerDashboardData {
  categorySpend: {
    category: string;
    total: number;
  }[];
  topSpenders: {
    userId: string;
    name: string;
    email: string;
    total: number;
  }[];
  pendingCount: number;
}

export default function ManagerDashboard() {
  const [data, setData] = useState<ManagerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/manager", { cache: "no-store" })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="text-red-500">Failed to load dashboard data.</div>;
  }

  const chartData = data.categorySpend.map((item) => ({
    name: item.category,
    total: item.total,
  }));

  return (
    <div className="space-y-8">
      {/* Pending approval count */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
        <p className="mt-2 text-3xl font-bold text-yellow-600">{data.pendingCount}</p>
      </div>

      {/* Team spend by category bar chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Team Spend by Category (This Month)</h2>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => formatINR(Number(value ?? 0))}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 spenders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Top 5 Spenders (This Month)</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                  Total Spent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.topSpenders.map((spender, index) => (
                <tr key={spender.userId}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {index + 1}
                    </span>
                    {spender.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{spender.email}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                    {formatINR(spender.total)}
                  </td>
                </tr>
              ))}
              {data.topSpenders.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No approved expenses this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}