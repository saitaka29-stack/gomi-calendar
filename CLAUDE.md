# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 応答言語
- ユーザーへの返答・説明・質問は**すべて日本語**で書く（英語で返さない）。コミットメッセージ・ドキュメントも日本語。

## プロジェクト概要
ゴミ出しカレンダー。地域のゴミ出しルール（曜日・第何週）を一度登録すると、開くだけで今日・明日に何を出すかが分かる。
要件・画面構成の正は以下（機能追加・変更時はまず確認する）:
- `docs/requirements.md` — 要件定義書（T-06）。機能 ID（F-01〜）と Phase（MVP / v1.0 / v2.0）。**今回実装するのは MVP のみ**
- `docs/user-story-map.md` — ユーザーストーリーマップ（T-04）
- `docs/information-architecture.md` — サイトマップ・ページ一覧（T-05）
- `docs/plan.md` — Plan Mode で承認された設計

## コマンド
- `npm run dev` — 開発サーバー（Vite）
- `npm run build` — 型チェック（`tsc -b`）＋本番ビルド（`dist/`）
- `npm run lint` — oxlint（`react/only-export-components` が有効。コンポーネントのファイルからフックや関数を一緒に export しない）
- `npm test` — Vitest を 1 回実行
- 単一テスト: `npx vitest run src/lib/schedule.test.ts -t "テスト名"`

## 技術スタック
React 19 + TypeScript + Vite。サーバー・DB なしの静的 SPA として Vercel にデプロイする。

## プロジェクト固有ルール
- **バックエンド・外部 API・解析タグを追加しない**。データは localStorage だけで扱う。
- **日付の判定ロジックは `src/lib/` の純粋関数に置く**（`Date` を引数で受け取り、内部で `new Date()` を呼ばない）。変更したら必ずテストを更新して `npm test` を通す。
- 「第 N 週」は「その月の N 回目のその曜日」（`Math.ceil(日 / 7)`）。カレンダーの行ではない。
- 日付は端末のローカル時刻で扱い、`toISOString()`（UTC）で日付を作らない（日本時間の早朝に前日になるため）。
- 保存データの形式を変えるときは `version` を上げ、古い形式を読めるようにする。
- UI の文言は日本語。スマホ幅（375px）で崩れないこと。
- コミット前に `npm run lint && npm test && npm run build` がすべて通ること。
