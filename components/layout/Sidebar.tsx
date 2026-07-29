"use client";

import { usePathname } from "next/navigation";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "📊",
  },
  {
    name: "My Expenses",
    href: "/expenses",
    icon: "📄",
  },
  {
    name: "Add Expense",
    href: "/expenses/new",
    icon: "➕",
  },
  {
    name: "Approvals",
    href: "/approvals",
    icon: "⏳",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: "📈",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: "👤",
  },
];


export default function Sidebar() {

  const pathname = usePathname();


  return (

    <div className="min-h-screen bg-gray-900 p-5">


      <h1 className="mb-8 text-2xl font-bold text-white">
        Expense Tracker
      </h1>



      <nav className="space-y-3">


        {menu.map((item)=>(

          <a
            key={item.href}
            href={item.href}
            className="
              flex
              items-center
              gap-3
              rounded-lg
              px-4
              py-3
              text-white
              hover:bg-gray-800
            "
          >

            <span className="text-white">
              {item.icon}
            </span>


            <span className="text-white">
              {item.name}
            </span>


          </a>

        ))}


      </nav>


    </div>

  );
}