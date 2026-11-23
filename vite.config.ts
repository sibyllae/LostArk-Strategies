import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const BASE = '/LostArk-Strategies/';
const SITE_ORIGIN = 'https://sibyllae.github.io/LostArk-Strategies';

interface StaticSeoRoute {
  path: string;
  title: string;
  description: string;
  keywords: string[];
}

const STATIC_SEO_ROUTES: StaticSeoRoute[] = [
  {
    path: '/game/favorability',
    title: '好友度 | LostArk Strategies 失落的方舟攻略網',
    description: 'NPC 好感度各階段獎勵與最大好感度一覽 — 失落的方舟繁中版攻略整理。',
    keywords: ['失落的方舟', 'Lost Ark', '好感度', 'NPC', 'Rapport', '卡片', '巨人心臟'],
  },
  {
    path: '/game/adventureBook',
    title: '冒險之書 | LostArk Strategies 失落的方舟攻略網',
    description: '各大陸冒險之書完成度對應的獎勵一覽 — 失落的方舟繁中版攻略整理。',
    keywords: ['失落的方舟', 'Lost Ark', '冒險之書', '大陸', '完成度', '里程碑獎勵'],
  },
  {
    path: '/game/collectibles',
    title: '收集品追蹤 | LostArk Strategies 失落的方舟攻略網',
    description:
      '巨人心臟、島之心、偉大的藝術品、奧菲斯之星、記憶八音盒、血爪海圖、世界樹之葉與摩可可等 9 種收集品攻略。',
    keywords: [
      '失落的方舟',
      '收集品',
      '巨人心臟',
      '島之心',
      '記憶八音盒',
      '血爪海圖',
      '世界樹之葉',
      '摩可可',
    ],
  },
  {
    path: '/game/raidChests',
    title: '副本開箱分析 | LostArk Strategies 失落的方舟攻略網',
    description: 'T3 軍團長與 T4 卡札羅斯第 1～4 幕／終幕通關金幣與額外寶箱開箱收益互動試算。',
    keywords: ['失落的方舟', '副本開箱', '軍團長', '卡札羅斯', 'T4', '金幣試算', '寶箱'],
  },
  {
    path: '/game/systems',
    title: '養成與配裝 | LostArk Strategies 失落的方舟攻略網',
    description: 'T4 飾品研磨詞條、艾利西爾 40 覺、超越／卡爾瑪與各大洲流浪商人傳說卡攻略。',
    keywords: ['失落的方舟', 'T4 飾品', '研磨詞條', '艾利西爾', '超越', '卡爾瑪', '流浪商人'],
  },
  {
    path: '/game/miscGuide',
    title: '雜項攻略 | LostArk Strategies 失落的方舟攻略網',
    description: '裝等解鎖路線、T4 方舟星圖、副本戰鬥道具、樂譜、符文、T3／T4 卡組與技能／悟性點數整理。',
    keywords: ['失落的方舟', '裝等路線', '方舟星圖', '戰鬥道具', '樂譜', '符文', '卡組', '技能點'],
  },
];

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** 開發／預覽時訪問根路徑 `/` 自動導向 `/LostArk-Strategies/` */
const redirectRootToBase = (): Plugin => {
  const redirectMiddleware: Parameters<NonNullable<Plugin['configureServer']>>[0]['middlewares']['use'] extends (
    fn: infer F
  ) => unknown
    ? F
    : never = (req, res, next) => {
    if (req.url === '/') {
      res.statusCode = 302;
      res.setHeader('Location', BASE);
      res.end();
      return;
    }
    next();
  };

  return {
    name: 'redirect-root-to-base',
    configureServer(server) {
      server.middlewares.use(redirectMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirectMiddleware);
    },
  };
};

/**
 * 建置完成後為每個主要路由產出獨立的靜態 HTML（含專屬 title / description / canonical / OG / JSON-LD），
 * 讓 GitHub Pages 對各子路由直接回傳 HTTP 200 OK，同時確保搜尋引擎與社群預覽不依賴 JS 即可讀到正確中繼資料。
 */
const emitStaticSeoRoutes = (): Plugin => ({
  name: 'emit-static-seo-routes',
  apply: 'build',
  closeBundle() {
    const distDir = fileURLToPath(new URL('./dist', import.meta.url));
    const templatePath = resolve(distDir, 'index.html');
    const template = readFileSync(templatePath, 'utf-8');

    for (const route of STATIC_SEO_ROUTES) {
      const canonical = `${SITE_ORIGIN}${route.path}`;
      const breadcrumbJsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '失落的方舟攻略網', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: route.title.split(' | ')[0], item: canonical },
        ],
      });

      const html = template
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`)
        .replace(
          /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
          `<meta name="description" content="${escapeHtml(route.description)}" />`
        )
        .replace(
          /<meta\s+name="keywords"\s+content="[^"]*"\s*\/>/,
          `<meta name="keywords" content="${escapeHtml(route.keywords.join(', '))}" />`
        )
        .replace(
          /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
          `<link rel="canonical" href="${canonical}" />`
        )
        .replace(
          /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
          `<meta property="og:url" content="${canonical}" />`
        )
        .replace(
          /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
          `<meta property="og:title" content="${escapeHtml(route.title)}" />`
        )
        .replace(
          /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
          `<meta property="og:description" content="${escapeHtml(route.description)}" />`
        )
        .replace(
          /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
          `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`
        )
        .replace(
          /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
          `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`
        )
        .replace(
          '</head>',
          `    <script id="seo-breadcrumb-jsonld" type="application/ld+json">${breadcrumbJsonLd}</script>\n  </head>`
        );

      const outPath = resolve(distDir, route.path.slice(1), 'index.html');
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, html, 'utf-8');
    }

    // 同步產出 404.html（加上 noindex 避免無效網址被收錄，仍保留 SPA fallback）
    const notFoundHtml = template.replace(
      /<meta\s+name="robots"\s+content="[^"]*"\s*\/>/,
      '<meta name="robots" content="noindex, nofollow" />'
    );
    writeFileSync(resolve(distDir, '404.html'), notFoundHtml, 'utf-8');
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [react(), redirectRootToBase(), emitStaticSeoRoutes()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
});
