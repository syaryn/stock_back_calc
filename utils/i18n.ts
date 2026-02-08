export type Language = "en" | "ja";

export const i18nConfig = {
  defaultLocale: "en" as Language,
  locales: ["en", "ja"] as Language[],
};

export function detectLanguage(acceptLanguageHeader: string | null): Language {
  if (!acceptLanguageHeader) {
    return i18nConfig.defaultLocale;
  }

  const languages = acceptLanguageHeader.split(",").map((lang) => {
    const [code, qValue] = lang.trim().split(";");
    const q = qValue ? parseFloat(qValue.split("=")[1]) : 1.0;
    return { code, q };
  }).sort((a, b) => b.q - a.q);

  for (const { code } of languages) {
    if (code === "ja" || code.startsWith("ja-")) {
      return "ja";
    }
    if (code === "en" || code.startsWith("en-")) {
      return "en";
    }
  }

  return i18nConfig.defaultLocale;
}

export const dictionary = {
  en: {
    title: "Stock Target Price Calculator",
    description:
      "Calculate theoretical stock prices based on target PER, PBR, and Dividend Yield. A simple tool for value investors.",
    currentValues: "Current Values",
    targetValues: "Target Indicators",
    results: "Target Prices",
    stockPrice: "Stock Price",
    eps: "EPS (Earnings Per Share)",
    bps: "BPS (Book-value Per Share)",
    dividend: "Dividend",
    currentPer: "Current PER",
    currentPbr: "Current PBR",
    currentYield: "Current Yield (%)",
    targetPer: "Target PER",
    targetPbr: "Target PBR",
    targetYield: "Target Yield",
    calculatedPrice: "Target Price",
    upside: "Upside",
    downside: "Downside",
    inputRequired: "Input required",
    language: "Language/言語",
    toggleLang: "日本語",
    optional: "(Optional)",
    perPrice: "PER Based",
    pbrPrice: "PBR Based",
    yieldPrice: "Yield Based",
    finalPrice: "Result: Price satisfying all conditions",
    bottleneck: "Bottleneck Indicator",
    resultPer: "PER",
    resultPbr: "PBR",
    resultYield: "Yield (%)",
    aboutTitle: "About this tool",
    bottleneckDesc: "Bottleneck Indicator",
    aboutContent: `
      <p>This tool calculates the theoretical stock price based on your target PER, PBR, and Dividend Yield.</p>
      <hr>
      <strong>[Example Usage]</strong><br>
      "To set a limit order regarding a stock currently at $1000 with 3% yield, targeting a 4% yield"
      <ol>
        <li>Enter <strong>1000</strong> for Price and <strong>3</strong> for Current Yield.</li>
        <li>Set the Target Yield slider to <strong>4</strong>.</li>
        <li>The calculated Target Price <strong>$750</strong> will be displayed.</li>
      </ol>
    `,
    close: "Close",
  },
  ja: {
    title: "目標株価逆算ツール",
    description:
      "目標とするPER、PBR、配当利回りから理論株価を逆算するツールです。バリュー投資家向けのシミュレーションに最適。",
    currentValues: "現在値",
    targetValues: "目標指標",
    results: "算出結果",
    stockPrice: "株価",
    eps: "予想EPS",
    bps: "実績BPS",
    dividend: "予想配当金",
    currentPer: "現在PER (倍)",
    currentPbr: "現在PBR (倍)",
    currentYield: "現在利回り (%)",
    targetPer: "目標PER",
    targetPbr: "目標PBR",
    targetYield: "目標利回り",
    calculatedPrice: "目標株価",
    upside: "割安",
    downside: "割高",
    inputRequired: "入力待ち",
    language: "Language/言語",
    toggleLang: "English",
    optional: "(任意)",
    perPrice: "PER基準",
    pbrPrice: "PBR基準",
    yieldPrice: "利回り基準",
    finalPrice: "算出結果: 全ての条件を満たす株価",
    bottleneck: "ボトルネック",
    bottleneckDesc: "制約要因",
    resultPer: "PER (倍)",
    resultPbr: "PBR (倍)",
    resultYield: "利回り (%)",
    aboutTitle: "このサイトについて",
    aboutBtn: "使い方",
    aboutContent: `
      <p>目標とするPER、PBR、配当利回りから、理論的な株価を逆算するツールです。</p>
      <p>現在の株価と財務指標を入力し、目標指標を調整することで、全ての条件を満たす株価（最も保守的な算出結果）を表示します。</p>
      <hr>
      <strong>【使い方例】</strong><br>
      「株価1000円で現在の利回りが3%の銘柄を、利回りが4%になるように指値を設定したい」場合
      <ol>
        <li>現在値入力欄の「株価」に <strong>1000</strong>、「現在利回り」に <strong>3</strong> を入力します。</li>
        <li>目標指標の「目標利回り」スライダーを動かして <strong>4</strong> に設定します。</li>
        <li>算出結果に <strong>750</strong> (円) と表示されます。</li>
      </ol>
      <p>これが、利回り4%になるための指値価格です。</p>
    `,
    close: "閉じる",
  },
};
