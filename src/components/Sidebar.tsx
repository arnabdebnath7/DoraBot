import React from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  Cpu,
  Zap,
  Sparkles,
  BookOpen,
  DoorOpen,
  Wind,
  Brain,
  Languages,
  Clock,
  Minimize2,
  HardDrive,
  RefreshCw,
} from 'lucide-react';
import type { MiniDoraConfig, MiniDoraId, ChatSession, SystemHealth } from '../types';

interface SidebarProps {
  miniDoras: MiniDoraConfig[];
  activeDoraId: MiniDoraId;
  onSelectDora: (id: MiniDoraId) => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onSelectGadget: (gadgetId: string) => void;
  systemHealth: SystemHealth | null;
  onTriggerCleanup: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  miniDoras,
  activeDoraId,
  onSelectDora,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onSelectGadget,
  systemHealth,
  onTriggerCleanup,
}) => {
  const getIconForDora = (id: MiniDoraId) => {
    switch (id) {
      case 'dora-classic':
        return <Cpu className="w-4 h-4 text-sky-400" />;
      case 'dora-red':
        return <Zap className="w-4 h-4 text-red-400" />;
      case 'dora-yellow':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'dora-green':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
    }
  };

  const diskUsed = systemHealth?.disk.usedMB || 1900;
  const diskPercent = Math.min(100, Math.round((diskUsed / 4800) * 100));
  const isDiskHigh = diskUsed > 3800;

  return (
    <aside className="w-72 border-r border-sky-500/20 glass-panel flex flex-col h-full shrink-0 select-none">
      {/* Mini-Dora Mode Switcher */}
      <div className="p-3 border-b border-slate-800">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
          Mini-Dora Squad Modes
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {miniDoras.map((dora) => {
            const isSelected = dora.id === activeDoraId;
            return (
              <button
                key={dora.id}
                onClick={() => onSelectDora(dora.id)}
                className={`flex items-center space-x-2 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all border text-left ${
                  isSelected
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-sm shadow-sky-500/20'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {getIconForDora(dora.id)}
                <div className="truncate">
                  <span className="block truncate">{dora.name.replace('Mini-Dora ', '')}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Dora Conversation</span>
        </button>
      </div>

      {/* Session History List */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 px-1">
          Recent Chats
        </label>
        {sessions.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs italic">
            No chats yet. Start chatting!
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs transition-all border ${
                  isActive
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-200 font-medium'
                    : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2 truncate pr-2">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-sky-400" />
                  <span className="truncate">{session.title || 'Conversation'}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded transition-opacity"
                  title="Delete conversation"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* 4D Gadget Quick Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <label className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider block mb-2 px-1 flex items-center justify-between">
          <span>4D Pocket Shortcuts</span>
          <span>🔔</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onSelectGadget('anywhere-door')}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-pink-500/40 hover:bg-pink-500/10 text-slate-300 transition-colors"
            title="Anywhere Door"
          >
            <DoorOpen className="w-4 h-4 text-pink-400 mb-1" />
            <span className="text-[9px] font-medium truncate w-full text-center">Door</span>
          </button>
          <button
            onClick={() => onSelectGadget('bamboo-copter')}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 hover:bg-amber-500/10 text-slate-300 transition-colors"
            title="Bamboo Copter"
          >
            <Wind className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[9px] font-medium truncate w-full text-center">Copter</span>
          </button>
          <button
            onClick={() => onSelectGadget('memory-bread')}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 hover:bg-sky-500/10 text-slate-300 transition-colors"
            title="Memory Bread"
          >
            <Brain className="w-4 h-4 text-sky-400 mb-1" />
            <span className="text-[9px] font-medium truncate w-full text-center">Bread</span>
          </button>
          <button
            onClick={() => onSelectGadget('translation-gummy')}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-slate-300 transition-colors"
            title="Translation Gummy"
          >
            <Languages className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-[9px] font-medium truncate w-full text-center">Gummy</span>
          </button>
          <button
            onClick={() => onSelectGadget('time-machine')}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 hover:bg-purple-500/10 text-slate-300 transition-colors"
            title="Time Machine"
          >
            <Clock className="w-4 h-4 text-purple-400 mb-1" />
            <span className="text-[9px] font-medium truncate w-full text-center">Time</span>
          </button>
          <button
            onClick={() => onSelectGadget('small-light')}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-yellow-500/40 hover:bg-yellow-500/10 text-slate-300 transition-colors"
            title="Small Light"
          >
            <Minimize2 className="w-4 h-4 text-yellow-400 mb-1" />
            <span className="text-[9px] font-medium truncate w-full text-center">Small</span>
          </button>
        </div>
      </div>

      {/* Disk & Watchdog Status */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-slate-400 flex items-center space-x-1">
            <HardDrive className="w-3 h-3 text-sky-400" />
            <span>Disk Watchdog</span>
          </span>
          <span className={`font-bold ${isDiskHigh ? 'text-red-400' : 'text-sky-300'}`}>
            {diskUsed}MB / 4.8GB ({diskPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full transition-all duration-500 ${
              isDiskHigh ? 'bg-red-500' : 'bg-gradient-to-r from-sky-500 to-sky-400'
            }`}
            style={{ width: `${diskPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500">Auto-clean @ 3.8GB</span>
          <button
            onClick={onTriggerCleanup}
            className="flex items-center space-x-1 text-[10px] text-sky-400 hover:text-sky-300 px-1.5 py-0.5 rounded bg-sky-950/60 hover:bg-sky-900/50 border border-sky-800/40"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Clean Cache</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
