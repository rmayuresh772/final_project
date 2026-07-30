import SidebarWrapper from "@/components/layout/SidebarWrapper";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarWrapper />

      <main
        className="
        ml-72
        min-h-screen
        bg-gray-50
        p-8
        "
      >
        <Breadcrumbs />

        <div className="mt-6">
          {children}
        </div>
      </main>
    </>
  );
}