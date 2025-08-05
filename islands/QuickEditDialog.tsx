import { useState, useEffect } from "preact/hooks";
import { type ScheduleItem } from "../utils/firebase.ts";

interface Props {
  schedule: ScheduleItem;
  field?: "title" | "date";
  onSave: (updates: Partial<ScheduleItem>) => void;
  onClose: () => void;
}

export default function QuickEditDialog({ schedule, field, onSave, onClose }: Props) {
  const [title, setTitle] = useState(schedule.title);
  const [date, setDate] = useState(
    schedule.scheduledDate 
      ? formatDateTimeLocal(schedule.scheduledDate)
      : ""
  );
  const [location, setLocation] = useState(schedule.location || "");
  const [duration, setDuration] = useState(schedule.estimatedDuration?.toString() || "");
  const [isCompleted, setIsCompleted] = useState(schedule.isCompleted);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const handleSave = () => {
    const updates: Partial<ScheduleItem> = {};
    
    // タイトルの更新
    if (title.trim() !== schedule.title) {
      updates.title = title.trim();
    }
    
    // 日時の更新
    if (date && (!schedule.scheduledDate || new Date(date).getTime() !== schedule.scheduledDate.getTime())) {
      updates.scheduledDate = new Date(date);
    } else if (!date && schedule.scheduledDate) {
      updates.scheduledDate = null;
    }
    
    // 場所の更新
    if (location !== (schedule.location || "")) {
      updates.location = location || null;
    }
    
    // 所要時間の更新
    const durationNum = duration ? parseInt(duration) : null;
    if (durationNum !== schedule.estimatedDuration) {
      updates.estimatedDuration = durationNum;
    }
    
    // 完了状態の更新
    if (isCompleted !== schedule.isCompleted) {
      updates.isCompleted = isCompleted;
    }
    
    // 変更がある場合のみ保存
    if (Object.keys(updates).length > 0) {
      onSave(updates);
    } else {
      onClose();
    }
  };

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold text-gray-800 mb-4">
          予定を編集
        </h2>

        <div class="space-y-4">
          {/* タイトル */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              タイトル <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus={field === "title"}
            />
          </div>

          {/* 日時 */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              日時
            </label>
            <input
              type="datetime-local"
              value={date}
              onInput={(e) => setDate((e.target as HTMLInputElement).value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus={field === "date"}
            />
            <p class="text-xs text-gray-500 mt-1">空欄の場合は「未定」になります</p>
          </div>

          {/* 場所 */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              場所
            </label>
            <input
              type="text"
              value={location}
              onInput={(e) => setLocation((e.target as HTMLInputElement).value)}
              placeholder="例: 東京駅、会議室A"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 所要時間 */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              所要時間（分）
            </label>
            <input
              type="number"
              value={duration}
              onInput={(e) => setDuration((e.target as HTMLInputElement).value)}
              placeholder="例: 60"
              min="0"
              step="15"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 完了状態 */}
          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => setIsCompleted((e.target as HTMLInputElement).checked)}
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span class="text-sm font-medium text-gray-700">完了済み</span>
            </label>
          </div>

          {/* 元のテキスト（読み取り専用） */}
          {schedule.originalText && (
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                元のテキスト
              </label>
              <div class="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                {schedule.originalText}
              </div>
            </div>
          )}

          {/* 作成日時・更新日時 */}
          <div class="text-xs text-gray-500 space-y-1">
            {schedule.createdAt && (
              <div>作成: {schedule.createdAt.toLocaleString("ja-JP")}</div>
            )}
            {schedule.updatedAt && (
              <div>更新: {schedule.updatedAt.toLocaleString("ja-JP")}</div>
            )}
          </div>

          {/* Buttons */}
          <div class="flex gap-3 pt-2">
            <button
              onClick={onClose}
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              class={`flex-1 px-4 py-2 rounded-lg text-white font-medium
                ${title.trim() 
                  ? "bg-indigo-600 hover:bg-indigo-700" 
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}