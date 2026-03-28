"use client";

import { motion } from "framer-motion";
import { FileText, Plus, Hash, GitCommitHorizontal, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useNotes } from "@/context/NotesContext";

export default function Dashboard() {
  const { notes } = useNotes();
  
  // Sort notes to show the most recent first
  const RECENT_NOTES = [...notes].sort((a, b) => b.timestamp - a.timestamp).slice(0, 4);

  // aggregate stats
  const totalNotes = notes.length;
  const uniqueTags = new Set(notes.flatMap(n => n.tags)).size;
  // Connections can be mocked or derived from tags overlap later
  const connections = Math.floor(totalNotes * 1.5);
  return (
    <div className="p-8 max-w-6xl mx-auto w-full h-full flex flex-col gap-8 pb-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Good Evening, Saran
          </h1>
          <p className="text-gray-400 mt-1">Here is the state of your second brain.</p>
        </div>
        <Link href="/notes/new">
          <button className="flex items-center gap-2 bg-gradient-signature text-white px-5 py-2.5 rounded-xl font-medium shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-105 transition-all">
            <Plus className="w-5 h-5" />
            New Note
          </button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Notes", value: totalNotes, icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Tags", value: uniqueTags, icon: Hash, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Connections", value: connections, icon: GitCommitHorizontal, color: "text-cyan-400", bg: "bg-cyan-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl flex items-center gap-5 hover:bg-white/[0.03] transition-colors group"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm hidden md:block">{stat.label}</p>
              <p className="text-3xl font-bold mt-1 text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex-1 min-h-0 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-primary)]" />
            Recent Notes
          </h2>
          <Link href="/notes" className="text-sm text-gray-400 hover:text-white flex items-center gap-1 group transition-colors">
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECENT_NOTES.map((note, i) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <div 
                className="glass-card p-5 h-full rounded-2xl group hover:bg-white/[0.04] hover:scale-[1.02] transition-all cursor-pointer border border-transparent hover:border-white/10"
              >
                <h3 className="text-lg font-medium text-gray-200 group-hover:text-[var(--color-primary)] transition-colors">
                  {note.title}
                </h3>
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  {note.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Edited {note.date}
                  </p>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[var(--color-primary)] transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
