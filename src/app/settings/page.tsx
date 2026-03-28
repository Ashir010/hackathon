"use client";

import { motion } from "framer-motion";
import { Moon, Sun, Monitor, HardDrive, Shield, Bell, Zap, CloudOff } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto w-full h-full flex flex-col gap-10 pb-32">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-purple)] opacity-[0.03] blur-[100px] pointer-events-none" />

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your second brain preferences and data.</p>
      </div>

      <div className="space-y-12 relative z-10">
        
        {/* Appearance */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-[var(--color-primary)]" />
            Appearance
          </h2>
          <div className="glass-card rounded-2xl p-2 flex flex-col md:flex-row gap-2 border border-white/5">
            {[
              { id: "system", label: "System", icon: Monitor, active: false },
              { id: "light", label: "Light", icon: Sun, active: false },
              { id: "dark", label: "Dark", icon: Moon, active: true },
            ].map((theme) => (
              <button
                key={theme.id}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                  theme.active 
                    ? "bg-white/10 text-white shadow-sm border border-white/10" 
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <theme.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{theme.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Data & Privacy */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--color-primary)]" />
            Data & Privacy
          </h2>
          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <div className="flex gap-4 items-center">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CloudOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Local First Mode</h3>
                  <p className="text-xs text-gray-400 mt-1">Keep all data strictly on this device.</p>
                </div>
              </div>
              <div className="w-11 h-6 bg-[var(--color-primary)] rounded-full relative cursor-pointer outline-none">
                 <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white transition-transform" />
              </div>
            </div>
            
            <div className="p-5 flex items-center justify-between border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <div className="flex gap-4 items-center">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Storage Usage</h3>
                  <p className="text-xs text-gray-400 mt-1">12.4 MB of 500 MB used internally.</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                Clear Cache
              </button>
            </div>
            
            <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex gap-4 items-center">
                <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Danger Zone</h3>
                  <p className="text-xs text-gray-400 mt-1">Permanently delete your entire Second Brain.</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] rounded-lg transition-all">
                Delete Data
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
