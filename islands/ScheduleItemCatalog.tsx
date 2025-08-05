import AnimatedScheduleItem from "../components/AnimatedScheduleItem.tsx";
import { type ScheduleItem } from "../utils/firebase.ts";

export default function ScheduleItemCatalog() {
  const sampleSchedules: ScheduleItem[] = [
    {
      id: "1",
      userId: "sample",
      title: "通常の予定",
      scheduledDate: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3時間後
      estimatedDuration: 60,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      originalText: "3時間後に会議",
    },
    {
      id: "2",
      userId: "sample",
      title: "完了済みの予定",
      scheduledDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2時間前
      estimatedDuration: 30,
      isCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      originalText: "完了したタスク",
    },
    {
      id: "3",
      userId: "sample",
      title: "日時未定の予定",
      scheduledDate: null,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      originalText: "いつかやるタスク",
    },
    {
      id: "4",
      userId: "sample",
      title: "場所付きの予定",
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 明日
      estimatedDuration: 120,
      location: "東京駅",
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      originalText: "明日東京駅で打ち合わせ",
    },
  ];

  return (
    <div class="space-y-12">
      {/* 通常表示 */}
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">通常表示</h2>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="max-w-2xl mx-auto space-y-3">
            <AnimatedScheduleItem
              schedule={sampleSchedules[0]}
              showRelativeTime={true}
              onToggleComplete={() => console.log("Toggle complete")}
              onEdit={(field) => console.log("Edit", field)}
              onDelete={() => console.log("Delete")}
            />
          </div>
          <p class="text-sm text-gray-600 mt-4">通常の予定表示。チェックボックスをクリックで完了。</p>
        </div>
      </section>

      {/* 完了済み */}
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">完了済み表示</h2>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="max-w-2xl mx-auto space-y-3">
            <AnimatedScheduleItem
              schedule={sampleSchedules[1]}
              showRelativeTime={true}
              onToggleComplete={() => console.log("Toggle complete")}
              onEdit={(field) => console.log("Edit", field)}
              onDelete={() => console.log("Delete")}
            />
          </div>
          <p class="text-sm text-gray-600 mt-4">完了済みの予定。グレーアウト表示で、ゴミ箱アイコンが表示される。</p>
        </div>
      </section>

      {/* 日時未定 */}
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">日時未定</h2>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="max-w-2xl mx-auto space-y-3">
            <AnimatedScheduleItem
              schedule={sampleSchedules[2]}
              showRelativeTime={true}
              onToggleComplete={() => console.log("Toggle complete")}
              onEdit={(field) => console.log("Edit", field)}
              onDelete={() => console.log("Delete")}
            />
          </div>
          <p class="text-sm text-gray-600 mt-4">日時が設定されていない予定。「未定」と表示される。</p>
        </div>
      </section>

      {/* 場所付き */}
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">場所付き</h2>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="max-w-2xl mx-auto space-y-3">
            <AnimatedScheduleItem
              schedule={sampleSchedules[3]}
              showRelativeTime={true}
              onToggleComplete={() => console.log("Toggle complete")}
              onEdit={(field) => console.log("Edit", field)}
              onDelete={() => console.log("Delete")}
            />
          </div>
          <p class="text-sm text-gray-600 mt-4">場所情報がある予定。地図アイコンが表示される。</p>
        </div>
      </section>

      {/* 時刻表示切り替え */}
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">時刻表示の切り替え</h2>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="max-w-2xl mx-auto space-y-6">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">相対時刻表示（デフォルト）</h3>
              <AnimatedScheduleItem
                schedule={sampleSchedules[0]}
                showRelativeTime={true}
                onToggleComplete={() => console.log("Toggle complete")}
                onEdit={(field) => console.log("Edit", field)}
                onDelete={() => console.log("Delete")}
              />
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">絶対時刻表示</h3>
              <AnimatedScheduleItem
                schedule={sampleSchedules[0]}
                showRelativeTime={false}
                onToggleComplete={() => console.log("Toggle complete")}
                onEdit={(field) => console.log("Edit", field)}
                onDelete={() => console.log("Delete")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* インタラクション */}
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">インタラクション</h2>
        <div class="bg-white rounded-lg shadow p-6">
          <ul class="space-y-2 text-sm text-gray-600">
            <li>• チェックボックスクリック: フェードアウトアニメーション後に完了</li>
            <li>• タイトルクリック: タイトル編集ダイアログ表示</li>
            <li>• 日時クリック: 日時編集ダイアログ表示</li>
            <li>• ゴミ箱アイコン: 完了済みアイテムの削除（完了済みのみ表示）</li>
            <li>• 地図アイコン: Google Mapへのリンク（場所情報がある場合のみ）</li>
          </ul>
        </div>
      </section>
    </div>
  );
}