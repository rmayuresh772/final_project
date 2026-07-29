import type { Metadata } from "next";
import "./globals.css";

import SidebarWrapper from "@/components/layout/SidebarWrapper";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Expense management application",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (

    <html lang="en">


      <body>


        <div
          className="
          flex
          min-h-screen
          "
        >



          {/* Sidebar */}

          <aside
            className="
            w-64
            shrink-0
            "
          >

            <SidebarWrapper />

          </aside>







          {/* Main Content */}


          <main
            className="
            flex-1
            bg-gray-50
            p-6
            "
          >



            {/* Top Navigation */}

            <div
              className="
              mb-6
              flex
              items-center
              justify-between
              "
            >


              <Breadcrumbs />


            </div>






            {children}





          </main>



        </div>



      </body>


    </html>

  );

}