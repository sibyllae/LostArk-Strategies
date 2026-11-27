import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useMatches,
  useNavigation,
} from 'react-router-dom';
import { Drawer, FloatButton } from 'antd';
import { useRouteSeo } from '@/hooks/useRouteSeo';
import type { RouteHandle } from '@/types/router';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import CommandPalette from './CommandPalette';
import SidebarNav from './SidebarNav';
import TopProgress from './TopProgress';
import type { LayoutContext } from './layoutContext';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export default function AppLayout() {
  const location = useLocation();
  const navigation = useNavigation();
  const matches = useMatches();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const routeHandle = matches
    .map((match) => match.handle as RouteHandle | undefined)
    .filter(Boolean)
    .at(-1);

  useRouteSeo(location.pathname, routeHandle);

  // 支援 Ctrl/⌘ + K，以及效仿 d2r.world 在非輸入狀態按下 Q 或 / 直接喚醒全站快搜
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((open) => !open);
        return;
      }
      if (
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isEditableTarget(event.target) &&
        (event.key.toLowerCase() === 'q' || event.key === '/')
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const outletContext = useMemo<LayoutContext>(() => ({ openSearch }), [openSearch]);

  return (
    <div className='flex min-h-dvh flex-col bg-canvas'>
      <TopProgress active={navigation.state === 'loading'} />

      <AppHeader onOpenMenu={() => setMenuOpen(true)} onOpenSearch={openSearch} />

      <main className='mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-10'>
        <div key={location.pathname} className='animate-fade-in'>
          <Outlet context={outletContext} />
        </div>
      </main>

      <AppFooter />

      <Drawer
        placement='left'
        open={menuOpen}
        onClose={closeMenu}
        closable={false}
        size={296}
        styles={{ body: { padding: 0 } }}
      >
        <SidebarNav onNavigate={closeMenu} />
      </Drawer>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <FloatButton.BackTop visibilityHeight={480} />
      <ScrollRestoration />
    </div>
  );
}
