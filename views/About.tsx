import { html, raw } from "hono/html";
import { dictionary, Language } from "../utils/i18n.ts";

interface AboutProps {
  lang: Language;
}

export const About = ({ lang }: AboutProps) => {
  const t = dictionary[lang];
  const toolHref = lang === "ja" ? "/ja/" : "/";
  const aboutHref = lang === "ja" ? "/ja/about/" : "/about/";
  const guideHref = lang === "ja" ? "/ja/guide/" : "/guide/";
  const switchHref = lang === "ja" ? "/about/" : "/ja/about/";

  return html`
    <section style="margin-block: 2rem 1rem;">
      <nav>
        <ul>
          <li><strong>${t.aboutNavLabel}</strong></li>
        </ul>
        <ul>
          <li><a href="${toolHref}">${t.toolNavLabel}</a></li>
          <li><a href="${guideHref}">${t.guideNavLabel}</a></li>
          <li><a href="${aboutHref}" aria-current="page">${t
            .aboutNavLabel}</a></li>
          <li><a class="outline" href="${switchHref}">${t.toggleLang}</a></li>
        </ul>
      </nav>
    </section>

    <section>
      ${raw(t.aboutContent)}
    </section>
  `;
};
