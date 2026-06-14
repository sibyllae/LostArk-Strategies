import useQuery from '@/component/api/query';

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

export interface MiscGuideData {
  songs: SongData[];
  skillPoints: SkillPointData[];
  runes: RuneData[];
  cardSets: CardSetData[];
  dailyLimits: DailyLimitData[];
  dailyQuests: DailyQuestData[];
}

const useService = () => {
  const { api, get } = useQuery();

  const getMiscGuide = async (): Promise<MiscGuideData> => {
    return get<MiscGuideData>(api.miscGuide);
  };

  return { getMiscGuide };
};

export default useService;
