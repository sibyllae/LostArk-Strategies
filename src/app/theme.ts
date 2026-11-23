import { theme, type ThemeConfig } from 'antd';

export const FONT_FAMILY = "Inter, 'Noto Sans TC', system-ui, -apple-system, sans-serif";

export const appTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#c4984d',
    colorInfo: '#60a5fa',
    colorSuccess: '#4ade80',
    colorWarning: '#d8b26e',
    colorError: '#f87171',
    colorBgBase: '#0e1013',
    colorBgContainer: '#14171c',
    colorBgElevated: '#191d24',
    colorBorder: '#2a303c',
    colorBorderSecondary: '#20252f',
    colorText: '#e7e5e4',
    colorTextSecondary: '#a8a29e',
    borderRadius: 6,
    fontFamily: FONT_FAMILY,
    wireframe: false,
  },
  components: {
    Table: {
      headerBg: '#191d24',
      headerColor: '#a8a29e',
      rowHoverBg: '#1d222b',
      colorBgContainer: 'transparent',
      borderColor: '#232833',
      cellPaddingBlockMD: 10,
      cellPaddingInlineMD: 14,
    },
    Tabs: {
      itemColor: '#a8a29e',
      itemHoverColor: '#e7e5e4',
      itemSelectedColor: '#ebd09a',
      inkBarColor: '#c4984d',
      titleFontSize: 14,
    },
    Segmented: {
      trackBg: '#14171c',
      itemSelectedBg: '#252b36',
      itemSelectedColor: '#f5f5f4',
      itemColor: '#a8a29e',
    },
    Card: {
      colorBgContainer: '#14171c',
      colorBorderSecondary: '#232833',
      headerBg: '#171b22',
    },
    Collapse: {
      headerBg: '#171b22',
      contentBg: '#12151a',
      headerPadding: '12px 16px',
      contentPadding: '16px',
    },
    Modal: {
      contentBg: '#14171c',
    },
    Drawer: {
      colorBgElevated: '#111419',
    },
    Input: {
      colorBgContainer: '#14171c',
      activeBorderColor: '#c4984d',
      hoverBorderColor: '#3a4252',
    },
    Select: {
      colorBgContainer: '#14171c',
      activeBorderColor: '#c4984d',
      hoverBorderColor: '#3a4252',
    },
    Switch: {
      colorPrimary: '#c4984d',
      colorPrimaryHover: '#d8b26e',
    },
  },
};
