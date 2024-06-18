import useQuery from '@/component/api/query';

export interface AdventureBookIn {
  adventureBook: string;
  eightyPercent: string;
  fiftyPercent: string;
  fortyPercent: string;
  ninetyPercent: string;
  seventyPercent: string;
  sixtyPercent: string;
  tenPercent: string;
  thirtyPercent: string;
  twentyPercent: string;
  key?: React.Key;
}

export interface AdventureBookCompIn {
  adventureBookData: AdventureBookIn[];
}

const useService = () => {
  const { api, get } = useQuery();

  const getAdventureBook = async (): Promise<AdventureBookIn[]> => {
    let res = await get<AdventureBookIn[]>(api.adventureBook);
    return res.map((e) => {
      // set uuid
      e.key = window.crypto.randomUUID();
      return e;
    });
  };

  return { getAdventureBook };
};

export default useService;
