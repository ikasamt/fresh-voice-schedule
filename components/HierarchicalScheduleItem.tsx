import { useState } from "preact/hooks";
import { type ScheduleItem } from "../utils/firebase.ts";
import AnimatedScheduleItem from "./AnimatedScheduleItem.tsx";

interface Props {
  schedule: ScheduleItem;
  children: ScheduleItem[];
  allSchedules: ScheduleItem[];  // 全てのスケジュールを渡す
  showRelativeTime: boolean;
  onToggleComplete: (schedule: ScheduleItem) => void;
  onEdit: (schedule: ScheduleItem, field: "title" | "date") => void;
  onDelete: (schedule: ScheduleItem) => void;
  onAddChild: (parentId: string) => void;
  shortcutNumber?: number;
  level?: number;
}

export default function HierarchicalScheduleItem({
  schedule,
  children,
  allSchedules,
  showRelativeTime,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddChild,
  shortcutNumber,
  level = 0,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = children.length > 0;

  return (
    <div class={`${level > 0 ? 'ml-8' : ''}`}>
      <div class="relative">
        {/* 展開/折りたたみボタン */}
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            class="absolute -left-6 top-5 p-1 hover:bg-gray-100 rounded"
          >
            <svg 
              class={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* メインアイテム */}
        <div class="relative">
          <AnimatedScheduleItem
            schedule={schedule}
            showRelativeTime={showRelativeTime}
            onToggleComplete={() => onToggleComplete(schedule)}
            onEdit={(field) => onEdit(schedule, field)}
            onDelete={() => onDelete(schedule)}
            shortcutNumber={shortcutNumber}
          />
          
          {/* サブタスク追加ボタン */}
          {!schedule.isCompleted && (
            <button
              onClick={() => onAddChild(schedule.id!)}
              class="absolute -right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full opacity-0 hover:opacity-100 transition-opacity"
              title="サブタスクを追加"
            >
              <svg class="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 子タスク */}
      {hasChildren && isExpanded && (
        <div class="mt-3 relative">
          {/* 縦線 */}
          <div class="absolute left-3 top-0 bottom-0 w-px bg-gray-200"></div>
          
          {children.map((child, index) => {
            // 孫タスクを取得
            const grandChildren = allSchedules.filter(s => s.parentId === child.id);
            
            return (
              <div key={child.id} class="relative">
                {/* 横線 */}
                <div class="absolute left-3 top-5 w-4 h-px bg-gray-200"></div>
                
                <HierarchicalScheduleItem
                  schedule={child}
                  children={grandChildren}
                  allSchedules={allSchedules}
                  showRelativeTime={showRelativeTime}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddChild={onAddChild}
                  level={level + 1}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}