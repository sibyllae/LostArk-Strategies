import { useMemo, useState } from 'react';
import { Alert, Button, Card, Switch, Tag } from 'antd';
import { GoldOutlined, InfoCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import ResponsiveList from '@/components/ui/ResponsiveList';
import SearchInput from '@/components/ui/SearchInput';
import Toolbar from '@/components/ui/Toolbar';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetRaidChestsQuery } from '@/services/gameApi';
import type { RaidInfo } from '@/types/game';
import { cx } from '@/utils/cx';
import { matchesQuery } from '@/utils/text';

export default function RaidChestsPage() {
  const { data, isLoading, isError, refetch } = useGetRaidChestsQuery();
  const [query, setQuery] = useSearchQuery();

  const filteredRaids = useMemo(() => {
    if (!data) return [];
    return data.raids.filter((raid) =>
      matchesQuery(
        query,
        raid.name,
        raid.nameEn,
        raid.ilvl,
        raid.recommendation,
        raid.gates.map((g) => g.chestContents)
      )
    );
  }, [data, query]);

  return (
    <div>
      <PageHeader
        navKey='raidChests'
        stats={[
          { label: '收錄副本', value: data?.raids.length ?? 0 },
          { label: '符合項目', value: filteredRaids.length },
        ]}
      />

      <Toolbar>
        <div className='min-w-[240px] flex-1'>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder='搜尋副本名稱、裝等或建議（如：伐爾坦、1490、突破石）…'
          />
        </div>
      </Toolbar>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {filteredRaids.length === 0 ? (
          <EmptyResult query={query} onReset={() => setQuery('')} />
        ) : (
          <div className='space-y-6'>
            {filteredRaids.map((raid) => (
              <RaidCard key={raid.nameEn} raid={raid} query={query} />
            ))}

            {data?.notes && (
              <Alert
                type='info'
                showIcon
                className='!border-white/10 !bg-zinc-900/60 text-zinc-300'
                title='軍團長副本注意事項'
                description={
                  <ul className='mt-2 list-disc space-y-1 pl-4 text-xs text-zinc-400'>
                    {data.notes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                }
              />
            )}
          </div>
        )}
      </QueryState>
    </div>
  );
}

function RaidCard({ raid, query }: { raid: RaidInfo; query: string }) {
  // 預設全開箱，玩家可自由切換各關卡是否開箱試算實際收益
  const [openChests, setOpenChests] = useState<boolean[]>(() => raid.gates.map(() => true));

  const toggleGate = (index: number, checked: boolean) => {
    setOpenChests((prev) => prev.map((v, i) => (i === index ? checked : v)));
  };

  const setAll = (checked: boolean) => {
    setOpenChests(raid.gates.map(() => checked));
  };

  const selectedChestCost = raid.gates.reduce(
    (sum, g, i) => sum + (openChests[i] ? g.chestCost : 0),
    0
  );
  const netGold = raid.totalGold - selectedChestCost;
  const profitRate = raid.totalGold > 0 ? Math.round((netGold / raid.totalGold) * 100) : 0;
  const openCount = openChests.filter(Boolean).length;

  const gates = raid.gates.map((g, i) => ({
    ...g,
    key: i,
    index: i,
    opened: openChests[i] ?? true,
  }));

  return (
    <Card
      className='rounded-2xl !border-white/10 !bg-zinc-900/60 backdrop-blur-sm'
      title={
        <div className='flex flex-wrap items-center justify-between gap-2 py-1'>
          <div className='flex items-center gap-3'>
            <TrophyOutlined className='text-xl text-amber-400' />
            <span className='text-lg font-bold text-zinc-100'>
              <Highlight text={raid.name} query={query} />
            </span>
            <span className='text-xs font-normal text-zinc-500'>
              <Highlight text={raid.nameEn} query={query} />
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              size='small'
              type={openCount === raid.gates.length ? 'default' : 'text'}
              onClick={() => setAll(true)}
              className='text-xs'
            >
              全開箱
            </Button>
            <Button
              size='small'
              type={openCount === 0 ? 'default' : 'text'}
              onClick={() => setAll(false)}
              className='text-xs'
            >
              全不開
            </Button>
            <Tag color='orange' className='!m-0 font-semibold'>
              裝等 {raid.ilvl}
            </Tag>
          </div>
        </div>
      }
    >
      {/* 動態收益指標 */}
      <div className='mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4'>
        <div className='rounded-xl border border-white/5 bg-zinc-950/60 p-3'>
          <p className='mb-1 text-[11px] text-zinc-500'>通關總金幣</p>
          <p className='flex items-center gap-1.5 font-mono text-lg font-bold text-amber-400'>
            <GoldOutlined /> {raid.totalGold.toLocaleString()} G
          </p>
        </div>
        <div className='rounded-xl border border-white/5 bg-zinc-950/60 p-3'>
          <p className='mb-1 text-[11px] text-zinc-500'>
            開箱成本（{openCount}/{raid.gates.length} 關）
          </p>
          <p className='font-mono text-lg font-bold text-red-400'>
            {selectedChestCost > 0 ? `-${selectedChestCost.toLocaleString()} G` : '0 G'}
          </p>
        </div>
        <div className='rounded-xl border border-white/5 bg-zinc-950/60 p-3'>
          <p className='mb-1 text-[11px] text-zinc-500'>實得淨收入</p>
          <p className='font-mono text-lg font-bold text-emerald-400'>
            +{netGold.toLocaleString()} G
          </p>
        </div>
        <div className='rounded-xl border border-white/5 bg-zinc-950/60 p-3'>
          <p className='mb-1 text-[11px] text-zinc-500'>金幣留存率</p>
          <p className='font-mono text-lg font-bold text-sky-400'>{profitRate}%</p>
        </div>
      </div>

      {/* 關卡明細 */}
      <ResponsiveList
        data={gates}
        columns={[
          { title: '關卡', dataIndex: 'gate', key: 'gate', width: 96 },
          {
            title: '通關金幣',
            dataIndex: 'goldReward',
            key: 'goldReward',
            width: 130,
            render: (v: number) => (
              <span className='font-mono font-bold text-amber-400'>+{v.toLocaleString()} G</span>
            ),
          },
          {
            title: '開箱花費',
            dataIndex: 'chestCost',
            key: 'chestCost',
            width: 130,
            render: (v: number, row) => (
              <span
                className={cx(
                  'font-mono transition-opacity',
                  row.opened ? 'text-red-400' : 'text-zinc-600 line-through'
                )}
              >
                -{v.toLocaleString()} G
              </span>
            ),
          },
          {
            title: '額外寶箱內容',
            dataIndex: 'chestContents',
            key: 'chestContents',
            render: (t: string, row) => (
              <span className={cx('text-xs', row.opened ? 'text-zinc-300' : 'text-zinc-600')}>
                <Highlight text={t} query={query} />
              </span>
            ),
          },
          {
            title: '開箱',
            key: 'opened',
            width: 80,
            align: 'center',
            render: (_, row) => (
              <Switch
                size='small'
                checked={row.opened}
                onChange={(checked) => toggleGate(row.index, checked)}
                aria-label={`${raid.name} ${row.gate} 開箱切換`}
              />
            ),
          },
        ]}
        renderCard={(g) => (
          <div className='rounded-xl border border-white/5 bg-zinc-950/60 p-3 text-xs'>
            <div className='mb-2 flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <Tag color='purple' className='!m-0 font-semibold'>
                  {g.gate}
                </Tag>
                <span className='font-mono font-bold text-amber-400'>+{g.goldReward}G</span>
                <span
                  className={cx(
                    'font-mono font-bold',
                    g.opened ? 'text-red-400' : 'text-zinc-600 line-through'
                  )}
                >
                  -{g.chestCost}G
                </span>
              </div>
              <Switch
                size='small'
                checked={g.opened}
                onChange={(checked) => toggleGate(g.index, checked)}
                aria-label={`${raid.name} ${g.gate} 開箱切換`}
              />
            </div>
            <p className={cx('text-[11px]', g.opened ? 'text-zinc-400' : 'text-zinc-600')}>
              <Highlight text={g.chestContents} query={query} />
            </p>
          </div>
        )}
      />

      <div className='mt-4 flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-300'>
        <InfoCircleOutlined className='shrink-0 text-blue-400' />
        <span>
          建議決策：<Highlight text={raid.recommendation} query={query} />
        </span>
      </div>
    </Card>
  );
}
