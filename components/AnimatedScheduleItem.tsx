import { useState, useEffect } from "preact/hooks";
import { type ScheduleItem } from "../utils/firebase.ts";

interface Props {
  schedule: ScheduleItem;
  onToggleComplete: () => void;
  onEdit: (field: "title" | "date") => void;
  onDelete: () => void;
}

export default function AnimatedScheduleItem({ 
  schedule, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const now = new Date();
  const isOverdue = schedule.scheduledDate && 
    schedule.scheduledDate < now && 
    !schedule.isCompleted;

  const formatDate = (date: Date | null) => {
    if (!date) return "未定";
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleCheckClick = () => {
    if (schedule.isCompleted) {
      // 完了済みの場合は未完了に戻す
      onToggleComplete();
    } else {
      // 未完了の場合は完了にしてから削除アニメーション
      onToggleComplete();
      setIsDeleting(true);
      
      // アニメーション後に削除
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onDelete();
        }, 300);
      }, 1500); // 1.5秒後に消え始める
    }
  };

  useEffect(() => {
    if (isDeleting) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isDeleting]);

  return (
    <div
      class={`
        relative bg-white rounded-2xl shadow-md p-5 
        transition-all duration-300 ease-out
        ${isOverdue && !schedule.isCompleted ? "bg-red-50" : ""}
        ${schedule.isCompleted && !isDeleting ? "opacity-60" : ""}
        ${isDeleting ? "opacity-60 scale-95" : ""}
        ${!isVisible ? "opacity-0 scale-90 h-0 overflow-hidden" : ""}
      `}
    >
      <div class="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleCheckClick}
          class="flex-shrink-0 mt-0.5"
        >
          <div class="relative">
            {schedule.isCompleted || isDeleting ? (
              <div class="relative">
                <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {isDeleting && (
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-6 h-6 border-2 border-blue-500 rounded-full animate-ping"></div>
                  </div>
                )}
              </div>
            ) : (
              <div class="w-6 h-6 border-2 border-gray-300 rounded-full hover:border-blue-400 transition-colors"></div>
            )}
          </div>
        </button>

        {/* Date and Time */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit("date");
          }}
          class="flex-shrink-0"
        >
          <div class={`text-sm font-medium ${isOverdue && !schedule.isCompleted ? "text-red-500" : schedule.isCompleted ? "text-gray-400" : "text-gray-600"}`}>
            {formatDate(schedule.scheduledDate)}
          </div>
          {schedule.scheduledDate && (
            <div class={`text-xs ${isOverdue && !schedule.isCompleted ? "text-red-400" : "text-gray-400"} mt-1`}>
              {formatTime(schedule.scheduledDate)}
            </div>
          )}
        </button>

        {/* Content */}
        <div class="flex-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit("title");
            }}
            class="text-left w-full"
          >
            <div class={`text-base ${schedule.isCompleted ? "line-through text-gray-400" : "text-gray-900"}`}>
              {schedule.title}
            </div>
          </button>
          {schedule.estimatedDuration && (
            <div class="flex items-center gap-1 mt-2 text-xs text-gray-400">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{schedule.estimatedDuration}分</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete animation overlay */}
      {isDeleting && (
        <div class="absolute inset-0 bg-white bg-opacity-50 rounded-2xl flex items-center justify-center">
          <div class="text-blue-500 font-medium animate-pulse">完了しました</div>
        </div>
      )}
    </div>
  );
}