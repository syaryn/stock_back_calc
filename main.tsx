import { Hono } from "hono";
import { Layout } from "./views/Layout.tsx";
import { Calculator } from "./views/Calculator.tsx";
import { detectLanguage } from "./utils/i18n.ts";
import { MarketState } from "./utils/pricing.ts";

import { serveStatic } from "hono/deno";

export const app = new Hono();

app.use("/*", serveStatic({ root: "./static" }));

app.get("/", (c) => {
  const acceptLanguage = c.req.header("Accept-Language") || null;
  const lang = detectLanguage(acceptLanguage);

  // Parse Query Params for Initial State (SSR/Testing)
  const query = c.req.query();
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
    <Layout>
      <Calculator
        lang={lang}
        initialState={initialState}
        initialTargets={initialTargets}
      />
    </Layout>,
  );
});

export default app;
