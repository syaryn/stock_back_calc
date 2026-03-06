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
    a: "PER・PBR・配当利回りの目標水準を入力すると、その水準に対応する買い価格を自動で逆算します。たとえば「PER 15 倍以下で買いたい」「配当利回りが 4% になったら買いたい」という条件を数値に変換できます。感覚ではなく再現できる根拠で指値を置きたい個人投資家向けの無料ツールです。",
  },
  {
    q: "PER・PBR・配当利回りを組み合わせて使う理由は何ですか？",
    a: "PER は収益力、PBR は純資産・財務健全性、配当利回りは株主還元という、それぞれ異なる観点で割安水準を測ります。1 つの指標だけに頼ると、その指標が悪化したときに判断が崩れやすくなります。複数の条件を組み合わせることで、より多角的な買いルールを設計できます。",
  },
  {
    q: "ボトルネック指標・ボトルネック株価とは何ですか？",
    a: "PER・PBR・配当利回りの 3 つで目標株価を計算したとき、最も低い価格を出す条件が「ボトルネック指標」です。すべての条件を同時に満たしたい場合、この最低価格が実質的な指値の基準になります。どの指標が最も厳しい制約になっているかが一目でわかります。",
  },
  {
    q: "計算結果や入力した銘柄情報を他の人と共有できますか？",
    a: "できます。入力値は URL のクエリパラメータに自動で反映されるため、その URL を共有・ブックマークするだけで同じ計算条件を再現できます。なお、SEO 用の canonical URL は固定されており、共有 URL がインデックスに影響することはありません。",
  },
];

export const dictionary = {
  en: {
    title:
      "Stock Target Price Calculator | Reverse a Buy Price from PER, PBR, and Dividend Yield",
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
    toolNavLabel: "Target Price Calculator",
    introHeading:
      "Stock Target Price Calculator for PER, PBR, and Dividend Yield",
    introBody:
      "Use this calculator to reverse a buy price from the valuation level you want. It is built for investors who want a repeatable rule instead of placing limit orders by intuition.",
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
      <section>
        <h2>How to think about a target stock price before placing a limit order</h2>
        <p>
          A target price is most useful when it is tied to a clear rule. This guide explains how PER, PBR, and dividend yield can be used to create that rule and how this calculator fits into the process.
        </p>

        <h3>1. Start with the decision, not the chart</h3>
        <p>
          Many investors choose a buy price because it "feels lower" than the recent market price. A better approach is to decide what valuation you would actually accept, then convert that rule into a concrete price.
        </p>

        <h3>2. Use the right indicator for the reason you are buying</h3>
        <ul>
          <li><strong>PER:</strong> useful when earnings power is the core of the thesis.</li>
          <li><strong>PBR:</strong> useful when balance-sheet strength or asset backing matters.</li>
          <li><strong>Dividend yield:</strong> useful when your return target depends on cash income.</li>
        </ul>

        <h3>3. Reverse the price from the target valuation</h3>
        <p>
          The calculator first derives EPS, BPS, and dividend amounts from your current data, then converts your target indicators into price levels. This makes each target explicit and comparable.
        </p>

        <h3>4. Treat the lowest calculated price as the strictest rule</h3>
        <p>
          If you require multiple conditions at once, the lowest price becomes the bottleneck. That is usually the most disciplined entry level because it satisfies every threshold simultaneously.
        </p>

        <h3>5. Keep the rule but revisit the inputs</h3>
        <p>
          Price targets are only as useful as the current fundamentals behind them. If earnings, book value, or dividends change materially, recalculate rather than anchoring to an outdated number.
        </p>

        <p>
          <a href="/" role="button">Open the calculator</a>
        </p>
      </section>
    `,
  },
  ja: {
    title: "目標株価計算ツール | PER・PBR・配当利回りから買い価格を逆算",
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
    toolNavLabel: "目標株価計算ツール",
    introHeading: "目標株価を計算 | PER・PBR・配当利回りから買い価格を逆算",
    introBody:
      "このツールは、欲しい利回りや許容したい PER・PBR から買い価格を逆算します。なんとなく安そうだからではなく、再現できるルールで指値を置きたい投資家向けです。",
    toolLinkLabel: "目標株価計算ツールを開く",
    aboutContent: `
      <section>
        <h2>PER・PBR・配当利回りから目標株価を逆算するとは</h2>
        <p>
          このツールは「今の株価が安いかどうか」ではなく、<strong>「どの価格なら自分の投資基準を満たすか」</strong>を計算します。目標とする PER・PBR・配当利回りを入力すると、それぞれの水準に対応する買い価格を自動で逆算します。感覚的な指値ではなく、数値の根拠に基づいた買いルールを作りたい投資家に向けたツールです。
        </p>

        <h3>目標株価ツールのよくある利用シーン</h3>
        <ul>
          <li><strong>高配当株投資:</strong> 「配当利回りが 4% に到達したタイミングで買いたい」→ 目標利回りを入力して買い価格を逆算</li>
          <li><strong>バリュー株投資:</strong> 「PER 15 倍以下が買い条件」→ 現在の EPS からその条件を満たす価格を算出</li>
          <li><strong>資産価値重視:</strong> 「PBR 1 倍割れで割安と判断する」→ BPS を使って解散価値ベースの目標株価を計算</li>
        </ul>

        <h3>PER・PBR・配当利回りを使った目標株価の計算式</h3>
        <p>現在の株価・指標から EPS・BPS・年間配当を算出し、目標指標を掛け合わせて買い価格へ変換します。</p>
        <ul>
          <li><strong>PER ベース目標株価</strong> = EPS（1株利益） × 目標 PER</li>
          <li><strong>PBR ベース目標株価</strong> = BPS（1株純資産） × 目標 PBR</li>
          <li><strong>配当利回りベース目標株価</strong> = 年間配当 ÷ 目標配当利回り</li>
        </ul>

        <h3>複数指標の結果の読み方：ボトルネック指標とは</h3>
        <p>
          3 つの指標すべてで目標株価を計算すると、条件によって価格がそれぞれ異なります。すべての条件を同時に満たしたい場合、<strong>最も低い価格を出す指標（ボトルネック指標）</strong>が実質的な買い目線になります。どの条件が最も厳しい制約か一目でわかるため、安全余裕を意識した指値設定に役立ちます。
        </p>

        <h3>目標株価を決める際に注意すべき失敗パターン</h3>
        <ul>
          <li>EPS や BPS を確認せず、PER・PBR の数値だけを見て「割安」と判断してしまう</li>
          <li>1 つの指標だけで買いを決めてしまい、他の観点から割高になっていることに気づかない</li>
          <li>高い配当利回りを目標にしているのに、それに対応した（低い）買い価格を意識していない</li>
        </ul>

        <h3>計算例：配当利回りから目標株価を逆算する</h3>
        <ol>
          <li>株価 <strong>1,000 円</strong>、現在の配当利回り <strong>3%</strong> を入力します。</li>
          <li>目標配当利回りを <strong>4%</strong> に設定します。</li>
          <li>ツールが <strong>750 円</strong> を目標買い価格として算出します（年間配当 30 円 ÷ 4% = 750）。</li>
        </ol>

${buildFaqHtml("よくある質問", jaFaqs)}

        <hr>
        <p style="font-size: 0.9em; color: var(--pico-muted-color);">
          <strong>注意事項:</strong> 表示結果は入力値に基づく理論値です。将来の株価や投資成果を保証するものではありません。
        </p>
      </section>
    `,
    guideContent: `
      <section>
        <h2>目標株価の決め方：PER・PBR・配当利回りで指値の根拠を作る</h2>
        <p>
          「なんとなく安そうだから買う」ではなく、PER・PBR・配当利回りの目標水準から買い価格を逆算して指値を置く方法を解説します。このガイドでは、各指標の使い分けから計算手順、複数条件の組み合わせ方まで順を追って説明します。
        </p>

        <h3>1. チャートではなく投資条件から目標株価を決める</h3>
        <p>
          「最近の高値より下がったから」「なんとなく割安に見える」という根拠では、一貫した買いルールを作れません。先に「PER 15 倍以下」「配当利回り 4% 以上」といった数値の条件を決め、その条件に対応する株価を計算することで、再現性のある指値が設定できます。
        </p>

        <h3>2. PER・PBR・配当利回り：投資目的に合った指標を選ぶ</h3>
        <ul>
          <li><strong>PER（株価収益率）:</strong> 利益成長・収益力を評価基準にするとき。EPS（1株利益）に目標 PER を掛けると目標株価が逆算できます。</li>
          <li><strong>PBR（株価純資産倍率）:</strong> 純資産・財務健全性・解散価値を重視するとき。BPS（1株純資産）に目標 PBR を掛けて算出します。</li>
          <li><strong>配当利回り:</strong> 高配当株投資やインカム収入を目的とするとき。年間配当を目標利回りで割ると買うべき上限価格がわかります。</li>
        </ul>

        <h3>3. 目標 PER・PBR・配当利回りから株価を逆算する手順</h3>
        <p>
          現在の株価と各指標から EPS・BPS・年間配当を算出し、目標となる PER・PBR・配当利回りを当てはめて買い価格へ変換します。計算式は以下のとおりです。
        </p>
        <ul>
          <li>PER ベース目標株価 = EPS × 目標 PER</li>
          <li>PBR ベース目標株価 = BPS × 目標 PBR</li>
          <li>配当利回りベース目標株価 = 年間配当 ÷ 目標配当利回り</li>
        </ul>

        <h3>4. 最も低い目標株価がボトルネック指標：複数条件の使い方</h3>
        <p>
          PER・PBR・配当利回りの 3 条件すべてを同時に満たしたい場合、計算結果の中で最も低い価格が実質的な買い判断の基準になります。この最低価格を生み出す条件を「ボトルネック指標」と呼び、どの条件が最も厳しい制約かを一目で把握できます。安全余裕（マージン・オブ・セーフティ）を重視するバリュー投資家に特に有効な考え方です。
        </p>

        <h3>5. 決算・配当変更のたびに目標株価を更新する</h3>
        <p>
          目標株価は EPS・BPS・配当予想を前提として計算されます。決算発表や配当方針の変更があれば、前提となる数値が変わるため、以前の目標株価に固執せず再計算することが重要です。定期的に見直す習慣をつけることで、常に最新の業績・財務状況に基づいた買いルールを維持できます。
        </p>

        <p>
          <a href="/ja/" role="button">計算ツールを開く</a>
        </p>
      </section>
    `,
  },
};
