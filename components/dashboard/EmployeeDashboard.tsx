"use client";

import { useEffect, useState } from "react";
import { formatINR } from "@/utils/currency";

interface EmployeeDashboardData {
  stats: {
    draft: number;
    submitted: number;
    approved: number;
    rejected: number;
  };
  comparison: {
    thisMonth: number;
    lastMonth: number;
  };
}

export default function EmployeeDashboard() {
  const [data, setData] = useState<EmployeeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/employee", { cache: "no-store" })
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

  const { stats, comparison } = data;
  const diff = comparison.lastMonth > 0
    ? ((comparison.thisMonth - comparison.lastMonth) / comparison.lastMonth) * 100
    : 0;

  return (
    <div className="space-y-8">
      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Draft</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.draft}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Submitted</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.submitted}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Approved</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Rejected</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* This month vs last month */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">My Spend Comparison</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-blue-50 p-5">
            <p className="text-sm font-medium text-blue-700">This Month</p>
            <p className="mt-2 text-3xl font-bold text-blue-900">
              {formatINR(comparison.thisMonth)}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm font-medium text-gray-600">Last Month</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatINR(comparison.lastMonth)}
            </p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {comparison.lastMonth === 0 ? (
            <span>No spend recorded last month.</span>
          ) : diff >= 0 ? (
            <span className="text-red-600">
              ↑ {diff.toFixed(1)}% increase vs last month
            </span>
          ) : (
            <span className="text-green-600">
              ↓ {Math.abs(diff).toFixed(1)}% decrease vs last month
            </span>
          )}
        </div>
      </div>
    </div>
  );
}