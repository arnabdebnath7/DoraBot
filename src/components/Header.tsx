import React from 'react';
import { Sparkles, Bell, Cpu, Settings, LogIn, LogOut, HardDrive, ShieldCheck } from 'lucide-react';
import type { MiniDoraConfig, UserProfile, SystemHealth } from '../types';

interface HeaderProps {
  activeDora: MiniDoraConfig;
  user: UserProfile | null;
  systemHealth: SystemHealth | null;
  onOpenGadgets: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeDora,
  user,
  systemHealth,
  onOpenGadgets,
  onOpenSettings,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="h-16 px-4 border-b border-sky-500/20 glass-panel flex items-center justify-between z-20 shrink-0">
      {/* Brand & Mascot */}
      <div className="flex items-center space-x-3">
        <div className="relative group cursor-pointer" onClick={onOpenGadgets}>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-sky-400 dora-glow transition-transform duration-300 group-hover:scale-105">
            <img
              src="/assets/dorabot_mascot.jpg"
              alt="DoraBot Mascot"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Bell badge */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center text-[9px] font-bold text-slate-900 dora-bell-glow">
            🔔
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-sky-400 via-sky-200 to-white bg-clip-text text-transparent">
              DoraBot
            </h1>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-500/30">
              v1.0 • 22nd Cent.
            </span>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{activeDora.name}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 truncate max-w-[140px] md:max-w-none">{activeDora.badge}</span>
          </p>
        </div>
      </div>

      {/* Middle Status Pill (Desktop) */}
      <div className="hidden lg:flex items-center space-x-3 text-xs">
        {/* System Health / Disk Monitor Pill */}
        {systemHealth && (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700/60 text-slate-300">
            <HardDrive className="w-3.5 h-3.5 text-sky-400" />
            <span>Disk: <strong className="text-sky-300">{systemHealth.disk.usedMB}MB</strong> / 4.8GB</span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>OmniRoute Ready</span>
            </span>
          </div>
        )}

        {/* 4D Pocket Button */}
        <button
          onClick={onOpenGadgets}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-all font-medium hover:scale-105 active:scale-95"
        >
          <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>4D Pocket</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2.5">
        {/* 4D Pocket Button (Mobile) */}
        <button
          onClick={onOpenGadgets}
          className="lg:hidden p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
          title="4D Pocket Gadgets"
        >
          <Bell className="w-4 h-4 text-amber-400" />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 transition-colors"
          title="Model Brain & System Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Auth status / Google User */}
        {user ? (
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-700/70">
            <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/70 rounded-full pl-1 pr-3 py-1">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google User'}
                  className="w-6 h-6 rounded-full border border-sky-400/50"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-sky-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {(user.displayName || 'G')[0]}
                </div>
              )}
              <span className="text-xs font-medium text-slate-200 hidden sm:inline-block max-w-[100px] truncate">
                {user.displayName || 'Google User'}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/50 text-sky-300 font-semibold text-xs transition-all hover:scale-105 active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Google Login</span>
          </button>
        )}
      </div>
    </header>
  );
};
