import type { ComponentType } from 'react';
import {
  CompassOutlined,
  CrownOutlined,
  GoldOutlined,
  HeartOutlined,
  ReadOutlined,
  SettingOutlined,
} from '@ant-design/icons';

export const SITE = {
  name: 'LostArk Strategies',
  nameZh: '失落的方舟攻略網',
  repo: 'https://github.com/sibyllae/LostArk-Strategies',
  dataSource:
    'https://docs.google.com/spreadsheets/d/1NuLGvFK98id3n835YzO6judXi2ovRSBgszau8gxHJjo/',
} as const;

export type Accent = 'rose' | 'sky' | 'emerald' | 'amber' | 'violet';

interface AccentStyle {
  text: string;
  iconBg: string;
  ring: string;
  gradient: string;
  hoverBorder: string;
  dot: string;
}

/** Tailwind 需要完整的 class 字串才能被掃描到，因此集中定義每個主題色 */
export const ACCENTS: Record<Accent, AccentStyle> = {
  rose: {
    text: 'text-rose-300',
    iconBg: 'bg-rose-500/15',
    ring: 'ring-rose-400/30',
    gradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
    hoverBorder: 'hover:border-rose-400/40',
    dot: 'bg-rose-400',
  },
  sky: {
    text: 'text-sky-300',
    iconBg: 'bg-sky-500/15',
    ring: 'ring-sky-400/30',
    gradient: 'from-sky-500/20 via-sky-500/5 to-transparent',
    hoverBorder: 'hover:border-sky-400/40',
    dot: 'bg-sky-400',
  },
  emerald: {
    text: 'text-emerald-300',
    iconBg: 'bg-emerald-500/15',
    ring: 'ring-emerald-400/30',
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    hoverBorder: 'hover:border-emerald-400/40',
    dot: 'bg-emerald-400',
  },
  amber: {
    text: 'text-amber-300',
    iconBg: 'bg-amber-500/15',
    ring: 'ring-amber-400/30',
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
    hoverBorder: 'hover:border-amber-400/40',
    dot: 'bg-amber-400',
  },
  violet: {
    text: 'text-violet-300',
    iconBg: 'bg-violet-500/15',
    ring: 'ring-violet-400/30',
    gradient: 'from-violet-500/20 via-violet-500/5 to-transparent',
    hoverBorder: 'hover:border-violet-400/40',
    dot: 'bg-violet-400',
  },
};

export type NavKey =
  | 'favorability'
  | 'adventureBook'
  | 'collectibles'
  | 'raidChests'
  | 'systems'
  | 'miscGuide';

export interface NavItem {
  key: NavKey;
  /** 相對於 basename 的路徑 */
  path: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  accent: Accent;
  keywords: string[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/** 導覽的唯一資料來源：側邊欄、首頁卡片、快速搜尋、路由標題都由此產生 */
export const NAV_GROUPS: NavGroup[] = [
  {
    title: '遊戲資訊',
    items: [
      {
        key: 'favorability',
        path: '/game/favorability',
        title: '好友度',
        description: 'NPC 好感度各階段獎勵與最大好感度一覽',
        icon: HeartOutlined,
        accent: 'rose',
        keywords: ['好感度', 'npc', 'rapport', '卡片', '巨人心臟'],
      },
      {
        key: 'adventureBook',
        path: '/game/adventureBook',
        title: '冒險之書',
        description: '各大陸冒險之書完成度對應的獎勵',
        icon: ReadOutlined,
        accent: 'sky',
        keywords: ['tome', '大陸', '完成度'],
      },
    ],
  },
  {
    title: '收集品',
    items: [
      {
        key: 'collectibles',
        path: '/game/collectibles',
        title: '收集品追蹤',
        description: '巨人心臟、島之心、記憶八音盒、血爪海圖等 9 種收集品攻略',
        icon: CrownOutlined,
        accent: 'emerald',
        keywords: [
          '島之心',
          '巨人心臟',
          '藝術品',
          '摩可可',
          '世界樹',
          '奧菲斯之星',
          '航海',
          '記憶八音盒',
          '血爪海圖',
        ],
      },
    ],
  },
  {
    title: '攻略工具',
    items: [
      {
        key: 'raidChests',
        path: '/game/raidChests',
        title: '副本開箱分析',
        description: 'T3 軍團長與 T4 卡札羅斯第 1～4 幕／終幕金幣與開箱試算',
        icon: GoldOutlined,
        accent: 'amber',
        keywords: ['軍團長', '卡札羅斯', '阿爾莫切', 'raid', '金幣', '寶箱', 't4'],
      },
      {
        key: 'systems',
        path: '/game/systems',
        title: '養成與配裝',
        description: 'T4 飾品研磨詞條、艾利西爾 40 覺、超越／卡爾瑪與流浪商人傳說卡',
        icon: SettingOutlined,
        accent: 'sky',
        keywords: ['飾品', '研磨', '艾利西爾', '超越', '卡爾瑪', '流浪商人', '韋毅', '巴亨圖爾'],
      },
    ],
  },
  {
    title: '參考資料',
    items: [
      {
        key: 'miscGuide',
        path: '/game/miscGuide',
        title: '雜項攻略',
        description: '裝等路線、方舟星圖、戰鬥道具、樂譜、符文、T3/T4 卡組與技能/悟性點數',
        icon: CompassOutlined,
        accent: 'violet',
        keywords: [
          '樂譜',
          '曲譜',
          '符文',
          '卡組',
          '技能點',
          '悟性',
          '方舟星圖',
          '戰鬥道具',
          '裝等',
          '每日任務',
        ],
      },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

export const getNavItem = (key: NavKey): NavItem => {
  const item = NAV_ITEMS.find((navItem) => navItem.key === key);
  if (!item) throw new Error(`Unknown nav key: ${key}`);
  return item;
};

export const formatPageTitle = (title?: string): string =>
  title ? `${title} | ${SITE.name} ${SITE.nameZh}` : `${SITE.name} | ${SITE.nameZh}`;
