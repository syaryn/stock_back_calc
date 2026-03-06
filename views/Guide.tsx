import { html, raw } from "hono/html";
import { dictionary, Language } from "../utils/i18n.ts";

interface GuideProps {
  lang: Language;
}

export const Guide = ({ lang }: GuideProps) => {
  const t = dictionary[lang];
  const guideHref = lang === "ja" ? "/ja/guide/" : "/guide/";
  const switchHref = lang === "ja" ? "/guide/" : "/ja/guide/";

  return html`
    <section style="margin-block: 2rem 1rem;">
      <nav>
        <ul>
          <li><strong>${t.guideNavLabel}</strong></li>
        </ul>
        <ul>
          <li><a href="${lang === "ja" ? "/ja/" : "/"}">${t
            .toolNavLabel}</a></li>
          <li><a href="${guideHref}" aria-current="page">${t
            .guideNavLabel}</a></li>
          <li><a class="outline" href="${switchHref}">${t.toggleLang}</a></li>
        </ul>
      </nav>
    </section>

    <section>
      ${raw(t.guideContent)}
    </section>
  `;
};
