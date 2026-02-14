# 【Google Antigravity】AIエージェントに「マイスタック」を教える：Skill機能の活用

## はじめに

Google AI Pro を
半額で契約できたのでせっかくだから何か作ってみようと思い、「Antigravity」を使って、株価逆算シミュレーターを開発しました。
完成したアプリはこちらです。

https://stock-back-calc.syaryn.com/

この記事は、コーディングに入る「事前準備」の話になります。
AIエージェントを使って開発をする際、「Denoで、Honoで、HTMXで...」と毎回プロンプトに入力するのは面倒ですし、数が多いと大変です。
そこで、Antigravityの
**「[Skill（スキル）](https://antigravity.google/docs/skills)」**機能を使って、**「マイスタック」をエージェントに教え込み、環境構築を自動化**させてみました。

## AIエージェントにおける「Skill」とは？

Antigravityにおける「Skill」とは、**エージェントが特定のタスクを実行するための「知識パッケージ」**のことです。
人間で言えば「マニュアル」や「手順書」に近いものです。

通常、AIエージェントはその場のコンテキストでしか動きませんが、Skillを定義しておくと、エージェントはそれを参照して：

- 「このプロジェクトではDeno 2.0を使う」
- 「ディレクトリ構成はこうする」
- 「コミット前には必ず `lefthook` でチェックする」

といった**「マイルール」**を自律的に守ってくれるようになります。

## 「Deno Hono Web Stack」Skillの作成

今回は、以下のモダンWebスタックを自動構築するSkillを作成しました。

- **Runtime**: Deno 2.0
- **Backend**: Hono
- **Frontend**: HTMX + Alpine.js
- **Tools**: mise (バージョン管理), lefthook (Git hooks)

### 1. 最新ドキュメントの学習 (context7)

まず、エージェントに最新の知識を与える必要があります。Antigravityに事前に
[context7](https://github.com/upstash/context7#installation)
という[MCP](https://antigravity.google/docs/mcp)を登録して、外部のドキュメントを検索・学習できます。

```text
context7でdeno, mise, lefthook, hono, htmx, picocss, alpine.jsを読み込んで
```

と指示することで、エージェントは各ライブラリの最新の公式ドキュメントを理解します。

### 2. SKILL.md の生成

次に、学習した内容を元に、Skillの本体となる `SKILL.md`
をエージェントに生成させました。

> 「今の内容を元に、Deno Hono Web
> Stackの開発スキル定義ファイルのドラフトを作成して」

と指示すると、以下のような `SKILL.md` ができます。

```markdown
---
name: deno-hono-web-stack
description: Expert assistance for developing web applications using Deno, Hono, Htmx, PicoCSS, Alpine.js, and Lefthook.
---

# Deno Hono Web Stack Skill

## When to use this skill

- Setting up a new web project with the Deno/Hono stack.
- implementing server-side rendering (SSR) with Hono's JSX middleware.

## Quick Start (New Project)

To create a new project using the bundled template:

1. Copy the contents of `resources/template/` to the project root.
2. Run `mise install` to set up the environment.
```

このように、**「いつ使うか」「どう使うか」**がMarkdownで記述されています。

### 3. テンプレートの生成

さらに、設定ファイルのテンプレートもエージェントに生成してもらいました。

> 「これらのツール（Deno, mise,
> lefthook）の推奨設定ファイルを、Skillのresourcesディレクトリに作成して」

この指示で、以下のファイル群が自動生成され、Skillとしてパッケージ化されます。

- `resources/deno.json`: タスク定義 (`deno task check` など)
- `resources/mise.toml`: ツールのバージョン固定
- `resources/lefthook.yml`: コミット前のLint/Formatチェック

これらをSkillに同梱しておくことで、プロジェクト作成時にエージェントがこれらを参照し、展開してくれます。

## 成果：コマンド一つで環境構築

Skillの作成が完了した後、エージェントにこう指示しました。

> 「deno-hono-web-stackスキルを使って、新規プロジェクトをセットアップして」

すると、エージェントはSkillの定義に従ってテンプレートを展開し、`mise install`
などのセットアップコマンドを自動実行。
一瞬で「いつもの開発環境」が構築されました。

人間がやるべきは、**「作りたいもののロジック」**に集中することだけです。

## 次回：実装編

環境構築が完了したので、次はいよいよアプリの実装に入ります。 Reactを使わず、Deno
2.0 + Hono + HTMX + Alpine.jsで爆速Webアプリを作る過程を紹介します。

**[Stock Target Price Calculator (目標株価逆算ツール)](https://stock-back-calc.syaryn.com/)**

次回記事： **【Deno 2.0】Reactなしで構築する株価シミュレーター開発ログ (Hono +
HTMX + Alpine.js)**

---

※この記事の文章は、Antigravityで作成したベースをもとに、筆者が構成・加筆したものです。
