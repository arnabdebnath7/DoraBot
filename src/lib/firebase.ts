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

export async function loginWithGoogle(): Promise<UserProfile> {
  const currentAuth = auth || initFirebase();

  if (currentAuth && googleProvider) {
    try {
      const res = await signInWithPopup(currentAuth, googleProvider);
      const user = res.user;
      return {
        uid: user.uid,
        displayName: user.displayName || 'Google Explorer',
        email: user.email,
        photoURL: user.photoURL,
        providerId: 'google.com',
      };
    } catch (err: any) {
      console.warn('Live Google Sign-In failed or was cancelled:', err);
      // Fallback if domain is unauthorized in console
      if (err.code === 'auth/unauthorized-domain' || err.code === 'auth/api-key-not-valid' || err.code === 'auth/configuration-not-found') {
        throw new Error(`Firebase Auth Error: ${err.message}. You can switch to Demo Google Login or update config in Settings.`);
      }
      throw err;
    }
  }

  // Fallback to Demo Google Session for offline / pre-authorization VM environment
  const mockUser: UserProfile = {
    uid: 'google-uid-dorabot-888',
    displayName: 'Debnath Arnab',
    email: 'debnatharnab64@gmail.com',
    photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
    providerId: 'google.com',
    isAnonymous: false,
  };
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
  return mockUser;
}

export async function logoutUser(): Promise<void> {
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
  }
  localStorage.removeItem(MOCK_STORAGE_KEY);
}

export function subscribeAuthState(callback: (user: UserProfile | null) => void): () => void {
  // Check mock storage first
  const mockStored = localStorage.getItem(MOCK_STORAGE_KEY);
  if (mockStored) {
    try {
      const parsed = JSON.parse(mockStored);
      callback(parsed);
      return () => {};
    } catch (e) {}
  }

  if (auth) {
    return firebaseOnAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        callback({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          providerId: 'google.com',
        });
      } else {
        callback(null);
      }
    });
  }

  callback(null);
  return () => {};
}

export function saveFirebaseCustomConfig(config: Record<string, string>) {
  localStorage.setItem('dorabot_firebase_config', JSON.stringify(config));
  // Re-init
  initFirebase();
}
