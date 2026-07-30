import SidebarWrapper from "@/components/layout/SidebarWrapper";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0">
        <SidebarWrapper />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Breadcrumbs />

        <div className="mt-6">
          {children}
        </div>
      </main>
    </div>
  );
}