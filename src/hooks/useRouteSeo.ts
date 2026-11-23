import { useEffect } from 'react';
import { formatPageTitle, SITE } from '@/config/navigation';
import type { RouteHandle } from '@/types/router';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setBreadcrumbJsonLd(pathname: string, pageTitle?: string) {
  const id = 'seo-breadcrumb-jsonld';
  let script = document.getElementById(id) as HTMLScriptElement | null;

  if (!pageTitle || pathname === '/') {
    script?.remove();
    return;
  }

  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE.nameZh,
        item: `${SITE.url}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageTitle,
        item: `${SITE.url}${normalizedPath}`,
      },
    ],
  };

  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

/** 依目前路由同步更新文件標題、Meta Description、Canonical、Open Graph 與麵包屑結構化資料 */
export function useRouteSeo(pathname: string, handle?: RouteHandle) {
  useEffect(() => {
    const fullTitle = formatPageTitle(handle?.title);
    const description = handle?.description ?? SITE.description;
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const canonicalUrl = `${SITE.url}${normalizedPath}`;

    document.title = fullTitle;
    setCanonical(canonicalUrl);

    setMeta('name', 'description', description);
    setMeta('name', 'robots', handle?.noindex ? 'noindex, nofollow' : 'index, follow');
    if (handle?.keywords?.length) {
      setMeta('name', 'keywords', ['失落的方舟', 'Lost Ark', ...handle.keywords].join(', '));
    }

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);

    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);

    setBreadcrumbJsonLd(pathname, handle?.noindex ? undefined : handle?.title);
  }, [pathname, handle?.title, handle?.description, handle?.keywords, handle?.noindex]);
}
