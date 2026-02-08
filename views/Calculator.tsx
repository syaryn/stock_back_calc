import { html, raw } from "hono/html";
import { dictionary, Language } from "../utils/i18n.ts";
import {
  calculateFundamentals,
  calculateTargetPrices,
  MarketState,
} from "../utils/pricing.ts";

interface CalculatorProps {
  lang: Language;
  initialState?: Partial<MarketState>;
  initialTargets?: { per?: number; pbr?: number; yield?: number };
}

export const Calculator = (props: CalculatorProps) => {
  const initialLang = props.lang;
  const initialState = props.initialState || {};
  const initialTargets = props.initialTargets || {};

  const t = (key: keyof typeof dictionary["en"]) => {
    return dictionary[initialLang][key] || dictionary["en"][key] || key;
  };

  const dictJson = JSON.stringify(dictionary);

  // Logic Injection: We output the source code of the pricing functions so Alpine.js can use them.
  const script = `
const dictionaryData = ${dictJson};
const calculateFundamentals = ${calculateFundamentals.toString()};
const calculateTargetPrices = ${calculateTargetPrices.toString()};

document.addEventListener('alpine:init', () => {
  Alpine.data('calculator', () => ({
    lang: '${initialLang}',
    dict: dictionaryData,
    showAbout: false,

    // Market State Inputs (Default to null if not provided)
    stockPrice: ${initialState.price ?? "null"},
    currentPer: ${initialState.per ?? "null"},
    currentPbr: ${initialState.pbr ?? "null"},
    currentYield: ${initialState.yield ?? "null"},

    // Targets
    // If explicit target provided, use it.
    // Else if current provided, use current (synced).
    // Else null.
    targetPer: ${initialTargets.per ?? (initialState.per ?? "null")},
    targetPbr: ${initialTargets.pbr ?? (initialState.pbr ?? "null")},
    targetYield: ${initialTargets.yield ?? (initialState.yield ?? "null")},

    // Dirty Flags
    // True only if explicitly provided in initialTargets
    targetPerDirty: ${initialTargets.per !== undefined ? "true" : "false"},
    targetPbrDirty: ${initialTargets.pbr !== undefined ? "true" : "false"},
    targetYieldDirty: ${initialTargets.yield !== undefined ? "true" : "false"},

    // Computed Fundamentals
    get fundamentals() {
      return calculateFundamentals({
        price: this.stockPrice,
        per: this.currentPer,
        pbr: this.currentPbr,
        yield: this.currentYield,
      });
    },

    // Computed Target Prices
    get results() {
      return calculateTargetPrices(this.fundamentals, {
        per: this.targetPer,
        pbr: this.targetPbr,
        yield: this.targetYield,
      });
    },

    // Computed Implied Metrics at Min Price
    get implied() {
      const p = this.results.minPrice;
      if (!p || !this.fundamentals) return null;
      return {
        per: this.fundamentals.eps ? p / this.fundamentals.eps : null,
        pbr: this.fundamentals.bps ? p / this.fundamentals.bps : null,
        yield: (this.fundamentals.dividend && p) ? (this.fundamentals.dividend / p) * 100 : null
      };
    },

    t(key) {
      return this.dict[this.lang][key] || key
    },

    toggleLang() {
      this.lang = this.lang === 'en' ? 'ja' : 'en'
    },

    formatCurrency(val) {
      if (val === null || val === undefined || isNaN(val)) return '-'
      const isJa = this.lang === 'ja'
      return new Intl.NumberFormat(isJa ? 'ja-JP' : 'en-US', {
        style: 'currency',
        currency: isJa ? 'JPY' : 'USD',
        maximumFractionDigits: isJa ? 0 : 2
      }).format(val)
    },

    formatNumber(val, digits = 2) {
      if (val === null || val === undefined || isNaN(val)) return '-'
      return val.toFixed(digits)
    },

    formatPercent(val) {
      if (val === null || val === undefined || isNaN(val)) return '-'
      return val.toFixed(2) + '%'
    },

    // Comparison Text Color
    getDiffStyle(targetPrice) {
      if (!this.stockPrice || !targetPrice) return ''
      return targetPrice > this.stockPrice ? 'color: var(--pico-color-emerald-500)' : 'color: var(--pico-color-pink-500)'
    },

    // Comparison Text
    getDiffText(targetPrice) {
      if (!this.stockPrice || !targetPrice) return ''
      if (targetPrice > this.stockPrice) {
        const diff = ((targetPrice - this.stockPrice) / this.stockPrice) * 100
        return '+' + diff.toFixed(1) + '% (' + this.t('upside') + ')'
      } else {
        const diff = ((this.stockPrice - targetPrice) / this.stockPrice) * 100
        return '-' + diff.toFixed(1) + '% (' + this.t('downside') + ')'
      }
    },

    init() {
      // Sync Logic: If target not dirty, follow current
      this.$watch('currentPer', (val) => {
        if (!this.targetPerDirty) this.targetPer = val;
        this.updateUrl();
      });
      this.$watch('currentPbr', (val) => {
        if (!this.targetPbrDirty) this.targetPbr = val;
        this.updateUrl();
      });
      this.$watch('currentYield', (val) => {
        if (!this.targetYieldDirty) this.targetYield = val;
        this.updateUrl();
      });
      
      // Watchers for URL updates
      this.$watch('stockPrice', () => this.updateUrl());
      this.$watch('targetPer', () => this.updateUrl());
      this.$watch('targetPbr', () => this.updateUrl());
      this.$watch('targetYield', () => this.updateUrl());
    },

    updateUrl() {
      const params = new URLSearchParams();
      if (this.stockPrice) params.set('stockPrice', this.stockPrice);
      if (this.currentPer) params.set('currentPer', this.currentPer);
      if (this.currentPbr) params.set('currentPbr', this.currentPbr);
      if (this.currentYield) params.set('currentYield', this.currentYield);
      
      if (this.targetPer) params.set('targetPer', this.targetPer);
      if (this.targetPbr) params.set('targetPbr', this.targetPbr);
      if (this.targetYield) params.set('targetYield', this.targetYield);

      const newUrl = window.location.pathname + '?' + params.toString();
      window.history.replaceState({}, '', newUrl);
    }
  }))
})
  `;

  return html`
    <div x-data="calculator">
      <!-- Header with Language Toggle -->
      <nav>
        <ul>
          <li><strong><span x-text="t('title')">${t(
            "title",
          )}</span></strong></li>
        </ul>
        <ul>
          <li>
            <button
              class="secondary outline"
              @click="showAbout = true"
              x-text="t('aboutBtn')"
            >
              ${t("aboutBtn")}
            </button>
          </li>
          <li>
            <button class="outline" @click="toggleLang" x-text="t('toggleLang')">
              ${t("toggleLang")}
            </button>
          </li>
        </ul>
      </nav>

      <!-- About Modal -->
      <dialog :open="showAbout">
        <article>
          <header>
            <button aria-label="Close" rel="prev" @click="showAbout = false">
            </button>
            <p>
              <strong x-text="t('aboutTitle')">${t("aboutTitle")}</strong>
            </p>
          </header>
          <div x-html="t('aboutContent')">${raw(t("aboutContent"))}</div>
        </article>
      </dialog>

      <!-- Main Grid Layout -->
      <div class="responsive-grid">
        <!-- Column 1: Inputs (Current Market State) -->
        <article class="card-content">
          <header><h3 x-text="t('currentValues')">${t(
            "currentValues",
          )}</h3></header>

          <label>
            <span x-text="t('stockPrice')">${t("stockPrice")}</span>
            <input type="number" x-model.number="stockPrice" value="${initialState
              .price ?? ""}">
          </label>

          <label>
            <span x-text="t('currentPer')">${t("currentPer")}</span>
            <input
              type="number"
              x-model.number="currentPer"
              step="0.1"
              value="${initialState.per ?? ""}"
            >
          </label>

          <label>
            <span x-text="t('currentPbr')">${t("currentPbr")}</span>
            <input
              type="number"
              x-model.number="currentPbr"
              step="0.01"
              value="${initialState.pbr ?? ""}"
            >
          </label>

          <label>
            <span x-text="t('currentYield')">${t("currentYield")}</span>
            <input
              type="number"
              x-model.number="currentYield"
              step="0.1"
              value="${initialState.yield ?? ""}"
            >
          </label>
        </article>

        <!-- Column 2: Targets (Sliders + Inputs) -->
        <article class="card-content">
          <header><h3 x-text="t('targetValues')">${t(
            "targetValues",
          )}</h3></header>

          <!-- Target PER -->
          <label>
            <div class="grid">
              <span x-text="t('targetPer')">${t("targetPer")}</span>
              <input
                type="number"
                x-model.number="targetPer"
                size="4"
                step="0.1"
                @input="targetPerDirty = true"
                :disabled="!currentPer"
              >
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="0.1"
              x-model.number="targetPer"
              @input="targetPerDirty = true"
              :disabled="!currentPer"
            >
          </label>

          <!-- Target PBR -->
          <label>
            <div class="grid">
              <span x-text="t('targetPbr')">${t("targetPbr")}</span>
              <input
                type="number"
                x-model.number="targetPbr"
                size="4"
                step="0.01"
                @input="targetPbrDirty = true"
                :disabled="!currentPbr"
              >
            </div>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.01"
              x-model.number="targetPbr"
              @input="targetPbrDirty = true"
              :disabled="!currentPbr"
            >
          </label>

          <!-- Target Yield -->
          <label>
            <div class="grid">
              <span x-text="t('targetYield')">${t("targetYield")}</span>
              <input
                type="number"
                x-model.number="targetYield"
                size="4"
                step="0.1"
                @input="targetYieldDirty = true"
                :disabled="!currentYield"
              >
            </div>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              x-model.number="targetYield"
              @input="targetYieldDirty = true"
              :disabled="!currentYield"
            >
          </label>
        </article>

        <!-- Column 3: Results -->
        <article class="card-content">
          <header><h3 x-text="t('results')">${t("results")}</h3></header>

          <!-- Final Result (Minimum Price) -->
          <div
            style="padding: 1rem; border: 2px solid var(--pico-primary-border); margin-bottom: 2rem; border-radius: 8px; text-align: center;"
          >
            <strong x-text="t('finalPrice')">${t("finalPrice")}</strong>
            <div x-show="results.minPrice === null" x-text="t('inputRequired')">
              ${t("inputRequired")}
            </div>
            <div x-show="results.minPrice !== null">
              <h2
                x-text="formatCurrency(results.minPrice)"
                style="margin-bottom: 0.5rem; color: var(--pico-primary);"
              >
              </h2>
              <small
                x-show="results.bottleneck"
                style="color: var(--pico-muted-color);"
              >
                <span x-text="t('bottleneckDesc')">${t(
                  "bottleneckDesc",
                )}</span>:
                <strong x-text="t(results.bottleneck + 'Price')"></strong>
              </small>
            </div>
          </div>

          <template x-if="results.minPrice !== null && implied">
            <div>
              <hr />
              <div class="grid" style="text-align: center;">
                <div>
                  <small x-text="t('resultPer')">${t("resultPer")}</small><br>
                  <strong
                    x-text="formatNumber(implied.per, 1)"
                    :style="results.bottleneck === 'per' ? 'color: var(--pico-primary);' : ''"
                  ></strong>
                </div>
                <div>
                  <small x-text="t('resultPbr')">${t("resultPbr")}</small><br>
                  <strong
                    x-text="formatNumber(implied.pbr, 2) + 'x'"
                    :style="results.bottleneck === 'pbr' ? 'color: var(--pico-primary);' : ''"
                  ></strong>
                </div>
                <div>
                  <small x-text="t('resultYield')">${t(
                    "resultYield",
                  )}</small><br>
                  <strong
                    x-text="formatNumber(implied.yield, 2)"
                    :style="results.bottleneck === 'yield' ? 'color: var(--pico-primary);' : ''"
                  ></strong>
                </div>
              </div>
            </div>
          </template>
        </article>
      </div>

      <script>
      ${raw(script)}
      </script>
    </div>
  `;
};
