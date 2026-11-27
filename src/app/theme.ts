import { theme, type ThemeConfig } from 'antd';
import type { ThemeMode } from '@/hooks/useThemeMode';

export const FONT_FAMILY =
  "'Plus Jakarta Sans', 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei UI', system-ui, -apple-system, sans-serif";

export function getAppTheme(mode: ThemeMode): ThemeConfig {
  const isDark = mode === 'dark';

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: isDark ? '#e5b55f' : '#b45c0e',
      colorInfo: isDark ? '#38bdf8' : '#0284c7',
      colorSuccess: isDark ? '#34d399' : '#059669',
      colorWarning: isDark ? '#f59e0b' : '#d97706',
      colorError: isDark ? '#f87171' : '#dc2626',
      colorBgBase: isDark ? '#0e1116' : '#f4f6fa',
      colorBgContainer: isDark ? '#171c24' : '#ffffff',
      colorBgElevated: isDark ? '#1f2631' : '#ffffff',
      colorBorder: isDark ? '#272f3d' : '#e2e8f0',
      colorBorderSecondary: isDark ? '#202734' : '#edf2f7',
      colorText: isDark ? '#f1f5f9' : '#0f172a',
      colorTextSecondary: isDark ? '#adb8c9' : '#475569',
      borderRadius: 10,
      fontSize: 14,
      fontFamily: FONT_FAMILY,
      wireframe: false,
    },
    components: {
      Table: {
        headerBg: isDark ? '#131820' : '#f8fafc',
        headerColor: isDark ? '#adb8c9' : '#475569',
        rowHoverBg: isDark ? 'rgba(229, 181, 95, 0.05)' : '#f8fafc',
        colorBgContainer: 'transparent',
        borderColor: isDark ? '#232a37' : '#edf2f7',
        cellPaddingBlockMD: 15,
        cellPaddingInlineMD: 18,
      },
      Segmented: {
        trackBg: isDark ? '#11151c' : '#eef2f6',
        itemSelectedBg: isDark ? '#242c3a' : '#ffffff',
        itemSelectedColor: isDark ? '#f8fafc' : '#0f172a',
        itemColor: isDark ? '#8e9bb0' : '#64748b',
      },
      Modal: {
        contentBg: isDark ? '#171c24' : '#ffffff',
      },
      Drawer: {
        colorBgElevated: isDark ? '#141820' : '#ffffff',
      },
      Input: {
        colorBgContainer: isDark ? '#12161e' : '#f8fafc',
        activeBorderColor: isDark ? '#e5b55f' : '#b45c0e',
        hoverBorderColor: isDark ? '#3a4558' : '#cbd5e1',
        paddingBlock: 8,
        paddingInline: 12,
      },
      Select: {
        colorBgContainer: isDark ? '#12161e' : '#f8fafc',
        activeBorderColor: isDark ? '#e5b55f' : '#b45c0e',
        hoverBorderColor: isDark ? '#3a4558' : '#cbd5e1',
      },
      Switch: {
        colorPrimary: isDark ? '#d9a441' : '#b45c0e',
        colorPrimaryHover: isDark ? '#e5b55f' : '#92400e',
      },
    },
  };
}
