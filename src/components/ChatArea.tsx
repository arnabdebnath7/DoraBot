import React, { useRef, useEffect } from 'react';
import { Bot, User, Copy, Check, Sparkles, Bell, Cpu, Zap, BookOpen, Terminal, ChevronDown } from 'lucide-react';
import type { ChatMessage, MiniDoraConfig, UserProfile } from '../types';

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  activeDora: MiniDoraConfig;
  user: UserProfile | null;
  onSelectPrompt: (prompt: string) => void;
  onOpenGadgets: () => void;
}

const FormattedContent: React.FC<{
  content: string;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}> = ({ content, onCopy, copiedId }) => {
  let thought = '';
  let mainContent = content;
  const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/i);
  if (thinkMatch) {
    thought = thinkMatch[1].trim();
    mainContent = content.replace(/<think>[\s\S]*?<\/think>/i, '').trim();
  }

  const parts: React.ReactNode[] = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(mainContent)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <div key={`text-${lastIndex}`} className="whitespace-pre-wrap break-words my-1 font-sans">
          {mainContent.slice(lastIndex, match.index)}
        </div>
      );
    }

    const lang = match[1] || 'code';
    const code = match[2];
    const codeId = `code-${match.index}`;

    parts.push(
      <div key={codeId} className="my-3 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950/90 shadow-xl">
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>{lang}</span>
          </div>
          <button
            onClick={() => onCopy(code, codeId)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
          >
            {copiedId === codeId ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-3.5 text-xs font-mono text-sky-200/90 overflow-x-auto leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < mainContent.length) {
    parts.push(
      <div key={`text-${lastIndex}`} className="whitespace-pre-wrap break-words my-1 font-sans">
        {mainContent.slice(lastIndex)}
      </div>
    );
  }

  return (
    <div>
      {thought && (
        <details className="mb-3 p-3 rounded-xl bg-slate-900/60 border border-sky-500/20 text-xs text-sky-300 group">
          <summary className="font-semibold cursor-pointer flex items-center space-x-2 select-none hover:text-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>22nd Century Cognitive Circuit Reasoning</span>
            <ChevronDown className="w-3.5 h-3.5 ml-auto transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-slate-400 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
            {thought}
          </div>
        </details>
      )}
      {parts.length > 0 ? parts : <div className="whitespace-pre-wrap break-words">{mainContent}</div>}
    </div>
  );
};

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  activeDora,
  user,
  onSelectPrompt,
  onOpenGadgets,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDoraColorBadge = (doraId?: string) => {
    switch (doraId) {
      case 'dora-red':
        return 'border-red-500/40 text-red-300 bg-red-950/40';
      case 'dora-yellow':
        return 'border-amber-500/40 text-amber-300 bg-amber-950/40';
      case 'dora-green':
        return 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40';
      default:
        return 'border-sky-500/40 text-sky-300 bg-sky-950/40';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.length === 0 ? (
        /* Empty State / Welcome Hero */
        <div className="max-w-2xl mx-auto py-10 flex flex-col items-center text-center">
          {/* Animated 3D Mascot Hero */}
          <div className="relative mb-6 cursor-pointer group" onClick={onOpenGadgets}>
            <div className="absolute inset-0 rounded-full bg-sky-500/20 blur-2xl group-hover:bg-sky-400/30 transition-all"></div>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-sky-400/70 shadow-2xl dora-glow animate-float">
              <img
                src="/assets/dorabot_mascot.jpg"
                alt="DoraBot 22nd Century Companion"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Bell Charm */}
            <div className="absolute -bottom-2 right-1/2 translate-x-1/2 px-3 py-1 rounded-full bg-amber-400 text-slate-900 font-extrabold text-xs shadow-lg flex items-center space-x-1 dora-bell-glow">
              <span>🔔 22nd Century</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-sky-200 to-white bg-clip-text text-transparent mb-2">
            Konnichiwa! I am DoraBot
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mb-8 leading-relaxed">
            Your personal robotic AI companion inspired by Doraemon. Powered by free smart model routing, 4D pocket gadgets, and four specialized Mini-Dora modes.
          </p>

          {/* Quick Starter Chips */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl text-left">
            <button
              onClick={() => onSelectPrompt('Take out the Anywhere Door and explore the latest frontier in AI agents!')}
              className="p-3 rounded-xl glass-card hover:border-sky-400/50 hover:bg-sky-500/10 transition-all text-xs group"
            >
              <div className="font-semibold text-sky-300 flex items-center space-x-1.5 mb-1">
                <span>🚪 Anywhere Door</span>
              </div>
              <p className="text-slate-400 text-[11px]">Teleport and explore novel AI agent concepts across the web</p>
            </button>

            <button
              onClick={() => onSelectPrompt('Mini-Dora Red, write a high-performance token rate limiter in TypeScript!')}
              className="p-3 rounded-xl glass-card hover:border-red-400/50 hover:bg-red-500/10 transition-all text-xs group"
            >
              <div className="font-semibold text-red-300 flex items-center space-x-1.5 mb-1">
                <span>🚀 Mini-Dora Red Turbo</span>
              </div>
              <p className="text-slate-400 text-[11px]">Fast code architecture and rock-solid debugging</p>
            </button>

            <button
              onClick={() => onSelectPrompt('Activate Memory Bread to create permanent study notes on distributed databases!')}
              className="p-3 rounded-xl glass-card hover:border-amber-400/50 hover:bg-amber-500/10 transition-all text-xs group"
            >
              <div className="font-semibold text-amber-300 flex items-center space-x-1.5 mb-1">
                <span>🍞 Memory Bread</span>
              </div>
              <p className="text-slate-400 text-[11px]">Toast key insights into memorable digestible blocks</p>
            </button>

            <button
              onClick={() => onSelectPrompt('Mini-Dora Yellow, brainstorm 5 crazy futuristic gadget ideas for 2030!')}
              className="p-3 rounded-xl glass-card hover:border-yellow-400/50 hover:bg-yellow-500/10 transition-all text-xs group"
            >
              <div className="font-semibold text-yellow-300 flex items-center space-x-1.5 mb-1">
                <span>✨ Mini-Dora Yellow Ideation</span>
              </div>
              <p className="text-slate-400 text-[11px]">Creative sparks, whimsical thinking, and storytelling</p>
            </button>
          </div>
        </div>
      ) : (
        /* Messages Thread */
        messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 max-w-4xl mx-auto ${
                isUser ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              {isUser ? (
                user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'You'}
                    className="w-8 h-8 rounded-full border border-sky-400/40 shrink-0 mt-1"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1 shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                )
              ) : (
                <div className="relative shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-sky-400 shadow-md dora-glow">
                    <img
                      src="/assets/dorabot_mascot.jpg"
                      alt="DoraBot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-[7px] text-slate-900 font-bold">
                    🔔
                  </div>
                </div>
              )}

              {/* Message Content Bubble */}
              <div className={`relative group max-w-[85%] sm:max-w-[75%]`}>
                {/* Meta details header for assistant */}
                {!isUser && (
                  <div className="flex items-center space-x-2 mb-1.5 px-1">
                    <span className="text-xs font-bold text-sky-300">DoraBot</span>
                    {msg.miniDoraId && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getDoraColorBadge(msg.miniDoraId)}`}>
                        {msg.miniDoraId.replace('dora-', 'Mini-Dora ')}
                      </span>
                    )}
                    {msg.gadgetUsed && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                        <span>🔔 {msg.gadgetUsed}</span>
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-tr-sm shadow-md'
                      : 'glass-panel border-sky-500/20 text-slate-200 rounded-tl-sm shadow-lg'
                  }`}
                >
                  <FormattedContent
                    content={msg.content}
                    onCopy={handleCopy}
                    copiedId={copiedId}
                  />
                </div>

                {/* Copy button */}
                <div
                  className={`absolute top-2 ${
                    isUser ? 'left-[-32px]' : 'right-[-32px]'
                  } opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs"
                    title="Copy text"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Loading Thinking Aura Animation */}
      {isLoading && (
        <div className="flex items-start space-x-3 max-w-4xl mx-auto">
          <div className="relative shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-sky-400 shadow-md dora-glow animate-pulse">
              <img
                src="/assets/dorabot_mascot.jpg"
                alt="DoraBot Thinking"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="glass-panel border-sky-500/30 p-4 rounded-2xl rounded-tl-sm flex items-center space-x-3 text-xs text-sky-300 shadow-lg">
            <div className="flex space-x-1">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <span>DoraBot is rummaging through the 4D Pocket for answers...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
