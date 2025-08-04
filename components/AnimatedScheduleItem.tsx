import { useState, useEffect } from "preact/hooks";
import { type ScheduleItem } from "../utils/firebase.ts";

interface Props {
  schedule: ScheduleItem;
  showRelativeTime?: boolean;
  onToggleComplete: () => void;
  onEdit: (field: "title" | "date") => void;
  onDelete: () => void;
}

export default function AnimatedScheduleItem({ 
  schedule, 
  showRelativeTime = false,
  onToggleComplete, 
  onEdit,
  onDelete
}: Props) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [, setRefresh] = useState(0);

  useEffect(() => {
    if (showRelativeTime) {
      // 残り時間表示の場合は1分ごとに更新
      const interval = setInterval(() => {
        setRefresh(prev => prev + 1);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [showRelativeTime]);

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

  const formatRelativeTime = (date: Date | null) => {
    if (!date) return { main: "未定", sub: "", isPast: false };
    
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const absDiff = Math.abs(diff);
    const isPast = diff < 0;
    
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      // 24時間以上 - 日数のみ表示
      return { 
        main: `${isPast ? '-' : ''}${days}`,
        sub: 'd',
        isPast 
      };
    } else if (hours > 0) {
      // 1時間以上 - 時間のみ表示
      return { 
        main: `${isPast ? '-' : ''}${hours}`,
        sub: 'h',
        isPast 
      };
    } else {
      // 1時間未満 - 分のみ表示
      return { 
        main: `${isPast ? '-' : ''}${minutes}`,
        sub: 'm',
        isPast 
      };
    }
  };

  const handleCheckClick = () => {
    if (schedule.isCompleted) {
      // 完了済みの場合は未完了に戻す
      onToggleComplete();
    } else {
      // 未完了の場合はグレーアウトして完了
      setIsCompleting(true);
      
      // 少し遅延してから完了フラグを立てる
      setTimeout(() => {
        onToggleComplete();
        setIsCompleting(false);
      }, 800);
    }
  };

  return (
    <div
      class={`
        relative bg-white rounded-2xl shadow-md p-5 
        transition-opacity duration-500 ease-out
        ${isOverdue && !schedule.isCompleted ? "bg-red-50" : ""}
        ${schedule.isCompleted ? "opacity-60" : ""}
        ${isCompleting ? "opacity-40" : ""}
      `}
    >
      <div class="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleCheckClick}
          class="flex-shrink-0 mt-0.5"
          disabled={isCompleting}
        >
          {(schedule.isCompleted || isCompleting) ? (
            <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          ) : (
            <div class="w-6 h-6 border-2 border-gray-300 rounded-full hover:border-blue-400 transition-colors"></div>
          )}
        </button>

        {/* Date and Time */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isCompleting) onEdit("date");
          }}
          class="flex-shrink-0 min-w-[60px]"
          disabled={isCompleting}
        >
          {showRelativeTime ? (() => {
            const relTime = formatRelativeTime(schedule.scheduledDate);
            return (
              <div class={`flex items-baseline ${relTime.isPast && !schedule.isCompleted ? "text-red-500" : schedule.isCompleted ? "text-gray-400" : "text-gray-600"}`}>
                <span class="text-xl font-bold">{relTime.main}</span>
                <span class="text-xs ml-0.5">{relTime.sub}</span>
              </div>
            );
          })() : (
            <>
              <div class={`text-sm font-medium ${isOverdue && !schedule.isCompleted ? "text-red-500" : schedule.isCompleted ? "text-gray-400" : "text-gray-600"}`}>
                {formatDate(schedule.scheduledDate)}
              </div>
              {schedule.scheduledDate && (
                <div class={`text-xs ${isOverdue && !schedule.isCompleted ? "text-red-400" : "text-gray-400"} mt-1`}>
                  {formatTime(schedule.scheduledDate)}
                </div>
              )}
            </>
          )}
        </button>

        {/* Content */}
        <div class="flex-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isCompleting) onEdit("title");
            }}
            class="text-left w-full"
            disabled={isCompleting}
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

        {/* Delete button for completed items */}
        {schedule.isCompleted && !isCompleting && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`「${schedule.title}」を削除しますか？`)) {
                onDelete();
              }
            }}
            class="flex-shrink-0 p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}