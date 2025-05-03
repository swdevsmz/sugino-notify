# 杉野遥亮 出演情報通知システム

このプロジェクトは、[杉野遥亮の公式サイト](https://topcoat.co.jp/yosuke_sugino)から出演情報を自動的に取得し、更新があった場合にLINE通知を送信するシステムです。

## 機能

- 公式サイトから出演情報を定期的に取得
- 前回取得した情報と比較し、更新があった場合にLINE通知を送信
- 出演情報をテキストファイルに保存
- GitHub Actionsによる自動実行（1日1回）

## 必要条件

- Node.js (v16以上)
- npm
- LINE Messaging APIのアクセストークン

## セットアップ

1. リポジトリをクローンします：
   ```bash
   git clone <repository-url>
   cd sugino-notify
   ```

2. 必要なパッケージをインストールします：
   ```bash
   npm install
   ```

3. 環境変数を設定します：
   - `.env`ファイルをプロジェクトのルートディレクトリに作成
   - 以下の内容を追加：
     ```
     LINE_ACCESS_TOKEN=your_line_access_token
     ```
   - `your_line_access_token`を実際のLINE Messaging APIのアクセストークンに置き換えてください

## 実行方法

### ローカルでの実行

```bash
npx ts-node src/scraper.ts
```

### GitHub Actionsでの自動実行

このプロジェクトは GitHub Actions によって1日1回自動的に実行されます。
以下の手順で設定してください：

1. GitHubのリポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定：
   - `LINE_ACCESS_TOKEN`: LINE Messaging APIのアクセストークン

2. GitHub Actionsのワークフローは既に設定されているため、追加の設定は不要です。

## ファイル構造

```
sugino-notify/
├── src/
│   └── scraper.ts      # メインのスクレイピングスクリプト
├── data/
│   └── appearances.txt  # 出演情報の保存ファイル
├── .env                # 環境変数設定ファイル（手動作成）
├── package.json        # プロジェクト設定
└── tsconfig.json       # TypeScript設定
```

## LINE通知

更新があった場合、以下のような形式でLINE通知が送信されます：

```
出演情報が更新されました:

【タイトル】
詳細情報

---

【タイトル】
詳細情報
```

## 注意事項

- LINE Messaging APIのアクセストークンは厳重に管理してください
- スクレイピングの実行頻度は適切な間隔を保ってください
- サイトの構造が変更された場合、スクリプトの修正が必要になる可能性があります