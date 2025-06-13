# sanin2025

選挙ドットコムの情報をもとに、参議院選挙2025の選挙区データをスクレイピング・集計するTypeScriptプロジェクトです。

## 概要

- 各都道府県の選挙区ページから候補者情報などをスクレイピングし、JSON形式で保存します。
- 保存したデータをもとに、政党ごとの候補者数や特定グループの集計・分析を行います。

## ディレクトリ構成

```
.
├── batch_scrape.ts           # 全選挙区のデータを一括取得
├── scrape.ts                 # 単一選挙区のデータを取得
├── find_multi_B_seats.ts     # 1人区でグループBが複数出ている選挙区を抽出
├── find_A_B_multi_seats.ts   # 複数人区でA/Bグループの政党を抽出
├── count_party_candidates.ts # 各政党の候補者数を集計
├── results/                  # スクレイピング結果(JSON)
├── package.json
├── tsconfig.json
└── ...
```

## セットアップ

1. 依存パッケージのインストール

```sh
npm install
```

2. TypeScriptの実行には `ts-node` を利用します。

## 使い方

### 1. 単一選挙区のデータ取得

```sh
npx ts-node scrape.ts <URL>
```
- 例: `npx ts-node scrape.ts https://sangiin.go2senkyo.com/2025/prefecture/1`
- 結果は標準出力(JSON形式)

### 2. 全選挙区のデータを一括取得

```sh
npx ts-node batch_scrape.ts
```
- `results/` ディレクトリに `1.json` ～ `47.json` が保存されます。
- デフォルトURLは `https://sangiin.go2senkyo.com/2025/prefecture/` です。
- 環境変数 `SENKYOKU_URL` でベースURLを変更可能です。

### 3. 各種集計・分析

#### 各政党の候補者数を集計
```sh
npx ts-node count_party_candidates.ts
```

#### 1人区でグループBが複数出ている選挙区を抽出
```sh
npx ts-node find_multi_B_seats.ts
```

#### 複数人区でA/Bグループの政党を抽出
```sh
npx ts-node find_A_B_multi_seats.ts
```

## results ディレクトリのJSON構造例

```json
{
  "name": "北海道選挙区",
  "numOfSeats": "3",
  "numOfCandidates": "12",
  "votedRate": "53.98",
  "candidates": [
    {
      "name": "田中 よしひと",
      "age": "53",
      "position": "会社役員53歳｜会社役員",
      "party": "参政党"
    },
    ...
  ]
}
```

## 依存パッケージ
- axios
- cheerio
- commander
- typescript
- @types/cheerio, @types/commander, @types/node

## 注意
- スクレイピング対象サイトの構造変更により動作しなくなる場合があります。
- `results/` ディレクトリは `.gitignore` されていませんが、必要に応じて管理してください。

## ライセンス
ISC