# 【Deno 2.7】安定化された Temporal API を実際のプロジェクトに導入してみた

## はじめに

2026年2月にリリースされた **Deno 2.7**
には、いくつかの重要なアップデートが含まれています。
その中でも特に開発者体験に直結するのが、**Temporal API の安定化**です。

この記事では、私が開発している「[株価逆算シミュレーター](https://stock-back-calc.syaryn.com/)」への導入を例に、Temporal
API が何を解決するのか、そして実際の移行がどれほど簡単かを紹介します。

**対象読者**：Deno を使っていて、日付処理のコードが気になっている方。

## Deno 2.7 の主な新機能

まず、Deno 2.7 の概要を整理します。

| 機能                               | 概要                                         |
| ---------------------------------- | -------------------------------------------- |
| **Temporal API 安定化**            | `--unstable-temporal` フラグ不要に           |
| Windows on ARM サポート            | aarch64-pc-windows-msvc の公式ビルドを提供   |
| `package.json` の `overrides` 対応 | 推移的な依存関係のバージョンを強制指定可能に |
| 新しいサブプロセス API (unstable)  | `Deno.spawn()` などがアンステーブルで追加    |
| V8 14.5 へのアップデート           | エンジンのパフォーマンス向上                 |
| Brotli 圧縮ストリームのサポート    | レスポンスの圧縮選択肢が増加                 |
| 自己展開型コンパイルバイナリ       | 実行環境不要の配布バイナリを作成可能に       |

この中で、**既存コードに対して最も即効性のある改善**が「Temporal API
の安定化」です。

## Temporal API とは？

Temporal API は、JavaScript の歴史的な問題を抱えた `Date`
オブジェクトを置き換えるために策定された、新しい日付・時刻の標準 API です。

### `Date` の問題点

`Date` オブジェクトには以下の問題があります。

- **タイムゾーンが曖昧**：ローカル時刻と UTC が混在しやすい
- **ミュータブル**：値が変更されやすく、バグの温床になりやすい
- **「今日の日付だけ取る」API がない**：文字列操作でのハックが必要

:::warn `toISOString()` は常に UTC
の時刻を返します。日本時間（JST=UTC+9）の深夜0時に実行すると、UTC
ではまだ前日のため、意図せず前日の日付が返ることがあります。 :::

例えば、「今日の日付（YYYY-MM-DD形式）を取得する」という
よくある処理ですら、こうなります。

```typescript
// 従来の方法：意図が不明瞭で、タイムゾーン依存のバグリスクがある
const today = new Date().toISOString().split("T")[0];
```

`toISOString()` は UTC
の時刻を返します。つまり、**日本時間の1月1日午前0時に実行すると、UTC
では前日の12月31日になる**という問題があります（これは実運用では問題が顕在化しにくいのでさらに厄介です）。

なお、後述しますが **Temporal API
もオプション指定を誤るとこの罠にはまる**ため、正しい使い方を把握することが重要です。

## Temporal API による解決

Temporal API を使うと、意図が明確で安全なコードが書けます。

```typescript
// ❌ 引数なし：システムのローカルタイムゾーンに依存するため、サーバー環境によって日付が変わる
const today = Temporal.Now.plainDateISO().toString();

// ✅ UTC を明示：サーバーのタイムゾーン設定に関わらず常に同じ結果になる
const today = Temporal.Now.plainDateISO("UTC").toString();
// 出力例: "2026-02-28"
```

`Temporal.Now.plainDateISO()` の引数にタイムゾーン識別子を渡すことができます。
**引数なしではシステムのローカルタイムゾーンが使われる**ため、サーバー（Deno
Deploy など）の環境によって日付がズレるリスクがあります。

:::tip サイトマップの `lastmod` など、**「今日の UTC
の日付」を決定論的に取得したい場合は `"UTC"` を明示的に指定しましょう。**
`Temporal.PlainDate`
は時刻情報を持たない「純粋な日付」を表すため、意図が明確でコードレビューも通りやすくなります。
:::

## 実際の移行

私のプロジェクトでは、サイトマップ (`sitemap.xml`) の `<lastmod>`
タグに「今日の日付」を埋め込む処理がありました。

```typescript:main.tsx
// Before: Deno 2.7以前
app.get("/sitemap.xml", (c) => {
  const today = new Date().toISOString().split("T")[0]; // タイムゾーン依存
  // ...
});
```

これを Temporal API に移行しました。

```diff_typescript:main.tsx
  app.get("/sitemap.xml", (c) => {
-   const today = new Date().toISOString().split("T")[0];
+   const today = Temporal.Now.plainDateISO("UTC").toString();
    // ...
  });
```

差分はたった1行です。`--unstable-temporal` フラグも不要です。 タイムゾーンを
`"UTC"` で明示することで、後述の CodeRabbit
によるコードレビューでも指摘を受けることなく、決定論的な日付処理が実現できます。

## Deno 2.7 かどうかの確認方法

`mise.toml` などでバージョンを管理している場合は以下で確認できます。

```bash
mise current
# deno 2.7.1
```

通常の環境では：

```bash
deno --version
# deno 2.7.1 (stable, ...)
```

## 動作確認

変更後に既存のテストと `deno audit` を実行し、すべて通過することを確認しました。

```bash
deno task check
# Task lint deno lint ✔
# Task fmt deno fmt ✔
# ...
# ok | 15 passed | 0 failed (137ms)
# No known vulnerabilities found
```

サイトマップのレスポンスも正しく出力されています。

```xml
<!-- GET /sitemap.xml -->
<lastmod>2026-02-28</lastmod>
```

## まとめ

Deno 2.7 で安定化された **Temporal API** は、従来の `Date`
オブジェクトに潜む曖昧さを一掃し、日付処理のコードをより安全で可読性の高いものにしてくれます。

`--unstable-temporal` フラグも不要になったため、**Deno 2.7
にアップデートするだけで即座に採用できます**。

既存プロジェクトへの適用も非常に簡単なので、ぜひご自身のコードでも
`new Date().toISOString().split("T")[0]`
のような箇所を探して置き換えてみてください。

## 参考

- [Deno 2.7 リリースノート](https://deno.com/blog/v2.7)
- [Temporal API ドキュメント (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)

---

※この記事の文章は、Antigravityで作成したベースをもとに、筆者が構成・加筆したものです。
