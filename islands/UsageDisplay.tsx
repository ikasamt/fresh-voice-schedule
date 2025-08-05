import { useEffect, useState } from "preact/hooks";
import { getUserUsage, calculateEstimatedCost, type UserUsage } from "../utils/usage-tracking.ts";

interface Props {
  userId: string;
}

export default function UsageDisplay({ userId }: Props) {
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadUsage = async () => {
    setLoading(true);
    try {
      console.log("Loading usage for user:", userId);
      const userUsage = await getUserUsage(userId);
      console.log("Loaded usage data:", userUsage);
      setUsage(userUsage);
    } catch (error) {
      console.error("Failed to load usage:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !usage) {
      loadUsage();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        class="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
        title="使用量を確認"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
    );
  }

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">使用量とコスト</h2>
          <button
            onClick={() => setIsOpen(false)}
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : usage ? (
          <div class="space-y-4">
            {/* 全期間の使用量 */}
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gray-700 mb-2">全期間の使用量</h3>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Gemini API呼び出し:</span>
                  <span class="font-medium">{usage.geminiApiCalls}回</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Firestore読み取り:</span>
                  <span class="font-medium">{usage.firestoreReads}回</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Firestore書き込み:</span>
                  <span class="font-medium">{usage.firestoreWrites}回</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Firestore削除:</span>
                  <span class="font-medium">{usage.firestoreDeletes}回</span>
                </div>
              </div>
            </div>

            {/* 今月の使用量 */}
            {usage.monthlyUsage && (() => {
              const currentMonth = new Date().toISOString().slice(0, 7);
              const monthData = usage.monthlyUsage[currentMonth];
              if (monthData) {
                return (
                  <div class="bg-blue-50 rounded-lg p-4">
                    <h3 class="text-sm font-semibold text-blue-700 mb-2">今月の使用量</h3>
                    <div class="space-y-1 text-sm">
                      <div class="flex justify-between">
                        <span class="text-blue-600">Gemini API:</span>
                        <span class="font-medium">{monthData.geminiApiCalls}回</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-blue-600">Firestore読み取り:</span>
                        <span class="font-medium">{monthData.firestoreReads}回</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-blue-600">Firestore書き込み:</span>
                        <span class="font-medium">{monthData.firestoreWrites}回</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* 推定コスト */}
            {(() => {
              const cost = calculateEstimatedCost(usage);
              return (
                <div class="bg-yellow-50 rounded-lg p-4">
                  <h3 class="text-sm font-semibold text-yellow-700 mb-2">推定コスト（概算）</h3>
                  <div class="space-y-1 text-sm">
                    <div class="flex justify-between">
                      <span class="text-yellow-600">Gemini API:</span>
                      <span class="font-medium">${cost.geminiCost.toFixed(4)}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-yellow-600">Firestore:</span>
                      <span class="font-medium">${cost.firestoreCost.toFixed(4)}</span>
                    </div>
                    <div class="border-t pt-1 mt-2">
                      <div class="flex justify-between font-semibold">
                        <span class="text-yellow-700">合計:</span>
                        <span>${cost.totalCost.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                  <p class="text-xs text-yellow-600 mt-2">
                    ※ 無料枠を考慮した概算です。実際の請求額はGoogle Cloudコンソールでご確認ください。
                  </p>
                </div>
              );
            })()}

            {/* 最終更新 */}
            {usage.lastUpdated && (
              <p class="text-xs text-gray-400 text-center">
                最終更新: {new Date(usage.lastUpdated).toLocaleString('ja-JP')}
              </p>
            )}
          </div>
        ) : (
          <p class="text-gray-500 text-center py-4">使用量データがありません</p>
        )}

        <div class="flex gap-2">
          <button
            onClick={loadUsage}
            class="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            更新
          </button>
          <button
            onClick={async () => {
              const { trackGeminiUsage } = await import("../utils/usage-tracking.ts");
              await trackGeminiUsage(userId);
              alert("テスト記録を追加しました");
              loadUsage();
            }}
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            テスト
          </button>
        </div>
      </div>
    </div>
  );
}