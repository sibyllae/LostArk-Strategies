import useQuery from '@/component/api/query';

export interface CollectibleReward {
  count: number;
  reward: string;
  note: string;
}

export interface CollectibleItem {
  id?: number;
  island?: string;
  source: string;
  note: string;
  key?: React.Key;
}

export interface CollectibleCategory {
  rewards: CollectibleReward[];
  items?: CollectibleItem[];
  // for worldTree/mokoko special structure
  worldTreeRewards?: CollectibleReward[];
  worldTreeNote?: string;
  mokokoRewards?: CollectibleReward[];
}

export interface CollectiblesData {
  igneaTokens: { rewards: CollectibleReward[] };
  seaBounties: { rewards: CollectibleReward[]; items: CollectibleItem[] };
  worldTreeMokoko: {
    worldTreeRewards: CollectibleReward[];
    worldTreeNote: string;
    mokokoRewards: CollectibleReward[];
  };
  giantHearts: { rewards: CollectibleReward[]; items: CollectibleItem[] };
  masterpieces: { rewards: CollectibleReward[]; items: CollectibleItem[] };
  omniumStars: { rewards: CollectibleReward[]; items: CollectibleItem[] };
  islandTokens: {
    rewards: CollectibleReward[];
    items: { island: string; source: string; note: string; key?: React.Key }[];
  };
}

export const COLLECTIBLE_TABS = [
  { key: 'igneaTokens', label: '伊格涅亞的標誌', icon: '🏅' },
  { key: 'giantHearts', label: '巨人心臟', icon: '❤️' },
  { key: 'masterpieces', label: '偉大的藝術品', icon: '🎨' },
  { key: 'omniumStars', label: '奧菲斯之星', icon: '⭐' },
  { key: 'islandTokens', label: '島之心', icon: '🏝️' },
  { key: 'seaBounties', label: '航海冒險物', icon: '⚓' },
  { key: 'worldTreeMokoko', label: '世界樹&摩可可', icon: '🌳' },
] as const;

const useService = () => {
  const { api, get } = useQuery();

  const getCollectibles = async (): Promise<CollectiblesData> => {
    return get<CollectiblesData>(api.collectibles);
  };

  return { getCollectibles };
};

export default useService;
