import { Hono } from "hono";
import { Layout } from "./views/Layout.tsx";
import { Calculator } from "./views/Calculator.tsx";
import { detectLanguage, dictionary } from "./utils/i18n.ts";
import { MarketState } from "./utils/pricing.ts";

import { serveStatic } from "hono/deno";

export const app = new Hono();

app.get("/robots.txt", (c) => {
  return c.text(
    `User-agent: *
Allow: /
Sitemap: https://stock-back-calc.syaryn.com/sitemap.xml`,
  );
});

app.get("/sitemap.xml", (c) => {
  c.header("Content-Type", "application/xml; charset=utf-8");
  return c.body(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://stock-back-calc.syaryn.com/</loc>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://stock-back-calc.syaryn.com/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://stock-back-calc.syaryn.com/?lang=en" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://stock-back-calc.syaryn.com/?lang=ja" />
    <lastmod>2026-02-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://stock-back-calc.syaryn.com/?lang=en</loc>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://stock-back-calc.syaryn.com/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://stock-back-calc.syaryn.com/?lang=en" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://stock-back-calc.syaryn.com/?lang=ja" />
    <lastmod>2026-02-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://stock-back-calc.syaryn.com/?lang=ja</loc>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://stock-back-calc.syaryn.com/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://stock-back-calc.syaryn.com/?lang=en" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://stock-back-calc.syaryn.com/?lang=ja" />
    <lastmod>2026-02-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`,
  );
});

app.use("/*", serveStatic({ root: "./static" }));

app.get("/", (c) => {
  const query = c.req.query();

  const acceptLanguage = c.req.header("Accept-Language") || null;
  const langFromHeader = detectLanguage(acceptLanguage);

  const langParam = query.lang;
  const lang = (langParam === "en" || langParam === "ja")
    ? langParam
    : langFromHeader;

  // Parse Query Params for Initial State (SSR/Testing)
  const initialState: Partial<MarketState> = {};
  const initialTargets: { per?: number; pbr?: number; yield?: number } = {};

  if (query.stockPrice) initialState.price = parseFloat(query.stockPrice);
  if (query.currentPer) initialState.per = parseFloat(query.currentPer);
  if (query.currentPbr) initialState.pbr = parseFloat(query.currentPbr);
  if (query.currentYield) initialState.yield = parseFloat(query.currentYield);

  if (query.targetPer) initialTargets.per = parseFloat(query.targetPer);
  if (query.targetPbr) initialTargets.pbr = parseFloat(query.targetPbr);
  if (query.targetYield) initialTargets.yield = parseFloat(query.targetYield);

  return c.html(
    <Layout
      title={dictionary[lang].title}
      description={dictionary[lang].description}
      lang={lang}
      queryParams={query}
    >
      <Calculator
        lang={lang}
        initialState={initialState}
        initialTargets={initialTargets}
        queryParams={query}
      />
    </Layout>,
  );
});

export default app;
