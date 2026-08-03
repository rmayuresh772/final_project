import { requireAuth } from "@/lib/auth";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import ManagerDashboard from "@/components/dashboard/ManagerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ExportCsvButton from "@/components/export/ExportButton";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Expense Dashboard</h1>
          <p className="text-slate-500 mt-2">
            Track, review and manage company expenses
          </p>
        </div>

        {user.role === "ADMIN" && <ExportCsvButton />}
      </div>

      {/* Role-based dashboard */}
      {user.role === "EMPLOYEE" && <EmployeeDashboard />}
      {user.role === "MANAGER" && <ManagerDashboard />}
      {user.role === "ADMIN" && <AdminDashboard />}
    </div>
  );
}