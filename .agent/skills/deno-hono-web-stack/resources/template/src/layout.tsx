import { html } from "@hono/hono/html";

export const Layout = ({ children, title }) => {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title || "Deno App"}</title>

        <!-- Pico CSS -->
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
        >

        <!-- Custom Styles -->
        <link rel="stylesheet" href="/static/style.css">

        <!-- HTMX -->
        <script src="https://unpkg.com/htmx.org@1.9.12"></script>

        <!-- Alpine.js -->
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.0/dist/cdn.min.js"
        ></script>
      </head>
      <body>
        <main class="container">
          ${children}
        </main>
      </body>
    </html>
  `;
};
