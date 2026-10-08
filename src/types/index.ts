export type MiniDoraId = 'dora-classic' | 'dora-red' | 'dora-yellow' | 'dora-green';

export interface MiniDoraConfig {
  id: MiniDoraId;
  name: string;
  japanese: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  badge: string;
  description: string;
  avatarIcon: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  miniDoraId?: MiniDoraId;
  gadgetUsed?: string;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  miniDoraId: MiniDoraId;
  messages: ChatMessage[];
}

export interface GadgetItem {
  id: string;
  name: string;
  japanese: string;
  icon: string;
  description: string;
  instruction: string;
  color: string;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  context: string;
  recommended?: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerId: string;
  isAnonymous?: boolean;
}

export interface SystemHealth {
  status: string;
  appName: string;
  version: string;
  era: string;
  omnirouteBridge: {
    url: string;
    connected: boolean;
  };
  disk: {
    usedMB: number;
    availableMB: number;
    usagePercent: string;
    safeThresholdMB: number;
    isUnderSafeThreshold: boolean;
  };
  defaultModel: string;
  timestamp: string;
}
