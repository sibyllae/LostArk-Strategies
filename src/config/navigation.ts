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
  nameZh: '失落的方舟・戰術與收集快查手冊',
  patchBadge: 'T4 · 2026 卡達魯姆＆暗影襲擊戰紀元',
  url: 'https://sibyllae.github.io/LostArk-Strategies',
  description:
    '失落的方舟繁中版低眩光戰術快查手冊：收錄 T3／T4 全副本血條機制與每週 3 本金幣試算、T4 飾品／手鐲／遺物刻印書／寶石斷點、NPC 好感度、20 大陸冒險之書、9 大收集品追蹤、大航海船員與跨服譯名對照。',
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

/** 導覽唯一資料來源：頂部指揮列、行動抽屜、首頁啟動台、Q 鍵快搜、路由 SEO 皆由此產生 */
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
        description: '各大陸與島嶼 NPC 五階好感度獎勵、四維門檻、需求上限篩選與完成標記',
        icon: HeartOutlined,
        keywords: ['好感度', 'npc', 'rapport', '卡片', '巨人心臟', '巴亨圖爾', '妮娜芙', '金'],
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
        keywords: ['tome', '大陸', '完成度', '伊格涅亞', '庫爾贊', '里姆雷克', '卡達魯姆'],
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
        description: '巨人心臟、島之心、記憶八音盒、血爪海圖、世界樹 120 片等 9 大類進度記憶',
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
        title: '副本機制與週收帳本',
        shortTitle: '副本機制/帳本',
        subtitleEn: 'RAID MECHANICS & LEDGER',
        description: '伐爾坦至卡札羅斯終幕、賽爾卡、大聖堂與貝爾加丁 x 血條機制、聯手技與週收試算',
        icon: GoldOutlined,
        keywords: [
          '軍團長',
          '卡札羅斯',
          '阿爾莫切',
          '賽爾卡',
          '貝爾加丁',
          '地平線大聖堂',
          '血條機制',
          '艾斯特',
          '金幣',
          '寶箱',
        ],
      },
      {
        key: 'systems',
        roman: 'V',
        path: '/game/systems',
        title: '養成與配裝戰術',
        shortTitle: '養成配裝',
        subtitleEn: 'ARK PASSIVE & GEAR',
        description: 'T4 飾品研磨、手鐲詞條、遺物刻印書倍率、T4 寶石＆精煉斷點與 19 洲流浪商人',
        icon: SettingOutlined,
        keywords: [
          '飾品',
          '手鐲',
          '刻印',
          '遺物書',
          '怨恨',
          '腎上腺素',
          '寶石',
          '劫火',
          '精煉斷點',
          '艾利西爾',
          '超越',
          '卡爾瑪',
          '護腕',
          '流浪商人',
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
        description: '裝等路線、守護者、全職業流派、方舟星圖、卡組種族傷、大航海船員、跨服譯名與生活製作',
        icon: CompassOutlined,
        keywords: [
          '樂譜',
          '符文',
          '卡組',
          '惡魔傷',
          '技能點',
          '悟性',
          '方舟星圖',
          '戰鬥道具',
          '守護者',
          '職業',
          '船隻',
          '船員',
          '術語對照',
          '生活技能',
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
