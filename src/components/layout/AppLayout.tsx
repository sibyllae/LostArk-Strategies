import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useMatches,
  useNavigation,
} from 'react-router-dom';
import { Drawer, FloatButton } from 'antd';
import { formatPageTitle } from '@/config/navigation';
import type { RouteHandle } from '@/types/router';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import CommandPalette from './CommandPalette';
import SidebarNav from './SidebarNav';
import TopProgress from './TopProgress';
import type { LayoutContext } from './layoutContext';

export default function AppLayout() {
  const location = useLocation();
  const navigation = useNavigation();
  const matches = useMatches();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // 以最深層 route 的 handle.title 設定文件標題
  const title = matches
    .map((match) => (match.handle as RouteHandle | undefined)?.title)
    .filter(Boolean)
    .at(-1);

  useEffect(() => {
    document.title = formatPageTitle(title);
  }, [title]);

  // Ctrl/⌘ + K 開啟快速搜尋
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const outletContext = useMemo<LayoutContext>(() => ({ openSearch }), [openSearch]);

  return (
    <div className='relative min-h-dvh'>
      <TopProgress active={navigation.state === 'loading'} />

      {/* 背景光暈 */}
      <div aria-hidden className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
        <div className='absolute -top-40 left-1/3 h-[480px] w-[720px] rounded-full bg-indigo-600/10 blur-[120px]' />
        <div className='absolute -right-40 top-1/2 h-[420px] w-[520px] rounded-full bg-amber-500/[0.06] blur-[120px]' />
      </div>

      <aside className='fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/5 bg-zinc-950/70 backdrop-blur-xl lg:block'>
        <SidebarNav />
      </aside>

      <div className='flex min-h-dvh flex-col lg:pl-64'>
        <AppHeader onOpenMenu={() => setMenuOpen(true)} onOpenSearch={openSearch} />
        <main className='mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8'>
          <div key={location.pathname} className='animate-slide-up'>
            <Outlet context={outletContext} />
          </div>
        </main>
        <AppFooter />
      </div>

      <Drawer
        placement='left'
        open={menuOpen}
        onClose={closeMenu}
        closable={false}
        size={288}
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
