declare module 'firebase/app' {
  export interface FirebaseApp { name: string; options: Record<string, any>; automaticDataCollectionEnabled: boolean; }
  export interface FirebaseOptions { apiKey?: string; authDomain?: string; projectId?: string; storageBucket?: string; messagingSenderId?: string; appId?: string; measurementId?: string; }
  export function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
  export function getApp(name?: string): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export class FirebaseError extends Error { code: string; customData?: Record<string, unknown>; constructor(code: string, message: string, customData?: Record<string, unknown>); }
}

declare module 'firebase/auth' {
  import { FirebaseApp } from 'firebase/app';
  export interface Auth { app: FirebaseApp; name: string; }
  export interface User { uid: string; email: string | null; displayName: string | null; photoURL: string | null; phoneNumber: string | null; }
  export interface UserCredential { user: User; }
  export function getAuth(app?: FirebaseApp): Auth;
  export function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function onAuthStateChanged(auth: Auth, nextOrObserver: (user: User | null) => void): () => void;
  export function connectAuthEmulator(auth: Auth, url: string, options?: { disableWarnings?: boolean }): void;
}

declare module 'firebase/firestore' {
  import { FirebaseApp } from 'firebase/app';
  export interface Firestore { app: FirebaseApp; type: 'firestore'; }
  export interface DocumentData { [field: string]: any; }
  export interface DocumentReference<T = DocumentData> { id: string; path: string; }
  export interface CollectionReference<T = DocumentData> { id: string; path: string; }
  export interface Query<T = DocumentData> { }
  export interface SnapshotOptions { }
  export interface DocumentSnapshot<T = DocumentData> { exists(): boolean; data(options?: SnapshotOptions): T | undefined; id: string; }
  export interface QuerySnapshot<T = DocumentData> { docs: QueryDocumentSnapshot<T>[]; forEach(cb: (doc: QueryDocumentSnapshot<T>) => void): void; }
  export interface QueryDocumentSnapshot<T = DocumentData> extends DocumentSnapshot<T> { data(options?: SnapshotOptions): T; }
  export function getFirestore(app?: FirebaseApp): Firestore;
  export function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference<DocumentData>;
  export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference<DocumentData>;
  export function doc<T = DocumentData>(ref: CollectionReference<T>, path?: string): DocumentReference<T>;
  export function getDoc<T = DocumentData>(ref: DocumentReference<T>): Promise<DocumentSnapshot<T>>;
  export function setDoc<T = DocumentData>(ref: DocumentReference<T>, data: T): Promise<void>;
  export function addDoc<T = DocumentData>(ref: CollectionReference<T>, data: T): Promise<DocumentReference<T>>;
  export function updateDoc<T = DocumentData>(ref: DocumentReference<T>, data: Partial<T>): Promise<void>;
  export function query<T = DocumentData>(ref: CollectionReference<T>, ...constraints: any[]): Query<T>;
  export function where(fieldPath: string, opStr: string, value: any): any;
  export function onSnapshot<T = DocumentData>(ref: DocumentReference<T>, onNext: (snapshot: DocumentSnapshot<T>) => void, onError?: (error: Error) => void): () => void;
  export function onSnapshot<T = DocumentData>(query: Query<T>, onNext: (snapshot: QuerySnapshot<T>) => void, onError?: (error: Error) => void): () => void;
  export function serverTimestamp(): any;
  export function connectFirestoreEmulator(firestore: Firestore, host: string, port: number): void;
  export { Timestamp, FieldValue } from '@firebase/firestore';
}
