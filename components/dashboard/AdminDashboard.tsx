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

interface AdminDashboardData {
  budgetStatus: {
    monthlyLimit: number;
    spent: number;
    percentage: number;
    over80Percent: boolean;
    overBudget: boolean;
  };
  categoryBreakdown: {
    category: string;
    total: number;
  }[];
  monthlyTrend: {
    month: string;
    total: number;
  }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/admin", { cache: "no-store" })
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

  const { budgetStatus, categoryBreakdown, monthlyTrend } = data;
  const barColor =
    budgetStatus.overBudget
      ? "#dc2626"
      : budgetStatus.over80Percent
      ? "#f59e0b"
      : "#22c55e";

  const categoryChartData = categoryBreakdown.map((item) => ({
    name: item.category,
    total: item.total,
  }));

  return (
    <div className="space-y-8">
      {/* Budget status */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Monthly Budget Status</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              budgetStatus.overBudget
                ? "bg-red-100 text-red-700"
                : budgetStatus.over80Percent
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {budgetStatus.overBudget
              ? "OVER BUDGET"
              : budgetStatus.over80Percent
              ? "NEAR LIMIT >80%"
              : "WITHIN BUDGET"}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-blue-50 p-5">
            <p className="text-sm font-medium text-blue-700">Monthly Spent</p>
            <p className="mt-2 text-2xl font-bold text-blue-900">
              {formatINR(budgetStatus.spent)}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm font-medium text-gray-600">Monthly Budget</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatINR(budgetStatus.monthlyLimit)}
            </p>
          </div>
          <div className="rounded-xl bg-purple-50 p-5">
            <p className="text-sm font-medium text-purple-700">Used</p>
            <p className="mt-2 text-2xl font-bold text-purple-900">
              {budgetStatus.percentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="h-4 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(budgetStatus.percentage, 100)}%`,
                backgroundColor: barColor,
              }}
            />
          </div>
          {budgetStatus.over80Percent && (
            <p className="mt-2 text-sm font-medium text-amber-600">
              ⚠️ Budget usage is above 80%. Consider reviewing spending.
            </p>
          )}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Category Breakdown (This Month)</h2>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => formatINR(Number(value ?? 0))}
              />
              <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly trend - last 6 months */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Monthly Trend (Last 6 Months)</h2>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) => formatINR(Number(value ?? 0))}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}