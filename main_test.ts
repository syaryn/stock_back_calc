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
});

Deno.test("GET /ja/ returns Japanese", async () => {
  const req = new Request("http://localhost:8000/ja/");
  const res = await app.request(req);
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, "現在値");
});

Deno.test("GET /favicon.ico returns 200", async () => {
  const req = new Request("http://localhost:8000/favicon.ico");
  const res = await app.request(req);
  assertEquals(res.status, 200);
  const blob = await res.blob();
  assertEquals(blob.size > 0, true);
});

Deno.test("GET /?stockPrice=1000&currentPer=10&targetPer=15 returns calculated result", async () => {
  // Input: Price 1000, PER 10 => EPS 100
  // Target: PER 15 => Price 1500
  const req = new Request(
    "http://localhost:8000/?stockPrice=1000&currentPer=10&targetPer=15",
  );
  const res = await app.request(req);
  assertEquals(res.status, 200);

  const text = await res.text();
  // Check that input value is set in the Alpine.js data
  assertStringIncludes(text, "stockPrice: 1000");
  assertStringIncludes(text, "currentPer: 10");
  assertStringIncludes(text, "targetPer: 15");

  // Logic Injection check
  assertStringIncludes(text, "const calculateFundamentals =");
});
