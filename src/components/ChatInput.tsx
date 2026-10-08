import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, Bell, ArrowUp, Loader2, Volume2 } from 'lucide-react';
import type { MiniDoraConfig, GadgetItem } from '../types';

interface ChatInputProps {
  onSendMessage: (content: string, gadgetId?: string) => void;
  isLoading: boolean;
  activeDora: MiniDoraConfig;
  selectedModel: string;
  onOpenGadgets: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  activeDora,
  selectedModel,
  onOpenGadgets,
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeGadget, setActiveGadget] = useState<string | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Voice Recognition (Web Speech API)
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported on this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim(), activeGadget);
    setInput('');
    setActiveGadget(undefined);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  return (
    <div className="p-4 glass-panel border-t border-sky-500/20 shrink-0">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Quick Gadget Selectors */}
        <div className="flex items-center justify-between text-xs overflow-x-auto pb-1 gap-2 no-scrollbar">
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Bell className="w-3 h-3 text-amber-400" />
              <span>Pocket:</span>
            </span>

            <button
              onClick={() => setActiveGadget(activeGadget === 'anywhere-door' ? undefined : 'anywhere-door')}
              className={`px-2 py-0.5 rounded-full border text-[11px] transition-all flex items-center space-x-1 ${
                activeGadget === 'anywhere-door'
                  ? 'bg-pink-500/20 border-pink-400 text-pink-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🚪 Anywhere Door</span>
            </button>

            <button
              onClick={() => setActiveGadget(activeGadget === 'bamboo-copter' ? undefined : 'bamboo-copter')}
              className={`px-2 py-0.5 rounded-full border text-[11px] transition-all flex items-center space-x-1 ${
                activeGadget === 'bamboo-copter'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🚁 Bamboo Copter</span>
            </button>

            <button
              onClick={() => setActiveGadget(activeGadget === 'memory-bread' ? undefined : 'memory-bread')}
              className={`px-2 py-0.5 rounded-full border text-[11px] transition-all flex items-center space-x-1 ${
                activeGadget === 'memory-bread'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🍞 Memory Bread</span>
            </button>

            <button
              onClick={() => setActiveGadget(activeGadget === 'translation-gummy' ? undefined : 'translation-gummy')}
              className={`px-2 py-0.5 rounded-full border text-[11px] transition-all flex items-center space-x-1 ${
                activeGadget === 'translation-gummy'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🍬 Translation Gummy</span>
            </button>
          </div>

          <button
            onClick={onOpenGadgets}
            className="text-[11px] text-sky-400 hover:text-sky-300 shrink-0 font-medium"
          >
            All 6 Gadgets →
          </button>
        </div>

        {/* Input Box with 21st.dev Glow & Voice Waveform */}
        <div className="relative rounded-2xl glass-input p-2 shadow-xl border border-sky-500/20 focus-within:border-sky-400/60 transition-all">
          {/* Active Voice Waveform Bar with 21st.dev Audio Visualizer */}
          {isListening && (
            <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-sky-950/70 rounded-xl border border-sky-400/40 text-sky-300 text-xs shadow-lg shadow-sky-500/20">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-sky-400 animate-bounce" />
                <span className="font-medium">Listening to your voice... Speak clearly!</span>
              </div>
              <div className="flex items-center space-x-1 h-6">
                <span className="w-1 h-3 bg-sky-400 rounded-full animate-pulse"></span>
                <span className="w-1 h-5 bg-amber-400 rounded-full animate-pulse [animation-delay:0.1s]"></span>
                <span className="w-1 h-2 bg-sky-300 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                <span className="w-1 h-6 bg-red-400 rounded-full animate-pulse [animation-delay:0.3s]"></span>
                <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.15s]"></span>
                <span className="w-1 h-3 bg-sky-400 rounded-full animate-pulse [animation-delay:0.25s]"></span>
              </div>
            </div>
          )}

          <div className="flex items-end space-x-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={
                activeGadget
                  ? `Using ${activeGadget}... Enter your question or topic!`
                  : `Message ${activeDora.name}... (Press Enter to send, Shift+Enter for newline)`
              }
              rows={1}
              className="flex-1 bg-transparent border-0 text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none max-h-36 py-2 px-2"
            />

            {/* Voice Mic Button */}
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-500/30 border border-red-500 text-red-300 animate-pulse'
                  : 'text-slate-400 hover:text-sky-300 hover:bg-slate-800'
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-xl transition-all ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white shadow-lg shadow-sky-500/30 scale-100'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed scale-95'
              }`}
              title="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1 text-slate-400">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Model Brain:</span>
              <strong className="text-sky-300 font-mono">{selectedModel}</strong>
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Free Smart Routing Active</span>
          </div>
          <div>
            <span>DoraBot 22nd Century Core</span>
          </div>
        </div>
      </div>
    </div>
  );
};
