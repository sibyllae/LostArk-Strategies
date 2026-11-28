import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useMatches,
  useNavigation,
} from 'react-router-dom';
import { Drawer } from 'antd';
import { useRouteSeo } from '@/hooks/useRouteSeo';
import type { RouteHandle } from '@/types/router';
import { scrollToAndPulseAnchor } from '@/utils/slug';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import CommandPalette from './CommandPalette';
import FloatingTools from './FloatingTools';
import SidebarNav from './SidebarNav';
import TopProgress from './TopProgress';
import type { LayoutContext } from './layoutContext';

function isEditableElement(el: Element | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    el.isContentEditable ||
    Boolean(el.closest('[contenteditable="true"]'))
  );
}

export default function AppLayout() {
  const location = useLocation();
  const navigation = useNavigation();
  const matches = useMatches();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const routeHandle = matches
    .map((match) => match.handle as RouteHandle | undefined)
    .filter(Boolean)
    .at(-1);

  useRouteSeo(location.pathname, routeHandle);

  const openSearch = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      lastFocusedRef.current = document.activeElement;
    }
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    const prev = lastFocusedRef.current;
    if (prev && document.contains(prev)) {
      window.setTimeout(() => prev.focus(), 20);
    }
  }, []);

  // SKILL.md Section 4F：全域綁定 Q 鍵、/ 鍵與 Ctrl/⌘ + K，嚴格防呆輸入框焦點劫持
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (searchOpen) closeSearch();
        else openSearch();
        return;
      }

      if (searchOpen) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (
        isEditableElement(document.activeElement) ||
        isEditableElement(event.target instanceof Element ? event.target : null)
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === 'q' || key === '/') {
        event.preventDefault();
        openSearch();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchOpen, openSearch, closeSearch]);

  // 處理網址帶 #entity-slug 進入時的捲動偏移與邊框脈衝
  useEffect(() => {
    if (!location.hash) return;
    const targetId = decodeURIComponent(location.hash.slice(1));
    if (!targetId) return;
    const timer = window.setTimeout(() => {
      scrollToAndPulseAnchor(targetId);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const outletContext = useMemo<LayoutContext>(() => ({ openSearch }), [openSearch]);

  return (
    <div className='flex min-h-dvh flex-col bg-canvas'>
      <TopProgress active={navigation.state === 'loading'} />

      <AppHeader onOpenMenu={() => setMenuOpen(true)} onOpenSearch={openSearch} />

      <main className='mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-6 sm:py-5'>
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
        size={280}
        styles={{ body: { padding: 0 } }}
      >
        <SidebarNav onNavigate={closeMenu} />
      </Drawer>

      <CommandPalette open={searchOpen} onClose={closeSearch} />
      <FloatingTools />
      <ScrollRestoration />
    </div>
  );
}
