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

  // Canonical URL: English → root (/), Japanese → /?lang=ja
  const explicitLang = props.queryParams?.lang || props.lang;
  const isJa = explicitLang === "ja";
  const currentUrl = isJa ? `${baseUrl}?lang=ja` : baseUrl;

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

  const faqJson = isJa
    ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "目標株価とは何ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "目標株価とは、投資家が「この価格なら買いたい」と考える基準価格のことです。PER（株価収益率）・PBR（株価純資産倍率）・配当利回りなどの財務指標をもとに計算することで、感覚ではなく根拠のある指値を設定できます。",
          },
        },
        {
          "@type": "Question",
          "name": "PERとPBRの違いは何ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "PER（Price Earnings Ratio）は企業の「稼ぐ力（EPS）」に基準を置いた割安度指標です。PBR（Price Book-value Ratio）は企業の「純資産（BPS）」に基準を置いた指標で、PBR1倍以下は解散価値割れとも言われます。",
          },
        },
        {
          "@type": "Question",
          "name": "配当利回りを基準に株価を計算するメリットは？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "配当利回りを基準にすると「このくらいの利回りになったら買いたい」という明確な基準で目標株価を設定できます。例えば、利回り3%の銘柄を「4%になったら買う」と決めれば、ツールが自動で目標株価を算出します。",
          },
        },
        {
          "@type": "Question",
          "name": "このツールは無料で使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "はい、完全無料でご利用いただけます。登録不要で、すべての機能をそのままご利用いただけます。",
          },
        },
        {
          "@type": "Question",
          "name": "EPSとPERから目標株価を計算するには？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "現在の株価と現在PERを入力すると、ツールが内部でEPS（= 株価 ÷ 現在PER）を計算します。次に目標PERを設定すれば、目標株価 = EPS × 目標PER が自動で算出されます。",
          },
        },
      ],
    }
    : {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a stock target price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "A stock target price is a calculated price at which an investor would consider buying a stock. By using financial metrics like PER (Price-to-Earnings Ratio), PBR (Price-to-Book Ratio), and dividend yield, investors can set data-driven limit orders instead of arbitrary ones.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the difference between PER and PBR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "PER (Price-to-Earnings Ratio) measures how expensive a stock is relative to a company's earnings power (EPS). PBR (Price-to-Book Ratio) measures a stock's price relative to its net assets (BPS). A PBR below 1x is generally considered undervalued relative to book value.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the advantage of using dividend yield as a target?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Setting a target dividend yield gives you a clear, actionable buy price. For example, if a stock yields 3% and you want to buy it at a 4% yield, this tool instantly calculates the exact price you need to place your limit order at.",
          },
        },
        {
          "@type": "Question",
          "name": "Is this tool free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes, this tool is completely free to use. No registration is required, and all features are available without any cost.",
          },
        },
        {
          "@type": "Question",
          "name": "How do I calculate a target stock price using EPS and PER?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Enter the current stock price and current PER. The tool will derive the implied EPS (= Stock Price / Current PER). Then set your Target PER, and the tool will calculate: Target Price = EPS × Target PER.",
          },
        },
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
        <link rel="alternate" hreflang="en" href="${baseUrl}" />
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
        ${raw(JSON.stringify(ldJson).replace(/\//g, "\\/"))}
        </script>
        <script type="application/ld+json">
        ${raw(JSON.stringify(faqJson).replace(/\//g, "\\/"))}
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
