import React, { useState } from 'react';
import { X, ShieldCheck, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';
import { loginWithGoogle } from '../lib/firebase';
import type { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginWithGoogle();
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Google login error:', err);
      setErrorMsg(err.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-sky-500/30 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-sky-500/20 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-sky-400 dora-glow">
              <img
                src="/assets/dorabot_mascot.jpg"
                alt="DoraBot Mascot"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-extrabold text-base text-slate-100">
              DoraBot Google Sign-In
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-center">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-100">Welcome to DoraBot!</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign in with your Google account via Firebase to save conversation histories, personalized 4D pocket memories, and unlock all Mini-Dora modes.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-left">
              {errorMsg}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {/* Google G Logo SVG */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure Firebase Authentication • Project DoraBot</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-sky-500/20 flex items-center justify-end bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
