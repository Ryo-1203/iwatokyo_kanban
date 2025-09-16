# AGENTS.md
> 任意のコーディングエージェント（Cursor / Claude Code / Codex CLI / Gemini CLI など）向けの**ベンダー非依存・高精度**ガイド。  
> **大原則**: プロジェクト直下の **`.cursor/rules/*.mdc` を必ず読み込み**、その指示に**厳密に準拠**して実装すること。:contentReference[oaicite:2]{index=2}  
> **本ファイルは AGENTS.md の公開慣習**（「エージェント用 README」）に準拠し、ツール横断で予測可能な参照点を提供する。:contentReference[oaicite:3]{index=3}

---

## 0. コントラクト（遵守順序・適用範囲）
1) **Rules 最優先**  
   - `.cursor/rules/` の **`v5.mdc` を常に最優先で遵守**（タスク分類・承認・品質ゲート・報告様式は v5 に従う）。  
   - 併設されるルール（例：`quality-gates.mdc` など）は **v5 の上位方針に整合**させる。 :contentReference[oaicite:4]{index=4}
2) **Mastra 専用ルール**  
   - リポジトリ内に `src/mastra/**` もしくは `package.json` に `@mastra/*` が存在する場合、**`mastra.mdc` を必ず厳守**。Mastra の推奨構成・エージェント/ワークフロー/観測の作法に従う。 :contentReference[oaicite:5]{index=5}
3) **会話言語**  
   - ユーザーとの対話・説明・出力は **必ず日本語**で行う（内部実装言語は不問）。
4) **安全第一**  
   - 破壊的変更（DB/Schema/本番設定/高コスト操作）やセキュリティ影響は **v5.mdc の承認プロセス**を経るまで実行しない。

---

## 1. リポジトリ概要（テンプレ）
- **Stack**: <Language/Framework/Runtime>  
- **Entry points**: `<src/index.*>` or `<apps/*>`  
- **重要ディレクトリ**: `src/`, `tests/`, `scripts/`, `.cursor/rules/`  
- **MCP（任意）**: MCP で外部ツール/データに接続する場合は、定義/権限を明確化する（Claude Code でも MCP を公式サポート）。 :contentReference[oaicite:6]{index=6}

---

## 2. セットアップ（コピペ運用の最小系）
```bash
# 依存インストール（いずれか）
pnpm i   # or: npm ci / yarn install

# 環境変数
cp .env.example .env  # 必要な KEY を設定（Secret をコード/PR/ログに含めない）
````

* APIキーや認証情報は\*\*.env / Secrets Manager に限定\*\*する。リポジトリやログへ流出禁止。 ([Cursor][1])

---

## 3. 実行 / ビルド / テスト / Lint

```bash
# 実行（例）
pnpm dev     # or: npm run dev

# ビルド
pnpm build   # or: npm run build

# テスト
pnpm test    # add: --watch / --coverage

# 品質（Lint/Format）
pnpm lint && pnpm fmt
```

---

## 4. 作業プロセス（v5.mdc に準拠）

* **タスク分類**: v5.mdc の **軽量 / 標準 / 重要**を使用（プロセス・承認・報告は同ルールに従う）。
* **小さく速く**: 最小差分・段階投入・Fail→Pass テストを原則とする。
* **観測の先付け**: ログ/メトリクス/トレース（例：Pino/OTel or スタック準拠）を**最初から**仕込む。
* **コミット規約**: Conventional Commits を推奨（`feat:`, `fix:`, `docs:` / `BREAKING CHANGE:` 等）。 ([InfoQ][4])

---

## 5. コーディング標準（要点）

* **命名/レイヤリング**: 既存構造に合わせて**依存境界を明確化**。
* **I/O 契約**: JSON Schema / Zod 等で入力/出力/エラーを**構造化**。
* **セキュリティ**: 入力バリデーション、最小権限、依存の定期更新、秘密情報の扱い厳守（OWASP 準拠を推奨）。
* **出力形式**: 可能なら**diff/patch 形式**で提示し、適用手順を併記。

---

## 6. Mastra を使う場合（該当時は必読）

* 推奨構成例：`src/mastra/{agents,tools,workflows}/` + `src/mastra/index.ts`。
* エージェントには `name / instructions / model` を明示、\*\*maxSteps と hooks（onStepFinish/onFinish）\*\*で挙動を制御。
* RAG/メモリ/ワークフロー/観測は **Mastra の公式ガイド**に従い、`mastra.mdc` のチェックリストで品質ゲートを通す。 ([mastra.ai][2], [GitHub][3])

---

## 7. マルチエージェント併用の指針

* **Cursor**: `.cursor/rules/*.mdc` の \*\*Rule Type（Always/Auto/Agent-Requested）\*\*に基づき自動適用。説明/`globs`/`alwaysApply` を尊重する。 ([Cursor][1])
* **Claude Code**: `CLAUDE.md` が**会話開始時に自動読込**されるため、短い運用レシピを CLAUDE.md 側に集約。 ([Anthropic][5])
* **Codex CLI / Gemini CLI**: ターミナル実行時はカレントと選択ファイルが文脈。大規模改変はパッチ分割・逐次レビュー。

---

## 8. PR / レビュー（テンプレ）

* **PR に含めるもの**: 課題→方針→変更点→副作用→テスト結果→ロールバック案。
* **Diff-first**: 影響範囲を最小化し、レビュー負荷を下げる。
* **CI ゲート**: Lint/Type/Test/Build/セキュリティを全通過。

---

## 9. 使いはじめの手順（自己点検）

1. `.cursor/rules/` から **`v5.mdc` と `mastra.mdc`(該当時)** を読み込んだことを**最初の返信で宣言**。
2. 以後の対話は**日本語**で行い、提案は**小さなパッチ**と**Fail→Pass テスト**を添えて提示。
3. 破壊的変更は **v5.mdc の承認**が下りるまで保留。

---

### 参考

* **AGENTS.md 仕様/事例**（OpenAI/agents.md・採用実績）: ([GitHub][6], [Agents][7], [InfoQ][4])
* **Cursor Rules（.mdc 仕様）**: ([Cursor][1])
* **Mastra（TS エージェント FW）**: ([mastra.ai][2], [GitHub][3])
* **MCP（ツール連携の標準）**: ([Anthropic][8], [Model Context Protocol][9])
