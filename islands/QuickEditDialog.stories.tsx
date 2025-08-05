import QuickEditDialog from "./QuickEditDialog.tsx";
import { type ScheduleItem } from "../utils/firebase.ts";

export const metadata = {
  title: "QuickEditDialog",
  description: "タイトルや日時を素早く編集するダイアログ",
  category: "Components",
};

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

export const stories = [
  {
    name: "タイトル編集",
    description: "タイトルを編集するモード。autoFocusが有効。",
    render: () => (
      <QuickEditDialog
        schedule={sampleSchedule}
        field="title"
        onSave={(updates) => {
          console.log("Save title:", updates);
          alert(`タイトルを保存: ${updates.title}`);
        }}
        onClose={() => console.log("Close dialog")}
      />
    ),
  },
  {
    name: "日時編集",
    description: "日時を編集するモード。datetime-local入力を使用。",
    render: () => (
      <QuickEditDialog
        schedule={sampleSchedule}
        field="date"
        onSave={(updates) => {
          console.log("Save date:", updates);
          alert(`日時を保存: ${updates.scheduledDate}`);
        }}
        onClose={() => console.log("Close dialog")}
      />
    ),
  },
];