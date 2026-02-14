# 【Deno 2.0】Reactなしで構築する株価シミュレーター開発ログ (Hono + HTMX + Alpine.js)

## はじめに

Google AI Pro を活用して、株価逆算シミュレーターを開発しました。
前回の記事では、開発に入る前の「環境構築」をAIエージェントに自律的に行わせるプロセスを紹介しました。

今回は、その環境上でエージェントと共に実装したWebアプリケーション**「Stock
Target Price Calculator (目標株価逆算ツール)」**の中身について解説します。

完成したアプリはこちらです。

https://stock-back-calc.syaryn.com/

## 技術選定：シンプルさを追求する

今回の開発テーマは**「Reactを使わずに、現代的な開発体験とパフォーマンスを両立する」**ことでした。
そのため、以下の技術スタックを選定しました。

- **Runtime**: [Deno 2.0](https://deno.com/)
  - Node.js互換性が向上し、npmパッケージもスムーズに使えるようになった最新バージョンです。
  - 標準でTypeScriptをサポートしており、設定ファイル地獄から解放されます。
- **Backend**: [Hono](https://hono.dev/)
  - Web標準APIに準拠した超高速Webフレームワーク。
  - Deno、Cloudflare Workers、Node.jsなどどこでも動きます。
- **Frontend**: [HTMX](https://htmx.org/) + [Alpine.js](https://alpinejs.dev/)
  - **HTMX**: HTML属性だけでAjaxリクエストやDOM更新を行うライブラリ。
  - **Alpine.js**:
    HTMLに直接リアクティビティを記述できる軽量ライブラリ。Vue.jsのような構文で書けます。
- **CSS**: [Pico.css](https://picocss.com/)
  - クラスレスCSSフレームワーク。HTMLタグを書くだけで、いい感じのデザインになります。

これらを組み合わせることで、**ビルドステップなし、複雑な構成なし**で、サクサク動くWebアプリを作ることができました。

## 実装のポイント

### 1. HonoによるSSR (Server-Side Rendering)

画面のレンダリングはHonoのJSX Middlewareを使用しています。
Reactのような書き心地ですが、サーバーサイドでHTML文字列に変換されてクライアントに送信されます。

```tsx:src/server.tsx
app.get('/', (c) => {
  return c.html(
    <Layout>
      <main class="container">
        <h1>目標株価逆算ツール</h1>
        {/* ... */}
      </main>
    </Layout>
  )
})
```

これにより、初期表示が非常に高速になります。

### 2. Alpine.jsによるクライアントサイド計算 (Activity的な役割)

「目標株価」の計算ロジックは、サーバーへの通信を行わず、クライアントサイド（ブラウザ）で完結させています。
ここでAlpine.jsが活躍します。

参考にした[記事](https://qiita.com/soysauce/items/1e648a6825e86cff3c29)では、**「HTMXがFragment（画面の断片）、Alpine.jsがActivity（画面の振る舞い）」**を担うというアーキテクチャが提唱されています。
今回のアプリでも、以下のように役割を分担しました。

- **HTMX**: サーバーとの通信、画面遷移（今回はSSRメインなので出番は控えめ）
- **Alpine.js**: 入力値の計算、即時のUI反映（Activity的な役割）

```html
<div
  x-data="{ 
    currentPrice: 1000, 
    targetReturn: 10,
    get targetPrice() {
        return this.currentPrice * (1 + this.targetReturn / 100);
    }
}"
>
  <label>
    現在株価:
    <input type="number" x-model.number="currentPrice">
  </label>
  <label>
    目標リターン (%):
    <input type="number" x-model.number="targetReturn">
  </label>

  <p>目標株価: <span x-text="targetPrice"></span> 円</p>
</div>
```

`x-data` で状態を定義し、`x-model` で入力値とバインド、`x-text`
で計算結果を表示します。
このように、**「サーバーに聞くまでもない計算」をAlpine.js（Activity）に任せる**ことで、ユーザー体験を損なうことなく実装をシンプルに保てました。
JavaScriptを別ファイルに書くことなく、HTMLの中にロジックを凝縮できるのも大きなメリットです。

### 3. Pico.cssによる爆速UI構築

デザインに関しては、Pico.cssを採用したことで、CSSをほとんど書かずに済みました。
セマンティックなHTML（`<header>`, `<main>`, `<article>`,
`<button>`）を書くだけで、レスポンシブ対応の整ったデザインが適用されます。

```html
<article>
  <header>計算結果</header>
  ...
  <footer>
    <button class="secondary">リセット</button>
  </footer>
</article>
```

## 開発環境 (Skillの恩恵)

前回の記事で作成した「Skill」のおかげで、開発環境の構築はエージェント任せで完了しました。

- **`mise`**: エージェントが自動で `mise install`
  を実行し、Denoのバージョン管理やタスクランナーを準備。
- **`lefthook`**:
  コミット前のLint/Formatチェックも、エージェントが配置した設定ファイルにより自動化。

あとは「アプリを作って」と指示するだけで、**「環境構築の試行錯誤」ゼロ時間**で、最初から実装に集中できました。

## 圧倒的な軽量性

完成したアプリのパフォーマンスを確認すると、かなり軽量なページにできました。

- **HTML**: 約25KB
- **JS/CSS (Gzipped)**: 合計 約40KB程度 (HTMX + Alpine.js + Pico.css)

ReactやNext.jsで作られた同様のアプリが、初期ロードで数百KB〜数MBのJavaScriptを読み込むのに対し、このスタックでは**合計50KB〜100KB程度**に収まっています。
モバイル回線でも一瞬で表示され、Lighthouseのスコアも自然と高くなりました。

## まとめ

Deno 2.0 + Hono + HTMX + Alpine.js + Pico.css
というスタックは、**「小〜中規模の個人開発」において始めやすい組み合わせ**の一つだと感じました。

- **シンプル**: 複雑なビルド設定がない。
- **高速**: DenoとHonoのパフォーマンス。
- **楽**: HTML中心の開発体験。

ReactやNext.jsがオーバースペックに感じる時は、ぜひこのスタックを検討してみてください。

https://stock-back-calc.syaryn.com/

## 参考記事

開発のプロセスや設計思想は自分で思いついたわけではなく、以下の記事を最初に参考にさせていただきました。
特にHTMXをAlpine.jsで補う考え方は、自分では思いもよりませんでした。

https://qiita.com/soysauce/items/1e648a6825e86cff3c29
https://qiita.com/twrcd1227/items/d47781403ec9a3c00449

---

※この記事の文章は、Antigravityで作成したベースをもとに、筆者が構成・加筆したものです。
