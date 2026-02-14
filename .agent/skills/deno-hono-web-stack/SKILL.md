---
name: deno-hono-web-stack
description: Expert assistance for developing web applications using Deno, Hono, Htmx, PicoCSS, Alpine.js, and Lefthook. Use this for project setup, backend API implementation, frontend interactivity, and development workflows.
---

# Deno Hono Web Stack Skill

This skill provides guidelines, templates, and best practices for building
modern, lightweight web applications using the following stack:

- **Runtime**: Deno
- **Framework**: Hono (v4+)
- **Interactivity**: Htmx + Alpine.js
- **Styling**: Pico CSS (Class-less/Minimalist)
- **Workflow**: Lefthook (Git hooks)

## When to use this skill

- Setting up a new web project with the Deno/Hono stack.
- Implementing server-side rendering (SSR) with Hono's JSX middleware.
- Adding dynamic behavior using Htmx attributes (`hx-get`, `hx-post`, etc.).
- Creating client-side interactivity with Alpine.js (`x-data`, `x-on`, etc.).
- Configuring development tasks and git hooks.

## Quick Start (New Project)

To create a new project using the bundled template:

1. Copy the contents of `resources/template/` to the project root.
2. Copy `resources/deno.json`, `resources/lefthook.yml`, and
   `resources/mise.toml` to the project root.
3. Run `mise install` to set up the environment.
4. Run `mise run hook` to setup git hooks.

## Guidelines & Best Practices

### 1. Project Structure

Maintain a clean separation of concerns:

```
/
├── deno.json        # Deno Configuration
├── mise.toml        # Tool Versions & High-level Tasks
├── lefthook.yml     # Git Hooks
├── src/
│   ├── main.ts      # App Entry Point
│   └── ...
```

### 4. Development Workflow

- **Task Runner**: Use `mise` as the primary entry point.
  - `mise run dev`: Start dev server.
  - `mise run test`: Run tests.
- **Environment**: Use `mise.toml` to lock tool versions (Deno, etc.).
- **Git Hooks**: Use Lefthook (integrated via `mise run hook`) to enforce
  linting.

## Resources

The `resources/` directory contains:

- `deno.json`: Recommended configuration.
- `lefthook.yml`: Pre-commit hooks for `deno lint` and `deno fmt`.
- `template/`: Minimal boilerplates for `src/`.
