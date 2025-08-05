import { Head } from "$fresh/runtime.ts";
import CatalogLayout from "../../islands/CatalogLayout.tsx";
import EditDialogCatalog from "../../islands/EditDialogCatalog.tsx";

export default function EditDialogCatalogPage() {
  return (
    <>
      <Head>
        <title>QuickEditDialog - UI Catalog</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <CatalogLayout currentPath="/catalog/edit-dialog">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">QuickEditDialog</h1>
          <p class="text-lg text-gray-600 mb-8">
            スケジュールのタイトルまたは日時を素早く編集するためのダイアログ。
            プレビュー機能付き。
          </p>
          <div class="space-y-12">
            {/* 概要 */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">概要</h2>
              <div class="bg-white rounded-lg shadow p-6">
                <p class="text-gray-600 mb-4">
                  スケジュールのタイトルまたは日時を素早く編集するためのダイアログ。プレビュー機能付き。
                </p>
                <EditDialogCatalog />
              </div>
            </section>

            {/* 機能 */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">機能</h2>
              <div class="bg-white rounded-lg shadow p-6">
                <ul class="space-y-2 text-gray-600">
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 mt-1">✓</span>
                    <span>タイトル編集モード: テキスト入力フィールド</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 mt-1">✓</span>
                    <span>日時編集モード: datetime-local入力フィールド</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 mt-1">✓</span>
                    <span>リアルタイムプレビュー表示</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 mt-1">✓</span>
                    <span>ESCキーでダイアログを閉じる</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 mt-1">✓</span>
                    <span>自動フォーカス（タイトル編集時）</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* UIパーツ */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">UIパーツ</h2>
              <div class="bg-white rounded-lg shadow p-6 space-y-6">
                {/* タイトル編集 */}
                <div>
                  <h3 class="text-sm font-medium text-gray-700 mb-2">タイトル編集フォーム</h3>
                  <div class="max-w-md p-4 bg-gray-50 rounded space-y-4">
                    <h2 class="text-xl font-bold text-gray-800">タイトルを編集</h2>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        タイトル
                      </label>
                      <input
                        type="text"
                        value="サンプルの予定"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 日時編集 */}
                <div>
                  <h3 class="text-sm font-medium text-gray-700 mb-2">日時編集フォーム</h3>
                  <div class="max-w-md p-4 bg-gray-50 rounded space-y-4">
                    <h2 class="text-xl font-bold text-gray-800">日時を編集</h2>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        日時
                      </label>
                      <input
                        type="datetime-local"
                        value="2024-01-01T12:00"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* プレビュー */}
                <div>
                  <h3 class="text-sm font-medium text-gray-700 mb-2">プレビューエリア</h3>
                  <div class="p-3 bg-gray-50 rounded-lg">
                    <div class="text-sm text-gray-600 mb-1">プレビュー</div>
                    <div class="font-semibold text-gray-800">
                      サンプルの予定
                    </div>
                    <div class="text-sm text-gray-600">
                      2024/1/1 12:00
                    </div>
                  </div>
                </div>

                {/* ボタン */}
                <div>
                  <h3 class="text-sm font-medium text-gray-700 mb-2">アクションボタン</h3>
                  <div class="flex gap-3 max-w-md">
                    <button class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      キャンセル
                    </button>
                    <button class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      保存
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* デザイン仕様 */}
            <section>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">デザイン仕様</h2>
              <div class="bg-white rounded-lg shadow p-6">
                <ul class="space-y-2 text-sm text-gray-600">
                  <li>• 最大幅: max-w-md (448px)</li>
                  <li>• 角丸: rounded-2xl</li>
                  <li>• 背景色: bg-white</li>
                  <li>• オーバーレイ: bg-black bg-opacity-50</li>
                  <li>• パディング: p-6</li>
                  <li>• 入力フィールド: border-gray-300, focus:ring-indigo-500</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </CatalogLayout>
    </>
  );
}