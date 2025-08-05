# UIカタログ自動生成システム

## 概要

このプロジェクトでは、UIコンポーネントのカタログを自動生成する仕組みを導入しています。
`*.stories.tsx`ファイルを作成するだけで、自動的にカタログページが生成されます。

## 使い方

### 1. ストーリーファイルの作成

コンポーネントと同じディレクトリに`*.stories.tsx`ファイルを作成します：

```typescript
// components/MyComponent.stories.tsx
import MyComponent from "./MyComponent.tsx";

export const metadata = {
  title: "MyComponent",
  description: "コンポーネントの説明",
  category: "Components", // カタログのカテゴリ
};

export const stories = [
  {
    name: "デフォルト",
    description: "基本的な使用例",
    render: (props: any) => (
      <MyComponent {...props} />
    ),
  },
  {
    name: "カスタム",
    description: "カスタマイズした例",
    render: (props: any) => (
      <MyComponent variant="custom" {...props} />
    ),
  },
];
```

### 2. カタログの生成

以下のコマンドでカタログを生成します：

```bash
deno task generate-catalog
```

または、開発サーバーを起動する際に自動生成されます：

```bash
deno task dev  # generate-catalog + start
```

### 3. カタログの確認

ブラウザで `/catalog` にアクセスすると、生成されたカタログを確認できます。

## 生成されるファイル

以下のファイルが自動生成されます（.gitignoreに追加済み）：

- `utils/catalog-generated.ts` - メニュー項目とストーリーモジュールのエクスポート
- `routes/catalog/generated/*.tsx` - 各コンポーネントのカタログページ

## 仕組み

1. `scripts/generate-catalog.ts`が`*.stories.tsx`ファイルを検索
2. 各ストーリーファイルに対してカタログページを生成
3. `CatalogLayout`コンポーネントが生成されたメニュー項目を読み込んで表示
4. `StoryRenderer`コンポーネントがストーリーを描画

## ベストプラクティス

- ストーリーファイルには複数のバリエーションを含める
- `description`フィールドで各ストーリーの目的を説明
- インタラクティブなコンポーネントは`console.log`でイベントを出力
- Propsの型定義を明確にする