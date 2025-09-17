// src/components/common/app-shell/Topbar.tsx
"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

type TopbarProps = {
  onToggle: () => void;      // toggle sidebar (desktop)
  onOpenSidebar: () => void; // open sidebar (mobile)
};

const BRAND = "#017938";

export default function Topbar({ onToggle, onOpenSidebar }: TopbarProps) {
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  const setTheme = (theme: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
    setCurrentTheme(theme);
    setShowThemeDropdown(false);
  };

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setCurrentTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  return (
    <header className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 px-6 py-2 text-neutral-800 dark:text-neutral-200">
      <div className="flex items-center justify-between">
        {/* Kiri */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggle}
            className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
            aria-label="Toggle sidebar"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
            aria-label="Open sidebar"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>
        </div>

        {/* Kanan */}
        <div className="flex items-center space-x-4">
          {/* Search Command Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search command..."
              className="pl-4 pr-12 py-1 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64 text-sm bg-white dark:bg-neutral-700"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <kbd className="inline-flex items-center border border-gray-200 dark:border-neutral-600 bg-gray-100 dark:bg-neutral-900 rounded px-2 text-xs font-sans text-gray-400">
                <span>⌘</span>
                <span className="ml-1">K</span>
              </kbd>
            </div>
          </div>

          {/* Notification: dot ditempel ke ikon lonceng */}
          <button
            type="button"
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 focus:outline-none"
            aria-label="Notifications"
          >
            <span className="relative inline-flex h-5 w-5 items-center justify-center">
              <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
              {/* dot berdetak, nempel di sudut ikon */}
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2" aria-hidden>
                <span
                  className="absolute inset-0 rounded-full opacity-70 animate-ping motion-reduce:animate-none"
                  style={{ backgroundColor: BRAND }}
                />
                <span
                  className="relative block h-2 w-2 rounded-full ring-[1.5px] ring-white dark:ring-neutral-800"
                  style={{ backgroundColor: BRAND }}
                />
              </span>
            </span>
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold text-xs">
            DF
          </div>

          {/* Theme toggle + dropdown */}
          <div className="relative">
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 focus:outline-none"
              onClick={() => setShowThemeDropdown(v => !v)}
              aria-haspopup="menu"
              aria-expanded={showThemeDropdown}
              aria-label="Theme menu"
            >
              <FontAwesomeIcon icon={currentTheme === "dark" ? faMoon : faSun} className="h-4 w-4" />
            </button>
            <div
              className={`absolute right-0 mt-2 w-28 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded shadow-lg z-10 transition-all duration-300 ${
                showThemeDropdown ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
              }`}
              role="menu"
            >
              <button
                type="button"
                className="flex items-center w-full px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-neutral-700 text-sm"
                onClick={() => setTheme("light")}
                role="menuitem"
              >
                <FontAwesomeIcon icon={faSun} className="h-3.5 w-3.5 mr-2" />
                Light
              </button>
              <button
                type="button"
                className="flex items-center w-full px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-neutral-700 text-sm"
                onClick={() => setTheme("dark")}
                role="menuitem"
              >
                <FontAwesomeIcon icon={faMoon} className="h-3.5 w-3.5 mr-2" />
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
