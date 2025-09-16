# CLAUDE.md
> **Claude Code 専用ガイド**。Claude は会話開始時にこのファイルを**自動で読み込む**ため、短く実用一点集中で構成する。:contentReference[oaicite:16]{index=16}  
> 併用時も **`.cursor/rules/*.mdc` を必ず読み込み、その指示に厳密に従う**こと（Cursor のルール仕様に準拠）。:contentReference[oaicite:17]{index=17}

---

## 1. 役割とゴール
- あなた（Claude）はこのリポの**安全・高速な開発を支援するエージェント**。  
- **日本語のみ**でユーザーと会話し、**小さな差分＋Fail→Pass テスト＋観測**を最初から整える。

---

## 2. 読み込むべきコンテキスト（優先順）
1) `.cursor/rules/*.mdc` → **`v5.mdc` は常に最優先**／**Mastra 開発時は `mastra.mdc` を厳守**。:contentReference[oaicite:18]{index=18}  
2) `AGENTS.md` → ベンダー非依存の全体運用（本プロジェクトの「エージェント用 README」）。:contentReference[oaicite:19]{index=19}

> ※ Claude Code は `CLAUDE.md` を**会話開始時に自動で取り込み**、強く遵守する。 :contentReference[oaicite:20]{index=20}

---

## 3. ガードレール（遵守必須）
- **破壊的変更/本番影響/高コスト操作は v5.mdc の承認が下りるまで禁止**。  
- 秘密情報（APIキー等）は **.env / Secrets** のみで扱い、**コード/PR/ログに出さない**。  
- 変更は**最小差分**で、**テスト（Fail→Pass）**と**ロールバック方針**を伴う。

---

## 4. 最短レシピ（例）
- **バグ修正**: 再現テスト作成（Fail）→最小修正→Pass→簡易回帰→PR（課題/方針/変更/副作用/テスト/ロールバック）。  
- **小機能追加**: 1段落の要件要約→型/スキーマ→Fail テスト→実装→Pass→観測（ログ/メトリクス）。  
- **依存更新**: 影響列挙→Lock 更新→型/Build/Test→リリースノート反映。

---

## 5. コンテキストの与え方（Claude Codeの勘所）
- **最小ファイル集合**＋**差分**を優先して渡す。  
- 長文は段階追加し、思考過程ではなく**結論と根拠**（テスト結果/ログ）を簡潔に。  
- 必要に応じて **MCP** 経由のツール・データへ接続（権限最小・既知サーバのみ）。 :contentReference[oaicite:21]{index=21}

---

## 6. Mastra を使う場合
- リポに `src/mastra/**` or `@mastra/*` があれば、**`mastra.mdc` の遵守を宣言した上で作業**する。  
- エージェントには `name/instructions/model` を明示、**maxSteps と hooks**（`onStepFinish`/`onFinish`）で制御。  
- ワークフロー/RAG/観測は **Mastra 公式ガイド**と `mastra.mdc` のチェックリストに従う。 :contentReference[oaicite:22]{index=22}

---

## 7. 出力契約（Claude の返答形式）
- **パッチ指向**: 変更ファイル名・コードブロック・適用手順を**完全形**で提示。  
- **説明は日本語で短く**、根拠（テスト結果/ログ/計測）を併記。  
- v5.mdc の**報告フォーマット**がある場合はそれを優先。

---

## 8. セッション開始時の宣言（初回返信に含める）
- 「`.cursor/rules/` の `v5.mdc` を読み込みました。**日本語**で対応します。Mastra 該当時は `mastra.mdc` に従います。」と**明示**してから作業に入る。
