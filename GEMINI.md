# GEMINI Playbook

このリポでは、**Gemini CLI GitHub Actions** を使って **PRレビュー** と **Issueトリアージ/（必要時の）タスク分割** を行います。  
**Issue本文が唯一の真**です。本文の「目的 / 背景 / 制約 / 受け入れ基準 / 決定ログ」を常に参照・更新してください。

## 0. 用語・プロジェクト連携
- **Status（Projects）**: `Todo → In progress → In review → Changes requested → Blocked → Done`
- **Priority（Projects Single-select）**: `No priority / Urgent / High / Medium / Low`
- **ラベル（リポ）**: `priority: none|urgent|high|medium|low`
- **PRリンク**: PR本文に **`Fixes #<issue_number>`** を必ず含める

## 1. ツールの使い分け（MCP）
- **Serena（symbol-level）**  
  - 目的: 最小トークンで該当箇所だけ正確に読む/直す  
  - 優先: `find_symbol` / `find_referencing_symbols` / `insert_after_symbol`（ファイル丸読みは回避）  
  - 起動: `--context ide-assistant` を基本（クライアント依存で `codex` 指示があれば従う）  
  - 注意: 一部クライアントは **「Serenaで現ディレクトリを有効化」** が必要

- **Context7（最新仕様の参照）**  
  - 目的: 外部ライブラリ/フレームワークの**最新仕様**を参照  
  - ルール: 不明API・破壊的変更の可能性がある時は**必ず呼ぶ**  
  - PR: 採用した仕様/バージョンの**根拠を1行でコメント**（Context7の要点）  
  - Transport: **HTTP / stdio を使用（SSEは非推奨）**

## 2. レビューの観点（チェックリスト）
- ✅ テスト/リンタが通る（実行コマンドはPR本文に）  
- ✅ 受け入れ基準を満たす  
- ✅ 後方互換/セキュリティ/パフォーマンスに重大懸念なし  
- ✅ 変更範囲は最小（不要ファイルに触らない）  
- ✅ ドキュメント/コメント/型の更新（必要なら）  
- ✅ PR本文: 背景→変更点→検証手順→影響範囲→リスク  
- ✅ `Fixes #<issue>`

## 3. タスク分割（必要な時のみ）
- **2〜5件 / 各60–120分**。複数リポにまたがらない  
- サブIssueに必須: Scope / Acceptance / Risk / Run hint（`dt -i <n> --engine <claude|codex|none>`）

## 4. 変更の原則・コミット
- Conventional Commits  
- 小さな意味単位のコミット  
- Secret/個人情報/外部トークンは扱わない  
- 不確かな仕様は **Context7** で再確認（短く根拠を残す）

## 5. ステータス運用（Projects）
- 作業開始→`In progress` / PR作成→`In review` / NG→`Changes requested` / 外部待ち→`Blocked` / マージ/クローズ→`Done`
