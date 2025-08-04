import { type ScheduleItem } from "../utils/firebase.ts";

interface Props {
  schedule: ScheduleItem;
  onToggleComplete: () => void;
  onEdit: (field: "title" | "date") => void;
  onDelete: () => void;
}

export default function ScheduleItemComponent({ 
  schedule, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}: Props) {
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

  return (
    <div
      class={`
        bg-white rounded-xl shadow-sm border p-4 
        transition-all hover:shadow-md
        ${isOverdue ? "bg-red-50 border-red-200" : "border-gray-200"}
        ${schedule.isCompleted ? "opacity-70 bg-gray-50" : ""}
      `}
    >
      <div class="flex items-center gap-4">
        {/* Checkbox */}
        <button
          onClick={onToggleComplete}
          class="flex-shrink-0"
        >
          {schedule.isCompleted ? (
            <svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          ) : (
            <div class="w-6 h-6 border-2 border-gray-300 rounded hover:border-gray-400"></div>
          )}
        </button>

        {/* Date */}
        <button
          onClick={() => onEdit("date")}
          class="flex-shrink-0 text-center min-w-[60px] hover:bg-gray-100 rounded px-2 py-1"
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
            onClick={() => onEdit("title")}
            class="text-left hover:bg-gray-100 rounded px-2 py-1 w-full"
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

        {/* Delete */}
        <button
          onClick={onDelete}
          class="flex-shrink-0 text-red-400 hover:text-red-600 p-2"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}