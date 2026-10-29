# 実装計画：ゴミ出しカレンダー（課題 2・MVP）

## Context
課題 2（1 つ目と別テーマのオリジナルシステムを、要件定義 → Plan Mode → 実装 → デプロイ → 記事 で再現）。
要件は `gomi-calendar/docs/requirements.md`（T-06）・`user-story-map.md`（T-04）・`information-architecture.md`（T-05）で確定済み。
「作業量が少ないもの」という希望に合わせ、**MVP（F-01〜F-07）だけ**を実装する。
課題 1 と同じ React + TS + Vite 構成にして、手順を再利用する（記事の「スムーズになった点」の材料）。

## 1. データモデル（`src/lib/types.ts`）
```ts
type Rule = { weekdays: number[] /* 0=日〜6=土 */; weeks: number[] /* 空=毎週, 1〜5 */ }
type GarbageType = { id: string; name: string; color: ColorKey; note: string; rule: Rule }
type Store = { version: 1; types: GarbageType[] }   // localStorage 'gomi-calendar:v1'
```
- 色は固定パレット（赤・青・緑・黄・紫・灰）から選ぶ `ColorKey`。CSS 変数でライト/ダーク両対応

## 2. ロジック（`src/lib/`・純粋関数＋テスト）
- `schedule.ts`
  - `nthWeek(date)` = `Math.ceil(date.getDate() / 7)`
  - `matches(rule, date)`：曜日が一致し、かつ（weeks が空 or nthWeek が含まれる）
  - `typesOn(types, date)`：その日に出すゴミ（登録順）
  - `upcoming(types, from, days = 14)`：`{ date, types }[]`（ローカル日付で 1 日ずつ進める）
  - `describeRule(rule)`：「毎週 月・木」「第2・第4 金」「（曜日未設定）」
  - `formatDate(date)`：「10/30（木）」
- `templates.ts`：よくある例（燃えるゴミ 月・木／プラ 水／資源（缶・びん・ペット） 火／不燃 第2・第4 金）。メモ「朝 8 時までに」
- `storage.ts`：`loadStore()` / `saveStore()`（try/catch、壊れていたら空）
- 状態は `useReducer`：`addType` / `removeType` / `applyTemplate`（id は呼び出し側で生成）。reducer も `src/lib/reducer.ts`

## 3. 画面（ハッシュで 2 画面を切り替え。ライブラリ・vercel.json 不要）
- `src/useHashView.ts`：`location.hash === '#settings'` を `useSyncExternalStore` + `hashchange` で購読
- `App.tsx`：Store を持ち、変更のたびに保存。`view` でページを出し分け
- `pages/TodayPage.tsx`（`/`）
  - ヘッダー：タイトル＋今日の日付、右上「⚙ 設定」
  - **今日**・**明日** のカード：色付きバッジで種類名＋メモ。ない日は「収集なし」
  - 2 週間の一覧：日付（土日は色）＋ゴミの色チップ。今日の行を強調
  - ルール 0 件のとき：「よくある例から始める」「自分で登録する」
  - 日付は描画時の `new Date()`。日付またぎ対策に、タブに戻ったとき（`visibilitychange`）再描画
- `pages/SettingsPage.tsx`（`/#settings`）
  - 「← 戻る」、登録済みの種類（色・名前・`describeRule`・メモ・削除（確認））
  - 追加フォーム：名前、色（6 色ボタン）、曜日（7 個のトグル）、第何週（「毎週」or 第1〜5 のトグル）、メモ
  - 「よくある例で上書き」（登録済みがあれば確認）

## 4. テスト（Vitest）
- `schedule.test.ts`：nthWeek の境界（7 日・8 日・29 日）、第2・第4 金の判定（2026-11 の実日付で）、毎週ルール、曜日未設定は一致しない、upcoming が 14 日・月またぎ・ローカル日付、describeRule の表記
- `reducer.test.ts`：追加・削除・テンプレート適用
- `storage.test.ts`：保存→読み込み、壊れたデータで空

## 5. ドキュメント・公開
- `README.md`：概要・スクショ・技術スタック・使い方・開発コマンド
- `docs/article.md`：記事（**課題 1 と比べてスムーズになった点の段落**を含む。つまずきは実際に起きたことだけ書く）
- 最初に作った GitHub リポジトリ `gomi-calendar` に push → Vercel で Import
- CLAUDE.md にアーキテクチャの節を追記

## 6. 検証
- `npm run lint && npm test && npm run build`
- `vite preview` を Playwright（375px）で操作：
  1. 初回 →「よくある例から始める」→ 今日・明日・2 週間が出る
  2. 設定で「粗大ゴミ（第1 土）」を追加 → トップの 2 週間に反映
  3. 種類を削除 → 反映、再読み込みで保持
  4. Playwright の時計を固定して、第 2 金曜に不燃ゴミが出ること・第 3 金曜には出ないことを確認
  5. 横スクロールなし、ダークモード
- スクショを `docs/` に保存
