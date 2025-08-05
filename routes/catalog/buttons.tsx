import { Head } from "$fresh/runtime.ts";

export default function ButtonsCatalog() {
  return (
    <>
      <Head>
        <title>Buttons - UI Catalog</title>
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
                <h1 class="text-xl font-bold text-gray-900">Buttons</h1>
              </div>
            </div>
          </div>
        </header>

        <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div class="space-y-12">
            {/* Primary Buttons */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Primary Buttons</h2>
              <div class="bg-white rounded-lg shadow p-6 space-y-4">
                <div class="flex gap-4 items-center">
                  <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    保存
                  </button>
                  <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    追加
                  </button>
                  <code class="text-sm text-gray-600">bg-indigo-600 hover:bg-indigo-700</code>
                </div>
              </div>
            </section>

            {/* Secondary Buttons */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Secondary Buttons</h2>
              <div class="bg-white rounded-lg shadow p-6 space-y-4">
                <div class="flex gap-4 items-center">
                  <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    キャンセル
                  </button>
                  <code class="text-sm text-gray-600">border border-gray-300 hover:bg-gray-50</code>
                </div>
              </div>
            </section>

            {/* FAB (Floating Action Button) */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">FAB (Floating Action Button)</h2>
              <div class="bg-white rounded-lg shadow p-6">
                <div class="relative h-32">
                  <button class="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-xl hover:bg-blue-600 transition-all hover:shadow-2xl flex items-center justify-center">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <code class="text-sm text-gray-600 block mt-4">w-14 h-14 rounded-full shadow-xl hover:shadow-2xl</code>
              </div>
            </section>

            {/* Icon Buttons */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Icon Buttons</h2>
              <div class="bg-white rounded-lg shadow p-6 space-y-4">
                <div class="flex gap-4 items-center">
                  <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                  <button class="p-2 rounded-lg transition-colors bg-blue-100 text-blue-600">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button class="p-2 text-red-500 hover:text-red-600">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <code class="text-sm text-gray-600">p-2 rounded-lg transition-colors</code>
                </div>
              </div>
            </section>

            {/* Toggle Buttons */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Toggle Buttons</h2>
              <div class="bg-white rounded-lg shadow p-6 space-y-4">
                <div class="flex gap-4 items-center">
                  <button class="p-2 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button class="p-2 rounded-lg transition-colors bg-blue-100 text-blue-600">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <code class="text-sm text-gray-600">未選択: text-gray-400 / 選択: bg-blue-100 text-blue-600</code>
                </div>
              </div>
            </section>

            {/* Disabled States */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Disabled States</h2>
              <div class="bg-white rounded-lg shadow p-6 space-y-4">
                <div class="flex gap-4 items-center">
                  <button disabled class="px-4 py-2 rounded-lg text-white font-medium bg-gray-300 cursor-not-allowed">
                    処理中...
                  </button>
                  <code class="text-sm text-gray-600">disabled bg-gray-300 cursor-not-allowed</code>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}