import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import useService, { CollectiblesData, COLLECTIBLE_TABS } from './service';
import {
  RewardTable,
  ItemTable,
  IslandTokenTable,
} from './common/CollectibleTable';
import { RewardCards, ItemCards } from './common/CollectibleCards';

const Collectibles = () => {
  const { getCollectibles } = useService();
  const [data, setData] = useState<CollectiblesData | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const res = await getCollectibles();
    setData(res);
  };

  const renderTabContent = (tabKey: string) => {
    if (!data) return null;

    switch (tabKey) {
      case 'igneaTokens':
        return (
          <>
            <div className='hidden xl:block'>
              <RewardTable
                rewards={data.igneaTokens.rewards}
                title='累計獎勵列表'
              />
            </div>
            <RewardCards
              rewards={data.igneaTokens.rewards}
              title='累計獎勵列表'
            />
          </>
        );

      case 'giantHearts':
        return (
          <>
            <div className='hidden xl:block'>
              <RewardTable
                rewards={data.giantHearts.rewards}
                title='重要獎勵列表'
              />
              <ItemTable
                items={data.giantHearts.items}
                title='取得方式'
                idLabel='#'
              />
            </div>
            <RewardCards
              rewards={data.giantHearts.rewards}
              title='重要獎勵列表'
            />
            <ItemCards items={data.giantHearts.items} title='取得方式' />
          </>
        );

      case 'masterpieces':
        return (
          <>
            <div className='hidden xl:block'>
              <RewardTable
                rewards={data.masterpieces.rewards}
                title='重要獎勵列表'
              />
              <ItemTable
                items={data.masterpieces.items}
                title='取得方式'
                idLabel='#'
              />
            </div>
            <RewardCards
              rewards={data.masterpieces.rewards}
              title='重要獎勵列表'
            />
            <ItemCards items={data.masterpieces.items} title='取得方式' />
          </>
        );

      case 'omniumStars':
        return (
          <>
            <div className='hidden xl:block'>
              <RewardTable
                rewards={data.omniumStars.rewards}
                title='重要獎勵列表'
              />
              <ItemTable
                items={data.omniumStars.items}
                title='取得方式'
                idLabel='#'
              />
            </div>
            <RewardCards
              rewards={data.omniumStars.rewards}
              title='重要獎勵列表'
            />
            <ItemCards items={data.omniumStars.items} title='取得方式' />
          </>
        );

      case 'islandTokens':
        return (
          <>
            <div className='hidden xl:block'>
              <RewardTable
                rewards={data.islandTokens.rewards}
                title='重要獎勵列表'
              />
              <IslandTokenTable
                items={data.islandTokens.items}
                title='島之心取得方式'
              />
            </div>
            <RewardCards
              rewards={data.islandTokens.rewards}
              title='重要獎勵列表'
            />
            <ItemCards
              items={data.islandTokens.items.map((item) => ({
                ...item,
                id: undefined,
              }))}
              title='島之心取得方式'
            />
          </>
        );

      case 'seaBounties':
        return (
          <>
            <div className='hidden xl:block'>
              <RewardTable
                rewards={data.seaBounties.rewards}
                title='重要獎勵列表'
              />
              <ItemTable
                items={data.seaBounties.items}
                title='取得方式'
                idLabel='#'
              />
            </div>
            <RewardCards
              rewards={data.seaBounties.rewards}
              title='重要獎勵列表'
            />
            <ItemCards items={data.seaBounties.items} title='取得方式' />
          </>
        );

      case 'worldTreeMokoko':
        return (
          <>
            <div className='hidden xl:block'>
              <RewardTable
                rewards={data.worldTreeMokoko.worldTreeRewards}
                title='世界樹之葉重要獎勵'
              />
              <div className='mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm'>
                ⚠ {data.worldTreeMokoko.worldTreeNote}
              </div>
              <RewardTable
                rewards={data.worldTreeMokoko.mokokoRewards}
                title='摩可可種子重要獎勵'
              />
            </div>
            <RewardCards
              rewards={data.worldTreeMokoko.worldTreeRewards}
              title='世界樹之葉重要獎勵'
            />
            <div className='mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm xl:hidden'>
              ⚠ {data.worldTreeMokoko?.worldTreeNote}
            </div>
            <RewardCards
              rewards={data.worldTreeMokoko.mokokoRewards}
              title='摩可可種子重要獎勵'
            />
          </>
        );

      default:
        return null;
    }
  };

  const tabItems = COLLECTIBLE_TABS.map((tab) => ({
    key: tab.key,
    label: (
      <span className='flex items-center gap-1.5'>
        <span>{tab.icon}</span>
        <span>{tab.label}</span>
      </span>
    ),
    children: renderTabContent(tab.key),
  }));

  return (
    <div className='w-full'>
      <div className='flex flex-wrap'>
        <div className='flex-none w-1/2'>
          <div className='font-bold m-4 text-xl border-l-4 border-emerald-500'>
            <span className='px-2'>收集品追蹤</span>
          </div>
        </div>
      </div>
      <div className='px-4'>
        <Tabs
          defaultActiveKey='igneaTokens'
          items={tabItems}
          type='card'
          size='small'
          className='collectible-tabs'
        />
      </div>
    </div>
  );
};

export default Collectibles;
