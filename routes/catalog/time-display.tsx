import { Head } from "$fresh/runtime.ts";

export default function TimeDisplayCatalog() {
  const now = new Date();
  const dates = [
    { label: "3分後", date: new Date(now.getTime() + 3 * 60 * 1000) },
    { label: "45分後", date: new Date(now.getTime() + 45 * 60 * 1000) },
    { label: "3時間後", date: new Date(now.getTime() + 3 * 60 * 60 * 1000) },
    { label: "1日後", date: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
    { label: "3日後", date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) },
    { label: "過去（1時間前）", date: new Date(now.getTime() - 60 * 60 * 1000) },
  ];

  function getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const absDiff = Math.abs(diff);
    
    const minutes = Math.floor(absDiff / (1000 * 60));
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    
    if (diff < 0) {
      return "終了";
    }
    
    if (days > 0) {
      return `${days}日`;
    } else if (hours > 0) {
      return `${hours}時間`;
    } else {
      return `${minutes}分`;
    }
  }

  return (
    <>
      <Head>
        <title>Time Display - UI Catalog</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <div class="min-h-screen bg-gray-100">
        <header class="bg-white shadow-sm">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="flex items-center justify-between h-16">
              <div class="flex items-center gap-3">
                <a href="/catalog" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </a>
                <h1 class="text-xl font-bold text-gray-900">Time Display</h1>
              </div>
            </div>
          </div>
        </header>

        <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div class="space-y-12">
            {/* 相対時刻表示 */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">相対時刻表示（デフォルト）</h2>
              <div class="bg-white rounded-lg shadow p-6">
                <div class="space-y-4">
                  {dates.map((item, index) => (
                    <div key={index} class="flex items-center justify-between max-w-md">
                      <span class="text-gray-600">{item.label}</span>
                      <div class="w-20 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                        <span class="font-bold text-gray-800">
                          {getRelativeTime(item.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div class="flex items-center justify-between max-w-md">
                    <span class="text-gray-600">日時未定</span>
                    <div class="w-20 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <span class="font-bold text-gray-800">未定</span>
                    </div>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mt-4">
                  残り時間を「3日」「12時間」「45分」の形式で表示。過去の予定は「終了」と表示。
                </p>
              </div>
            </section>

            {/* 絶対時刻表示 */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">絶対時刻表示</h2>
              <div class="bg-white rounded-lg shadow p-6">
                <div class="space-y-4">
                  {dates.map((item, index) => (
                    <div key={index} class="flex items-center justify-between max-w-md">
                      <span class="text-gray-600">{item.label}</span>
                      <div class="w-20 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                        <span class="font-bold text-gray-800">
                          {item.date.toLocaleTimeString("ja-JP", { 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div class="flex items-center justify-between max-w-md">
                    <span class="text-gray-600">日時未定</span>
                    <div class="w-20 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <span class="font-bold text-gray-800">未定</span>
                    </div>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mt-4">
                  実際の時刻を「12:34」の形式で表示。
                </p>
              </div>
            </section>

            {/* スタイリング仕様 */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">スタイリング仕様</h2>
              <div class="bg-white rounded-lg shadow p-6">
                <div class="space-y-4">
                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-2">コンテナ</h3>
                    <div class="flex gap-4 items-center">
                      <div class="w-20 h-10 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-blue-500">
                        <span class="font-bold text-gray-800">3時間</span>
                      </div>
                      <code class="text-sm text-gray-600">w-20 h-10 bg-gray-50 rounded-lg</code>
                    </div>
                  </div>
                  
                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-2">テキスト</h3>
                    <code class="text-sm text-gray-600">font-bold text-gray-800</code>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-2">固定サイズ</h3>
                    <ul class="text-sm text-gray-600 space-y-1">
                      <li>• 幅: 80px (w-20)</li>
                      <li>• 高さ: 40px (h-10)</li>
                      <li>• 右寄せ配置</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 特殊ケース */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">特殊ケース</h2>
              <div class="bg-white rounded-lg shadow p-6">
                <div class="space-y-4">
                  <div class="flex items-center justify-between max-w-md">
                    <span class="text-gray-600">完了済み（グレーアウト）</span>
                    <div class="w-20 h-10 bg-gray-50 rounded-lg flex items-center justify-center opacity-50">
                      <span class="font-bold text-gray-800">終了</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between max-w-md">
                    <span class="text-gray-600">日時未定（両モード共通）</span>
                    <div class="w-20 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <span class="font-bold text-gray-800">未定</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}