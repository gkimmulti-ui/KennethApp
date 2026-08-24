#!/usr/bin/env node
/**
 * 검색 최적화(SEO) 빌드 스크립트
 *
 * 왜 필요한가:
 *   앱 카드는 index.html 안의 APPS 목록을 JavaScript가 그려냅니다.
 *   구글은 JS를 실행하지만, 네이버 크롤러와 AI 검색 봇(GPTBot, PerplexityBot,
 *   ClaudeBot 등)은 대부분 실행하지 않아 페이지가 비어 보입니다.
 *   이 스크립트는 APPS 데이터를 읽어 정적 HTML을 미리 만들어 넣어,
 *   JS 없이도 앱 정보가 보이도록 합니다. (JS가 켜져 있으면 동일 내용으로 다시 그립니다.)
 *
 * 실행:  node build-seo.js
 *        → index.html 의 마커 사이를 갱신하고 sitemap.xml 을 새로 만듭니다.
 *        APPS 목록을 수정한 뒤에는 반드시 다시 실행하세요.
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const HTML = path.join(ROOT, "index.html");
const SITE_URL = "https://gkimmulti-ui.github.io/";
const LANGS = ["ko", "en", "ja", "zh", "ru", "fil"];
const BUILD_LANG = "ko"; // 정적으로 심을 기본 언어

let html = fs.readFileSync(HTML, "utf8");

/* ── index.html 안의 데이터 그대로 읽어오기 (단일 소스 유지) ────────── */
function extract(name, openChar, closeChar) {
  const start = html.indexOf("const " + name + " = " + openChar);
  if (start === -1) throw new Error(name + " 을(를) index.html 에서 찾지 못했습니다.");
  let i = html.indexOf(openChar, start);
  let depth = 0;
  for (let j = i; j < html.length; j++) {
    const c = html[j];
    if (c === openChar) depth++;
    else if (c === closeChar) {
      depth--;
      if (depth === 0) return html.slice(i, j + 1);
    }
  }
  throw new Error(name + " 의 끝을 찾지 못했습니다.");
}

const I18N = new Function("return " + extract("I18N", "{", "}"))();
const DEV_DESC = new Function("return " + extract("DEV_DESC", "{", "}"))();
const APPS = new Function("DEV_DESC", "return " + extract("APPS", "[", "]"))(DEV_DESC);

const t = (key, lang) => (I18N[lang] && I18N[lang][key]) || I18N.en[key] || "";
const loc = (value, lang) => {
  if (value == null) return "";
  if (typeof value === "string" || Array.isArray(value)) return value;
  return value[lang] ?? value.en ?? value.ko ?? Object.values(value)[0] ?? "";
};
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ── 정적 앱 카드 HTML ─────────────────────────────────────────── */
function cardHtml(app, lang) {
  const name = loc(app.name, lang);
  const isImg = typeof app.icon === "string" && app.icon.includes("/");
  const icon = isImg
    ? `<div class="app-icon"><img src="${esc(app.icon)}" alt="${esc(name)} 앱 아이콘" width="64" height="64" loading="lazy" /></div>`
    : `<div class="app-icon" style="background:${esc(app.iconBg || "linear-gradient(135deg,#4f6ef7,#8a5cf6)")}">${app.icon || "📱"}</div>`;

  const links =
    app.status === "dev"
      ? `<span class="store-btn dev">🛠️ ${esc(t("store.dev", lang))}</span>`
      : [
          [app.playUrl, "Google Play"],
          [app.appStoreUrl, "App Store"],
        ]
          .map(([url, label]) =>
            url === null || url === undefined
              ? ""
              : url
              ? `<a class="store-btn" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`
              : `<span class="store-btn disabled">${esc(t("store.soon", lang))}</span>`
          )
          .join("");

  return (
    `<div class="app-card">` +
    `<div class="app-head">${icon}<div class="app-name"><h3>${esc(name)}</h3>` +
    (app.category ? `<div class="category">${esc(loc(app.category, lang))}</div>` : "") +
    `</div></div>` +
    (app.desc ? `<p class="app-desc">${esc(loc(app.desc, lang))}</p>` : `<p class="app-desc"></p>`) +
    (app.tags
      ? `<div class="app-tags">${loc(app.tags, lang).map((x) => `<span>${esc(x)}</span>`).join("")}</div>`
      : "") +
    (app.note ? `<p class="app-note">${esc(loc(app.note, lang))}</p>` : "") +
    `<div class="app-links">${links}</div>` +
    `</div>`
  );
}

/* ── 구조화 데이터: 구글 리치 결과와 AI 검색이 읽는 부분 ──────────── */
function jsonLd() {
  const lang = BUILD_LANG;
  const apps = APPS.filter((a) => a.status !== "dev");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": SITE_URL + "#website",
        url: SITE_URL,
        name: "Kenneth App",
        description: t("meta.desc", lang),
        inLanguage: LANGS,
        publisher: { "@id": SITE_URL + "#publisher" },
      },
      {
        "@type": "Organization",
        "@id": SITE_URL + "#publisher",
        name: "Kenneth App",
        url: SITE_URL,
        logo: SITE_URL + "images/kenneth-logo.png",
        email: "gkimmulti@gmail.com",
      },
      {
        "@type": "ItemList",
        name: t("apps.title", lang),
        numberOfItems: apps.length,
        itemListElement: apps.map((app, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareApplication",
            name: loc(app.name, lang),
            description: loc(app.desc, lang),
            image: SITE_URL + app.icon,
            operatingSystem: "Android",
            applicationCategory: "MobileApplication",
            installUrl: app.playUrl,
            url: app.playUrl,
            author: { "@id": SITE_URL + "#publisher" },
            offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
          },
        })),
      },
    ],
  };
}

/* ── 마커 사이를 갱신 (여러 번 실행해도 안전) ───────────────────── */
function replaceBetween(source, id, content) {
  const open = `<!-- seo:${id}:start -->`;
  const close = `<!-- seo:${id}:end -->`;
  const a = source.indexOf(open);
  const b = source.indexOf(close);
  if (a === -1 || b === -1) throw new Error(`마커 seo:${id} 를 찾지 못했습니다.`);
  return source.slice(0, a + open.length) + content + source.slice(b);
}

const lang = BUILD_LANG;
const released = APPS.filter((a) => a.status !== "dev").length;
const inDev = APPS.length - released;

const statsHtml = [
  ["stats.released", released],
  ["stats.dev", inDev],
  ["stats.langs", LANGS.length],
]
  .filter(([, n]) => n > 0)
  .map(([k, n]) => `<div class="stat"><b>${n}</b><span>${esc(t(k, lang))}</span></div>`)
  .join("");

const iconsHtml = APPS.filter((a) => typeof a.icon === "string" && a.icon.includes("/"))
  .map(
    (a) =>
      `<img src="${esc(a.icon)}" alt="${esc(loc(a.name, lang))}" width="58" height="58" loading="lazy" />`
  )
  .join("");

const FILTERS = ["all", "both", "ios-soon", "google", "korean", "dev"];
const chipsHtml = FILTERS.map((key) => {
  const n = key === "all" ? APPS.length : APPS.filter((a) => (a.flags || []).includes(key)).length;
  if (!n) return "";
  return `<button type="button" class="filter-chip${key === "all" ? " active" : ""}" data-filter="${key}">${esc(
    t("filter." + key, lang)
  )}<span class="count">${n}</span></button>`;
}).join("");

const cardsHtml = APPS.map((a) => cardHtml(a, lang)).join("");

/* data-i18n 로 비어 있는 요소(H1·소개 문구·메뉴 등)를 기본 언어 텍스트로 채웁니다.
   H1 과 본문 문구는 검색 순위에 가장 큰 영향을 주는 부분이라 비워두면 안 됩니다. */
let filled = 0;
/* [^<]* 로 잡아 이미 채워진 문구도 매번 최신 번역으로 다시 씁니다.
   (data-i18n 요소는 모두 단순 텍스트라 중첩 태그를 건드리지 않습니다) */
html = html.replace(
  /(<(\w+)(?:\s[^>]*)?\sdata-i18n="([^"]+)"(?:\s[^>]*)?>)([^<]*)(<\/\2>)/g,
  (match, open, tag, key, _old, close) => {
    const text = t(key, lang);
    if (!text) return match;
    filled++;
    return open + esc(text) + close;
  }
);

html = replaceBetween(html, "stats", statsHtml);
html = replaceBetween(html, "icons", iconsHtml);
html = replaceBetween(html, "filters", chipsHtml);
html = replaceBetween(html, "cards", cardsHtml);

html = html.replace(
  /(<script type="application\/ld\+json" id="ld-json">)[\s\S]*?(<\/script>)/,
  (_m, a, b) => a + JSON.stringify(jsonLd(), null, 2) + b
);

fs.writeFileSync(HTML, html);

/* ── sitemap.xml ──────────────────────────────────────────────── */
/* lastmod 는 "오늘" 대신 마지막 커밋 날짜를 씁니다.
   오늘 날짜를 쓰면 내용이 그대로여도 매일 파일이 달라져서
   CI 의 "최신 여부 확인"이 날마다 실패합니다. */
let today;
try {
  today = require("child_process")
    .execSync("git log -1 --format=%cs -- index.html", { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] })
    .toString()
    .trim();
} catch (_) { /* git 을 쓸 수 없는 환경 */ }
if (!/^\d{4}-\d{2}-\d{2}$/.test(today || "")) today = new Date().toISOString().slice(0, 10);
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  LANGS.map((l) => {
    const url = SITE_URL + (l === "ko" ? "" : "?lang=" + l);
    const alts = LANGS.map(
      (x) =>
        `    <xhtml:link rel="alternate" hreflang="${x}" href="${SITE_URL}${x === "ko" ? "" : "?lang=" + x}" />`
    ).join("\n");
    return (
      `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n` +
      `    <changefreq>weekly</changefreq>\n    <priority>${l === "ko" ? "1.0" : "0.8"}</priority>\n` +
      `${alts}\n` +
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}" />\n  </url>`
    );
  }).join("\n") +
  `\n</urlset>\n`;

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);

console.log(`앱 ${APPS.length}개 정적 HTML 생성 완료 (출시 ${released} / 개발중 ${inDev})`);
console.log(`본문 문구 ${filled}곳 채움 (H1·소개·메뉴 등)`);
console.log(`sitemap.xml 생성 완료 — ${LANGS.length}개 언어 주소`);
