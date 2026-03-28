"use client";

import { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import { useNotes } from "@/context/NotesContext";

export default function GraphView() {
  const { notes } = useNotes();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // Generate nodes based on actual notes
    const newNodes = notes.map((note, index) => {
      // Calculate a rough scattered position
      const row = Math.floor(index / 3);
      const col = index % 3;
      return {
        id: note.id,
        position: { x: col * 300 + 100, y: row * 200 + 100 },
        data: { label: note.title },
        className: "glass-node"
      };
    });

    // Generate edges based on shared tags
    const newEdges: Edge[] = [];
    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const sharedTags = notes[i].tags.filter(tag => notes[j].tags.includes(tag));
        if (sharedTags.length > 0) {
          newEdges.push({
            id: `e${notes[i].id}-${notes[j].id}`,
            source: notes[i].id,
            target: notes[j].id,
            animated: true,
            style: { stroke: "#6366F1", strokeWidth: 2 }
          });
        }
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [notes, setNodes, setEdges]);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge({...params, animated: true, style: { stroke: "#6366F1", strokeWidth: 2 }}, eds)), [setEdges]);

  return (
    <div className="w-full h-full relative flex flex-col z-0">
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <h1 className="text-3xl font-bold text-white mb-2">Knowledge Graph</h1>
        <p className="text-gray-400">Visualize the connections between your {notes.length} notes.</p>
      </div>
      
      <div className="absolute top-8 right-8 z-10 flex gap-2">
        <div className="glass-card px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2 shadow-lg">
           <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)] animate-pulse" />
           <span className="text-sm font-medium text-white">Interactive Mode</span>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 w-full h-full"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-background"
        >
          <Background color="#ffffff" gap={24} size={1} variant={BackgroundVariant.Dots} className="opacity-[0.03]" />
          <Controls className="glass-card !border-white/10 !bg-surface !fill-gray-300" />
          <MiniMap 
            nodeColor={(node) => '#6366F1'}
            maskColor="rgba(11, 15, 26, 0.7)"
            className="glass-card !border-white/10 !bg-background !rounded-xl overflow-hidden shadow-2xl"
          />
        </ReactFlow>
      </motion.div>
      
      <style jsx global>{`
        .glass-node {
          background: rgba(17, 24, 39, 0.75) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          padding: 14px 24px !important;
          color: white !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .glass-node:hover {
          border-color: rgba(99, 102, 241, 0.6) !important;
          box-shadow: 0 4px 25px rgba(99, 102, 241, 0.25), inset 0 0 0 1px rgba(99, 102, 241, 0.3) !important;
          transform: translateY(-2px) !important;
        }
        .react-flow__handle {
          background-color: #8B5CF6 !important;
          width: 10px !important;
          height: 10px !important;
          border: 2px solid #0B0F1A !important;
          transition: transform 0.2s ease !important;
        }
        .react-flow__handle:hover {
          transform: scale(1.5) !important;
          background-color: #22D3EE !important;
        }
        .react-flow__attribution {
          background: transparent !important;
          color: rgba(255, 255, 255, 0.2) !important;
        }
        .react-flow__controls-button {
          background: transparent !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        .react-flow__controls-button:hover {
          background: rgba(255,255,255,0.05) !important;
        }
      `}</style>
    </div>
  );
}
