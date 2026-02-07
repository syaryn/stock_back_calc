import { html } from "hono/html";

import { Child } from "hono/jsx";

export const Layout = (props: { children: Child; title?: string }) => {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${props.title || "Stock Target Price Calculator"}</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
        />
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.5/dist/cdn.min.js"
        ></script>
        <style>
        /* Custom styles for mobile responsiveness */
        @media (max-width: 768px) {
          .responsive-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 1rem;
            padding-bottom: 1rem; /* For scrollbar space if needed */
          }
          .responsive-grid > * {
            flex: 0 0 85%; /* 85% width to peek next card */
            scroll-snap-align: center;
          }
        }
        @media (min-width: 769px) {
          .responsive-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 1.5rem;
          }
        }
        /* Card height standardization */
        .card-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        </style>
      </head>
      <body>
        <main class="container">
          ${props.children}
        </main>
      </body>
    </html>
  `;
};
