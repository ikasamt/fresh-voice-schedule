import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Voice Schedule - ADHD向けスケジュール管理</title>
        <meta name="description" content="AIでテキストや画像から自動でスケジュールを作成。ADHD向けのシンプルなタスク管理アプリ" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* OGP */}
        <meta property="og:title" content="Voice Schedule" />
        <meta property="og:description" content="AIでテキストや画像から自動でスケジュールを作成" />
        <meta property="og:image" content="/logo.svg" />
        
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
