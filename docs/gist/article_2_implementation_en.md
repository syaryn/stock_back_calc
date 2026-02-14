# [Deno 2.0] Building a Stock Simulator without React (Hono + HTMX + Alpine.js)

## Introduction

I developed a Stock Target Price Calculator using Google AI Pro. In a separate
article, I introduced the process of letting an AI agent autonomously perform
"environment setup" before starting development.

This time, I will explain the internals of the Web application **"Stock Target
Price Calculator"** implemented with the agent on that environment.

Here is the completed app:

[https://stock-back-calc.syaryn.com/](https://stock-back-calc.syaryn.com/)
GitHub:
[https://github.com/syaryn/stock_back_calc](https://github.com/syaryn/stock_back_calc)

## Technology Selection: Pursuing Simplicity

The theme of this development was **"To achieve both a modern developer
experience and high performance without using React."** Therefore, I selected
the following technology stack:

- **Runtime**: [Deno 2.0](https://deno.com/)
  - The latest version with improved Node.js compatibility and smooth npm
    package usage.
  - It supports TypeScript by default, freeing us from configuration hell.
- **Backend**: [Hono](https://hono.dev/)
  - An ultra-fast Web framework compliant with Web standard APIs.
  - It runs anywhere: Deno, Cloudflare Workers, Node.js, etc.
- **Frontend**: [HTMX](https://htmx.org/) + [Alpine.js](https://alpinejs.dev/)
  - **HTMX**: A library to perform Ajax requests and DOM updates using only HTML
    attributes.
  - **Alpine.js**: A lightweight library to describe reactivity directly in
    HTML. You can write it with syntax similar to Vue.js.
- **CSS**: [Pico.css](https://picocss.com/)
  - A class-less CSS framework. Just writing HTML tags applies a nice design.

By combining these, I was able to create a snappy Web app with **no build steps
and no complex configuration**.

## Implementation Points

### 1. SSR (Server-Side Rendering) with Hono

Screen rendering uses Hono's JSX Middleware. It feels like writing React, but it
is converted to HTML strings on the server side and sent to the client.

```tsx:src/server.tsx
app.get('/', (c) => {
  return c.html(
    <Layout>
      <main class="container">
        <h1>Stock Target Price Calculator</h1>
        {/* ... */}
      </main>
    </Layout>
  )
})
```

This makes the initial display extremely fast.

### 2. Client-side Calculation with Alpine.js (Role of Activity)

The "Target Price" calculation logic is completed on the client side (browser)
without communicating with the server. This is where Alpine.js comes in.

The architecture proposed by the community suggests that **"HTMX handles
Fragments (screen fragments) and Alpine.js handles Activity (screen
behavior)."** In this app, I divided the roles as follows:

- **HTMX**: Server communication, screen transitions (modest usage since SSR is
  main)
- **Alpine.js**: Input value calculation, immediate UI reflection (Activity
  role)

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
    Current Price:
    <input type="number" x-model.number="currentPrice">
  </label>
  <label>
    Target Return (%):
    <input type="number" x-model.number="targetReturn">
  </label>

  <p>Target Price: <span x-text="targetPrice"></span> JPY</p>
</div>
```

State is defined with `x-data`, bound to input values with `x-model`, and
calculation results are displayed with `x-text`. By delegating **"calculations
that don't need to ask the server" to Alpine.js (Activity)**, I kept the
implementation simple without compromising user experience. Being able to
strictly contain logic within HTML without writing JavaScript in a separate file
is also a big advantage.

### 3. Blazing Fast UI Construction with Pico.css

Regarding design, adopting Pico.css meant I hardly had to write any CSS. Just
writing semantic HTML (`<header>`, `<main>`, `<article>`, `<button>`) applies a
responsive layout and design.

```html
<article>
  <header>Result</header>
  ...
  <footer>
    <button class="secondary">Reset</button>
  </footer>
</article>
```

## Development Environment (Benefits of Skill)

Thanks to the "Skill" created in the previous article, the development
environment setup was completed by leaving it to the agent.

- **`mise`**: The agent automatically executes `mise install` to prepare Deno
  version management and task runners.
- **`lefthook`**: Lint/Format checks before commit are also automated by
  configuration files placed by the agent.

After that, just by instructing "Create the app," I could focus on
implementation from the start with **zero time spent on trial and error of
environment setup.**

## Overwhelming Lightweightness

Checking the performance of the completed app, it turned out to be a very
lightweight page.

- **HTML**: Approx. 25KB
- **JS/CSS (Gzipped)**: Total approx. 40KB (HTMX + Alpine.js + Pico.css)

While similar apps built with React or Next.js load hundreds of KB to several MB
of JavaScript on initial load, this stack stays within **50KB to 100KB in
total**. It displays instantly even on mobile networks, and the Lighthouse score
naturally became high.

## Summary

I felt that the stack of Deno 2.0 + Hono + HTMX + Alpine.js + Pico.css is **one
of the easiest combinations to start with for "small to medium-scale personal
development."**

- **Simple**: No complex build settings.
- **Fast**: Performance of Deno and Hono.
- **Easy**: HTML-centric development experience.

When React or Next.js feels like overkill, please consider this stack.

[https://stock-back-calc.syaryn.com/](https://stock-back-calc.syaryn.com/)

---

_This article is an English translation of a Japanese article based on a draft
created by Antigravity._
