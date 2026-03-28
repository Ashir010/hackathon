"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter, Clock } from "lucide-react";
import Link from "next/link";
import { useNotes } from "@/context/NotesContext";

export default function NotesPage() {
  const [search, setSearch] = useState("");
  const { notes } = useNotes();
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) || 
    note.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  ).sort((a,b) => b.timestamp - a.timestamp);

  return (
    <div className="p-8 max-w-6xl mx-auto w-full h-full flex flex-col gap-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">All Notes</h1>
          <p className="text-gray-400 mt-1">124 notes in your second brain.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--color-primary)] transition-colors" />
            <input 
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 glass-card rounded-xl border border-white/5 focus:border-[var(--color-primary)] outline-none text-sm w-full md:w-64 transition-all text-white placeholder-gray-500"
            />
          </div>
          <button className="p-2.5 glass-card rounded-xl border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white">
            <Filter className="w-5 h-5" />
          </button>
          <Link href="/notes/new">
            <button className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-all">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {filteredNotes.map((note, i) => (
          <Link key={note.id} href={`/notes/${note.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 h-full rounded-2xl group hover:bg-white/[0.04] hover:scale-[1.02] transition-all cursor-pointer border border-transparent hover:border-[var(--color-primary)]/30 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-[0.03] blur-2xl group-hover:opacity-[0.08] transition-opacity" />
              
              <h3 className="text-lg font-medium text-gray-200 group-hover:text-white transition-colors relative z-10">
                {note.title}
              </h3>
              <p className="text-sm text-gray-400 mt-3 line-clamp-3 flex-1 relative z-10">
                {note.preview}
              </p>
              
              <div className="mt-5 pt-5 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {note.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded bg-white/5 text-xs text-gray-300 group-hover:bg-white/10 transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {note.date}
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      
      <Link href="/notes/new" className="fixed bottom-8 right-8 z-40">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-gradient-signature flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] md:hidden"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </Link>
    </div>
  );
}
