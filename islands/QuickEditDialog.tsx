import { useState, useEffect } from "preact/hooks";
import { type ScheduleItem } from "../utils/firebase.ts";

interface Props {
  schedule: ScheduleItem;
  field: "title" | "date";
  onSave: (updates: Partial<ScheduleItem>) => void;
  onClose: () => void;
}

export default function QuickEditDialog({ schedule, field, onSave, onClose }: Props) {
  const [title, setTitle] = useState(schedule.title);
  const [date, setDate] = useState(
    schedule.scheduledDate 
      ? formatDateTimeLocal(schedule.scheduledDate)
      : formatDateTimeLocal(new Date())
  );

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
    if (field === "title") {
      onSave({ title: title.trim() });
    } else {
      onSave({ scheduledDate: new Date(date) });
    }
  };

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">
          {field === "title" ? "タイトルを編集" : "日時を編集"}
        </h2>

        <div class="space-y-4">
          {field === "title" ? (
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                タイトル
              </label>
              <input
                type="text"
                value={title}
                onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>
          ) : (
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                日時
              </label>
              <input
                type="datetime-local"
                value={date}
                onInput={(e) => setDate((e.target as HTMLInputElement).value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Preview */}
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="text-sm text-gray-600 mb-1">プレビュー</div>
            <div class="font-semibold text-gray-800">
              {field === "title" ? title || "(未入力)" : schedule.title}
            </div>
            <div class="text-sm text-gray-600">
              {field === "date" 
                ? new Date(date).toLocaleString("ja-JP")
                : schedule.scheduledDate?.toLocaleString("ja-JP") || "日時未定"
              }
            </div>
          </div>

          {/* Buttons */}
          <div class="flex gap-3">
            <button
              onClick={onClose}
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}