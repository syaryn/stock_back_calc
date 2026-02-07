export type MarketState = {
  price: number;
  per: number;
  pbr: number;
  yield: number;
};

export type Fundamentals = {
  eps: number;
  bps: number;
  dividend: number;
};

export type TargetPrices = {
  perPrice: number | null;
  pbrPrice: number | null;
  yieldPrice: number | null;
  minPrice: number | null;
  bottleneck: "per" | "pbr" | "yield" | null;
};

export function calculateFundamentals(state: MarketState): Fundamentals {
  return {
    eps: state.per ? state.price / state.per : 0,
    bps: state.pbr ? state.price / state.pbr : 0,
    dividend: state.price * (state.yield / 100),
  };
}

export function calculateTargetPrices(
  fundamentals: Fundamentals,
  targets: { per: number; pbr: number; yield: number },
): TargetPrices {
  const perPrice = fundamentals.eps ? fundamentals.eps * targets.per : null;
  const pbrPrice = fundamentals.bps ? fundamentals.bps * targets.pbr : null;
  const yieldPrice = (fundamentals.dividend && targets.yield)
    ? fundamentals.dividend / (targets.yield / 100)
    : null;

  const validPrices = [
    { key: "per", val: perPrice },
    { key: "pbr", val: pbrPrice },
    { key: "yield", val: yieldPrice },
  ].filter((p): p is { key: "per" | "pbr" | "yield"; val: number } =>
    p.val !== null && p.val !== Infinity && !isNaN(p.val) && p.val > 0
  );

  if (validPrices.length === 0) {
    return {
      perPrice,
      pbrPrice,
      yieldPrice,
      minPrice: null,
      bottleneck: null,
    };
  }

  // Find minimum
  validPrices.sort((a, b) => a.val - b.val);
  const best = validPrices[0];

  return {
    perPrice,
    pbrPrice,
    yieldPrice,
    minPrice: best.val,
    bottleneck: best.key,
  };
}
