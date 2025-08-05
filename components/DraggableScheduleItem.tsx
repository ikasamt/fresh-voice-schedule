import { useState } from "preact/hooks";
import { type ScheduleItem } from "../utils/firebase.ts";
import AnimatedScheduleItem from "./AnimatedScheduleItem.tsx";

interface Props {
  schedule: ScheduleItem;
  children: ScheduleItem[];
  allSchedules: ScheduleItem[];
  showRelativeTime: boolean;
  onToggleComplete: (schedule: ScheduleItem) => void;
  onEdit: (schedule: ScheduleItem, field: "title" | "date") => void;
  onDelete: (schedule: ScheduleItem) => void;
  onAddChild: (parentId: string) => void;
  onMove: (scheduleId: string, newParentId: string | null, position?: "before" | "after" | "child") => void;
  shortcutNumber?: number;
  level?: number;
}

type DropPosition = "before" | "after" | "child" | null;

export default function DraggableScheduleItem({
  schedule,
  children,
  allSchedules,
  showRelativeTime,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddChild,
  onMove,
  shortcutNumber,
  level = 0,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dropPosition, setDropPosition] = useState<DropPosition>(null);
  const hasChildren = children.length > 0;

  const handleDragStart = (e: DragEvent) => {
    if (schedule.isCompleted) return;
    
    setIsDragging(true);
    e.dataTransfer!.effectAllowed = "move";
    e.dataTransfer!.setData("scheduleId", schedule.id!);
  };

  const handleDragEnd = (e: DragEvent) => {
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    // 上部1/3: 前に挿入
    if (y < height / 3) {
      setDropPosition("before");
    }
    // 中央1/3: 子として追加
    else if (y < (height * 2) / 3) {
      setDropPosition("child");
    }
    // 下部1/3: 後に挿入
    else {
      setDropPosition("after");
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    // 子要素へのleaveイベントを無視
    if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as HTMLElement)) {
      return;
    }
    setDropPosition(null);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedId = e.dataTransfer!.getData("scheduleId");
    if (draggedId === schedule.id) {
      setDropPosition(null);
      return;
    }

    if (dropPosition === "child") {
      onMove(draggedId, schedule.id!);
    } else if (dropPosition === "before" || dropPosition === "after") {
      onMove(draggedId, schedule.parentId || null, dropPosition);
    }
    
    setDropPosition(null);
  };

  return (
    <div class={`${level > 0 ? 'ml-8' : ''}`}>
      <div 
        class="relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* ドロップインジケーター */}
        {dropPosition === "before" && (
          <div class="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></div>
        )}
        {dropPosition === "after" && (
          <div class="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></div>
        )}
        
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
        <div class={`
          relative transition-all duration-200
          ${dropPosition === "child" ? "ring-2 ring-blue-400 rounded-2xl" : ""}
        `}>
          <AnimatedScheduleItem
            schedule={schedule}
            showRelativeTime={showRelativeTime}
            onToggleComplete={() => onToggleComplete(schedule)}
            onEdit={(field) => onEdit(schedule, field)}
            onDelete={() => onDelete(schedule)}
            shortcutNumber={shortcutNumber}
            isDragging={isDragging}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
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
            const grandChildren = allSchedules.filter(s => s.parentId === child.id);
            
            return (
              <div key={child.id} class="relative">
                {/* 横線 */}
                <div class="absolute left-3 top-5 w-4 h-px bg-gray-200"></div>
                
                <DraggableScheduleItem
                  schedule={child}
                  children={grandChildren}
                  allSchedules={allSchedules}
                  showRelativeTime={showRelativeTime}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddChild={onAddChild}
                  onMove={onMove}
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