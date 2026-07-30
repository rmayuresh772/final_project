"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  expenses: "My Expenses",
  new: "Add Expense",
  approvals: "Approvals",
  reports: "Reports",
  profile: "Profile",
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Dashboard page
  if (pathname === "/dashboard") {
    return (
      <div className="mb-6">
        <span className="text-sm font-semibold text-gray-900">
          Dashboard
        </span>
      </div>
    );
  }

  const paths = pathname.split("/").filter(Boolean);

  return (
    <div className="mb-6 flex items-center gap-2 text-sm">
      <Link
        href="/dashboard"
        className="text-gray-500 hover:text-gray-900 transition"
      >
        Dashboard
      </Link>

      {paths.map((path, index) => {
        // Don't render "dashboard" twice
        if (path === "dashboard") return null;

        const isLast = index === paths.length - 1;

        let href = "/";

        switch (path) {
          case "expenses":
            href = "/expenses";
            break;

          case "new":
            href = "/expenses/new";
            break;

          case "approvals":
            href = "/approvals";
            break;

          case "reports":
            href = "/reports";
            break;

          case "profile":
            href = "/profile";
            break;

          default:
            href = "/" + paths.slice(0, index + 1).join("/");
        }

        return (
          <div
            key={path}
            className="flex items-center gap-2"
          >
            <span className="text-gray-400">/</span>

            {isLast ? (
              <span className="font-semibold text-gray-900">
                {labels[path] || path}
              </span>
            ) : (
              <Link
                href={href}
                className="text-gray-500 hover:text-gray-900 transition"
              >
                {labels[path] || path}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}