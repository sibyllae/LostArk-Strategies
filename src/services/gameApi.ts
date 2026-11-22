import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  AdventureBook,
  AdventureBookRaw,
  CollectiblesData,
  Favorability,
  FavorabilityRaw,
  MiscGuideData,
  RaidChestsData,
} from '@/types/game';
import { splitList } from '@/utils/text';

const ADVENTURE_FIELDS = [
  [10, 'tenPercent'],
  [20, 'twentyPercent'],
  [30, 'thirtyPercent'],
  [40, 'fortyPercent'],
  [50, 'fiftyPercent'],
  [60, 'sixtyPercent'],
  [70, 'seventyPercent'],
  [80, 'eightyPercent'],
  [90, 'ninetyPercent'],
] as const satisfies ReadonlyArray<readonly [number, keyof AdventureBookRaw]>;

const toFavorability = (item: FavorabilityRaw, index: number): Favorability => ({
  id: `${index}-${item.npc}`,
  npc: item.npc,
  locations: splitList(item.location, '/'),
  maxAffinity: Number(item.maxAffinity) || 0,
  rewards: {
    normal: splitList(item.normal),
    attention: splitList(item.attention),
    friendly: splitList(item.friendly),
    trust: splitList(item.trust),
    love: splitList(item.love),
  },
});

const toAdventureBook = (item: AdventureBookRaw, index: number): AdventureBook => ({
  id: `${index}-${item.adventureBook}`,
  region: item.adventureBook,
  milestones: ADVENTURE_FIELDS.filter(([, field]) => item[field].trim() !== '').map(
    ([percent, field]) => ({ percent, reward: item[field].trim() })
  ),
});

/**
 * 所有遊戲資料皆為 public/api/v1 下的靜態 JSON。
 * 使用 RTK Query 取得快取、載入/錯誤狀態與重新請求，取代手動 fetch + 全域 loading。
 */
export const gameApi = createApi({
  reducerPath: 'gameApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.BASE_URL}api/v1/` }),
  keepUnusedDataFor: 600,
  endpoints: (build) => ({
    getFavorabilities: build.query<Favorability[], void>({
      query: () => 'favorabilities.json',
      transformResponse: (raw: FavorabilityRaw[]) => raw.map(toFavorability),
    }),
    getAdventureBooks: build.query<AdventureBook[], void>({
      query: () => 'adventureBook.json',
      transformResponse: (raw: AdventureBookRaw[]) => raw.map(toAdventureBook),
    }),
    getCollectibles: build.query<CollectiblesData, void>({
      query: () => 'collectibles.json',
    }),
    getRaidChests: build.query<RaidChestsData, void>({
      query: () => 'raidChests.json',
    }),
    getMiscGuide: build.query<MiscGuideData, void>({
      query: () => 'miscGuide.json',
    }),
  }),
});

export const {
  useGetFavorabilitiesQuery,
  useGetAdventureBooksQuery,
  useGetCollectiblesQuery,
  useGetRaidChestsQuery,
  useGetMiscGuideQuery,
} = gameApi;
