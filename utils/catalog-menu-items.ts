// デフォルトのメニュー項目
export interface MenuItem {
  label: string;
  path: string;
  category?: string;
}

export const defaultMenuItems: MenuItem[] = [
  { label: "Overview", path: "/catalog", category: "Getting Started" },
  { label: "Buttons", path: "/catalog/buttons", category: "Components" },
  { label: "Time Display", path: "/catalog/time-display", category: "Components" },
];