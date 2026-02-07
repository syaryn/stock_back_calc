import { assertEquals, assertStringIncludes } from "@std/assert";
import { detectLanguage, i18nConfig } from "./utils/i18n.ts";
import { app } from "./main.tsx";

Deno.test("i18n config has default locale", () => {
  assertEquals(i18nConfig.defaultLocale, "en");
});

Deno.test("GET / with valid accept-language header returns English", async () => {
  const req = new Request("http://localhost:8000/", {
    headers: { "Accept-Language": "en-US,en;q=0.9" },
  });
  const res = await app.request(req);
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, "Current Values");
});

Deno.test("GET / with Japanese accept-language header returns Japanese", async () => {
  const req = new Request("http://localhost:8000/", {
    headers: { "Accept-Language": "ja-JP,ja;q=0.9" },
  });
  const res = await app.request(req);
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, "現在値");
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

Deno.test("detectLanguage returns default if header is null", () => {
  assertEquals(detectLanguage(null), "en");
});

Deno.test("detectLanguage returns default if header is empty", () => {
  assertEquals(detectLanguage(""), "en");
});

Deno.test("detectLanguage prioritizes ja when q value is higher", () => {
  assertEquals(detectLanguage("ja,en-US;q=0.9,en;q=0.8"), "ja");
});

Deno.test("detectLanguage prioritizes en when q value is higher", () => {
  assertEquals(detectLanguage("en-US,en;q=0.9,ja;q=0.8"), "en");
});

Deno.test("detectLanguage falls back to default if no known language found", () => {
  assertEquals(detectLanguage("fr,de;q=0.9"), "en");
});

Deno.test("detectLanguage handles complex whitespace", () => {
  assertEquals(detectLanguage("ja; q=1.0, en; q=0.5"), "ja");
});
