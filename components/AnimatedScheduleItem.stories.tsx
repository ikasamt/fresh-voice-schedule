import AnimatedScheduleItem from "./AnimatedScheduleItem.tsx";
import { type ScheduleItem } from "../utils/firebase.ts";

export const metadata = {
  title: "AnimatedScheduleItem",
  description: "スケジュール項目を表示するメインコンポーネント",
  category: "Components",
};

const baseSchedule: ScheduleItem = {
  id: "1",
  userId: "sample",
  title: "サンプルの予定",
  scheduledDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
  estimatedDuration: 60,
  isCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  originalText: "3時間後に会議",
};

export const stories = [
  {
    name: "通常表示",
    description: "通常の予定表示。チェックボックスをクリックで完了。",
    render: (props: any) => (
      <AnimatedScheduleItem
        schedule={baseSchedule}
        showRelativeTime={true}
        onToggleComplete={() => console.log("Toggle complete")}
        onEdit={(field) => console.log("Edit", field)}
        onDelete={() => console.log("Delete")}
        {...props}
      />
    ),
  },
  {
    name: "完了済み",
    description: "完了済みの予定。グレーアウト表示で、ゴミ箱アイコンが表示される。",
    render: (props: any) => (
      <AnimatedScheduleItem
        schedule={{ ...baseSchedule, isCompleted: true }}
        showRelativeTime={true}
        onToggleComplete={() => console.log("Toggle complete")}
        onEdit={(field) => console.log("Edit", field)}
        onDelete={() => console.log("Delete")}
        {...props}
      />
    ),
  },
  {
    name: "日時未定",
    description: "日時が設定されていない予定。「未定」と表示される。",
    render: (props: any) => (
      <AnimatedScheduleItem
        schedule={{ ...baseSchedule, scheduledDate: null }}
        showRelativeTime={true}
        onToggleComplete={() => console.log("Toggle complete")}
        onEdit={(field) => console.log("Edit", field)}
        onDelete={() => console.log("Delete")}
        {...props}
      />
    ),
  },
  {
    name: "場所付き",
    description: "場所情報がある予定。地図アイコンが表示される。",
    render: (props: any) => (
      <AnimatedScheduleItem
        schedule={{ ...baseSchedule, location: "東京駅" }}
        showRelativeTime={true}
        onToggleComplete={() => console.log("Toggle complete")}
        onEdit={(field) => console.log("Edit", field)}
        onDelete={() => console.log("Delete")}
        {...props}
      />
    ),
  },
  {
    name: "相対時刻表示",
    description: "残り時間を「3時間」のように表示",
    render: (props: any) => (
      <AnimatedScheduleItem
        schedule={baseSchedule}
        showRelativeTime={true}
        onToggleComplete={() => console.log("Toggle complete")}
        onEdit={(field) => console.log("Edit", field)}
        onDelete={() => console.log("Delete")}
        {...props}
      />
    ),
  },
  {
    name: "絶対時刻表示",
    description: "実際の時刻を「15:30」のように表示",
    render: (props: any) => (
      <AnimatedScheduleItem
        schedule={baseSchedule}
        showRelativeTime={false}
        onToggleComplete={() => console.log("Toggle complete")}
        onEdit={(field) => console.log("Edit", field)}
        onDelete={() => console.log("Delete")}
        {...props}
      />
    ),
  },
];