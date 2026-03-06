export type Language = "en" | "ja";

export const i18nConfig = {
  defaultLocale: "en" as Language,
  locales: ["en", "ja"] as Language[],
};

type FaqItem = { q: string; a: string };

function buildFaqHtml(title: string, faqs: FaqItem[]) {
  return `
      <h3>${title}</h3>
${
    faqs
      .map(
        (faq) =>
          `      <details>
        <summary><strong>${faq.q}</strong></summary>
        <p>${faq.a}</p>
      </details>`,
      )
      .join("\n")
  }`;
}

const enFaqs: FaqItem[] = [
  {
    q: "What does this stock target price calculator do?",
    a: "It reverse-calculates a buy price from the valuation level you want to wait for. You can set a target PER, PBR, or dividend yield and the tool estimates the corresponding stock price.",
  },
  {
    q: "Why use more than one indicator?",
    a: "Each indicator captures a different perspective. PER looks at earnings, PBR looks at net assets, and dividend yield looks at cash returns to shareholders. Combining them helps you avoid relying on a single metric.",
  },
  {
    q: "What is the bottleneck indicator?",
    a: "When multiple target prices are calculated, the tool highlights the lowest one. That lowest price is the strictest condition and becomes the practical buy target if you want to satisfy every rule at the same time.",
  },
  {
    q: "Can I share a calculation?",
    a: "Yes. The calculator stores your current inputs in the URL query string, so you can bookmark or share a specific scenario without changing the canonical page used for indexing.",
  },
];

const jaFaqs: FaqItem[] = [
  {
    q: "この目標株価計算ツールで何ができますか？",
    a: "PER、PBR、配当利回りの目標水準から、待ちたい買い価格を逆算できます。感覚ではなく数値基準で指値を置きたい投資家向けのツールです。",
  },
  {
    q: "なぜ PER・PBR・配当利回りを併用するのですか？",
    a: "PER は利益、PBR は純資産、配当利回りは株主還元という別々の視点を見ています。複数の条件を組み合わせることで、1つの指標だけに依存しない判断ができます。",
  },
  {
    q: "ボトルネック指標とは何ですか？",
    a: "複数の目標価格を計算したときに、最も低い価格を作る条件です。すべての条件を満たしたい場合、その価格が実質的な買い目線になります。",
  },
  {
    q: "入力内容を共有できますか？",
    a: "できます。現在の入力値は URL に反映されるため、特定の計算条件をそのまま共有できます。検索用の canonical は固定 URL に維持されます。",
  },
];

export const dictionary = {
  en: {
    title: "Stock Target Price Calculator for PER, PBR, and Dividend Yield",
    description:
      "Reverse-calculate a stock buy price from your target PER, PBR, and dividend yield. Includes investment context, formulas, and practical examples.",
    guideTitle:
      "How to Set a Stock Target Price with PER, PBR, and Dividend Yield",
    guideDescription:
      "A practical guide to setting stock buy targets with PER, PBR, and dividend yield, with examples and a direct link back to the calculator.",
    aboutPageTitle:
      "Why Use a Stock Target Price Calculator Before Buying a Stock",
    aboutDescription:
      "Learn how a stock target price calculator helps define buy rules with PER, PBR, and dividend yield instead of relying on intuition.",
    currentValues: "Current Values",
    targetValues: "Target Indicators",
    results: "Target Prices",
    stockPrice: "Stock Price",
    eps: "EPS (Earnings Per Share)",
    bps: "BPS (Book Value Per Share)",
    dividend: "Dividend",
    currentPer: "Current PER",
    currentPbr: "Current PBR",
    currentYield: "Current Yield (%)",
    targetPer: "Target PER",
    targetPbr: "Target PBR",
    targetYield: "Target Yield (%)",
    calculatedPrice: "Target Price",
    upside: "Upside",
    downside: "Downside",
    inputRequired: "Input required",
    language: "Language",
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
    aboutTitle: "Why this calculator is useful",
    bottleneckDesc: "Bottleneck Indicator",
    faq: enFaqs,
    guideNavLabel: "Guide",
    aboutNavLabel: "About",
    toolNavLabel: "Calculator",
    introEyebrow: "Stock valuation and buy-price planning",
    introHeading: "Set a target stock price with explicit valuation rules",
    introBody:
      "Use this calculator to reverse a buy price from the valuation level you want. It is built for investors who want a repeatable rule instead of placing limit orders by intuition.",
    guideCta:
      "Need a deeper explanation? Read the practical guide to target prices.",
    guideLinkLabel: "Read the guide",
    aboutCta: "Want the background first? Read why this calculator is useful.",
    aboutLinkLabel: "Read the overview",
    toolLinkLabel: "Open the calculator",
    aboutContent: `
      <section>
        <h2>What this stock target price calculator helps you decide</h2>
        <p>
          This tool estimates a buy price from the valuation level you want to wait for. Instead of asking "Is this stock cheap enough?", you define the price that would make the stock attractive on earnings, net assets, or dividend yield.
        </p>

        <h3>Typical investing use cases</h3>
        <ul>
          <li><strong>Dividend investing:</strong> "I only want to buy when the yield reaches 4%."</li>
          <li><strong>Value investing:</strong> "I want to buy at 15x earnings or less."</li>
          <li><strong>Balance-sheet discipline:</strong> "I want to add only below a certain PBR."</li>
        </ul>

        <h3>Calculation logic</h3>
        <p>The calculator derives fundamentals from your current inputs, then applies your target thresholds.</p>
        <ul>
          <li><strong>PER price</strong> = EPS × Target PER</li>
          <li><strong>PBR price</strong> = BPS × Target PBR</li>
          <li><strong>Yield price</strong> = Annual dividend ÷ Target yield</li>
        </ul>

        <h3>How to read the result</h3>
        <p>
          When you set multiple target indicators, the tool shows the lowest calculated price. That is the strictest condition and works as a practical margin-of-safety reference.
        </p>

        <h3>Common mistakes this page helps avoid</h3>
        <ul>
          <li>Comparing today’s price with a target multiple without deriving EPS or BPS first</li>
          <li>Using only one valuation metric even when a stock is sensitive to another</li>
          <li>Forgetting that a generous dividend yield target implies a lower acceptable buy price</li>
        </ul>

        <h3>Worked example</h3>
        <ol>
          <li>Enter a stock price of <strong>1,000</strong> and a current yield of <strong>3%</strong>.</li>
          <li>Set the target yield to <strong>4%</strong>.</li>
          <li>The calculator returns <strong>750</strong> as the target buy price.</li>
        </ol>

${buildFaqHtml("Frequently Asked Questions", enFaqs)}

        <hr>
        <p style="font-size: 0.9em; color: var(--pico-muted-color);">
          <strong>Disclaimer:</strong> The output is a planning aid based on your inputs. It does not guarantee future stock performance or investment outcomes.
        </p>
      </section>
    `,
    guideContent: `
      <article>
        <header>
          <p><strong>Guide</strong></p>
          <h1>How to think about a target stock price before placing a limit order</h1>
          <p>
            A target price is most useful when it is tied to a clear rule. This guide explains how PER, PBR, and dividend yield can be used to create that rule and how this calculator fits into the process.
          </p>
        </header>

        <h2>1. Start with the decision, not the chart</h2>
        <p>
          Many investors choose a buy price because it "feels lower" than the recent market price. A better approach is to decide what valuation you would actually accept, then convert that rule into a concrete price.
        </p>

        <h2>2. Use the right indicator for the reason you are buying</h2>
        <ul>
          <li><strong>PER:</strong> useful when earnings power is the core of the thesis.</li>
          <li><strong>PBR:</strong> useful when balance-sheet strength or asset backing matters.</li>
          <li><strong>Dividend yield:</strong> useful when your return target depends on cash income.</li>
        </ul>

        <h2>3. Reverse the price from the target valuation</h2>
        <p>
          The calculator first derives EPS, BPS, and dividend amounts from your current data, then converts your target indicators into price levels. This makes each target explicit and comparable.
        </p>

        <h2>4. Treat the lowest calculated price as the strictest rule</h2>
        <p>
          If you require multiple conditions at once, the lowest price becomes the bottleneck. That is usually the most disciplined entry level because it satisfies every threshold simultaneously.
        </p>

        <h2>5. Keep the rule but revisit the inputs</h2>
        <p>
          Price targets are only as useful as the current fundamentals behind them. If earnings, book value, or dividends change materially, recalculate rather than anchoring to an outdated number.
        </p>

        <p>
          <a href="/" role="button">Open the calculator</a>
        </p>
      </article>
    `,
  },
  ja: {
    title: "目標株価逆算ツール | PER・PBR・配当利回りから買い価格を計算",
    description:
      "PER・PBR・配当利回りの目標水準から買いたい株価を逆算できる無料ツール。計算式、使い方、投資判断の考え方も日本語で解説します。",
    guideTitle:
      "目標株価の決め方ガイド | PER・PBR・配当利回りで買い価格を考える",
    guideDescription:
      "PER・PBR・配当利回りを使って目標株価を決める考え方を、日本語の具体例付きで解説するガイドページです。",
    aboutPageTitle:
      "この目標株価逆算ツールが役立つ理由 | PER・PBR・配当利回りの考え方",
    aboutDescription:
      "PER・PBR・配当利回りから買い価格を逆算する意味と、このツールで整理できる判断軸を日本語でまとめた紹介ページです。",
    currentValues: "現在値",
    targetValues: "目標指標",
    results: "目標株価",
    stockPrice: "株価",
    eps: "EPS（1株利益）",
    bps: "BPS（1株純資産）",
    dividend: "年間配当",
    currentPer: "現在 PER",
    currentPbr: "現在 PBR",
    currentYield: "現在 配当利回り (%)",
    targetPer: "目標 PER",
    targetPbr: "目標 PBR",
    targetYield: "目標 配当利回り (%)",
    calculatedPrice: "目標株価",
    upside: "上値余地",
    downside: "下落余地",
    inputRequired: "入力が必要です",
    language: "言語",
    toggleLang: "English",
    optional: "任意",
    perPrice: "PER ベース",
    pbrPrice: "PBR ベース",
    yieldPrice: "利回りベース",
    finalPrice: "結果: すべての条件を満たす価格",
    bottleneck: "ボトルネック指標",
    resultPer: "PER",
    resultPbr: "PBR",
    resultYield: "配当利回り (%)",
    aboutTitle: "このツールが役立つ理由",
    bottleneckDesc: "ボトルネック指標",
    faq: jaFaqs,
    guideNavLabel: "解説ガイド",
    aboutNavLabel: "このツールについて",
    toolNavLabel: "計算ツール",
    introEyebrow: "株価の逆算と指値設計",
    introHeading: "感覚ではなく条件で目標株価を決める",
    introBody:
      "このツールは、欲しい利回りや許容したい PER・PBR から買い価格を逆算します。なんとなく安そうだからではなく、再現できるルールで指値を置きたい投資家向けです。",
    guideCta:
      "考え方から整理したい場合は、目標株価の決め方ガイドを先に読んでください。",
    guideLinkLabel: "解説ガイドを読む",
    aboutCta:
      "このツールの使いどころを先に知りたい場合はこちらを読んでください。",
    aboutLinkLabel: "このツールについて読む",
    toolLinkLabel: "計算ツールを開く",
    aboutContent: `
      <section>
        <h2>この目標株価逆算ツールで分かること</h2>
        <p>
          このページでは、あなたが待ちたい評価水準から買い価格を逆算できます。「今の株価が安いか」ではなく、「どの価格なら自分の基準を満たすか」を明確にするためのツールです。
        </p>

        <h3>よくある利用シーン</h3>
        <ul>
          <li><strong>高配当投資:</strong> 「利回りが 4% になったら買いたい」</li>
          <li><strong>バリュー投資:</strong> 「PER 15 倍以下で買いたい」</li>
          <li><strong>資産価値重視:</strong> 「PBR が 1 倍前後まで下がったら検討したい」</li>
        </ul>

        <h3>計算式の考え方</h3>
        <p>現在の入力値から EPS・BPS・年間配当を逆算し、そこに目標指標を当てて価格へ落とし込みます。</p>
        <ul>
          <li><strong>PER ベース株価</strong> = EPS × 目標 PER</li>
          <li><strong>PBR ベース株価</strong> = BPS × 目標 PBR</li>
          <li><strong>利回りベース株価</strong> = 年間配当 ÷ 目標配当利回り</li>
        </ul>

        <h3>結果の読み方</h3>
        <p>
          複数の条件を設定した場合は、最も低い価格が表示されます。これは最も厳しい条件であり、すべてのルールを満たすための実質的な買い目線です。
        </p>

        <h3>このページが防ぎたい失敗</h3>
        <ul>
          <li>EPS や BPS を計算せずに、なんとなく PER や PBR だけで判断する</li>
          <li>1つの指標だけで割安と決めつける</li>
          <li>高い配当利回りを求めているのに、対応する買い価格を下げて考えていない</li>
        </ul>

        <h3>具体例</h3>
        <ol>
          <li>株価 <strong>1,000</strong>、現在の配当利回り <strong>3%</strong> を入力します。</li>
          <li>目標配当利回りを <strong>4%</strong> に設定します。</li>
          <li>結果として <strong>750</strong> が表示され、そこが目標買い価格になります。</li>
        </ol>

${buildFaqHtml("よくある質問", jaFaqs)}

        <hr>
        <p style="font-size: 0.9em; color: var(--pico-muted-color);">
          <strong>注意事項:</strong> 表示結果は入力値に基づく理論値です。将来の株価や投資成果を保証するものではありません。
        </p>
      </section>
    `,
    guideContent: `
      <article>
        <header>
          <p><strong>解説ガイド</strong></p>
          <h1>目標株価は「何円で買いたいか」ではなく「どの条件なら買うか」で決める</h1>
          <p>
            指値を置く前に必要なのは、価格への感覚ではなく判断基準です。このガイドでは、PER・PBR・配当利回りを使って目標株価を設計する考え方を整理します。
          </p>
        </header>

        <h2>1. まずチャートではなく条件を決める</h2>
        <p>
          「最近より下がったから買う」だけでは、相場の雰囲気に引っ張られやすくなります。先に許容できる評価水準を決め、その条件を価格へ変換する方が一貫性があります。
        </p>

        <h2>2. 投資理由に合った指標を使う</h2>
        <ul>
          <li><strong>PER:</strong> 利益成長や収益力を重視するときに向いています。</li>
          <li><strong>PBR:</strong> 純資産や財務健全性を重視するときに向いています。</li>
          <li><strong>配当利回り:</strong> インカム収入の水準を重視するときに向いています。</li>
        </ul>

        <h2>3. 目標指標から株価を逆算する</h2>
        <p>
          このツールでは、現在株価と現在指標から EPS・BPS・年間配当を求め、目標 PER・PBR・配当利回りに対応する株価を計算します。数式が見えるので判断の根拠を追いやすい構成です。
        </p>

        <h2>4. 一番低い価格を「最も厳しい条件」として扱う</h2>
        <p>
          複数条件を同時に満たしたいなら、最も低い価格が実質的な基準になります。これがボトルネック指標であり、安全余裕を意識した買い判断に役立ちます。
        </p>

        <h2>5. 数字は固定せず、前提が変わったら更新する</h2>
        <p>
          目標株価は EPS、BPS、配当予想が変われば動きます。決算や配当方針の変更があったら、以前の目標価格に固執せず再計算してください。
        </p>

        <p>
          <a href="/ja/" role="button">計算ツールを開く</a>
        </p>
      </article>
    `,
  },
};
