# [Google Antigravity] Teaching AI Agents "My Stack": Leveraging the Skill Feature

## Introduction

I managed to subscribe to Google AI Pro at half price, so I decided to build
something with it. Using "Antigravity", I developed a Stock Target Price
Calculator. Here is the completed app:

[https://stock-back-calc.syaryn.com/](https://stock-back-calc.syaryn.com/)
GitHub:
[https://github.com/syaryn/stock_back_calc](https://github.com/syaryn/stock_back_calc)

This article covers the "preparation" phase before coding. When developing with
an AI agent, typing prompts like "Use Deno, Hono, HTMX..." every time is
tedious, especially when there are many tools involved. So, I used Antigravity's
**"[Skill](https://antigravity.google/docs/skills)"** feature to **teach the
agent "my stack" and automate the environment setup.**

## What is a "Skill" in AI Agents?

In Antigravity, a "Skill" is a **"knowledge package" for the agent to execute
specific tasks.** It's similar to a "manual" or "SOP" for humans.

Normally, an AI agent only works within the current context. However, by
defining a Skill, the agent can refer to it and autonomously follow "my rules"
such as:

- "Use Deno 2.0 for this project"
- "Follow this directory structure"
- "Always run `lefthook` check before committing"

## Creating the "Deno Hono Web Stack" Skill

This time, I created a Skill to automatically set up the following modern Web
stack:

- **Runtime**: Deno 2.0
- **Backend**: Hono
- **Frontend**: HTMX + Alpine.js
- **Tools**: mise (version management), lefthook (Git hooks)

### 1. Learning the Latest Documentation (context7)

First, I needed to give the agent the latest knowledge. I registered
[context7](https://github.com/upstash/context7#installation), an
[MCP](https://antigravity.google/docs/mcp), to Antigravity to search and learn
from external documentation.

```text
Read deno, mise, lefthook, hono, htmx, picocss, alpine.js using context7
```

By instructing this, the agent understands the latest official documentation for
each library.

### 2. Generating SKILL.md

Next, based on what it learned, I had the agent generate `SKILL.md`, which is
the core of the Skill.

> "Based on the current content, create a draft of the development skill
> definition file for Deno Hono Web Stack."

The agent proposed a `SKILL.md` like this:

```markdown
---
name: deno-hono-web-stack
description: Expert assistance for developing web applications using Deno, Hono, Htmx, PicoCSS, Alpine.js, and Lefthook.
---

# Deno Hono Web Stack Skill

## When to use this skill

- Setting up a new web project with the Deno/Hono stack.
- Implementing server-side rendering (SSR) with Hono's JSX middleware.

## Quick Start (New Project)

To create a new project using the bundled template:

1. Copy the contents of `resources/template/` to the project root.
2. Run `mise install` to set up the environment.
```

As you can see, **"When to use"** and **"How to use"** are described in
Markdown.

### 3. Generating Templates

Furthermore, I had the agent generate templates for configuration files.

> "Create recommended configuration files for these tools (Deno, mise, lefthook)
> in the Skill's resources directory."

With this instruction, the following files were automatically generated and
packaged as part of the Skill.

- `resources/deno.json`: Task definitions (e.g., `deno task check`)
- `resources/mise.toml`: Tool version locking
- `resources/lefthook.yml`: Lint/Format check before commit

By including these in the Skill, the agent refers to them and expands them when
creating a project.

## Result: Environment Setup with a Single Command

After the Skill creation was complete, I instructed the agent:

> "Set up a new project using the deno-hono-web-stack skill."

The agent expanded the templates according to the Skill definition and
automatically executed setup commands like `mise install`. My "usual development
environment" was built in an instant.

All humans have to do is focus on **"the logic of what we want to build."**

## Next: Implementation

Now that the environment setup is complete, we move on to the actual app
implementation. I will introduce the process of building a blazing fast Web app
with Deno 2.0 + Hono + HTMX + Alpine.js, without using React.

[https://stock-back-calc.syaryn.com/](https://stock-back-calc.syaryn.com/)

Next Article: **[Deno 2.0] Building a Stock Simulator without React (Hono +
HTMX + Alpine.js)**

---

_This article is an English translation of a Japanese article based on a draft
created by Antigravity._
