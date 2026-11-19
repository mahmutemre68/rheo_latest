/**
 * ═══════════════════════════════════════════════
 *  RHEO DASHBOARD — FIREBASE CONFIGURATION
 * ═══════════════════════════════════════════════
 *
 *  Firebase SDK entegrasyonu. Auth + Firestore.
 *
 *  KURULUM:
 *  1. npm install firebase
 *  2. Firebase Console'dan config değerlerini al
 *  3. .env.local dosyasına NEXT_PUBLIC_FIREBASE_* değişkenlerini ekle
 *
 *  ÖNEMLİ: USE_MOCK = true iken Firebase SDK yüklenmez.
 *  Bu sayede demo modunda Firebase bağımlılığı gerekmez.
 */

import { USE_MOCK } from "@/lib/api";

/* ── Firebase Config ── */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "rheo-mvp-2026",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

/* ── Lazy Initialization ── */

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;

/**
 * Firebase App'i lazy-load eder.
 * USE_MOCK = true iken null döner (SDK yüklenmez).
 */
export async function getFirebaseApp() {
  if (USE_MOCK) return null;

  if (!firebaseApp) {
    const { initializeApp } = await import("firebase/app");
    firebaseApp = initializeApp(firebaseConfig);
  }
  return firebaseApp;
}

/**
 * Firebase Auth instance'ını döner.
 */
export async function getAuth() {
  if (USE_MOCK) return null;

  if (!firebaseAuth) {
    const app = await getFirebaseApp();
    const { getAuth: initAuth } = await import("firebase/auth");
    firebaseAuth = initAuth(app);
  }
  return firebaseAuth;
}

/**
 * Firestore instance'ını döner.
 */
export async function getDb() {
  if (USE_MOCK) return null;

  if (!firebaseDb) {
    const app = await getFirebaseApp();
    const { getFirestore } = await import("firebase/firestore");
    firebaseDb = getFirestore(app);
  }
  return firebaseDb;
}

/* ── Auth Operations ── */

/**
 * Email/password ile giriş yapar.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export async function firebaseSignIn(email, password) {
  const auth = await getAuth();
  if (!auth) throw new Error("Firebase Auth is not initialized (mock mode)");

  const { signInWithEmailAndPassword } = await import("firebase/auth");
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Google ile giriş yapar.
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export async function firebaseSignInWithGoogle() {
  const auth = await getAuth();
  if (!auth) throw new Error("Firebase Auth is not initialized (mock mode)");

  const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

/**
 * Çıkış yapar.
 */
export async function firebaseSignOut() {
  const auth = await getAuth();
  if (!auth) return;

  const { signOut } = await import("firebase/auth");
  return signOut(auth);
}

/**
 * Auth state değişikliklerini dinler.
 * @param {(user: import("firebase/auth").User | null) => void} callback
 * @returns {() => void} unsubscribe fonksiyonu
 */
export async function onAuthStateChange(callback) {
  const auth = await getAuth();
  if (!auth) {
    // Mock mode: callback immediately with null
    callback(null);
    return () => {};
  }

  const { onAuthStateChanged } = await import("firebase/auth");
  return onAuthStateChanged(auth, callback);
}

/* ── Firestore Operations ── */

/**
 * Firestore'dan öğretmen profilini okur.
 * @param {string} uid
 */
export async function getTeacherDoc(uid) {
  const db = await getDb();
  if (!db) return null;

  const { doc, getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, "teachers", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Bir sınıfın öğrenci listesini okur.
 * @param {string} classId
 */
export async function getStudentsByClass(classId) {
  const db = await getDb();
  if (!db) return [];

  const { collection, query, where, getDocs } = await import("firebase/firestore");
  const q = query(collection(db, "students"), where("classId", "==", classId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Öğrenci ilerleme verilerini okur.
 * @param {string} studentId
 */
export async function getStudentProgress(studentId) {
  const db = await getDb();
  if (!db) return [];

  const { collection, getDocs } = await import("firebase/firestore");
  const snap = await getDocs(collection(db, "students", studentId, "progress"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
