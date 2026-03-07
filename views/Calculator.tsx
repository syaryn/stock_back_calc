import { html, raw } from "hono/html";
import i18next, { Language, resources } from "../utils/i18n.ts";
import {
  calculateFundamentals,
  calculateTargetPrices,
  MarketState,
} from "../utils/pricing.ts";

interface CalculatorProps {
  lang: Language;
  pathLang?: string;
  initialState?: Partial<MarketState>;
  initialTargets?: { per?: number; pbr?: number; yield?: number };
  queryParams?: Record<string, string>;
}

export const Calculator = (props: CalculatorProps) => {
  const {
    lang,
    pathLang,
    initialState = {},
    initialTargets = {},
    queryParams = {},
  } = props;
  const initialLang = lang && (lang === "ja" || lang === "en") ? lang : "en";
  const localizedPathLang = pathLang === "ja" || pathLang === "en"
    ? pathLang
    : undefined;
  const t = i18next.getFixedT(initialLang);
  const homeHref = localizedPathLang === "ja" ? "/ja/" : "/";
  const guideHref = localizedPathLang === "ja" ? "/ja/guide/" : "/guide/";
  const aboutHref = localizedPathLang === "ja" ? "/ja/about/" : "/about/";
  const targetLang = initialLang === "en" ? "ja" : "en";
  const fallbackParams = new URLSearchParams(queryParams);
  fallbackParams.delete("lang");
  const fallbackQuery = fallbackParams.size > 0
    ? `?${fallbackParams.toString()}`
    : "";
  const fallbackHref = targetLang === "ja"
    ? `/ja/${fallbackQuery}`
    : `/en/${fallbackQuery}`;

  const resourcesJson = JSON.stringify(resources);

  const script = `
const resourcesData = ${resourcesJson};
const calculateFundamentals = ${calculateFundamentals.toString()};
const calculateTargetPrices = ${calculateTargetPrices.toString()};

document.addEventListener('alpine:init', () => {
  Alpine.data('calculator', () => ({
    lang: '${initialLang}',
    stockPrice: ${initialState.price ?? "null"},
    currentPer: ${initialState.per ?? "null"},
    currentPbr: ${initialState.pbr ?? "null"},
    currentYield: ${initialState.yield ?? "null"},
    targetPer: ${initialTargets.per ?? (initialState.per ?? "null")},
    targetPbr: ${initialTargets.pbr ?? (initialState.pbr ?? "null")},
    targetYield: ${initialTargets.yield ?? (initialState.yield ?? "null")},
    targetPerDirty: ${initialTargets.per !== undefined ? "true" : "false"},
    targetPbrDirty: ${initialTargets.pbr !== undefined ? "true" : "false"},
    targetYieldDirty: ${initialTargets.yield !== undefined ? "true" : "false"},

    get fundamentals() {
      return calculateFundamentals({
        price: this.stockPrice,
        per: this.currentPer,
        pbr: this.currentPbr,
        yield: this.currentYield,
      });
    },

    get results() {
      return calculateTargetPrices(this.fundamentals, {
        per: this.targetPer,
        pbr: this.targetPbr,
        yield: this.targetYield,
      });
    },

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
      if (typeof i18next === 'undefined') return key;
      return i18next.t(key);
    },

    getLangSwitchUrl() {
      const nextLang = this.lang === 'en' ? 'ja' : 'en';
      const params = new URLSearchParams(window.location.search);
      params.delete('lang');
      const search = params.toString() ? '?' + params.toString() : '';
      return nextLang === 'ja' ? '/ja/' + search : '/en/' + search;
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

    getDiffStyle(targetPrice) {
      if (!this.stockPrice || !targetPrice) return ''
      return targetPrice > this.stockPrice ? 'color: var(--pico-color-emerald-500)' : 'color: var(--pico-color-pink-500)'
    },

    async init() {
      if (typeof i18next !== 'undefined') {
        await i18next.init({
          lng: this.lang,
          fallbackLng: 'en',
          resources: resourcesData,
        });
      }

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
      const currentPath = window.location.pathname;
      const search = params.toString() ? '?' + params.toString() : '';
      const newUrl = currentPath + search;
      window.history.replaceState({}, '', newUrl);
    }
  }));
});
  `;

  return html`
    <div x-data="calculator">
      <header class="site-nav">
        <nav>
          <ul>
            <li><strong>${t("toolNavLabel")}</strong></li>
          </ul>
          <ul>
            <li><a href="${homeHref}" aria-current="page">${t(
              "toolNavLabel",
            )}</a></li>
            <li><a href="${guideHref}">${t("guideNavLabel")}</a></li>
            <li><a href="${aboutHref}">${t("aboutNavLabel")}</a></li>
            <li>
              <a
                href="https://github.com/syaryn/stock_back_calc"
                target="_blank"
                rel="noopener noreferrer"
                class="contrast"
                aria-label="GitHub Repository"
                style="display: flex; align-items: center;"
              >
                <picture>
                  <source
                    srcset="/GitHub_Invertocat_White_Clearspace.svg"
                    media="(prefers-color-scheme: dark)"
                  />
                  <img
                    src="/GitHub_Invertocat_Black_Clearspace.svg"
                    alt="GitHub"
                    width="48"
                    height="48"
                  />
                </picture>
              </a>
            </li>
            <li>
              <a
                class="outline"
                role="button"
                href="${fallbackHref}"
                :href="getLangSwitchUrl()"
                x-text="t('toggleLang')"
              >
                ${t("toggleLang")}
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <section class="page-lead">
        <h1>${t("introHeading")}</h1>
        <p>${t("introBody")}</p>
      </section>

      <div class="responsive-grid">
        <article class="card-content">
          <header><h2 x-text="t('currentValues')">${t(
            "currentValues",
          )}</h2></header>

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

        <article class="card-content">
          <header><h2 x-text="t('targetValues')">${t(
            "targetValues",
          )}</h2></header>

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

        <article class="card-content">
          <header><h2 x-text="t('results')">${t("results")}</h2></header>

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
