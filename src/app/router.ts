import type { ComponentType } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import RouteErrorBoundary from '@/components/layout/RouteErrorBoundary';
import FullPageLoader from '@/components/ui/FullPageLoader';
import { getNavItem, type NavKey } from '@/config/navigation';
import AdventureBookPage from '@/features/adventure-book/AdventureBookPage';
import CollectiblesPage from '@/features/collectibles/CollectiblesPage';
import FavorabilityPage from '@/features/favorability/FavorabilityPage';
import HomePage from '@/features/home/HomePage';
import MiscGuidePage from '@/features/misc-guide/MiscGuidePage';
import NotFoundPage from '@/features/not-found/NotFoundPage';
import RaidChestsPage from '@/features/raid-chests/RaidChestsPage';
import SystemsPage from '@/features/systems/SystemsPage';
import type { RouteHandle } from '@/types/router';

/**
 * 直接同步載入六大核心頁面（合計 gzip 僅約 22 KB）：
 * 1. 徹底根除開發環境首次點擊子頁時 Vite 觸發 `504 Outdated Optimize Dep` 導致 ErrorBoundary 報錯。
 * 2. 徹底根除 GitHub Pages 部署換版瞬間舊分頁切換路由時的動態 chunk 404 錯誤，並實現 0 延遲秒切分頁。
 */
const pageRoute = (key: NavKey, Component: ComponentType): RouteObject => {
  const item = getNavItem(key);
  return {
    path: item.path.slice(1),
    Component,
    handle: {
      title: item.title,
      description: `${item.description} — 失落的方舟繁中版攻略整理。`,
      keywords: item.keywords,
    } satisfies RouteHandle,
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
          ErrorBoundary: RouteErrorBoundary,
          children: [
            { index: true, Component: HomePage },
            pageRoute('favorability', FavorabilityPage),
            pageRoute('adventureBook', AdventureBookPage),
            pageRoute('collectibles', CollectiblesPage),
            pageRoute('raidChests', RaidChestsPage),
            pageRoute('systems', SystemsPage),
            pageRoute('miscGuide', MiscGuidePage),
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
