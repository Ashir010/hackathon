"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, MoreHorizontal, Save, Maximize2, Minimize2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import clsx from "clsx";
import { useNotes } from "@/context/NotesContext";

export default function NoteEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";
  
  const { notes, saveNote } = useNotes();
  
  const existingNote = notes.find(n => n.id === id);
  
  const [noteId, setNoteId] = useState(isNew ? Date.now().toString() : id);
  const [title, setTitle] = useState(existingNote?.title || "");
  const [content, setContent] = useState(existingNote?.content || "");
  const [tags, setTags] = useState<string[]>(existingNote?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    if (!isNew && existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setTags(existingNote.tags || []);
    }
  }, [existingNote, isNew]);

  // Auto-save debounce effect
  useEffect(() => {
    // Only save if there's actually some content
    if (title.trim() === "" && content.trim() === "" && tags.length === 0) return;
    
    setSaveState("saving");
    const timeout = setTimeout(() => {
      saveNote(noteId, { title, content, tags });
      setSaveState("saved");
      
      // Update URL if we just saved a new note for the first time
      if (isNew) {
         router.replace(`/notes/${noteId}`);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, content, tags, noteId, saveNote, isNew, router]);
  
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className={clsx(
      "flex flex-col bg-background transition-all duration-500",
      isFocusMode ? "fixed inset-0 z-[100] overflow-y-auto" : "h-full relative z-0"
    )}>
      <header className={clsx("sticky top-0 z-10 glass border-b border-white/5 py-4 flex items-center justify-between transition-all duration-500", isFocusMode ? "px-12 opacity-50 hover:opacity-100 border-transparent bg-transparent" : "px-6")}>
        <div className="flex items-center gap-4">
          {!isFocusMode && (
            <Link href="/notes" className="p-2 -ml-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {!isFocusMode && <Link href="/notes" className="hover:text-gray-300">Notes</Link>}
            {!isFocusMode && <span>/</span>}
            <span className="text-gray-300 truncate max-w-[150px] sm:max-w-[300px]">{title || "Untitled"}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!isFocusMode && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 mr-2 bg-white/5 px-3 py-1.5 rounded-full transition-colors">
              {saveState === "saving" ? (
                <>
                  <Save className="w-3.5 h-3.5 animate-pulse text-gray-400" />
                  Saving...
                </>
              ) : saveState === "saved" ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Draft
                </>
              )}
            </div>
          )}
          <button 
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            title={isFocusMode ? "Exit Focus Mode" : "Focus Mode"}
          >
            {isFocusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          {!isFocusMode && (
            <>
              <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col max-w-4xl mx-auto p-6 md:p-12 lg:p-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full bg-transparent text-4xl lg:text-5xl font-bold text-white placeholder-gray-600 outline-none mb-6"
          />
          
          <div className={clsx("flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-white/5 transition-opacity", isFocusMode && "opacity-50 hover:opacity-100")}>
            {tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 rounded-md text-sm font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center gap-1.5 group border border-[var(--color-primary)]/20">
                #{tag}
                <button onClick={() => removeTag(tag)} className="opacity-0 group-hover:opacity-100 hover:text-white transition-all">
                  &times;
                </button>
              </span>
            ))}
            <input 
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag..."
              className="bg-transparent text-sm text-gray-400 placeholder-gray-600 outline-none w-24 focus:w-32 transition-all ml-1"
            />
          </div>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing your thoughts..."
            className="w-full flex-1 min-h-[500px] bg-transparent text-lg text-gray-300 placeholder-gray-600 outline-none resize-none leading-relaxed"
          />
        </motion.div>
      </main>
    </div>
  );
}
