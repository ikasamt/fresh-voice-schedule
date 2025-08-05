import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

interface CatalogItem {
  name: string;
  description: string;
  path: string;
  category: "forms" | "display" | "navigation" | "feedback";
}

const catalogItems: CatalogItem[] = [
  {
    name: "AnimatedScheduleItem",
    description: "スケジュール項目の表示コンポーネント（アニメーション付き）",
    path: "/catalog/schedule-item",
    category: "display",
  },
  {
    name: "AddScheduleModal",
    description: "新しい予定を追加するモーダル",
    path: "/catalog/add-modal",
    category: "forms",
  },
  {
    name: "QuickEditDialog",
    description: "タイトルや日時を編集するダイアログ",
    path: "/catalog/edit-dialog",
    category: "forms",
  },
  {
    name: "Buttons",
    description: "各種ボタンコンポーネント（FAB、トグル、アイコン）",
    path: "/catalog/buttons",
    category: "navigation",
  },
  {
    name: "Time Display",
    description: "時刻表示コンポーネント（絶対時刻/相対時刻）",
    path: "/catalog/time-display",
    category: "display",
  },
];

export default function CatalogIndex() {
  const categories = {
    forms: "フォーム",
    display: "表示",
    navigation: "ナビゲーション",
    feedback: "フィードバック",
  };

  return (
    <>
      <Head>
        <title>UI Catalog - Voice Schedule</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <div class="min-h-screen bg-gray-100">
        <header class="bg-white shadow-sm">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="flex items-center justify-between h-16">
              <div class="flex items-center gap-3">
                <a href="/" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </a>
                <h1 class="text-xl font-bold text-gray-900">UI Catalog</h1>
              </div>
            </div>
          </div>
        </header>

        <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">コンポーネント一覧</h2>
            <p class="text-gray-600">Voice Scheduleで使用されているUIコンポーネントのカタログです</p>
          </div>

          {Object.entries(categories).map(([key, label]) => {
            const items = catalogItems.filter(item => item.category === key);
            if (items.length === 0) return null;

            return (
              <div key={key} class="mb-12">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">{label}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(item => (
                    <a
                      key={item.path}
                      href={item.path}
                      class="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
                    >
                      <h4 class="text-lg font-medium text-gray-900 mb-2">{item.name}</h4>
                      <p class="text-sm text-gray-600">{item.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </main>
      </div>
    </>
  );
}