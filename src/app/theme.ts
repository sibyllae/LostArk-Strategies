import { theme, type ThemeConfig } from 'antd';
import type { ThemeMode } from '@/hooks/useThemeMode';

export const FONT_FAMILY =
  "'Noto Sans TC', 'PingFang TC', 'Inter', system-ui, -apple-system, sans-serif";

export function getAppTheme(mode: ThemeMode): ThemeConfig {
  const isDark = mode === 'dark';

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: isDark ? '#5c7cfa' : '#4263eb',
      colorInfo: isDark ? '#748ffc' : '#364fc7',
      colorSuccess: isDark ? '#2ecc71' : '#188a4a',
      colorWarning: isDark ? '#f1c40f' : '#b37400',
      colorError: isDark ? '#ff6b6b' : '#d93025',
      colorBgBase: isDark ? '#121212' : '#f2f4f7',
      colorBgContainer: isDark ? '#1c1c1c' : '#ffffff',
      colorBgElevated: isDark ? '#242424' : '#ffffff',
      colorBorder: isDark ? '#2b2b2b' : '#dde2ea',
      colorBorderSecondary: isDark ? '#252525' : '#e6eaf0',
      colorText: isDark ? '#e8e8e8' : '#1c2129',
      colorTextSecondary: isDark ? '#a6a6a6' : '#555f6e',
      borderRadius: 6,
      borderRadiusSM: 4,
      borderRadiusLG: 10,
      fontSize: 14,
      fontFamily: FONT_FAMILY,
      wireframe: false,
    },
    components: {
      Table: {
        headerBg: isDark ? '#161616' : '#f5f7fa',
        headerColor: isDark ? '#a6a6a6' : '#555f6e',
        rowHoverBg: isDark ? '#2c2c2c' : '#e5eaf2',
        colorBgContainer: 'transparent',
        borderColor: isDark ? '#2b2b2b' : '#dde2ea',
        cellPaddingBlockMD: 10,
        cellPaddingInlineMD: 14,
      },
      Segmented: {
        trackBg: isDark ? '#0e0e0e' : '#e9edf3',
        itemSelectedBg: isDark ? '#242424' : '#ffffff',
        itemSelectedColor: isDark ? '#e8e8e8' : '#1c2129',
        itemColor: isDark ? '#a6a6a6' : '#555f6e',
      },
      Modal: {
        contentBg: isDark ? '#1c1c1c' : '#ffffff',
        borderRadiusLG: 10,
      },
      Drawer: {
        colorBgElevated: isDark ? '#181818' : '#ffffff',
      },
      Input: {
        colorBgContainer: isDark ? '#0e0e0e' : '#f8f9fb',
        colorBorder: isDark ? '#3e3e3e' : '#c0c8d4',
        activeBorderColor: isDark ? '#5c7cfa' : '#4263eb',
        hoverBorderColor: isDark ? '#5c7cfa' : '#4263eb',
        paddingBlock: 6,
        paddingInline: 11,
      },
      Select: {
        colorBgContainer: isDark ? '#0e0e0e' : '#f8f9fb',
        colorBorder: isDark ? '#3e3e3e' : '#c0c8d4',
        activeBorderColor: isDark ? '#5c7cfa' : '#4263eb',
        hoverBorderColor: isDark ? '#5c7cfa' : '#4263eb',
      },
      Switch: {
        colorPrimary: isDark ? '#2ecc71' : '#188a4a',
        colorPrimaryHover: isDark ? '#40d47e' : '#15733e',
      },
    },
  };
}
