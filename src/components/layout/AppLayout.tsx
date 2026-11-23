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
    <div className='relative min-h-dvh bg-obsidian-950'>
      <TopProgress active={navigation.state === 'loading'} />

      <aside className='fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-obsidian-700/70 bg-[#111419] lg:block'>
        <SidebarNav />
      </aside>

      <div className='flex min-h-dvh flex-col lg:pl-60'>
        <AppHeader onOpenMenu={() => setMenuOpen(true)} onOpenSearch={openSearch} />
        <main className='mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8'>
          <div key={location.pathname} className='animate-fade-in'>
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
        size={264}
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
