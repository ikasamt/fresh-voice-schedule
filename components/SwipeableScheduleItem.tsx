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
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}/${day}`;
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
    const limitedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    setTranslateX(limitedDiff);
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    
    const swipeDistance = touchEnd - touchStart;
    const threshold = window.innerWidth * 0.2; // 20% of screen width

    if (swipeDistance > threshold) {
      // Swipe right - toggle complete
      onToggleComplete();
    } else if (swipeDistance < -threshold) {
      // Swipe left - delete
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
    const limitedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    setTranslateX(limitedDiff);
  };

  const handleMouseUp = () => {
    if (!isSwiping) return;
    
    const swipeDistance = touchEnd - touchStart;
    const threshold = window.innerWidth * 0.2;

    if (swipeDistance > threshold) {
      onToggleComplete();
    } else if (swipeDistance < -threshold) {
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
        class="absolute inset-0 bg-green-500 flex items-center justify-start px-6"
        style={{ opacity: leftOpacity }}
      >
        <div class="flex items-center gap-2 text-white">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            {schedule.isCompleted ? (
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            ) : (
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            )}
          </svg>
          <span class="font-medium text-lg">
            {schedule.isCompleted ? "未完了に戻す" : "完了"}
          </span>
        </div>
      </div>

      {/* Right background (Delete) */}
      <div 
        class="absolute inset-0 bg-red-500 flex items-center justify-end px-6"
        style={{ opacity: rightOpacity }}
      >
        <div class="flex items-center gap-2 text-white">
          <span class="font-medium text-lg">削除</span>
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div
        ref={containerRef}
        class={`
          relative bg-white rounded-xl shadow-sm border p-4 
          transition-transform cursor-grab active:cursor-grabbing
          ${isOverdue ? "bg-red-50 border-red-200" : "border-gray-200"}
          ${schedule.isCompleted ? "opacity-70 bg-gray-50" : ""}
        `}
        style={{ 
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.2s ease-out',
          touchAction: 'pan-y',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        <div class="flex items-center gap-4 pointer-events-none select-none">
          {/* Date */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit("date");
            }}
            class="flex-shrink-0 text-center min-w-[60px] hover:bg-gray-100 rounded px-2 py-1 pointer-events-auto"
          >
            <div class={`text-sm font-semibold ${isOverdue ? "text-red-500" : schedule.isCompleted ? "text-gray-400" : "text-gray-700"}`}>
              {formatDate(schedule.scheduledDate)}
            </div>
            {schedule.scheduledDate && (
              <div class={`text-xs ${isOverdue ? "text-red-400" : "text-gray-500"}`}>
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
              class="text-left hover:bg-gray-100 rounded px-2 py-1 w-full pointer-events-auto"
            >
              <div class={`${schedule.isCompleted ? "line-through text-gray-400" : "text-gray-800"}`}>
                {schedule.title}
              </div>
            </button>
            {schedule.estimatedDuration && (
              <div class="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{schedule.estimatedDuration}分</span>
              </div>
            )}
          </div>

          {/* Swipe indicator */}
          <div class="flex-shrink-0 text-gray-300">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}