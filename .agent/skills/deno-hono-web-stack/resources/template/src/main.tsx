import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { jsxRenderer } from "@hono/hono/jsx-renderer";
import { Layout } from "./layout.tsx";

const app = new Hono();

// Serve static files
app.use("/static/*", serveStatic({ root: "./src/public" }));

// Apply layout to all routes
app.use(
  "*",
  jsxRenderer(({ children, title }) => {
    return <Layout title={title}>{children}</Layout>;
  }),
);

app.get("/", (c) => {
  return c.render(
    <div class="container">
      <h1>Hello, Deno + Hono!</h1>
      <p>
        Currently running with <span x-data="{v:'Alpine.js'}" x-text="v"></span>
        {" "}
        and
        <a href="https://htmx.org" target="_blank">HTMX</a>.
      </p>
      <button type="button" hx-post="/api/clicked" hx-swap="outerHTML">
        Click Me (HTMX)
      </button>
    </div>,
    { title: "Home" },
  );
});

app.post("/api/clicked", (c) => {
  return c.html(<button type="button" disabled>Clicked! (HTMX worked)</button>);
});

Deno.serve(app.fetch);
