"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/resumes", label: "Resumes" },
  { href: "/admin/versions", label: "Versions" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4">
        <Link
          href="/admin/dashboard"
          className="text-sm font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Admin
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm" aria-label="Admin">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  active
                    ? "font-semibold text-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
