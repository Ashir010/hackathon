"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface Note {
  id: string;
  title: string;
  preview: string;
  content: string;
  tags: string[];
  date: string;
  timestamp: number;
}

const DEFAULT_NOTES: Note[] = [
  { 
    id: "1", 
    title: "React Flow Custom Nodes", 
    preview: "To create custom nodes in React Flow, you need to register them...",
    content: "To create custom nodes in React Flow, you need to register them in the nodeTypes prop.\n\n```jsx\nconst nodeTypes = { custom: CustomNode };\n```\n\nThis allows you to render any React component as a node.",
    tags: ["react", "visualization"], 
    date: "Just now",
    timestamp: Date.now()
  }
];

interface NotesContextType {
  notes: Note[];
  saveNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("second-brain-notes");
    if (saved) {
      setNotes(JSON.parse(saved));
    } else {
      setNotes(DEFAULT_NOTES);
      localStorage.setItem("second-brain-notes", JSON.stringify(DEFAULT_NOTES));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("second-brain-notes", JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  const saveNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => {
      const existing = prev.find(n => n.id === id);
      if (existing) {
        return prev.map(n => n.id === id ? { ...n, ...updates, timestamp: Date.now(), date: "Just now" } : n);
      }
      return [{
        id,
        title: updates.title || "Untitled",
        preview: updates.content?.substring(0, 80) || "",
        content: updates.content || "",
        tags: updates.tags || [],
        date: "Just now",
        timestamp: Date.now(),
        ...updates
      }, ...prev];
    });
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotesContext.Provider value={{ notes, saveNote, deleteNote }}>
      {isLoaded ? children : null}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
};
