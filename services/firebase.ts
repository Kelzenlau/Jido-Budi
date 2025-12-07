import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Handle dynamic injection from hosting environments or fallback to env vars
const getFirebaseConfig = () => {
  if (typeof (window as any).__firebase_config !== 'undefined') {
    return JSON.parse((window as any).__firebase_config);
  }
  // Fallback placeholder to prevent crashes if not configured, though functionality will fail.
  return {
    apiKey: "placeholder",
    authDomain: "placeholder",
    projectId: "placeholder",
    storageBucket: "placeholder",
    messagingSenderId: "placeholder",
    appId: "placeholder"
  };
};

const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = (window as any).__app_id || 'jido-budi-app';

export const hashPassword = async (string: string) => {
    const msgBuffer = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};