import React, { useState } from 'react';
import {
  X,
  Cpu,
  HardDrive,
  ShieldCheck,
  RefreshCw,
  Key,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import type { ModelOption, SystemHealth } from '../types';
import { getFirebaseConfig, saveFirebaseCustomConfig } from '../lib/firebase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: ModelOption[];
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  systemHealth: SystemHealth | null;
  onTriggerCleanup: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  models,
  selectedModel,
  onSelectModel,
  systemHealth,
  onTriggerCleanup,
}) => {
  const [activeTab, setActiveTab] = useState<'model' | 'system' | 'firebase'>('model');
  const [firebaseConfig, setFirebaseConfig] = useState(getFirebaseConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    saveFirebaseCustomConfig(firebaseConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const diskUsed = systemHealth?.disk.usedMB || 1900;
  const diskPercent = Math.min(100, Math.round((diskUsed / 4800) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel rounded-2xl border border-sky-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-sky-500/20 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <Cpu className="w-5 h-5 text-sky-400" />
            <h3 className="font-extrabold text-base text-slate-100">
              DoraBot Core Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 flex space-x-2 border-b border-slate-800 bg-slate-950/30">
          <button
            onClick={() => setActiveTab('model')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'model'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Model Brain
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'system'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            System & Storage
          </button>
          <button
            onClick={() => setActiveTab('firebase')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'firebase'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Firebase Google Auth
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'model' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Active Model Engine</h4>
                  <p className="text-xs text-slate-400">
                    Connected via OmniRoute Bridge & OpenRouter High-Speed Gateway
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Free Tier Unlimited
                </span>
              </div>

              <div className="space-y-2 pt-2">
                {models.map((m) => {
                  const isSelected = m.id === selectedModel;
                  return (
                    <div
                      key={m.id}
                      onClick={() => onSelectModel(m.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-sky-500/20 border-sky-400 shadow-md shadow-sky-500/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-200">{m.name}</span>
                          {m.recommended && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/30 text-sky-300 border border-sky-400/40">
                              Recommended
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {m.provider} • Context: {m.context}
                        </span>
                      </div>
                      <div className="w-4 h-4 rounded-full border border-sky-400 flex items-center justify-center">
                        {isSelected && <div className="w-2 h-2 rounded-full bg-sky-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-slate-200">/home Disk Monitor</span>
                  </div>
                  <span className="text-xs font-mono text-sky-300">
                    {diskUsed}MB / 4800MB ({diskPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-300"
                    style={{ width: `${diskPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The autonomous disk watchdog monitors disk usage every 20 seconds. Heavy modules are safely offloaded to the 31GB overlay to keep /home strictly below the 4.0GB threshold.
                </p>
                <button
                  onClick={onTriggerCleanup}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Execute Cache Cleanup</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>OmniRoute Antigravity Bridge Proxy</span>
                </div>
                <p className="text-slate-400">
                  Local bridge active on <code className="text-sky-300 font-mono">http://127.0.0.1:20129</code> with OpenRouter failover routing.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'firebase' && (
            <form onSubmit={handleSaveFirebase} className="space-y-3">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <p className="font-semibold">Firebase Google Auth Credentials</p>
                  <p className="text-[11px] text-amber-300/80">
                    If you configure or authorize your Firebase DoraBot project tomorrow in the Firebase Console, paste your keys here to activate live Google OAuth sign-in!
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">API Key (apiKey)</label>
                  <input
                    type="text"
                    value={firebaseConfig.apiKey}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono focus:border-sky-400 focus:outline-none"
                    placeholder="AIzaSy..."
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Auth Domain (authDomain)</label>
                  <input
                    type="text"
                    value={firebaseConfig.authDomain}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono focus:border-sky-400 focus:outline-none"
                    placeholder="dorabot-ai.firebaseapp.com"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Project ID (projectId)</label>
                  <input
                    type="text"
                    value={firebaseConfig.projectId}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono focus:border-sky-400 focus:outline-none"
                    placeholder="dorabot-ai"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">App ID (appId)</label>
                  <input
                    type="text"
                    value={firebaseConfig.appId}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, appId: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono focus:border-sky-400 focus:outline-none"
                    placeholder="1:109283746501:web:9a8b7c6d5e4f3a2b1c0d"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {savedSuccess ? (
                  <span className="text-xs text-emerald-400 flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Configuration saved!</span>
                  </span>
                ) : <span />}
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20"
                >
                  Save Firebase Keys
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-sky-500/20 flex items-center justify-end bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
