import { Head } from "$fresh/runtime.ts";
import CatalogLayout from "../../islands/CatalogLayout.tsx";
import ScheduleItemCatalog from "../../islands/ScheduleItemCatalog.tsx";

export default function ScheduleItemCatalogPage() {
  return (
    <>
      <Head>
        <title>AnimatedScheduleItem - UI Catalog</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <CatalogLayout currentPath="/catalog/schedule-item">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">AnimatedScheduleItem</h1>
          <p class="text-lg text-gray-600 mb-8">
            スケジュール項目を表示するメインコンポーネント。
            チェックボックス、編集、削除などの機能を含みます。
          </p>
          <ScheduleItemCatalog />
        </div>
      </CatalogLayout>
    </>
  );
}