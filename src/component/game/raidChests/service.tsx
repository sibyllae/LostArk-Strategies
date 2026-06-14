import useQuery from '@/component/api/query';

export interface RaidGate {
  gate: string;
  goldReward: number;
  chestCost: number;
  chestContents: string;
}

export interface RaidInfo {
  name: string;
  nameEn: string;
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

const useService = () => {
  const { api, get } = useQuery();

  const getRaidChests = async (): Promise<RaidChestsData> => {
    return get<RaidChestsData>(api.raidChests);
  };

  return { getRaidChests };
};

export default useService;
