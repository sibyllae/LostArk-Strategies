/* ---------------------------------- 好友度 ---------------------------------- */

/** favorabilities.json 原始資料格式 */
export interface FavorabilityRaw {
  npc: string;
  location: string;
  normal: string;
  attention: string;
  friendly: string;
  trust: string;
  love: string;
  maxAffinity: string;
}

export const FAVOR_TIERS = ['normal', 'attention', 'friendly', 'trust', 'love'] as const;
export type FavorTier = (typeof FAVOR_TIERS)[number];

/** 正規化後的 NPC 好感度資料 */
export interface Favorability {
  id: string;
  npc: string;
  locations: string[];
  maxAffinity: number;
  rewards: Record<FavorTier, string[]>;
}

/* --------------------------------- 冒險之書 --------------------------------- */

/** adventureBook.json 原始資料格式 */
export interface AdventureBookRaw {
  adventureBook: string;
  tenPercent: string;
  twentyPercent: string;
  thirtyPercent: string;
  fortyPercent: string;
  fiftyPercent: string;
  sixtyPercent: string;
  seventyPercent: string;
  eightyPercent: string;
  ninetyPercent: string;
}

export interface AdventureMilestone {
  percent: number;
  reward: string;
}

export interface AdventureBook {
  id: string;
  region: string;
  milestones: AdventureMilestone[];
}

/* ---------------------------------- 收集品 ---------------------------------- */

export interface CollectibleReward {
  count: number;
  reward: string;
  note: string;
}

export interface CollectibleSource {
  id?: number;
  island?: string;
  source: string;
  note: string;
}

interface CollectibleCategory {
  rewards: CollectibleReward[];
  items: CollectibleSource[];
}

export interface CollectiblesData {
  igneaTokens: { rewards: CollectibleReward[] };
  giantHearts: CollectibleCategory;
  masterpieces: CollectibleCategory;
  omniumStars: CollectibleCategory;
  islandTokens: CollectibleCategory;
  seaBounties: CollectibleCategory;
  memoryOrbs: CollectibleCategory;
  bloodclawCharts: CollectibleCategory;
  worldTreeMokoko: {
    worldTreeRewards: CollectibleReward[];
    worldTreeNote: string;
    worldTreeSources?: CollectibleSource[];
    mokokoRewards: CollectibleReward[];
  };
}

/* --------------------------------- 副本開箱 --------------------------------- */

export interface RaidGate {
  gate: string;
  goldReward: number;
  chestCost: number;
  chestContents: string;
}

export interface RaidInfo {
  name: string;
  nameEn: string;
  tier?: 'T3' | 'T4';
  difficulty?: '普通' | '困難';
  ilvl: number;
  gates: RaidGate[];
  totalGold: number;
  totalChestCost: number;
  netGold: number;
  recommendation: string;
}

export interface RaidChestsData {
  raids: RaidInfo[];
  notes: string[];
}

/* --------------------------------- 雜項攻略 --------------------------------- */

export interface SongData {
  name: string;
  source: string;
  note: string;
}

export interface SkillPointData {
  task: string;
  note: string;
}

export interface RuneData {
  rune: string;
  heroic: string;
  legendary: string;
  legendaryNote: string;
}

export interface CardSetData {
  setName: string;
  cards: { name: string; source: string }[];
}

export interface DailyLimitData {
  content: string;
  limit: string;
  note: string;
}

export interface DailyQuestData {
  name: string;
  location: string;
  dailyReward: string;
  reputationReward: string;
  requiredDays: number;
}

export interface ProgressionStepData {
  ilvl: string;
  milestone: string;
  system: string;
  note: string;
}

export interface ArkGridTopicData {
  topic: string;
  detail: string;
  note: string;
}

export interface BattleItemData {
  name: string;
  category: string;
  effect: string;
  timing: string;
}

export interface MiscGuideData {
  songs: SongData[];
  skillPoints: SkillPointData[];
  enlightenmentPoints: SkillPointData[];
  runes: RuneData[];
  cardSets: CardSetData[];
  dailyLimits: DailyLimitData[];
  dailyQuests: DailyQuestData[];
  progressionRoadmap: ProgressionStepData[];
  arkGrid: ArkGridTopicData[];
  battleItems: BattleItemData[];
}

/* ------------------------------- 養成與配裝指南 ------------------------------- */

export interface AccessoryPolishData {
  slot: string;
  role: string;
  primary: string;
  secondary: string;
  note: string;
}

export interface GearSystemData {
  system: string;
  unlock: string;
  goal: string;
  details: string;
}

export interface WanderingMerchantData {
  continent: string;
  merchant: string;
  cards: string;
  note: string;
}

export interface SystemsData {
  accessories: AccessoryPolishData[];
  gearSystems: GearSystemData[];
  wanderingMerchants: WanderingMerchantData[];
}
