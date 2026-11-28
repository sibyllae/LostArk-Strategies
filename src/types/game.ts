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
  virtueReq?: string;
}

export const FAVOR_TIERS = ['normal', 'attention', 'friendly', 'trust', 'love'] as const;
export type FavorTier = (typeof FAVOR_TIERS)[number];

/** 正規化後的 NPC 好感度資料 */
export interface Favorability {
  id: string;
  npc: string;
  locations: string[];
  maxAffinity: number;
  virtueReq?: string;
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
    mokokoNote?: string;
  };
}

/* ------------------------------- 副本開箱與機制 ------------------------------- */

export interface RaidGate {
  gate: string;
  boss?: string;
  goldReward: number;
  chestCost: number;
  chestContents: string;
  mechanics?: string[];
}

export type RaidDifficulty = '普通' | '困難' | '惡夢';

export interface RaidInfo {
  name: string;
  nameEn: string;
  tier?: 'T3' | 'T4';
  difficulty?: RaidDifficulty;
  partySize?: string;
  weakness?: string;
  soloAvailable?: boolean;
  boundGoldNote?: string;
  sidereals?: string;
  battleItems?: string;
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

/* --------------------------------- 百科速查 --------------------------------- */

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

export interface CardRaceBonusData {
  race: string;
  raceEn: string;
  maxBonus: string;
  targetRaids: string;
  keyCards: string;
  highlight?: boolean;
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

export interface GuardianRaidData {
  name: string;
  ilvl: string;
  weakness: string;
  battleItems: string;
  mechanics: string;
}

export interface ClassGuideData {
  className: string;
  archetype: string;
  releaseTag: string;
  arkPassiveBuilds: string;
  highlights: string;
}

export interface ShipSailorData {
  ship: string;
  shipEn: string;
  unlock: string;
  strengths: string;
  coreSailors: string;
  note: string;
}

export interface TerminologyMappingData {
  category: string;
  twTerm: string;
  globalEn: string;
  communityAlias: string;
  t4ChangeNote: string;
  changed?: boolean;
}

export interface LifeSkillData {
  skill: string;
  skillEn: string;
  t4Material: string;
  toolStats: string;
  note: string;
}

export interface MiscGuideData {
  songs: SongData[];
  skillPoints: SkillPointData[];
  enlightenmentPoints: SkillPointData[];
  runes: RuneData[];
  cardSets: CardSetData[];
  cardRaceBonuses?: CardRaceBonusData[];
  dailyLimits: DailyLimitData[];
  dailyQuests: DailyQuestData[];
  progressionRoadmap: ProgressionStepData[];
  arkGrid: ArkGridTopicData[];
  battleItems: BattleItemData[];
  guardianRaids?: GuardianRaidData[];
  newClasses?: ClassGuideData[];
  shipsAndSailors?: ShipSailorData[];
  terminologyMap?: TerminologyMappingData[];
  lifeSkills?: LifeSkillData[];
}

/* ------------------------------- 養成與配裝指南 ------------------------------- */

export interface AccessoryPolishData {
  slot: string;
  role: string;
  primary: string;
  secondary: string;
  rolls?: string;
  note: string;
}

export interface BraceletRollData {
  name: string;
  role: '輸出 (DPS)' | '輔助 (Support)' | '通用核心';
  tier: 'S' | 'A';
  effect: string;
  note: string;
}

export interface T4EngravingData {
  name: string;
  nameEn: string;
  role: '輸出 (DPS)' | '輔助 (Support)' | '通用';
  tier: 'S+' | 'S' | 'A';
  baseEffect: string;
  legendaryBonus: string;
  relicBonus: string;
  stoneBonus: string;
  highlight?: boolean;
  note: string;
}

export interface T4GemRow {
  level: number;
  doomfireDmg: string;
  blazingCdr: string;
  baseAtkPower: string;
  supportBonus: string;
  conversionNote: string;
  highlight?: boolean;
}

export interface HoningBreakpointRow {
  targetIlvl: string;
  normalHone: string;
  advancedHone: string;
  unlockedContent: string;
  strategy: string;
  highlight?: boolean;
}

export interface GearSystemData {
  system: string;
  unlock: string;
  goal: string;
  details: string;
  relatedRaid?: string;
}

export interface WanderingMerchantData {
  continent: string;
  merchant: string;
  priority?: '必蹲傳說' | '圖鑑核心' | '區域收集';
  cards: string;
  note: string;
}

export interface SystemsData {
  accessories: AccessoryPolishData[];
  bracelets?: BraceletRollData[];
  engravings?: T4EngravingData[];
  t4Gems?: T4GemRow[];
  honingBreakpoints?: HoningBreakpointRow[];
  gearSystems: GearSystemData[];
  wanderingMerchants: WanderingMerchantData[];
}
