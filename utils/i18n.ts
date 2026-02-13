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
    aboutBtn: "About",
    bottleneckDesc: "Bottleneck Indicator",
    aboutContent: `
      <h3>指値に意味を持たせませんか？ / Bring Strategic Meaning to Your Limit Orders</h3>
      <p>
        「なんとなく」の指値はもう卒業。このツールは、狙っている「理想の利回り」や「割安水準」が具体的にいくらなのかを、財務指標から逆算する投資シミュレーターです。<br>
        Stop guessing your limit orders. This tool is a stock valuation simulator that reverse-engineers the target price from your desired dividend yield and valuation multiples (PER/PBR).
      </p>

      <h3>具体的な活用シーン / Practical Use Cases</h3>
      <ul>
        <li><strong>高配当株投資 (Dividend Growth Investing):</strong> 「利回りが4%まで上がったら買いたい」 → 現在の配当金から具体的なターゲット株価を算出します。</li>
        <li><strong>バリュー投資 (Value Investing):</strong> 「過去平均のPER 15倍で買いたい」 → 企業の収益力（EPS）に基づいた適正価格を特定します。</li>
        <li><strong>資産価値 (PBR/Asset Value):</strong> 「解散価値であるPBR 1倍を割ったら買いたい」 → 純資産（BPS）に基づいた下値の目処を算出します。</li>
      </ul>

      <h3>計算ロジック / Calculation Logic</h3>
      <p>入力された現在値から「予想EPS」「実績BPS」「予想配当金」を内部で算出し、目標値を掛け合わせることで理論株価を導き出します。</p>
      <ul>
        <li><strong>PER Price</strong> = Expected EPS × Target PER</li>
        <li><strong>PBR Price</strong> = Actual BPS × Target PBR</li>
        <li><strong>Yield Price</strong> = Annual Dividend / Target Yield</li>
      </ul>

      <h3>ボトルネックと安全圏 / Bottleneck & Margin of Safety</h3>
      <p>
        複数の条件を設定した場合、ツールは「最も低い株価（ボトルネック）」を表示します。これにより、全ての条件をクリアする「安全域（Margin of Safety）」を確保した指値が可能になります。<br>
        When multiple targets are set, the tool identifies the "Bottleneck Indicator" and displays the lowest price to ensure a solid Margin of Safety.
      </p>

      <h3>計算例 / Example Usage</h3>
      <p><strong>Example: 株価1,000円、利回り3%の銘柄を、利回り4%の水準で買いたい場合</strong></p>
      <ol>
        <li>現在値の「株価」に <strong>1000</strong>、「現在利回り」に <strong>3</strong> を入力。</li>
        <li>「目標利回り」スライダーを <strong>4</strong> に設定。</li>
        <li>算出結果に <strong>750</strong> と表示されます。これがあなたの指値すべき根拠ある価格です。</li>
      </ol>
      <hr>
      <p style="font-size: 0.8em; color: var(--pico-muted-color);">
        <strong>免責事項 (Disclaimer):</strong><br>
        本ツールの計算結果は、入力されたデータに基づく理論値であり、将来の株価や投資成果を保証するものではありません。投資判断は自己責任で行ってください。<br>
        The results are theoretical values based on input data and do not guarantee future stock prices or investment outcomes. Please invest at your own risk.
      </p>
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
      <h3>指値に意味を持たせませんか？</h3>
      <p>「なんとなく」の指値はもう卒業。このツールは、あなたが狙っている「理想の利回り」や「割安水準」が具体的にいくらなのかを、財務指標から逆算する投資シミュレーターです。</p>

      <h4>具体的な活用シーン</h4>
      <ul>
        <li><strong>高配当株投資:</strong> 「利回りが4%まで上がったら（株価が下がったら）買いたい」 &rarr; 現在の配当金から具体的なターゲット株価を算出します。</li>
        <li><strong>バリュー投資:</strong> 「過去平均のPER 15倍で買いたい」 &rarr; 企業の収益力（EPS）に基づいた適正価格を特定します。</li>
        <li><strong>資産価値（PBR）:</strong> 「解散価値であるPBR 1倍を割ったら買いたい」 &rarr; 純資産（BPS）に基づいた下値の目処を算出します。</li>
      </ul>

      <h4>計算ロジック (Calculation Logic)</h4>
      <p>入力された現在値から「予想EPS」「実績BPS」「予想配当金」を内部で算出し、それらに目標値を掛け合わせています。</p>
      <ul>
        <li><strong>PER基準価格</strong> = <code>予想EPS × 目標PER</code></li>
        <li><strong>PBR基準価格</strong> = <code>実績BPS × 目標PBR</code></li>
        <li><strong>利回り基準価格</strong> = <code>予想配当金 ÷ 目標利回り</code></li>
      </ul>

      <h4>ボトルネック（制約要因）と安全圏</h4>
      <p>複数の条件を設定した場合、ツールは<strong>「最も低い株価（ボトルネック）」</strong>を算出結果として表示します。これにより、全ての条件をクリアする<strong>「安全域（Margin of Safety）」</strong>を確保した指値が可能になります。</p>

      <hr>
      <h4>計算例</h4>
      <p><strong>例:</strong> 株価1,000円、利回り3%の銘柄を、利回り4%の水準で買いたい場合</p>
      <ol>
        <li>現在値入力欄の「株価」に <strong>1000</strong>、「現在利回り」に <strong>3</strong> を入力します。</li>
        <li>目標指標の「目標利回り」スライダーを動かして <strong>4</strong> に設定します。</li>
        <li>算出結果に <strong>750</strong> (円) と表示されます。これがあなたの指値すべき価格です。</li>
      </ol>
    `,
    close: "閉じる",
  },
};
