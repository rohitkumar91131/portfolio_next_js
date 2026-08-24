"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileNav({ links }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="-m-2 p-2"
      >
        <Menu size={22} strokeWidth={1.5} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-bg px-5 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between py-6">
            <span className="text-sm font-semibold tracking-[0.12em] uppercase">
              Rohit Kumar
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="-m-2 p-2"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-8" aria-label="Mobile">
            {[...links, { href: "/resume.pdf", label: "Resume", download: true }].map(
              (link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  {...(link.download
                    ? { download: "Rohit_Kumar_Resume.pdf" }
                    : {})}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-4"
                >
                  <span className="label">0{i + 1}</span>
                  <span className="font-display text-5xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-2">
                    {link.label}
                  </span>
                </Link>
              )
            )}
          </nav>

          <p className="label py-6">hello — rk34190100@gmail.com</p>
        </div>
      )}
    </>
  );
}
