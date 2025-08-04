import { useEffect, useState } from "preact/hooks";
import { type User } from "../utils/firebase.ts";
import { 
  subscribeToSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  toggleScheduleComplete,
  signOutUser,
  type ScheduleItem 
} from "../utils/firebase.ts";
import { parseScheduleText, parseScheduleFromImage } from "../utils/gemini.ts";
import AnimatedScheduleItem from "../components/AnimatedScheduleItem.tsx";
import AddScheduleModal from "./AddScheduleModal.tsx";
import QuickEditDialog from "./QuickEditDialog.tsx";

interface Props {
  user: User;
}

export default function TimelineScreen({ user }: Props) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [editingField, setEditingField] = useState<"title" | "date" | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSchedules(user.uid, (data) => {
      setSchedules(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const filteredSchedules = schedules.filter(s => showCompleted || !s.isCompleted);

  const handleToggleComplete = async (schedule: ScheduleItem) => {
    if (schedule.id) {
      await toggleScheduleComplete(schedule.id, !schedule.isCompleted);
    }
  };

  const handleDelete = async (schedule: ScheduleItem) => {
    if (schedule.id) {
      await deleteSchedule(schedule.id);
    }
  };

  const handleEdit = (schedule: ScheduleItem, field: "title" | "date") => {
    setEditingSchedule(schedule);
    setEditingField(field);
  };

  const handleSaveEdit = async (updates: Partial<ScheduleItem>) => {
    if (editingSchedule?.id) {
      await updateSchedule(editingSchedule.id, updates);
      setEditingSchedule(null);
      setEditingField(null);
    }
  };

  const handleAddSchedule = async (text: string, imageData?: string) => {
    try {
      const parsed = imageData 
        ? await parseScheduleFromImage(imageData)
        : await parseScheduleText(text);

      await addSchedule({
        userId: user.uid,
        title: parsed.title,
        scheduledDate: parsed.scheduledDate,
        estimatedDuration: parsed.estimatedDuration,
        originalText: parsed.originalText,
        isCompleted: false,
        isFromImage: !!imageData,
      });

      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to add schedule:", error);
      alert("スケジュールの追加に失敗しました");
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  if (loading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-gray-100">
      {/* Header */}
      <header class="bg-white shadow-sm">
        <div class="max-w-2xl mx-auto px-4 sm:px-6">
          <div class="flex items-center justify-between h-16">
            <h1 class="text-xl font-bold text-gray-900">スケジュール</h1>
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <span class="text-sm text-gray-600">完了済み</span>
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted((e.target as HTMLInputElement).checked)}
                  class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              <button
                onClick={handleSignOut}
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Schedule List */}
      <main class="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {filteredSchedules.length === 0 ? (
          <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-3 text-gray-400 text-sm">予定がありません</p>
          </div>
        ) : (
          <div class="space-y-3">
            {filteredSchedules.map((schedule) => (
              <AnimatedScheduleItem
                key={schedule.id}
                schedule={schedule}
                onToggleComplete={() => handleToggleComplete(schedule)}
                onEdit={(field) => handleEdit(schedule, field)}
                onDelete={() => handleDelete(schedule)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        class="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-xl hover:bg-blue-600 transition-all hover:shadow-2xl flex items-center justify-center"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Modals */}
      {showAddModal && (
        <AddScheduleModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSchedule}
        />
      )}

      {editingSchedule && editingField && (
        <QuickEditDialog
          schedule={editingSchedule}
          field={editingField}
          onSave={handleSaveEdit}
          onClose={() => {
            setEditingSchedule(null);
            setEditingField(null);
          }}
        />
      )}
    </div>
  );
}