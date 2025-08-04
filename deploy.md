# 🚀 デプロイガイド

## Deno Deploy (推奨・最も簡単)

### 方法1: GitHub連携（推奨）

1. **GitHubにプッシュ**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/fresh-voice-schedule.git
git push -u origin main
```

2. **Deno Deployで設定**
- https://dash.deno.com/new にアクセス
- "Import from GitHub" を選択
- リポジトリを選択
- Entry point: `main.ts`
- Environment variables を設定（必要に応じて）
- "Deploy" をクリック

3. **自動デプロイ完了！**
- URLが発行される（例: `https://voice-schedule.deno.dev`）
- 以降、GitHubにプッシュすると自動デプロイ

### 方法2: CLIでデプロイ

```bash
# Deno Deploy CLIをインストール
deno install -Arf jsr:@deno/deployctl

# プロジェクトをビルド
deno task build

# デプロイ
deployctl deploy --project=voice-schedule main.ts

# 環境変数を設定する場合
deployctl deploy --project=voice-schedule \
  --env=FIREBASE_API_KEY=xxx \
  --env=GEMINI_API_KEY=xxx \
  main.ts
```

## 環境変数の設定

Deno Deployダッシュボードで設定：
1. プロジェクト選択
2. Settings > Environment Variables
3. 以下を追加：
   - `FIREBASE_API_KEY`（必要に応じて）
   - `GEMINI_API_KEY`（必要に応じて）

## Firebase設定の更新

1. **Firebase Console**
   - Authentication > Settings > 承認済みドメイン
   - デプロイ先URL追加（例: `voice-schedule.deno.dev`）

2. **コード内のFirebase設定確認**
   - `utils/firebase.ts` のauthDomainが正しいか確認

## カスタムドメインの設定

1. Deno Deployダッシュボード > Settings > Domains
2. "Add Domain" クリック
3. DNSレコード設定：
   - CNAME: `your-domain.com` → `voice-schedule.deno.dev`
   - または A record を指定のIPに

## デプロイ確認コマンド

```bash
# ローカルでプロダクションモードテスト
deno task build
deno task preview

# 型チェック
deno check **/*.ts **/*.tsx

# フォーマット
deno fmt

# Lint
deno lint
```

## トラブルシューティング

### よくあるエラーと対処法

1. **Firebase認証エラー**
   - 承認済みドメインを確認
   - APIキーを確認
   - CORSエラーの場合、Firebase Consoleで設定

2. **ビルドエラー**
   ```bash
   # 依存関係をクリア
   rm -rf node_modules
   deno cache --reload main.ts
   ```

3. **環境変数が読み込まれない**
   ```typescript
   // utils/env.ts を作成
   export const getEnv = (key: string) => {
     return Deno.env.get(key) || "";
   };
   ```

## その他のデプロイオプション

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### Netlify Edge Functions
```bash
# netlify.toml
[build]
  command = "deno task build"
  publish = "dist"

[functions]
  directory = "netlify/edge-functions"
```

### Self-hosting with PM2
```bash
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'voice-schedule',
    script: 'deno',
    args: 'run -A main.ts',
    env: {
      PORT: 8000
    }
  }]
};

pm2 start ecosystem.config.js
```

## デプロイ後の確認事項

- [ ] Googleログインが動作する
- [ ] Firestoreの読み書きが動作する  
- [ ] Gemini APIが動作する
- [ ] HTTPSが有効
- [ ] レスポンシブデザインが機能する

## サポート

問題が発生した場合：
1. Deno Deploy のログを確認
2. ブラウザのコンソールを確認
3. [Deno Deploy Discord](https://discord.gg/deno) で質問