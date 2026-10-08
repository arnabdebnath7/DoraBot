import React, { useState } from 'react';
import {
  X,
  DoorOpen,
  Wind,
  Brain,
  Languages,
  Clock,
  Minimize2,
  Sparkles,
  Zap,
  Check,
} from 'lucide-react';
import type { GadgetItem } from '../types';

interface GadgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteGadget: (gadgetId: string, input: string) => void;
}

const GADGET_ITEMS: (GadgetItem & { borderClass: string; iconBg: string })[] = [
  {
    id: 'anywhere-door',
    name: 'Anywhere Door',
    japanese: 'どこでもドア',
    icon: 'DoorOpen',
    description: 'Instant concept teleportation across disparate web domains and technical frameworks.',
    instruction: 'Teleport anywhere and cross-reference information across concepts.',
    color: '#ec4899',
    borderClass: 'border-pink-500/30 hover:border-pink-400 hover:bg-pink-950/20',
    iconBg: 'bg-pink-500/20 text-pink-400',
  },
  {
    id: 'bamboo-copter',
    name: 'Bamboo Copter',
    japanese: 'タケコプター',
    icon: 'Wind',
    description: 'Fly up to 30,000 feet for a high-altitude strategic overview & executive synthesis.',
    instruction: 'High-altitude strategic analysis.',
    color: '#f59e0b',
    borderClass: 'border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/20',
    iconBg: 'bg-amber-500/20 text-amber-400',
  },
  {
    id: 'memory-bread',
    name: 'Memory Bread',
    japanese: 'アンキパン',
    icon: 'Brain',
    description: 'Toast essential notes, equations, and facts into permanent digestible memory blocks.',
    instruction: 'Turn complex notes into indelible memory flashcards.',
    color: '#0ea5e9',
    borderClass: 'border-sky-500/30 hover:border-sky-400 hover:bg-sky-950/20',
    iconBg: 'bg-sky-500/20 text-sky-400',
  },
  {
    id: 'translation-gummy',
    name: 'Translation Gummy',
    japanese: 'ほんやくコンニャク',
    icon: 'Languages',
    description: 'Universal polyglot conversion: translate any natural language or simplify dense jargon.',
    instruction: 'Universal language and jargon translation.',
    color: '#10b981',
    borderClass: 'border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/20',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    id: 'time-machine',
    name: 'Time Machine',
    japanese: 'タイムマシン',
    icon: 'Clock',
    description: 'Chronological timeline extrapolation: historical origins, present state, and future outlook.',
    instruction: 'Temporal analysis of events and technology.',
    color: '#8b5cf6',
    borderClass: 'border-purple-500/30 hover:border-purple-400 hover:bg-purple-950/20',
    iconBg: 'bg-purple-500/20 text-purple-400',
  },
  {
    id: 'small-light',
    name: 'Small Light',
    japanese: 'スモールライト',
    icon: 'Minimize2',
    description: 'Shrink verbose code or lengthy documents down by 80% to their pure crystal essence.',
    instruction: 'Compress and distill texts or code down to minimal essentials.',
    color: '#eab308',
    borderClass: 'border-yellow-500/30 hover:border-yellow-400 hover:bg-yellow-950/20',
    iconBg: 'bg-yellow-500/20 text-yellow-400',
  },
];

export const GadgetModal: React.FC<GadgetModalProps> = ({
  isOpen,
  onClose,
  onExecuteGadget,
}) => {
  const [selectedGadgetId, setSelectedGadgetId] = useState<string>('anywhere-door');
  const [customInput, setCustomInput] = useState<string>('');

  if (!isOpen) return null;

  const activeGadget = GADGET_ITEMS.find((g) => g.id === selectedGadgetId) || GADGET_ITEMS[0];

  const handleLaunch = () => {
    onExecuteGadget(activeGadget.id, customInput.trim() || `Activate ${activeGadget.name}!`);
    setCustomInput('');
    onClose();
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'DoorOpen':
        return <DoorOpen className="w-6 h-6" />;
      case 'Wind':
        return <Wind className="w-6 h-6" />;
      case 'Brain':
        return <Brain className="w-6 h-6" />;
      case 'Languages':
        return <Languages className="w-6 h-6" />;
      case 'Clock':
        return <Clock className="w-6 h-6" />;
      case 'Minimize2':
        return <Minimize2 className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl glass-panel rounded-2xl border border-sky-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-sky-500/20 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-lg shadow-sm dora-bell-glow">
              🔔
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-100 flex items-center space-x-2">
                <span>Doraemon 4D Pocket Gadgets</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  四次元ポケット
                </span>
              </h3>
              <p className="text-xs text-slate-400">Select any 22nd-century tool to supercharge your queries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Gadget Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {GADGET_ITEMS.map((g) => {
              const isSelected = g.id === selectedGadgetId;
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGadgetId(g.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 shadow-md shadow-sky-500/20 scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${g.iconBg}`}>
                      {renderIcon(g.icon)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-200">{g.name}</h4>
                      <span className="text-[10px] text-slate-400">{g.japanese}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {g.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action form for selected gadget */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/20 space-y-3">
            <div className="flex items-center space-x-2 text-sm font-semibold text-sky-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Configure & Launch: {activeGadget.name} ({activeGadget.japanese})</span>
            </div>
            <p className="text-xs text-slate-400">{activeGadget.description}</p>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder={`Enter the text or prompt you want ${activeGadget.name} to process...`}
              rows={3}
              className="w-full rounded-lg bg-slate-950/80 border border-slate-700 p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-sky-500/20 flex items-center justify-between bg-slate-950/50">
          <span className="text-xs text-slate-500">Autonomous 22nd Century Engine</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleLaunch}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white shadow-md shadow-sky-500/20 flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Take Out & Activate Gadget</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
