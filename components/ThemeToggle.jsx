"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="-m-2 p-2 text-ink transition-opacity hover:opacity-60"
    >
      <Sun size={16} strokeWidth={1.5} className="hidden dark:block" />
      <Moon size={16} strokeWidth={1.5} className="block dark:hidden" />
    </button>
  );
};

export default ThemeToggle;
