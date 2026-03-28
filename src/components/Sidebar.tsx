"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, GitGraph, Sparkles, Settings } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Graph", href: "/graph", icon: GitGraph },
  { name: "AI Assistant", href: "/ai", icon: Sparkles },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full glass border-r border-white/5 flex flex-col py-8 z-10 transition-all duration-300 relative">
      <div className="mb-12 flex items-center justify-center gap-3 px-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-signature flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
          Brain OS
        </h1>
      </div>
      
      <nav className="flex-1 w-full px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="block relative">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-white/5 rounded-xl border border-white/10"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div
                className={clsx(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 z-10",
                  isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={clsx("w-5 h-5", isActive && "text-[var(--color-primary)]")} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto px-4 w-full">
        <div className="glass-card rounded-xl p-4 text-xs text-gray-400 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-signature opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          <p className="flex justify-between items-center z-10">
            <span>Notes</span> 
            <span className="text-white font-medium bg-white/5 px-2 py-0.5 rounded">124</span>
          </p>
          <p className="flex justify-between items-center z-10">
            <span>Tags</span> 
            <span className="text-white font-medium bg-white/5 px-2 py-0.5 rounded">32</span>
          </p>
          <p className="flex justify-between items-center z-10">
            <span>Connections</span> 
            <span className="text-white font-medium bg-white/5 px-2 py-0.5 rounded">89</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
