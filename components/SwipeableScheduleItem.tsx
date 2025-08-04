import { useRef, useState, useEffect } from "preact/hooks";
import { type ScheduleItem } from "../utils/firebase.ts";

interface Props {
  schedule: ScheduleItem;
  onToggleComplete: () => void;
  onEdit: (field: "title" | "date") => void;
  onDelete: () => void;
}

export default function SwipeableScheduleItem({ 
  schedule, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}: Props) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping) return;
    
    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);
    const diff = currentX - touchStart;
    
    // Prevent vertical scroll if horizontal swipe is detected
    if (Math.abs(diff) > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Limit swipe distance
    const maxSwipe = window.innerWidth * 0.4;
    let limitedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    
    // Only allow left swipe (delete) for completed items
    if (!schedule.isCompleted && limitedDiff < 0) {
      limitedDiff = 0;
    }
    
    setTranslateX(limitedDiff);
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    
    const swipeDistance = touchEnd - touchStart;
    const threshold = window.innerWidth * 0.2; // 20% of screen width

    if (swipeDistance > threshold) {
      // Swipe right - toggle complete
      onToggleComplete();
    } else if (swipeDistance < -threshold && schedule.isCompleted) {
      // Swipe left - delete (only for completed items)
      if (confirm(`「${schedule.title}」を削除しますか？`)) {
        onDelete();
      }
    }

    // Reset
    setTranslateX(0);
    setIsSwiping(false);
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Mouse events for desktop
  const handleMouseDown = (e: MouseEvent) => {
    setTouchStart(e.clientX);
    setIsSwiping(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isSwiping) return;
    setTouchEnd(e.clientX);
    const diff = e.clientX - touchStart;
    
    const maxSwipe = window.innerWidth * 0.4;
    let limitedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    
    // Only allow left swipe (delete) for completed items
    if (!schedule.isCompleted && limitedDiff < 0) {
      limitedDiff = 0;
    }
    
    setTranslateX(limitedDiff);
  };

  const handleMouseUp = () => {
    if (!isSwiping) return;
    
    const swipeDistance = touchEnd - touchStart;
    const threshold = window.innerWidth * 0.2;

    if (swipeDistance > threshold) {
      onToggleComplete();
    } else if (swipeDistance < -threshold && schedule.isCompleted) {
      if (confirm(`「${schedule.title}」を削除しますか？`)) {
        onDelete();
      }
    }

    setTranslateX(0);
    setIsSwiping(false);
    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Touch events with passive: false for touchmove to prevent pull-to-refresh
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Mouse events
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSwiping, touchStart, touchEnd]);

  // Calculate background opacity based on swipe distance
  const leftOpacity = Math.max(0, Math.min(1, translateX / 100));
  const rightOpacity = Math.max(0, Math.min(1, -translateX / 100));

  return (
    <div class="relative overflow-hidden rounded-xl mb-2">
      {/* Left background (Complete/Uncomplete) */}
      <div 
        class="absolute inset-0 bg-blue-500 flex items-center justify-start px-6 rounded-2xl"
        style={{ opacity: leftOpacity }}
      >
        <div class="flex items-center gap-2 text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {schedule.isCompleted ? (
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 11l3 3L22 4" />
            ) : (
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            )}
          </svg>
          <span class="font-medium">
            {schedule.isCompleted ? "未完了" : "完了"}
          </span>
        </div>
      </div>

      {/* Right background (Delete) - Only show for completed items */}
      {schedule.isCompleted && (
        <div 
          class="absolute inset-0 bg-red-500 flex items-center justify-end px-6 rounded-2xl"
          style={{ opacity: rightOpacity }}
        >
          <div class="flex items-center gap-2 text-white">
            <span class="font-medium">削除</span>
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        ref={containerRef}
        class={`
          relative bg-white rounded-2xl shadow-md p-5 
          transition-transform cursor-grab active:cursor-grabbing
          ${isOverdue ? "bg-red-50" : ""}
          ${schedule.isCompleted ? "opacity-60" : ""}
        `}
        style={{ 
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.2s ease-out',
          touchAction: 'pan-y',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        <div class="flex items-start gap-4 pointer-events-none select-none">
          {/* Date and Time */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit("date");
            }}
            class="flex-shrink-0 pointer-events-auto"
          >
            <div class={`text-sm font-medium ${isOverdue ? "text-red-500" : schedule.isCompleted ? "text-gray-400" : "text-gray-600"}`}>
              {formatDate(schedule.scheduledDate)}
            </div>
            {schedule.scheduledDate && (
              <div class={`text-xs ${isOverdue ? "text-red-400" : "text-gray-400"} mt-1`}>
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
              class="text-left w-full pointer-events-auto"
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
      </div>
    </div>
  );
}