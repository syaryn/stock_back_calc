import { Context, Hono } from "hono";
import { Layout } from "./views/Layout.tsx";
import { Calculator } from "./views/Calculator.tsx";
import { dictionary, Language } from "./utils/i18n.ts";
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
  const today = Temporal.Now.plainDateISO("UTC").toString();
  c.header("Content-Type", "application/xml; charset=utf-8");
  return c.body(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://stock-back-calc.syaryn.com/</loc>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://stock-back-calc.syaryn.com/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://stock-back-calc.syaryn.com/" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://stock-back-calc.syaryn.com/ja/" />
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://stock-back-calc.syaryn.com/ja/</loc>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://stock-back-calc.syaryn.com/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://stock-back-calc.syaryn.com/" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://stock-back-calc.syaryn.com/ja/" />
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`,
  );
});

app.use("/*", serveStatic({ root: "./static" }));

// Handler for rendering Calculator
const renderCalculator = (c: Context, explicitLang?: string) => {
  const query = c.req.query();

  const defaultLanguage: Language = "en";

  let lang: Language = defaultLanguage;
  if (explicitLang === "en" || explicitLang === "ja") {
    lang = explicitLang;
  }

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

  // pathLang communicates to the layout if we are physically on a language path
  const pathLang = explicitLang;

  return c.html(
    <Layout
      title={dictionary[lang].title}
      description={dictionary[lang].description}
      lang={lang}
      pathLang={pathLang}
    >
      <Calculator
        lang={lang}
        initialState={initialState}
        initialTargets={initialTargets}
        queryParams={query}
        pathLang={pathLang}
      />
    </Layout>,
  );
};

// Redirect middleware for old query params
app.use("*", async (c, next) => {
  const lang = c.req.query("lang");
  if (lang === "ja" || lang === "en") {
    const url = new URL(c.req.url);
    url.searchParams.delete("lang");
    url.pathname = lang === "ja" ? "/ja/" : "/"; // normalize en to /
    return c.redirect(url.toString(), 301);
  }
  await next();
});

// Route /ja/ specifically
app.get("/ja/", (c) => renderCalculator(c, "ja"));
app.get("/ja", (c) => {
  const url = new URL(c.req.url);
  url.pathname = "/ja/";
  return c.redirect(url.toString(), 301);
});

// Redirect /en/ or /en back to canonical index (/)
app.get("/en/", (c) => {
  const url = new URL(c.req.url);
  url.pathname = "/";
  return c.redirect(url.toString(), 301);
});
app.get("/en", (c) => {
  const url = new URL(c.req.url);
  url.pathname = "/";
  return c.redirect(url.toString(), 301);
});

// Default route
app.get("/", (c) => renderCalculator(c));

export default app;
