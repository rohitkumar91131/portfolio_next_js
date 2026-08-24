"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

// Frozen v1 theme toggle — colored circular button from the original design.
const OriginalThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-3 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-700"
      aria-label="Toggle Theme"
    >
      <Moon className="w-6 h-6 text-yellow-400 hidden dark:block" />
      <Sun className="w-6 h-6 text-orange-500 block dark:hidden" />
    </button>
  );
};

export default OriginalThemeToggle;
