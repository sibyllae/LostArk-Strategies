import { theme, type ThemeConfig } from 'antd';

export const FONT_FAMILY = "Inter, 'Noto Sans TC', system-ui, -apple-system, sans-serif";

export const appTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#6366f1',
    colorInfo: '#38bdf8',
    colorSuccess: '#34d399',
    colorWarning: '#fbbf24',
    colorError: '#fb7185',
    colorBgBase: '#09090b',
    colorBgContainer: '#141417',
    colorBgElevated: '#1c1c21',
    colorBorder: '#2a2a31',
    colorBorderSecondary: '#1f1f25',
    borderRadius: 10,
    fontFamily: FONT_FAMILY,
    wireframe: false,
  },
  components: {
    Table: {
      headerBg: '#17171b',
      headerColor: '#a1a1aa',
      rowHoverBg: '#1c1c22',
      colorBgContainer: 'transparent',
      borderColor: '#202026',
    },
    Tabs: {
      itemColor: '#a1a1aa',
      itemHoverColor: '#e4e4e7',
      itemSelectedColor: '#f4f4f5',
      inkBarColor: '#34d399',
    },
    Segmented: {
      trackBg: 'rgba(255,255,255,0.04)',
      itemSelectedBg: '#2a2a33',
    },
    Modal: {
      contentBg: '#141417',
    },
    Drawer: {
      colorBgElevated: '#0c0c0f',
    },
  },
};
