import { Context, Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { Layout } from "./views/Layout.tsx";
import { Calculator } from "./views/Calculator.tsx";
import { Guide } from "./views/Guide.tsx";
import { About } from "./views/About.tsx";
import { dictionary, Language } from "./utils/i18n.ts";
import { MarketState } from "./utils/pricing.ts";

import { serveStatic } from "hono/deno";

export const app = new Hono();
const preferredLangCookieName = "preferred_lang";

const getPreferredLanguage = (acceptLanguage: string | undefined): Language => {
  if (!acceptLanguage) return "en";

  const languages = acceptLanguage
    .split(",")
    .map((entry) => {
      const [tagPart, ...params] = entry.trim().split(";");
      const tag = tagPart.toLowerCase();
      const qValue = params.find((param) => param.trim().startsWith("q="))
        ?.split("=")[1];
      const q = qValue ? Number.parseFloat(qValue) : 1;
      return { tag, q: Number.isFinite(q) ? q : 0 };
    })
    .filter((entry) => entry.tag.length > 0 && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of languages) {
    if (tag === "ja" || tag.startsWith("ja-")) return "ja";
    if (tag === "en" || tag.startsWith("en-")) return "en";
  }

  return "en";
};

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
  <url>
    <loc>https://stock-back-calc.syaryn.com/guide/</loc>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://stock-back-calc.syaryn.com/guide/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://stock-back-calc.syaryn.com/guide/" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://stock-back-calc.syaryn.com/ja/guide/" />
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://stock-back-calc.syaryn.com/ja/guide/</loc>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://stock-back-calc.syaryn.com/guide/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://stock-back-calc.syaryn.com/guide/" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://stock-back-calc.syaryn.com/ja/guide/" />
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://stock-back-calc.syaryn.com/about/</loc>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://stock-back-calc.syaryn.com/about/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://stock-back-calc.syaryn.com/about/" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://stock-back-calc.syaryn.com/ja/about/" />
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://stock-back-calc.syaryn.com/ja/about/</loc>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://stock-back-calc.syaryn.com/about/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://stock-back-calc.syaryn.com/about/" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://stock-back-calc.syaryn.com/ja/about/" />
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`,
  );
});

app.use("/*", serveStatic({ root: "./static" }));

const renderCalculator = (c: Context, explicitLang?: string) => {
  const query = c.req.query();
  const defaultLanguage: Language = "en";

  let lang: Language = defaultLanguage;
  if (explicitLang === "en" || explicitLang === "ja") {
    lang = explicitLang;
  }

  const initialState: Partial<MarketState> = {};
  const initialTargets: { per?: number; pbr?: number; yield?: number } = {};

  if (query.stockPrice) initialState.price = parseFloat(query.stockPrice);
  if (query.currentPer) initialState.per = parseFloat(query.currentPer);
  if (query.currentPbr) initialState.pbr = parseFloat(query.currentPbr);
  if (query.currentYield) initialState.yield = parseFloat(query.currentYield);

  if (query.targetPer) initialTargets.per = parseFloat(query.targetPer);
  if (query.targetPbr) initialTargets.pbr = parseFloat(query.targetPbr);
  if (query.targetYield) initialTargets.yield = parseFloat(query.targetYield);

  const pathLang = explicitLang;

  return c.html(
    <Layout
      title={dictionary[lang].title}
      description={dictionary[lang].description}
      lang={lang}
      pathLang={pathLang}
      canonicalPath={lang === "ja" ? "/ja/" : "/"}
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

const renderGuide = (c: Context, lang: Language) => {
  const canonicalPath = lang === "ja" ? "/ja/guide/" : "/guide/";
  const articleJson = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: dictionary[lang].guideTitle,
    description: dictionary[lang].guideDescription,
    inLanguage: lang,
    url: `https://stock-back-calc.syaryn.com${canonicalPath}`,
    mainEntityOfPage: `https://stock-back-calc.syaryn.com${canonicalPath}`,
  };

  return c.html(
    <Layout
      title={dictionary[lang].guideTitle}
      description={dictionary[lang].guideDescription}
      lang={lang}
      pathLang={lang}
      canonicalPath={canonicalPath}
      pageType="article"
      structuredData={[articleJson]}
    >
      <Guide lang={lang} />
    </Layout>,
  );
};

const renderAbout = (c: Context, lang: Language) => {
  const canonicalPath = lang === "ja" ? "/ja/about/" : "/about/";
  const articleJson = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: dictionary[lang].aboutPageTitle,
    description: dictionary[lang].aboutDescription,
    inLanguage: lang,
    url: `https://stock-back-calc.syaryn.com${canonicalPath}`,
    mainEntityOfPage: `https://stock-back-calc.syaryn.com${canonicalPath}`,
  };

  return c.html(
    <Layout
      title={dictionary[lang].aboutPageTitle}
      description={dictionary[lang].aboutDescription}
      lang={lang}
      pathLang={lang}
      canonicalPath={canonicalPath}
      pageType="article"
      structuredData={[articleJson]}
    >
      <About lang={lang} />
    </Layout>,
  );
};

app.use("*", async (c, next) => {
  const lang = c.req.query("lang");
  if (lang === "ja" || lang === "en") {
    setCookie(c, preferredLangCookieName, lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "Lax",
      httpOnly: true,
    });
    const url = new URL(c.req.url);
    const isGuidePath = /\/guide\/?$/.test(url.pathname);
    const isAboutPath = /\/about\/?$/.test(url.pathname);
    url.searchParams.delete("lang");
    url.pathname = isGuidePath
      ? (lang === "ja" ? "/ja/guide/" : "/guide/")
      : isAboutPath
      ? (lang === "ja" ? "/ja/about/" : "/about/")
      : (lang === "ja" ? "/ja/" : "/");
    return c.redirect(url.toString(), 301);
  }
  await next();
});

const redirectJapaneseBrowserToLocalizedPath = async (
  c: Context,
  next: () => Promise<void>,
) => {
  const persistedLanguage = getCookie(c, preferredLangCookieName);
  if (persistedLanguage === "ja" || persistedLanguage === "en") {
    await next();
    return;
  }

  const preferredLanguage = getPreferredLanguage(
    c.req.header("accept-language"),
  );
  if (preferredLanguage === "ja") {
    const url = new URL(c.req.url);
    c.header("Vary", "Accept-Language");
    url.pathname = url.pathname === "/guide/"
      ? "/ja/guide/"
      : url.pathname === "/about/"
      ? "/ja/about/"
      : "/ja/";
    return c.redirect(url.toString(), 302);
  }

  await next();
};

app.use("/", redirectJapaneseBrowserToLocalizedPath);
app.use("/guide/", redirectJapaneseBrowserToLocalizedPath);
app.use("/about/", redirectJapaneseBrowserToLocalizedPath);

app.get("/ja/", (c) => renderCalculator(c, "ja"));
app.get("/ja", (c) => {
  const url = new URL(c.req.url);
  url.pathname = "/ja/";
  return c.redirect(url.toString(), 301);
});
app.get("/guide/", (c) => renderGuide(c, "en"));
app.get("/guide", (c) => {
  const url = new URL(c.req.url);
  url.pathname = "/guide/";
  return c.redirect(url.toString(), 301);
});
app.get("/ja/guide/", (c) => renderGuide(c, "ja"));
app.get("/ja/guide", (c) => {
  const url = new URL(c.req.url);
  url.pathname = "/ja/guide/";
  return c.redirect(url.toString(), 301);
});
app.get("/about/", (c) => renderAbout(c, "en"));
app.get("/about", (c) => {
  const url = new URL(c.req.url);
  url.pathname = "/about/";
  return c.redirect(url.toString(), 301);
});
app.get("/ja/about/", (c) => renderAbout(c, "ja"));
app.get("/ja/about", (c) => {
  const url = new URL(c.req.url);
  url.pathname = "/ja/about/";
  return c.redirect(url.toString(), 301);
});

app.get("/en/", (c) => {
  setCookie(c, preferredLangCookieName, "en", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "Lax",
    httpOnly: true,
  });
  const url = new URL(c.req.url);
  url.pathname = "/";
  return c.redirect(url.toString(), 301);
});
app.get("/en", (c) => {
  setCookie(c, preferredLangCookieName, "en", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "Lax",
    httpOnly: true,
  });
  const url = new URL(c.req.url);
  url.pathname = "/";
  return c.redirect(url.toString(), 301);
});
app.get("/en/guide/", (c) => {
  setCookie(c, preferredLangCookieName, "en", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "Lax",
    httpOnly: true,
  });
  const url = new URL(c.req.url);
  url.pathname = "/guide/";
  return c.redirect(url.toString(), 301);
});
app.get("/en/guide", (c) => {
  setCookie(c, preferredLangCookieName, "en", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "Lax",
    httpOnly: true,
  });
  const url = new URL(c.req.url);
  url.pathname = "/guide/";
  return c.redirect(url.toString(), 301);
});
app.get("/en/about/", (c) => {
  setCookie(c, preferredLangCookieName, "en", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "Lax",
    httpOnly: true,
  });
  const url = new URL(c.req.url);
  url.pathname = "/about/";
  return c.redirect(url.toString(), 301);
});
app.get("/en/about", (c) => {
  setCookie(c, preferredLangCookieName, "en", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "Lax",
    httpOnly: true,
  });
  const url = new URL(c.req.url);
  url.pathname = "/about/";
  return c.redirect(url.toString(), 301);
});

app.get("/", (c) => renderCalculator(c));

export default app;
