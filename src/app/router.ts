import type { ComponentType } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import RouteErrorBoundary from '@/components/layout/RouteErrorBoundary';
import FullPageLoader from '@/components/ui/FullPageLoader';
import { getNavItem, type NavKey } from '@/config/navigation';
import HomePage from '@/features/home/HomePage';
import NotFoundPage from '@/features/not-found/NotFoundPage';
import type { RouteHandle } from '@/types/router';

/** 依導覽設定建立 lazy route（程式碼分割），路徑與 SEO 資訊皆來自 config/navigation */
const lazyPage = (
  key: NavKey,
  loader: () => Promise<{ default: ComponentType }>
): RouteObject => {
  const item = getNavItem(key);
  return {
    path: item.path.slice(1),
    handle: {
      title: item.title,
      description: `${item.description} — 失落的方舟繁中版攻略整理。`,
      keywords: item.keywords,
    } satisfies RouteHandle,
    lazy: async () => ({ Component: (await loader()).default }),
  };
};

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: AppLayout,
      ErrorBoundary: RouteErrorBoundary,
      HydrateFallback: FullPageLoader,
      children: [
        {
          // 子頁面錯誤時保留外層版面
          ErrorBoundary: RouteErrorBoundary,
          children: [
            { index: true, Component: HomePage },
            lazyPage('favorability', () => import('@/features/favorability/FavorabilityPage')),
            lazyPage('adventureBook', () => import('@/features/adventure-book/AdventureBookPage')),
            lazyPage('collectibles', () => import('@/features/collectibles/CollectiblesPage')),
            lazyPage('raidChests', () => import('@/features/raid-chests/RaidChestsPage')),
            lazyPage('systems', () => import('@/features/systems/SystemsPage')),
            lazyPage('miscGuide', () => import('@/features/misc-guide/MiscGuidePage')),
            {
              path: '*',
              Component: NotFoundPage,
              handle: {
                title: '找不到頁面',
                description: '找不到您請求的失落的方舟攻略頁面。',
                noindex: true,
              } satisfies RouteHandle,
            },
          ],
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' }
);
