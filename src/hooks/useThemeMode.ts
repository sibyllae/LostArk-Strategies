import { useCallback, useSyncExternalStore } from 'react';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'lostark_theme';
const listeners = new Set<() => void>();

function readTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const attr = document.documentElement.dataset.theme;
  if (attr === 'light' || attr === 'dark') return attr;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // ignore
  }
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark');
  document.documentElement.dataset.theme = mode;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', mode === 'dark' ? '#0e1116' : '#f4f6f9');
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore
  }
  listeners.forEach((fn) => fn());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useThemeMode() {
  const mode = useSyncExternalStore<ThemeMode>(subscribe, readTheme, () => 'dark');

  const toggleTheme = useCallback(() => {
    applyTheme(readTheme() === 'dark' ? 'light' : 'dark');
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    applyTheme(next);
  }, []);

  return { mode, isDark: mode === 'dark', toggleTheme, setTheme };
}
