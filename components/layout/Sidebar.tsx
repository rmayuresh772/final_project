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
  UserPlus,
  Mail,
  CreditCard,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
}

interface MenuItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: ("ADMIN" | "MANAGER" | "EMPLOYEE")[];
}

const menu: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
  },
  {
    name: "My Expenses",
    href: "/expenses",
    icon: Receipt,
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
  },
  {
    name: "Add Expense",
    href: "/expenses/new",
    icon: PlusCircle,
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
  },
  {
    name: "Approvals",
    href: "/approvals",
    icon: ClipboardCheck,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Invite User",
    href: "/users/invite",
    icon: UserPlus,
    roles: ["ADMIN"],
  },
  {
    name: "Invitations",
    href: "/invitations",
    icon: Mail,
    roles: ["ADMIN"],
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
  },
];

export default function Sidebar({ user }: { user: User | null }) {
  const pathname = usePathname();

  const visibleMenu = user
    ? menu.filter((item) => item.roles.includes(user.role))
    : menu;

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white shadow-2xl flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
          <CreditCard className="h-6 w-6 text-white" />
        </div>
        <div className="leading-tight">
          <h1 className="text-[22px] font-semibold tracking-tight text-white">
            Expense Tracker
          </h1>
          <p className="mt-1 text-xs font-medium text-slate-400">
            Company Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-scroll flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {visibleMenu.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-5 py-4 text-[15px] font-medium transition-all ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-700 p-5">
        <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-bold">
            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="font-semibold">{user?.name ?? "User"}</p>
            <p className="text-xs text-slate-400">
              {user?.role ?? "Guest"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}