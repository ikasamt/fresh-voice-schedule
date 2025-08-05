// Firebase SDK for Web
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { trackFirestoreUsage } from "./usage-tracking.ts";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  type QuerySnapshot,
  type DocumentData
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase設定 (Web用の正しいAPIキー)
const firebaseConfig = {
  apiKey: "AIzaSyC4Xkh6-H3kAvFzmD9zXscuwVaP0-ZWeXw",
  authDomain: "calendar-832d5.firebaseapp.com",
  projectId: "calendar-832d5",
  storageBucket: "calendar-832d5.firebasestorage.app",
  messagingSenderId: "246085994092",
  appId: "1:246085994092:web:437e54126ec9e2f8553a49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google sign in error:", error);
    return null;
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Firestore functions
export interface ScheduleItem {
  id?: string;
  userId: string;
  title: string;
  scheduledDate: Date | null;
  estimatedDuration: number | null;
  location?: string | null;
  originalText: string;
  isCompleted: boolean;
  isFromImage?: boolean;
  parentId?: string | null;  // 親タスクのID
  hasChildren?: boolean;      // 子タスクを持っているかのフラグ（パフォーマンス最適化用）
  createdAt?: Date;
  updatedAt?: Date;
}

export function subscribeToSchedules(
  userId: string, 
  callback: (schedules: ScheduleItem[]) => void
) {
  const q = query(
    collection(db, "schedules"),
    where("userId", "==", userId),
    orderBy("scheduledDate", "asc")
  );

  return onSnapshot(q, async (snapshot: QuerySnapshot<DocumentData>) => {
    const schedules = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      scheduledDate: doc.data().scheduledDate?.toDate() || null,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as ScheduleItem[];
    
    // 読み取り操作を記録（ドキュメント数分）
    // TODO: サーバーサイドで実装する必要がある
    // if (snapshot.docs.length > 0) {
    //   await trackFirestoreUsage(userId, 'read', snapshot.docs.length);
    // }
    
    callback(schedules);
  });
}

export async function addSchedule(schedule: Omit<ScheduleItem, "id" | "createdAt" | "updatedAt">) {
  const result = await addDoc(collection(db, "schedules"), {
    ...schedule,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  // 書き込み操作を記録
  // TODO: サーバーサイドで実装する必要がある
  // await trackFirestoreUsage(schedule.userId, 'write');
  
  return result;
}

export async function updateSchedule(id: string, updates: Partial<ScheduleItem>) {
  return await updateDoc(doc(db, "schedules", id), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSchedule(id: string) {
  return await deleteDoc(doc(db, "schedules", id));
}

export async function toggleScheduleComplete(id: string, isCompleted: boolean) {
  return await updateDoc(doc(db, "schedules", id), {
    isCompleted,
    updatedAt: serverTimestamp(),
  });
}