import { html, raw } from "hono/html";
import { dictionary, Language } from "../utils/i18n.ts";

interface AboutProps {
  lang: Language;
  pathLang?: Language;
}

export const About = ({ lang, pathLang }: AboutProps) => {
  const t = dictionary[lang];
  const localizedPathLang = pathLang === "ja" || pathLang === "en"
    ? pathLang
    : undefined;
  const toolHref = localizedPathLang === "ja" ? "/ja/" : "/";
  const aboutHref = localizedPathLang === "ja" ? "/ja/about/" : "/about/";
  const guideHref = localizedPathLang === "ja" ? "/ja/guide/" : "/guide/";
  const switchHref = lang === "ja" ? "/en/about/" : "/ja/about/";

  return html`
    <header class="site-nav">
      <nav>
        <ul>
          <li><strong>${t.aboutNavLabel}</strong></li>
        </ul>
        <ul>
          <li><a href="${toolHref}">${t.toolNavLabel}</a></li>
          <li><a href="${guideHref}">${t.guideNavLabel}</a></li>
          <li><a href="${aboutHref}" aria-current="page">${t
            .aboutNavLabel}</a></li>
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
            <a class="outline" role="button" href="${switchHref}">
              ${t.toggleLang}
            </a>
          </li>
        </ul>
      </nav>
    </header>

    <section class="page-body">
      ${raw(t.aboutContent)}
    </section>
  `;
};
