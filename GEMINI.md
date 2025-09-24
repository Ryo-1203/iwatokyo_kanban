# GEMINI Playbook

このリポでは、**Gemini CLI GitHub Actions** を使って **PRレビュー** と **Issueトリアージ/（必要時の）タスク分割** を行います。  
**Issue本文が唯一の真**です。本文の「目的 / 背景 / 制約 / 受け入れ基準 / 決定ログ」を常に参照・更新してください。

---

## 0. 用語・プロジェクト連携
- **Status（Projects）**: `Todo → In progress → In review → Changes requested → Blocked → Done`
- **Priority（Projects Single-select）**: `No priority / Urgent / High / Medium / Low`
- **ラベル（リポ）**: `priority: none|urgent|high|medium|low`
- **PRリンク**: PR本文に **`Fixes #<issue_number>`** を必ず含める（Issueと連動）

---

## 1. ツールの使い分け（MCP）
> CI（GitHub Actions）経由で **MCPサーバ**（Serena / Context7 ほか）を有効化します。  
> 目的は **「最小トークンで正確に編集」×「常に最新仕様に準拠」** です。

- **Serena（symbol-level editing/reading）**  
  - 目的: **最小トークン**で**該当箇所だけ**正確に読む・直す  
  - 優先: `find_symbol` / `find_referencing_symbols` / `insert_after_symbol`（**ファイル丸読みは回避**）  
  - 起動方針: `--context ide-assistant` を基本（クライアント依存で `codex` 指示がある場合は従う）  
  - 注意: 一部クライアントでは **「Serenaで現ディレクトリを有効化」** が必要（未有効化だとツールが使えない）

- **Context7（up-to-date docs / code samples）**  
  - 目的: **外部ライブラリやフレームワークの“最新仕様”** を常に参照し、古いAPIミスを防ぐ  
  - ルール: 不明API・破壊的変更の可能性があるときは **必ず呼ぶ**  
  - PR: 採用した仕様/バージョンの **根拠を1行でコメント**（Context7の要点 & 可能ならリンク）  
  - Transport: **HTTP または stdio を使用（SSEは非推奨）**

- **（任意）Mastra/Linear 等の他MCP**  
  - このリポに必要であれば利用可。用途をPR本文またはコメントで一言明記。

---

## 2. レビューの観点（チェックリスト）
- ✅ テストが通る / 主要リンタが通る（実行コマンドをPR本文に記載）  
- ✅ **受け入れ基準**（Issue本文）を満たす  
- ✅ **後方互換 / セキュリティ / パフォーマンス**に重大懸念なし  
- ✅ 変更の**範囲が最小**（不要ファイルを触っていない）  
- ✅ ドキュメント/コメント/型の更新（必要な場合）  
- ✅ PR本文に **背景 → 変更点 → 検証手順 → 影響範囲 → リスク**  
- ✅ `Fixes #<issue>` でIssueと紐づけ

**判定**  
- 問題なし → **要点要約**（必要に応じて Context7 の根拠添付）  
- 追加修正 → **具体的ToDo**を箇条書きで提示、Projects **Status=Changes requested** に遷移（WFがあれば自動）

---

## 3. タスク分割（必要なときだけ）
- 方針: **“天才エンジニア目線の最小作業単位”** で **2〜5件 / 各60–120分**  
- 各サブIssueには以下を必ず含める:
  1) **Scope**（触ってよい範囲：フォルダ/層/モジュール）  
  2) **Acceptance**（検証手順 3–5点：コマンド/期待値/境界）  
  3) **Risk/Exclusions**（今回やらないこと）  
  4) **Run hint**（`dt -i <number> --engine <claude|codex|none>`）
- **複数リポにまたがらない**（Repo単位で分ける）  
- 親Issue本文は **チェックリスト** でサブIssueへのリンクを列挙

---

## 4. 変更の原則・コミット
- **Conventional Commits**：`feat: ...` / `fix: ...` / `docs: ...` など  
- コミットは**小さく意味単位**で。巨大差分/まとめコミットは避ける  
- Secret/個人情報/外部トークンは扱わない（検出時は指摘）  
- 不確かな仕様は **Context7** で再確認（根拠を短く残す）

---

## 5. ステータス運用（Projects）
- 作業開始 → `In progress`  
- PR作成 → `In review`  
- レビューNG → `Changes requested`  
- 重大阻害/外部待ち → `Blocked`  
- マージ/クローズ → `Done`（内蔵オートで反映）

---

## 6. 返信テンプレ（例）
**OK**  
> ✅ All checks passed.  
> - Matches acceptance criteria A/B/C  
> - Context7 confirms vX.Y API usage for Z (link)  
> LGTM.

**要修正（例）**  
> ◻ Add test for edge-case N  
> ◻ Avoid reading entire file; use Serena symbol edit  
> ◻ Update README for new flag  
> After fixes, push to same branch (Status moves to In review).
