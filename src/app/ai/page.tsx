"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, FileText, Bot } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useNotes } from "@/context/NotesContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
  references?: { id: string; title: string }[];
}

export default function AIPage() {
  const { notes } = useNotes();
  const connections = Math.floor(notes.length * 1.5);
  
  const INITIAL_MESSAGES: Message[] = [
    {
      id: "1",
      role: "assistant",
      content: `Hi Saran! I'm your Second Brain AI.\n\nI have access to your ${notes.length} notes and roughly ${connections} connections. I can help you recall information, connect ideas, or summarize your learning.\n\nWhat would you like to explore today?`,
    }
  ];

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI typing and response
    const aiMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: aiMessageId, role: "assistant", content: "", isTyping: true }]);

    setTimeout(() => {
      setMessages((prev) => prev.map(msg => {
        if (msg.id === aiMessageId) {
          return {
            ...msg,
            isTyping: false,
            content: "Based on your notes, **System Design Patterns** discusses caching and load balancing intensely. You also learned about API Gateways last week.\n\nThe connection between these is that an API Gateway often implements caching at the edge, reducing the load on your microservices.",
            references: [
              { id: "3", title: "System Design Patterns" },
              { id: "4", title: "API Gateway" }
            ]
          };
        }
        return msg;
      }));
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background relative z-0">
      <header className="sticky top-0 z-10 glass border-b border-white/5 px-8 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-signature flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Brain AI</h1>
          <p className="text-xs text-[var(--color-primary)] font-medium">Online • {notes.length} notes indexed</p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-8 overflow-y-auto pb-40">
        <div className="space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={clsx(
                  "flex gap-4",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className="flex-shrink-0">
                  {message.role === "assistant" ? (
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                      <Bot className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
                
                <div className={clsx(
                  "flex flex-col gap-2 max-w-[80%]",
                  message.role === "user" ? "items-end" : "items-start"
                )}>
                  <div className={clsx(
                    "px-5 py-4 rounded-2xl text-sm md:text-base leading-relaxed whitespace-pre-wrap",
                    message.role === "user" 
                      ? "bg-white text-black rounded-tr-sm" 
                      : "glass-card text-gray-200 border border-white/10 rounded-tl-sm relative"
                  )}>
                    {message.isTyping ? (
                      <div className="flex gap-1.5 items-center h-6">
                        <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    ) : (
                      <div dangerouslySetInnerHTML={{ 
                        __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white bg-white/10 px-1.5 py-0.5 rounded">$1</strong>') 
                      }} />
                    )}
                  </div>
                  
                  {!message.isTyping && message.references && message.references.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.references.map(ref => (
                        <Link key={ref.id} href={`/notes/${ref.id}`}>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group">
                            <FileText className="w-3.5 h-3.5 group-hover:text-[var(--color-primary)] transition-colors" />
                            {ref.title}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background via-background/90 to-transparent pt-10 pb-8 px-6 backdrop-blur-[2px]">
        <div className="max-w-4xl mx-auto relative group">
          <form onSubmit={handleSubmit} className="relative">
            <div className="absolute -inset-1 bg-gradient-signature rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative glass bg-[length:200%_200%] border border-white/10 rounded-xl flex items-end p-2 pb-2 pl-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask about your notes..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 resize-none max-h-32 py-2 pr-4 min-h-[44px]"
                rows={1}
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-lg bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:bg-white/10 disabled:text-gray-500 transition-all mb-0.5"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
          <div className="text-center mt-3 text-xs text-gray-500 font-medium">
             Brain AI can make mistakes. Consider verifying connections.
          </div>
        </div>
      </div>
    </div>
  );
}
