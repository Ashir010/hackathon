"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Sparkles, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/notes/new");
        setIsOpen(false);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [router]);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl z-[101] glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 bg-black/20">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search notes, tags, or commands..."
                className="flex-1 bg-transparent outline-none text-lg text-white placeholder-gray-500"
              />
              <div className="flex gap-1">
                <kbd className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 font-mono border border-white/10 shadow-sm">ESC</kbd>
              </div>
            </div>
            <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto bg-black/10">
              <div className="px-3 py-2 mt-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div>
              {[
                { icon: FileText, label: "Create new note", detail: "Ctrl + N", path: "/notes/new" },
                { icon: Sparkles, label: "Ask AI Assistant", detail: "Jump to AI", path: "/ai" },
                { icon: Settings, label: "Open Settings", detail: "", path: "/settings" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleNavigate(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 transition-all text-left group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 group-hover:bg-[var(--color-primary)]/20 transition-colors">
                    <item.icon className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                  {item.detail && <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{item.detail}</span>}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
