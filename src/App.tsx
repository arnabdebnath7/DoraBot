import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ChatInput } from './components/ChatInput';
import { GadgetModal } from './components/GadgetModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { subscribeAuthState, logoutUser } from './lib/firebase';
import type {
  MiniDoraConfig,
  MiniDoraId,
  ChatMessage,
  ChatSession,
  ModelOption,
  UserProfile,
  SystemHealth,
} from './types';

const MINI_DORAS: MiniDoraConfig[] = [
  {
    id: 'dora-classic',
    name: 'DoraBot Prime',
    japanese: 'ドラえもん',
    color: '#0284c7',
    bgGradient: 'from-sky-500 to-sky-700',
    borderColor: 'border-sky-400',
    badge: '22nd Century General Companion',
    description: 'Empathetic, resourceful robotic cat companion with full access to the 4D pocket.',
    avatarIcon: 'Cpu',
  },
  {
    id: 'dora-red',
    name: 'Mini-Dora Red',
    japanese: 'ミニドラ 赤',
    color: '#ef4444',
    bgGradient: 'from-red-500 to-red-700',
    borderColor: 'border-red-400',
    badge: 'Code Architect & Execution Turbo',
    description: 'Specialized in rapid software architecture, bug-hunting, and clean code generation.',
    avatarIcon: 'Zap',
  },
  {
    id: 'dora-yellow',
    name: 'Mini-Dora Yellow',
    japanese: 'ミニドラ 黄',
    color: '#f59e0b',
    bgGradient: 'from-amber-400 to-amber-600',
    borderColor: 'border-amber-400',
    badge: 'Creative Ideation & Sparks',
    description: 'Specialized in brainstorming, imaginative prompts, UX/UI creativity, and storytelling.',
    avatarIcon: 'Sparkles',
  },
  {
    id: 'dora-green',
    name: 'Mini-Dora Green',
    japanese: 'ミニドラ 緑',
    color: '#10b981',
    bgGradient: 'from-emerald-500 to-emerald-700',
    borderColor: 'border-emerald-400',
    badge: 'Deep Knowledge & Analyst',
    description: 'Meticulous research synthesizer, document analyst, and structured fact-finder.',
    avatarIcon: 'BookOpen',
  },
];

const DEFAULT_SESSION_ID = 'session-welcome';

export function App() {
  const [activeDoraId, setActiveDoraId] = useState<MiniDoraId>('dora-classic');
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('dorabot_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: DEFAULT_SESSION_ID,
        title: 'Welcome to DoraBot',
        createdAt: new Date().toISOString(),
        miniDoraId: 'dora-classic',
        messages: [],
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(DEFAULT_SESSION_ID);
  const [models, setModels] = useState<ModelOption[]>([
    { id: 'openrouter/free', name: 'OpenRouter Free (Auto-Routing Pool)', provider: 'OpenRouter', context: '128k', recommended: true },
    { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', name: 'Nvidia Nemotron 30B Reasoning (Free)', provider: 'Nvidia', context: '32k' },
    { id: 'google/gemma-4-31b-it:free', name: 'Google Gemma 4 31B (Free)', provider: 'Google', context: '32k' },
    { id: 'nvidia/nemotron-3.5-lightning:free', name: 'Nvidia Nemotron 3.5 Lightning (Free)', provider: 'Nvidia', context: '64k' },
  ]);
  const [selectedModel, setSelectedModel] = useState<string>('openrouter/free');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);

  const [isGadgetsOpen, setIsGadgetsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync sessions to localStorage
  useEffect(() => {
    localStorage.setItem('dorabot_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Auth subscription
  useEffect(() => {
    const unsubscribe = subscribeAuthState((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Fetch health & models from backend
  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/system/health');
      if (res.ok) {
        const data = await res.json();
        setSystemHealth(data);
      }
    } catch (e) {}
  };

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/models');
      if (res.ok) {
        const data = await res.json();
        if (data.models?.length) {
          setModels(data.models);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchHealth();
    fetchModels();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const activeDora = MINI_DORAS.find((d) => d.id === activeDoraId) || MINI_DORAS[0];
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const handleNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      miniDoraId: activeDoraId,
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (id: string) => {
    if (sessions.length <= 1) {
      handleNewSession();
    }
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
      }
    }
  };

  const handleSendMessage = async (content: string, gadgetId?: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...(activeSession?.messages || []), userMsg];

    // Update session title on first message
    const updatedTitle =
      activeSession?.messages.length === 0
        ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
        : activeSession.title;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, title: updatedTitle, messages: updatedMessages }
          : s
      )
    );

    setIsLoading(true);

    try {
      let reply = '';
      if (gadgetId) {
        // Execute via 4D Gadget API
        const res = await fetch('/api/gadgets/use', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gadgetId, input: content }),
        });
        const data = await res.json();
        reply = data.result || 'Gadget activated successfully!';
      } else {
        // Execute via Chat API
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.content,
            })),
            model: selectedModel,
            miniDoraId: activeDoraId,
          }),
        });
        const data = await res.json();
        reply = data.reply || "DoraBot's bell rang! Received empty response.";
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        miniDoraId: activeDoraId,
        gadgetUsed: gadgetId,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, messages: [...s.messages, botMsg] }
            : s
        )
      );
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: `*Ding-dong!* ⚠️ Pocket alert: ${err.message || 'Network error'}. Please try again!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, messages: [...s.messages, errorMsg] }
            : s
        )
      );
    } finally {
      setIsLoading(false);
      fetchHealth();
    }
  };

  const handleExecuteGadget = (gadgetId: string, input: string) => {
    handleSendMessage(input, gadgetId);
  };

  const handleTriggerCleanup = async () => {
    try {
      const res = await fetch('/api/system/cleanup', { method: 'POST' });
      if (res.ok) {
        await fetchHealth();
      }
    } catch (e) {}
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#080d1a] text-slate-100">
      {/* Top Header */}
      <Header
        activeDora={activeDora}
        user={user}
        systemHealth={systemHealth}
        onOpenGadgets={() => setIsGadgetsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          miniDoras={MINI_DORAS}
          activeDoraId={activeDoraId}
          onSelectDora={(id) => setActiveDoraId(id)}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={(id) => setActiveSessionId(id)}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          onSelectGadget={(gId) => {
            setIsGadgetsOpen(true);
          }}
          systemHealth={systemHealth}
          onTriggerCleanup={handleTriggerCleanup}
        />

        {/* Center / Right Chat View */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#080d1a] via-[#091124] to-[#070b16]">
          <ChatArea
            messages={activeSession?.messages || []}
            isLoading={isLoading}
            activeDora={activeDora}
            user={user}
            onSelectPrompt={(prompt) => handleSendMessage(prompt)}
            onOpenGadgets={() => setIsGadgetsOpen(true)}
          />

          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            activeDora={activeDora}
            selectedModel={selectedModel}
            onOpenGadgets={() => setIsGadgetsOpen(true)}
          />
        </main>
      </div>

      {/* Modals */}
      <GadgetModal
        isOpen={isGadgetsOpen}
        onClose={() => setIsGadgetsOpen(false)}
        onExecuteGadget={handleExecuteGadget}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        models={models}
        selectedModel={selectedModel}
        onSelectModel={(mId) => setSelectedModel(mId)}
        systemHealth={systemHealth}
        onTriggerCleanup={handleTriggerCleanup}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />
    </div>
  );
}

export default App;
