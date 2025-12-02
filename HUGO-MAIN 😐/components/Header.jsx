"use client"

import { MoreHorizontal, Menu } from "lucide-react"
import Link from "next/link"
import GhostIconButton from "./GhostIconButton";
import { useState, useEffect } from "react";

import ThemeToggle from "./ThemeToggle"

export default function Header({ createNewChat, sidebarCollapsed, setSidebarOpen, theme, setTheme }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-zinc-200/60 bg-white/80 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      {isMounted && sidebarCollapsed && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      <Link href="/" className="text-xl font-bold tracking-tight ml-2">Hugo</Link>
      <div className="ml-auto">
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
}
