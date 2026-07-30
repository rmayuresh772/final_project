"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  ClipboardCheck,
  BarChart3,
  User,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Expenses",
    href: "/expenses",
    icon: Receipt,
  },
  {
    name: "Add Expense",
    href: "/expenses/new",
    icon: PlusCircle,
  },
  {
    name: "Approvals",
    href: "/approvals",
    icon: ClipboardCheck,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
      fixed
      left-0
      top-0
      h-screen
      w-72
      bg-gradient-to-b
      from-slate-900
      via-slate-800
      to-slate-950
      text-white
      shadow-2xl
      flex
      flex-col
      "
    >
      {/* Logo */}

      <div
        className="
        border-b
        border-slate-700
        px-8
        py-8
        "
      >
        <h1
          className="
          text-2xl
          font-bold
          tracking-wide
          "
        >
          💳 Expense Tracker
        </h1>

        <p
          className="
          mt-2
          text-sm
          text-slate-400
          "
        >
          Company Portal
        </p>
      </div>

      {/* Navigation */}

      <nav
        className="
        flex-1
        overflow-y-auto
        px-4
        py-6
        space-y-2
        "
      >
        {menu.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex
                items-center
                gap-4
                rounded-xl
                px-5
                py-4
                text-[15px]
                font-medium
                transition-all

                ${
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }
              `}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}

      <div
        className="
        border-t
        border-slate-700
        p-5
        "
      >
        <div
          className="
          flex
          items-center
          gap-3
          rounded-xl
          bg-slate-800
          p-3
          "
        >
          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-blue-600
            text-lg
            font-bold
            "
          >
            M
          </div>

          <div>
            <p className="font-semibold">Mayuresh</p>

            <p className="text-xs text-slate-400">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}