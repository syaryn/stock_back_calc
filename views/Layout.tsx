import { html, raw } from "hono/html";

import { Child } from "hono/jsx";

export const Layout = (
  props: {
    title: string;
    description?: string;
    lang?: string;
    queryParams?: Record<string, string>;
    children?: Child;
  },
) => {
  const title = props.title || "Stock Target Price Calculator";
  const description = props.description ||
    "Calculate theoretical stock prices based on target PER, PBR, and Dividend Yield. A free simulator for value investors.";
  const baseUrl = "https://stock-back-calc.syaryn.com/";

  // Construct the canonical URL preserving the language parameter if needed
  let currentUrl = baseUrl;
  if (props.lang && props.lang !== "en") {
    currentUrl = `${baseUrl}?lang=${props.lang}`;
  } else if (props.lang === "en") {
    currentUrl = `${baseUrl}?lang=en`;
  }

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title,
    "url": currentUrl,
    "description": description,
    "image": `${baseUrl}og-image.png`,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "inLanguage": ["en", "ja"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "PER-based target price calculation",
      "PBR-based target price calculation",
      "Dividend yield-based target price calculation",
      "Bottleneck indicator detection",
      "Margin of safety analysis",
    ],
  };

  return html`
    <!DOCTYPE html>
    <html lang="${props.lang || "en"}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />
        <title>${title}</title>
        <link rel="canonical" href="${currentUrl}" />
        <link rel="alternate" hreflang="en" href="${baseUrl}?lang=en" />
        <link rel="alternate" hreflang="ja" href="${baseUrl}?lang=ja" />
        <link rel="alternate" hreflang="x-default" href="${baseUrl}" />

        <!-- Open Graph -->
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:url" content="${currentUrl}" />
        <meta property="og:image" content="${baseUrl}og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Stock Target Price Calculator" />

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${baseUrl}og-image.png" />

        <!-- JSON-LD Structured Data -->
        <script type="application/ld+json">
        ${raw(JSON.stringify(ldJson))}
        </script>

        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/picocss/2.1.1/pico.min.css"
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/htmx/2.0.7/htmx.min.js"
          defer
        ></script>
        <script
          defer
          src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.15.0/cdn.min.js"
        ></script>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
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
