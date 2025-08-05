import { Head } from "$fresh/runtime.ts";
import AddModalCatalog from "../../islands/AddModalCatalog.tsx";

export default function AddModalCatalogPage() {

  return (
    <>
      <Head>
        <title>Add Schedule Modal - UI Catalog</title>
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
                <h1 class="text-xl font-bold text-gray-900">AddScheduleModal</h1>
              </div>
            </div>
          </div>
        </header>

        <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div class="space-y-12">
            {/* 概要 */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">概要</h2>
              <div class="bg-white rounded-lg shadow p-6">
                <p class="text-gray-600 mb-4">
                  新しい予定を追加するためのモーダルダイアログ。テキスト入力と画像アップロードの2つの方法で予定を追加できます。
                </p>
                <AddModalCatalog />
              </div>
            </section>

            {/* 機能 */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">機能</h2>
              <div class="bg-white rounded-lg shadow p-6">
                <ul class="space-y-2 text-gray-600">
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 mt-1">✓</span>
                    <span>テキスト入力: 自然言語で予定を入力（例: "明日の15時から会議"）</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 mt-1">✓</span>
                    <span>画像アップロード: スクリーンショットや写真から予定を読み取り</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 mt-1">✓</span>
                    <span>ESCキーでモーダルを閉じる</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 mt-1">✓</span>
                    <span>処理中の状態表示</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* UIパーツ */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">UIパーツ</h2>
              <div class="bg-white rounded-lg shadow p-6 space-y-6">
                {/* ヘッダー */}
                <div>
                  <h3 class="text-sm font-medium text-gray-700 mb-2">ヘッダー</h3>
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <h2 class="text-xl font-bold text-gray-800">新しい予定を追加</h2>
                    <button class="text-gray-400 hover:text-gray-600">
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* テキスト入力エリア */}
                <div>
                  <h3 class="text-sm font-medium text-gray-700 mb-2">テキスト入力エリア</h3>
                  <div class="p-4 bg-gray-50 rounded">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      テキストで入力
                    </label>
                    <textarea
                      placeholder="例: 明日の15時から会議"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                    />
                  </div>
                </div>

                {/* OR区切り */}
                <div>
                  <h3 class="text-sm font-medium text-gray-700 mb-2">OR区切り</h3>
                  <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                      <span class="px-2 bg-white text-gray-500">または</span>
                    </div>
                  </div>
                </div>

                {/* 画像アップロードエリア */}
                <div>
                  <h3 class="text-sm font-medium text-gray-700 mb-2">画像アップロードエリア</h3>
                  <div class="p-4 bg-gray-50 rounded">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      画像から読み取る
                    </label>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400">
                      <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      クリックして画像を選択
                    </div>
                  </div>
                </div>

                {/* ボタン */}
                <div>
                  <h3 class="text-sm font-medium text-gray-700 mb-2">アクションボタン</h3>
                  <div class="flex gap-3">
                    <button class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      キャンセル
                    </button>
                    <button class="flex-1 px-4 py-2 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700">
                      追加
                    </button>
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