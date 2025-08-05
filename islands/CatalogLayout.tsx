import { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
  currentPath: string;
}

interface MenuItem {
  label: string;
  path: string;
  category?: string;
}

// 基本メニュー項目
const baseMenuItems: MenuItem[] = [
  { label: "Overview", path: "/catalog", category: "Getting Started" },
  { label: "Buttons", path: "/catalog/buttons", category: "Components" },
  { label: "Time Display", path: "/catalog/time-display", category: "Components" },
];

// 生成されたメニュー項目を動的にインポート
let generatedMenuItems: MenuItem[] = [];
try {
  const module = await import("../utils/catalog-generated.ts");
  generatedMenuItems = module.generatedMenuItems || [];
} catch {
  // ファイルが存在しない場合は空配列
}

// 重複を除外してメニュー項目をマージ
const menuItems = [...baseMenuItems];
generatedMenuItems.forEach(item => {
  if (!menuItems.some(existing => existing.path === item.path)) {
    menuItems.push(item);
  }
});

export default function CatalogLayout({ children, currentPath }: Props) {
  const categories = [...new Set(menuItems.map(item => item.category))].filter(Boolean);

  return (
    <div class="flex h-screen bg-white">
      {/* Sidebar */}
      <aside class="w-64 border-r border-gray-200 overflow-y-auto">
        <div class="p-4 border-b border-gray-200">
          <h1 class="text-lg font-semibold text-gray-900">UI Catalog</h1>
        </div>
        
        <nav class="p-4">
          {/* Uncategorized items */}
          {menuItems
            .filter(item => !item.category)
            .map(item => (
              <a
                key={item.path}
                href={item.path}
                class={`block px-3 py-2 rounded text-sm transition-colors ${
                  currentPath === item.path
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </a>
            ))}

          {/* Categorized items */}
          {categories.map(category => (
            <div key={category} class="mt-6">
              <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {category}
              </h3>
              {menuItems
                .filter(item => item.category === category)
                .map(item => (
                  <a
                    key={item.path}
                    href={item.path}
                    class={`block px-3 py-2 rounded text-sm transition-colors ${
                      currentPath === item.path
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}