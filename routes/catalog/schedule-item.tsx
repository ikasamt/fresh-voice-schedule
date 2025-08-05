import { Head } from "$fresh/runtime.ts";
import ScheduleItemCatalog from "../../islands/ScheduleItemCatalog.tsx";

export default function ScheduleItemCatalogPage() {

  return (
    <>
      <Head>
        <title>Schedule Item - UI Catalog</title>
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
                <h1 class="text-xl font-bold text-gray-900">AnimatedScheduleItem</h1>
              </div>
            </div>
          </div>
        </header>

        <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <ScheduleItemCatalog />
        </main>
      </div>
    </>
  );
}