
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { firebaseConfig } from './config';

export function initializeFirebase(): { app: FirebaseApp; firestore: Firestore; auth: Auth } {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const firestore = getFirestore(app);
  const auth = getAuth(app);

  if (process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
    const host = process.env.NEXT_PUBLIC_EMULATOR_HOST || 'localhost';
    connectFirestoreEmulator(firestore, host, 8080);
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
  }

  return { app, firestore, auth };
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './error-emitter';
export * from './errors';
export * from './demo-context';
export { FirebaseClientProvider } from './client-provider';
