import { useState } from "preact/hooks";
import QuickEditDialog from "./QuickEditDialog.tsx";
import { type ScheduleItem } from "../utils/firebase.ts";

export default function EditDialogCatalog() {
  const [showTitleDialog, setShowTitleDialog] = useState(false);
  const [showDateDialog, setShowDateDialog] = useState(false);

  const sampleSchedule: ScheduleItem = {
    id: "sample",
    userId: "sample",
    title: "サンプルの予定",
    scheduledDate: new Date(),
    estimatedDuration: 60,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    originalText: "サンプルの予定",
  };

  return (
    <>
      <div class="flex gap-3">
        <button
          onClick={() => setShowTitleDialog(true)}
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          タイトル編集を表示
        </button>
        <button
          onClick={() => setShowDateDialog(true)}
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          日時編集を表示
        </button>
      </div>

      {showTitleDialog && (
        <QuickEditDialog
          schedule={sampleSchedule}
          field="title"
          onSave={(updates) => {
            console.log("Save:", updates);
            alert(`タイトルを保存: ${updates.title}`);
            setShowTitleDialog(false);
          }}
          onClose={() => setShowTitleDialog(false)}
        />
      )}

      {showDateDialog && (
        <QuickEditDialog
          schedule={sampleSchedule}
          field="date"
          onSave={(updates) => {
            console.log("Save:", updates);
            alert(`日時を保存: ${updates.scheduledDate}`);
            setShowDateDialog(false);
          }}
          onClose={() => setShowDateDialog(false)}
        />
      )}
    </>
  );
}