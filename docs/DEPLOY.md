# デプロイ方法

## 1. Deno Deploy（推奨）

### 自動デプロイ（GitHub連携）
1. [Deno Deploy](https://deno.com/deploy) にアクセス
2. GitHubアカウントでサインイン
3. 「New Project」をクリック
4. GitHubリポジトリ（fresh-voice-schedule）を選択
5. 以下の設定を行う：
   - Entrypoint: `main.ts`
   - Production Branch: `master`
6. 環境変数を設定（必要に応じて）

### 手動デプロイ
```bash
# Deno Deployctl をインストール
deno install -Arf jsr:@deno/deployctl

# プロジェクトをビルド
deno task build

# デプロイ
deployctl deploy --project=your-project-name main.ts
```

## 2. 環境変数

デプロイ時に以下の環境変数が必要になる場合があります：

```bash
# Firebase設定（現在はクライアントサイドで設定されているため不要）
# FIREBASE_API_KEY=xxx
# FIREBASE_AUTH_DOMAIN=xxx
# FIREBASE_PROJECT_ID=xxx

# Gemini API（現在はクライアントサイドで設定されているため不要）
# GEMINI_API_KEY=xxx
```

**注意**: 現在はAPIキーがクライアントサイドにハードコードされています。
本番環境では環境変数に移行することを推奨します。

## 3. Firebase設定

### Firestoreルールのデプロイ
```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# ログイン
firebase login

# プロジェクトを初期化（初回のみ）
firebase init firestore

# ルールをデプロイ
firebase deploy --only firestore:rules
```

## 4. カスタムドメイン設定

Deno Deployでカスタムドメインを設定する場合：

1. Deno Deployダッシュボードで「Settings」→「Domains」
2. 「Add Domain」をクリック
3. ドメイン名を入力
4. DNSレコードを設定：
   - Aレコード: Deno Deployが提供するIPアドレス
   - またはCNAME: `your-project.deno.dev`

## 5. 本番環境のチェックリスト

- [ ] APIキーを環境変数に移行
- [ ] Firestoreセキュリティルールを確認
- [ ] エラートラッキング（Sentry等）の設定
- [ ] Google Analyticsの設定（必要に応じて）
- [ ] HTTPSが有効になっていることを確認
- [ ] パフォーマンス最適化の確認

## 6. デプロイ後の確認

1. アプリケーションが正常に起動するか
2. Firebaseとの接続が正常か
3. Gemini APIが正常に動作するか
4. 画像アップロードが機能するか
5. ドラッグ&ドロップが正常に動作するか

## 7. ロールバック

問題が発生した場合：

1. Deno Deployダッシュボードで「Deployments」タブを開く
2. 前のバージョンを選択
3. 「Promote to Production」をクリック

または、GitHubで前のコミットにrevertして自動デプロイを待つ。