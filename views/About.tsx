import { html, raw } from "hono/html";
import i18next, { Language } from "../utils/i18n.ts";

interface AboutProps {
  lang: Language;
  pathLang?: Language;
}

export const About = (props: { lang: Language; pathLang?: Language }) => {
  const t = i18next.getFixedT(props.lang);
  const localizedPathLang = props.pathLang === "ja" || props.pathLang === "en"
    ? props.pathLang
    : undefined;
  const toolHref = localizedPathLang === "ja" ? "/ja/" : "/";
  const aboutHref = localizedPathLang === "ja" ? "/ja/about/" : "/about/";
  const guideHref = localizedPathLang === "ja" ? "/ja/guide/" : "/guide/";
  const switchHref = props.lang === "ja" ? "/en/about/" : "/ja/about/";

  return html`
    <header class="site-nav">
      <nav>
        <ul>
          <li><strong>${t("aboutNavLabel")}</strong></li>
        </ul>
        <ul>
          <li><a href="${toolHref}">${t("toolNavLabel")}</a></li>
          <li><a href="${guideHref}">${t("guideNavLabel")}</a></li>
          <li><a href="${aboutHref}" aria-current="page">${t(
            "aboutNavLabel",
          )}</a></li>
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
                <source
                  srcset="/GitHub_Invertocat_White_Clearspace.svg"
                  media="(prefers-color-scheme: light)"
                />
                <img
                  src="/GitHub_Invertocat_White_Clearspace.svg"
                  alt="GitHub"
                  width="20"
                  height="20"
                />
              </picture>
            </a>
          </li>
          <li>
            <a href="${switchHref}" aria-label="Switch language">
              ${props.lang === "ja" ? "EN" : "JP"}
            </a>
          </li>
        </ul>
      </nav>
    </header>

    <article>
      <header>
        <h1>${t("aboutPageTitle")}</h1>
      </header>
      <section>
        ${raw(t("aboutContent"))}
      </section>
    </article>
  `;
};
