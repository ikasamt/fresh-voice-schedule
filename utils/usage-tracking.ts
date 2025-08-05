import { db } from "./firebase.ts";
import { 
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export interface UserUsage {
  userId: string;
  geminiApiCalls: number;
  firestoreReads: number;
  firestoreWrites: number;
  firestoreDeletes: number;
  lastUpdated: Date;
  // 月別の使用量
  monthlyUsage?: {
    [yearMonth: string]: {
      geminiApiCalls: number;
      firestoreReads: number;
      firestoreWrites: number;
      firestoreDeletes: number;
    }
  }
}

// 現在の年月を取得（YYYY-MM形式）
function getCurrentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Gemini API使用を記録
export async function trackGeminiUsage(userId: string) {
  const userUsageRef = doc(db, "user_usage", userId);
  const yearMonth = getCurrentYearMonth();
  
  try {
    await updateDoc(userUsageRef, {
      geminiApiCalls: increment(1),
      [`monthlyUsage.${yearMonth}.geminiApiCalls`]: increment(1),
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    // ドキュメントが存在しない場合は作成
    await setDoc(userUsageRef, {
      userId,
      geminiApiCalls: 1,
      firestoreReads: 0,
      firestoreWrites: 0,
      firestoreDeletes: 0,
      monthlyUsage: {
        [yearMonth]: {
          geminiApiCalls: 1,
          firestoreReads: 0,
          firestoreWrites: 0,
          firestoreDeletes: 0
        }
      },
      lastUpdated: serverTimestamp()
    });
  }
}

// Firestore操作を記録
export async function trackFirestoreUsage(
  userId: string, 
  operation: 'read' | 'write' | 'delete',
  count: number = 1
) {
  const userUsageRef = doc(db, "user_usage", userId);
  const yearMonth = getCurrentYearMonth();
  
  const updates: any = {
    lastUpdated: serverTimestamp()
  };
  
  switch (operation) {
    case 'read':
      updates.firestoreReads = increment(count);
      updates[`monthlyUsage.${yearMonth}.firestoreReads`] = increment(count);
      break;
    case 'write':
      updates.firestoreWrites = increment(count);
      updates[`monthlyUsage.${yearMonth}.firestoreWrites`] = increment(count);
      break;
    case 'delete':
      updates.firestoreDeletes = increment(count);
      updates[`monthlyUsage.${yearMonth}.firestoreDeletes`] = increment(count);
      break;
  }
  
  try {
    await updateDoc(userUsageRef, updates);
  } catch (error) {
    // ドキュメントが存在しない場合は初期化
    const initialData: UserUsage = {
      userId,
      geminiApiCalls: 0,
      firestoreReads: operation === 'read' ? count : 0,
      firestoreWrites: operation === 'write' ? count : 0,
      firestoreDeletes: operation === 'delete' ? count : 0,
      lastUpdated: new Date(),
      monthlyUsage: {
        [yearMonth]: {
          geminiApiCalls: 0,
          firestoreReads: operation === 'read' ? count : 0,
          firestoreWrites: operation === 'write' ? count : 0,
          firestoreDeletes: operation === 'delete' ? count : 0
        }
      }
    };
    await setDoc(userUsageRef, initialData);
  }
}

// ユーザーの使用量を取得
export async function getUserUsage(userId: string): Promise<UserUsage | null> {
  const userUsageRef = doc(db, "user_usage", userId);
  const docSnap = await getDoc(userUsageRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      ...data,
      lastUpdated: data.lastUpdated?.toDate()
    } as UserUsage;
  }
  
  return null;
}

// 推定コストを計算（概算）
export function calculateEstimatedCost(usage: UserUsage): {
  geminiCost: number;
  firestoreCost: number;
  totalCost: number;
} {
  // Gemini 1.5 Flash: $0.075 per 1M input tokens, $0.30 per 1M output tokens
  // 1リクエスト平均500トークンと仮定
  const geminiCostPerCall = 0.000001; // 非常に概算
  
  // Firestore料金（無料枠を超えた場合）
  // 読み取り: $0.06 per 100,000
  // 書き込み: $0.18 per 100,000
  // 削除: $0.02 per 100,000
  const firestoreReadCost = Math.max(0, usage.firestoreReads - 50000) * 0.0000006;
  const firestoreWriteCost = Math.max(0, usage.firestoreWrites - 20000) * 0.0000018;
  const firestoreDeleteCost = Math.max(0, usage.firestoreDeletes - 20000) * 0.0000002;
  
  const geminiCost = usage.geminiApiCalls * geminiCostPerCall;
  const firestoreCost = firestoreReadCost + firestoreWriteCost + firestoreDeleteCost;
  
  return {
    geminiCost,
    firestoreCost,
    totalCost: geminiCost + firestoreCost
  };
}