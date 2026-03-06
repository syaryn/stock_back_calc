import { assertEquals, assertStringIncludes } from "@std/assert";
import { i18nConfig } from "./utils/i18n.ts";
import { app } from "./main.tsx";

Deno.test("i18n config has default locale", () => {
  assertEquals(i18nConfig.defaultLocale, "en");
});

Deno.test("GET / defaults to English", async () => {
  const req = new Request("http://localhost:8000/");
  const res = await app.request(req);
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, "Current Values");
  assertStringIncludes(text, "Read the guide");
});

Deno.test("GET /ja/ returns Japanese", async () => {
  const req = new Request("http://localhost:8000/ja/");
  const res = await app.request(req);
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, "現在値");
  assertStringIncludes(text, "感覚ではなく条件で目標株価を決める");
});

Deno.test("GET /guide/ returns guide page metadata", async () => {
  const req = new Request("http://localhost:8000/guide/");
  const res = await app.request(req);
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(
    text,
    "How to Set a Stock Target Price with PER, PBR, and Dividend Yield",
  );
  assertStringIncludes(
    text,
    'rel="canonical" href="https://stock-back-calc.syaryn.com/guide/"',
  );
});

Deno.test("GET /ja/guide/ returns Japanese guide", async () => {
  const req = new Request("http://localhost:8000/ja/guide/");
  const res = await app.request(req);
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, "目標株価の決め方ガイド");
  assertStringIncludes(text, "計算ツールを開く");
});

Deno.test("GET /favicon.ico returns 200", async () => {
  const req = new Request("http://localhost:8000/favicon.ico");
  const res = await app.request(req);
  assertEquals(res.status, 200);
  const blob = await res.blob();
  assertEquals(blob.size > 0, true);
});

Deno.test("GET /sitemap.xml includes guide pages only as fixed URLs", async () => {
  const req = new Request("http://localhost:8000/sitemap.xml");
  const res = await app.request(req);
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, "https://stock-back-calc.syaryn.com/guide/");
  assertStringIncludes(text, "https://stock-back-calc.syaryn.com/ja/guide/");
});

Deno.test("GET /?stockPrice=1000&currentPer=10&targetPer=15 returns calculated result", async () => {
  const req = new Request(
    "http://localhost:8000/?stockPrice=1000&currentPer=10&targetPer=15",
  );
  const res = await app.request(req);
  assertEquals(res.status, 200);

  const text = await res.text();
  assertStringIncludes(text, "stockPrice: 1000");
  assertStringIncludes(text, "currentPer: 10");
  assertStringIncludes(text, "targetPer: 15");
  assertStringIncludes(text, "const calculateFundamentals =");
});
