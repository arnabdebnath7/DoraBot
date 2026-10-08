import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';
import type { UserProfile } from '../types';

// Retrieve config from LocalStorage or Vite Env
export function getFirebaseConfig() {
  const stored = localStorage.getItem('dorabot_firebase_config');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'dorabot-ai.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'dorabot-ai',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'dorabot-ai.appspot.com',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export function initFirebase() {
  const config = getFirebaseConfig();
  if (!config.apiKey || config.apiKey.startsWith('AIzaSyDoraBotDemoKey')) {
    // Config not yet populated or in demo mode
    return null;
  }

  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    return auth;
  } catch (err) {
    console.warn('Firebase initialization skipped or failed:', err);
    return null;
  }
}

// Attempt initial init
initFirebase();

// Mock / Sandbox Storage for when Firebase credentials are not yet authorized
const MOCK_STORAGE_KEY = 'dorabot_sandbox_user';

// Reactive Auth Listener Registry
const authListeners = new Set<(user: UserProfile | null) => void>();

function notifyAuthListeners(user: UserProfile | null) {
  authListeners.forEach((listener) => {
    try {
      listener(user);
    } catch (e) {
      console.error('Error in auth listener:', e);
    }
  });
}

export function getCurrentLocalUser(): UserProfile | null {
  const mockStored = localStorage.getItem(MOCK_STORAGE_KEY);
  if (mockStored) {
    try {
      return JSON.parse(mockStored);
    } catch (e) {}
  }
  return null;
}

export async function loginWithSandboxGoogle(): Promise<UserProfile> {
  const mockUser: UserProfile = {
    uid: 'google-uid-dorabot-888',
    displayName: 'Debnath Arnab',
    email: 'debnatharnab64@gmail.com',
    photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
    providerId: 'google.com',
    isAnonymous: false,
  };
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
  notifyAuthListeners(mockUser);
  return mockUser;
}

export async function loginWithGoogle(): Promise<UserProfile> {
  const currentAuth = auth || initFirebase();

  if (currentAuth && googleProvider) {
    try {
      const res = await signInWithPopup(currentAuth, googleProvider);
      const user = res.user;
      const profile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'Google Explorer',
        email: user.email,
        photoURL: user.photoURL,
        providerId: 'google.com',
      };
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(profile));
      notifyAuthListeners(profile);
      return profile;
    } catch (err: any) {
      console.warn('Live Google Sign-In failed or was cancelled:', err);
      // Fallback if domain is unauthorized in console
      if (
        err.code === 'auth/unauthorized-domain' ||
        err.code === 'auth/api-key-not-valid' ||
        err.code === 'auth/configuration-not-found'
      ) {
        throw new Error(
          `Firebase Auth: ${err.message}. You can continue with Sandbox Google Account or update config in Settings.`
        );
      }
      throw err;
    }
  }

  // Fallback to Sandbox Google Session for offline / pre-authorization VM environment
  return loginWithSandboxGoogle();
}

export async function logoutUser(): Promise<void> {
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
  }
  localStorage.removeItem(MOCK_STORAGE_KEY);
  notifyAuthListeners(null);
}

export function subscribeAuthState(callback: (user: UserProfile | null) => void): () => void {
  authListeners.add(callback);

  // Check current local state
  const currentUser = getCurrentLocalUser();
  if (currentUser) {
    callback(currentUser);
  } else if (auth && auth.currentUser) {
    callback({
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
      providerId: 'google.com',
    });
  } else {
    callback(null);
  }

  let firebaseUnsub: (() => void) | null = null;
  if (auth) {
    firebaseUnsub = firebaseOnAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const profile: UserProfile = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          providerId: 'google.com',
        };
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(profile));
        notifyAuthListeners(profile);
      } else if (!getCurrentLocalUser()) {
        notifyAuthListeners(null);
      }
    });
  }

  return () => {
    authListeners.delete(callback);
    if (firebaseUnsub) {
      firebaseUnsub();
    }
  };
}

export function saveFirebaseCustomConfig(config: Record<string, string>) {
  localStorage.setItem('dorabot_firebase_config', JSON.stringify(config));
  // Re-init
  initFirebase();
}
