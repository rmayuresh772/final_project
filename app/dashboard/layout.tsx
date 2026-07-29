import SidebarWrapper from "@/components/layout/SidebarWrapper";
import Breadcrumbs from "@/components/layout/Breadcrumbs";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (

    <div className="flex min-h-screen">


      {/* Sidebar */}

      <SidebarWrapper />



      {/* Content */}

      <main
        className="
        flex-1
        bg-gray-50
        p-6
        "
      >

        <Breadcrumbs />

        {children}


      </main>


    </div>

  );

}