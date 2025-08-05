import { Head } from "$fresh/runtime.ts";
import CatalogLayout from "../../islands/CatalogLayout.tsx";

export default function CatalogIndex() {
  return (
    <>
      <Head>
        <title>UI Catalog - Voice Schedule</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <CatalogLayout currentPath="/catalog">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">UI Catalog</h1>
          <p class="text-lg text-gray-600 mb-8">
            Voice Scheduleで使用されているUIコンポーネントのカタログです。
            左のメニューからコンポーネントを選択してください。
          </p>

          <div class="space-y-8">
            <section>
              <h2 class="text-xl font-semibold text-gray-900 mb-3">はじめに</h2>
              <p class="text-gray-600 leading-relaxed">
                このカタログは、Voice Scheduleアプリケーションで使用されているすべてのUIコンポーネントを
                一覧できるようにまとめたものです。各コンポーネントの使用例、プロパティ、
                インタラクションパターンを確認できます。
              </p>
            </section>

            <section>
              <h2 class="text-xl font-semibold text-gray-900 mb-3">主なコンポーネント</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="border border-gray-200 rounded-lg p-4">
                  <h3 class="font-medium text-gray-900 mb-1">AnimatedScheduleItem</h3>
                  <p class="text-sm text-gray-600">
                    スケジュール項目を表示するメインコンポーネント。
                    チェックボックス、編集、削除などの機能を含む。
                  </p>
                </div>
                <div class="border border-gray-200 rounded-lg p-4">
                  <h3 class="font-medium text-gray-900 mb-1">AddScheduleModal</h3>
                  <p class="text-sm text-gray-600">
                    新しい予定を追加するためのモーダル。
                    テキスト入力と画像アップロードに対応。
                  </p>
                </div>
                <div class="border border-gray-200 rounded-lg p-4">
                  <h3 class="font-medium text-gray-900 mb-1">QuickEditDialog</h3>
                  <p class="text-sm text-gray-600">
                    タイトルや日時を素早く編集できるダイアログ。
                    リアルタイムプレビュー機能付き。
                  </p>
                </div>
                <div class="border border-gray-200 rounded-lg p-4">
                  <h3 class="font-medium text-gray-900 mb-1">Buttons</h3>
                  <p class="text-sm text-gray-600">
                    アプリケーション全体で使用される各種ボタン。
                    Primary、Secondary、FAB、Iconボタンなど。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 class="text-xl font-semibold text-gray-900 mb-3">デザインシステム</h2>
              <div class="space-y-4">
                <div>
                  <h3 class="font-medium text-gray-900 mb-2">カラーパレット</h3>
                  <div class="flex gap-2">
                    <div class="w-16 h-16 bg-blue-500 rounded"></div>
                    <div class="w-16 h-16 bg-indigo-600 rounded"></div>
                    <div class="w-16 h-16 bg-gray-900 rounded"></div>
                    <div class="w-16 h-16 bg-gray-600 rounded"></div>
                    <div class="w-16 h-16 bg-gray-300 rounded"></div>
                    <div class="w-16 h-16 bg-gray-50 rounded border"></div>
                  </div>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 mb-2">タイポグラフィ</h3>
                  <div class="space-y-2">
                    <p class="text-3xl font-bold">見出し1 (text-3xl font-bold)</p>
                    <p class="text-xl font-semibold">見出し2 (text-xl font-semibold)</p>
                    <p class="text-lg font-medium">見出し3 (text-lg font-medium)</p>
                    <p class="text-base">本文 (text-base)</p>
                    <p class="text-sm text-gray-600">補足テキスト (text-sm text-gray-600)</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </CatalogLayout>
    </>
  );
}