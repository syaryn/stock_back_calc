import { assertEquals } from "@std/assert";
import { calculateFundamentals, calculateTargetPrices } from "./pricing.ts";

Deno.test("calculateFundamentals correctly derives EPS, BPS, Dividend", () => {
  const state = {
    price: 1000,
    per: 20, // 1000 / 20 = 50 EPS
    pbr: 2, // 1000 / 2 = 500 BPS
    yield: 3, // 1000 * 0.03 = 30 Dividend
  };
  const fundamentals = calculateFundamentals(state);
  assertEquals(fundamentals.eps, 50);
  assertEquals(fundamentals.bps, 500);
  assertEquals(fundamentals.dividend, 30);
});

Deno.test("calculateFundamentals handles zero/null values", () => {
  const state = {
    price: 1000,
    per: 0,
    pbr: 0,
    yield: 0,
  };
  const fundamentals = calculateFundamentals(state);
  assertEquals(fundamentals.eps, 0);
  assertEquals(fundamentals.bps, 0);
  assertEquals(fundamentals.dividend, 0);
});

Deno.test("calculateTargetPrices correctly derives prices and finds bottleneck", () => {
  const fundamentals = {
    eps: 50,
    bps: 500,
    dividend: 30,
  };
  const targets = {
    per: 15,
    pbr: 1.5,
    yield: 2,
  };

  const prices = calculateTargetPrices(fundamentals, targets);

  // PER Price: 50 * 15 = 750
  assertEquals(prices.perPrice, 750);

  // PBR Price: 500 * 1.5 = 750
  assertEquals(prices.pbrPrice, 750);

  // Yield Price: 30 / 0.02 = 1500
  assertEquals(prices.yieldPrice, 1500);

  // Min Price should be 750 (PER or PBR are tied for lowest)
  assertEquals(prices.minPrice, 750);
});

Deno.test("calculateTargetPrices identifies distinct bottleneck", () => {
  const fundamentals = {
    eps: 100,
    bps: 1000,
    dividend: 20,
  };
  const targets = {
    per: 10, // Price: 1000
    pbr: 1.2, // Price: 1200
    yield: 1, // Price: 2000
  };

  const prices = calculateTargetPrices(fundamentals, targets);
  assertEquals(prices.minPrice, 1000);
  assertEquals(prices.bottleneck, "per");
});
