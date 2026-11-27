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
  name: 'ARKESIA CODEX',
  subName: 'LostArk Strategies',
  nameZh: '失落的方舟・戰術與收集法典',
  patchBadge: 'T4 · 2026 卡達魯姆＆暗影襲擊戰紀元',
  url: 'https://sibyllae.github.io/LostArk-Strategies',
  description:
    '失落的方舟繁中版戰術與收集法典：收錄 NPC 好感度追蹤、20 大陸冒險之書、9 大類收集品勾選進度、T3／T4 卡札羅斯至貝爾加丁副本開箱與每週 3 本排程試算、T4 飾品／手鐲詞條、19 洲流浪商人與守護者新職業百科。',
  repo: 'https://github.com/sibyllae/LostArk-Strategies',
  dataSource:
    'https://docs.google.com/spreadsheets/d/1NuLGvFK98id3n835YzO6judXi2ovRSBgszau8gxHJjo/',
} as const;

export type NavKey =
  | 'favorability'
  | 'adventureBook'
  | 'collectibles'
  | 'raidChests'
  | 'systems'
  | 'miscGuide';

export interface NavItem {
  key: NavKey;
  roman: string;
  /** 相對於 basename 的路徑 */
  path: string;
  title: string;
  shortTitle: string;
  subtitleEn: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  keywords: string[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/** 導覽的唯一資料來源：頂部星盤指揮列、行動抽屜、首頁章節矩陣、快速搜尋、路由 SEO 皆由此產生 */
export const NAV_GROUPS: NavGroup[] = [
  {
    title: '探索與好感圖鑑',
    items: [
      {
        key: 'favorability',
        roman: 'I',
        path: '/game/favorability',
        title: 'NPC 好友度',
        shortTitle: '好友度',
        subtitleEn: 'RAPPORT ARCHIVE',
        description: '各大陸與島嶼 NPC 五階好感度獎勵、需求量排序與完成度標記',
        icon: HeartOutlined,
        keywords: ['好感度', 'npc', 'rapport', '卡片', '巨人心臟', '巴亨圖爾', '妮娜芙'],
      },
      {
        key: 'adventureBook',
        roman: 'II',
        path: '/game/adventureBook',
        title: '大陸冒險之書',
        shortTitle: '冒險之書',
        subtitleEn: "ADVENTURER'S TOME",
        description: '20 座大陸 10%～90% 里程碑獎勵橫軸與伊格涅亞標誌連動追蹤',
        icon: ReadOutlined,
        keywords: ['tome', '大陸', '完成度', '伊格涅亞', '庫爾贊', '里姆雷克'],
      },
    ],
  },
  {
    title: '遠征隊橫向收集',
    items: [
      {
        key: 'collectibles',
        roman: 'III',
        path: '/game/collectibles',
        title: '收集品追蹤',
        shortTitle: '收集品',
        subtitleEn: 'RELIC COLLECTIBLES',
        description: '巨人心臟、島之心、記憶八音盒、血爪海圖等 9 大類收集勾選與進度記憶',
        icon: CrownOutlined,
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
    title: '終局戰術與配裝',
    items: [
      {
        key: 'raidChests',
        roman: 'IV',
        path: '/game/raidChests',
        title: '副本開箱與週收',
        shortTitle: '副本帳本',
        subtitleEn: 'RAID GOLD LEDGER',
        description: 'T3 軍團長至 T4 卡札羅斯終幕、賽爾卡、大聖堂與貝爾加丁開箱試算＆每週 3 本排程',
        icon: GoldOutlined,
        keywords: ['軍團長', '卡札羅斯', '阿爾莫切', '賽爾卡', '貝爾加丁', '地平線大聖堂', '金幣', '寶箱', 't4'],
      },
      {
        key: 'systems',
        roman: 'V',
        path: '/game/systems',
        title: '養成與配裝戰術',
        shortTitle: '養成配裝',
        subtitleEn: 'ARK PASSIVE & GEAR',
        description: 'T4 飾品研磨數值、手鐲 S 級詞條、進階精煉／護腕／寶石與 19 洲流浪商人傳說卡',
        icon: SettingOutlined,
        keywords: [
          '飾品',
          '手鐲',
          '研磨',
          '艾利西爾',
          '超越',
          '卡爾瑪',
          '護腕',
          '流浪商人',
          '韋毅',
          '巴亨圖爾',
          '瓦爾格里斯',
          '瓦爾坎',
        ],
      },
    ],
  },
  {
    title: '全境百科速查',
    items: [
      {
        key: 'miscGuide',
        roman: 'VI',
        path: '/game/miscGuide',
        title: '百科速查台',
        shortTitle: '百科速查',
        subtitleEn: 'TACTICAL ENCYCLOPEDIA',
        description: '1415→1780 裝等路線、T4 守護者討伐、龍騎士／女聖騎／幻獸師、星圖、悟性點、卡組與符文',
        icon: CompassOutlined,
        keywords: [
          '樂譜',
          '符文',
          '卡組',
          '技能點',
          '悟性',
          '方舟星圖',
          '戰鬥道具',
          '裝等',
          '守護者',
          '龍騎士',
          '女聖騎',
          '幻獸師',
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
  title ? `${title} | ${SITE.subName} ${SITE.nameZh}` : `${SITE.subName} | ${SITE.nameZh}`;
