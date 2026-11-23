import { useMemo, useState } from 'react';
import { Alert, Button, Segmented, Switch } from 'antd';
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

type TierFilter = 'ALL' | 'T3' | 'T4';
type DifficultyFilter = 'ALL' | '普通' | '困難';

export default function RaidChestsPage() {
  const { data, isLoading, isError, refetch } = useGetRaidChestsQuery();
  const [query, setQuery] = useSearchQuery();
  const [tier, setTier] = useState<TierFilter>('ALL');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('ALL');

  const filteredRaids = useMemo(() => {
    if (!data) return [];
    return data.raids.filter((raid) => {
      const matchTier = tier === 'ALL' || raid.tier === tier;
      const matchDiff = difficulty === 'ALL' || (raid.difficulty ?? '普通') === difficulty;
      const matchText = matchesQuery(
        query,
        raid.name,
        raid.nameEn,
        raid.ilvl,
        raid.tier,
        raid.difficulty,
        raid.recommendation,
        raid.gates.map((g) => g.chestContents)
      );
      return matchTier && matchDiff && matchText;
    });
  }, [data, query, tier, difficulty]);

  const resetAll = () => {
    setQuery('');
    setTier('ALL');
    setDifficulty('ALL');
  };

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
            placeholder='搜尋副本名稱、裝等或建議（如：艾吉爾、卡蒙、1680）…'
          />
        </div>
        <Segmented
          size='middle'
          value={tier}
          onChange={(v) => setTier(v as TierFilter)}
          options={[
            { label: '全部階段', value: 'ALL' },
            { label: 'T3', value: 'T3' },
            { label: 'T4', value: 'T4' },
          ]}
        />
        <Segmented
          size='middle'
          value={difficulty}
          onChange={(v) => setDifficulty(v as DifficultyFilter)}
          options={[
            { label: '全部難度', value: 'ALL' },
            { label: '普通', value: '普通' },
            { label: '困難', value: '困難' },
          ]}
        />
      </Toolbar>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {filteredRaids.length === 0 ? (
          <EmptyResult query={query} onReset={resetAll} />
        ) : (
          <div className='space-y-5'>
            {filteredRaids.map((raid) => (
              <RaidCard key={`${raid.nameEn}-${raid.difficulty ?? '普通'}`} raid={raid} query={query} />
            ))}

            {data?.notes && (
              <Alert
                type='info'
                showIcon
                className='!border-obsidian-700 !bg-obsidian-900 text-stone-300'
                title='軍團長與襲擊戰注意事項'
                description={
                  <ul className='mt-2 list-disc space-y-1 pl-4 text-xs text-stone-400'>
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
    <section className='surface overflow-hidden'>
      {/* 標題列 */}
      <div className='flex flex-wrap items-center justify-between gap-2 border-b border-obsidian-700/80 bg-obsidian-850/80 px-4 py-3'>
        <div className='flex flex-wrap items-center gap-2'>
          <h2 className='text-base font-bold text-stone-100'>
            <Highlight text={raid.name} query={query} />
          </h2>
          <span className='font-mono text-xs text-stone-500'>
            <Highlight text={raid.nameEn} query={query} />
          </span>
          {raid.tier && (
            <span
              className={cx(
                'rounded border px-1.5 py-0 text-[11px] font-mono font-medium',
                raid.tier === 'T4'
                  ? 'border-gold-500/40 bg-gold-500/15 text-gold-300'
                  : 'border-obsidian-700 bg-obsidian-950 text-stone-400'
              )}
            >
              {raid.tier}
            </span>
          )}
          {raid.difficulty && (
            <span
              className={cx(
                'rounded border px-1.5 py-0 text-[11px] font-medium',
                raid.difficulty === '困難'
                  ? 'border-red-500/35 bg-red-500/10 text-red-300'
                  : 'border-obsidian-700 bg-obsidian-950 text-stone-400'
              )}
            >
              {raid.difficulty}
            </span>
          )}
          <span className='meta-tag font-mono text-[11px] tabular-nums'>
            裝等 {raid.ilvl}
          </span>
        </div>

        <div className='flex items-center gap-1.5'>
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
        </div>
      </div>

      {/* 橫向帳本式收益摘要 */}
      <dl className='grid grid-cols-2 divide-x divide-y divide-obsidian-700/70 border-b border-obsidian-700/70 bg-obsidian-950/50 lg:grid-cols-4 lg:divide-y-0'>
        <div className='px-4 py-2.5'>
          <dt className='text-[11px] text-stone-500'>通關總金幣</dt>
          <dd className='mt-0.5 font-mono text-base font-semibold tabular-nums text-gold-300'>
            {raid.totalGold.toLocaleString()} G
          </dd>
        </div>
        <div className='px-4 py-2.5'>
          <dt className='text-[11px] text-stone-500'>
            開箱花費（{openCount}/{raid.gates.length} 關）
          </dt>
          <dd className='mt-0.5 font-mono text-base font-semibold tabular-nums text-red-400'>
            {selectedChestCost > 0 ? `-${selectedChestCost.toLocaleString()} G` : '0 G'}
          </dd>
        </div>
        <div className='px-4 py-2.5'>
          <dt className='text-[11px] text-stone-500'>實得淨收入</dt>
          <dd className='mt-0.5 font-mono text-base font-semibold tabular-nums text-emerald-400'>
            +{netGold.toLocaleString()} G
          </dd>
        </div>
        <div className='px-4 py-2.5'>
          <dt className='text-[11px] text-stone-500'>金幣留存率</dt>
          <dd className='mt-0.5 font-mono text-base font-semibold tabular-nums text-stone-200'>
            {profitRate}%
          </dd>
        </div>
      </dl>

      {/* 關卡明細 */}
      <div className='p-4'>
        <ResponsiveList
          data={gates}
          columns={[
            {
              title: '關卡',
              dataIndex: 'gate',
              key: 'gate',
              width: 88,
              render: (v: string) => <span className='font-mono font-medium text-stone-200'>{v}</span>,
            },
            {
              title: '通關金幣',
              dataIndex: 'goldReward',
              key: 'goldReward',
              width: 120,
              render: (v: number) => (
                <span className='font-mono font-medium tabular-nums text-gold-300'>
                  +{v.toLocaleString()} G
                </span>
              ),
            },
            {
              title: '開箱花費',
              dataIndex: 'chestCost',
              key: 'chestCost',
              width: 120,
              render: (v: number, row) => (
                <span
                  className={cx(
                    'font-mono tabular-nums transition-opacity',
                    row.opened ? 'text-red-400' : 'text-stone-600 line-through'
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
                <span className={cx('text-xs', row.opened ? 'text-stone-300' : 'text-stone-600')}>
                  <Highlight text={t} query={query} />
                </span>
              ),
            },
            {
              title: '開箱',
              key: 'opened',
              width: 72,
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
            <div className='subsurface p-3 text-xs'>
              <div className='mb-1.5 flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2.5'>
                  <span className='meta-tag font-mono'>{g.gate}</span>
                  <span className='font-mono font-medium tabular-nums text-gold-300'>
                    +{g.goldReward}G
                  </span>
                  <span
                    className={cx(
                      'font-mono tabular-nums',
                      g.opened ? 'text-red-400' : 'text-stone-600 line-through'
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
              <p className={cx('text-[11px]', g.opened ? 'text-stone-400' : 'text-stone-600')}>
                <Highlight text={g.chestContents} query={query} />
              </p>
            </div>
          )}
        />

        <p className='mt-3 border-l-2 border-gold-500/60 bg-obsidian-950/60 px-3 py-2 text-xs text-stone-300'>
          <span className='mr-1.5 font-semibold text-gold-400'>開箱建議</span>
          <Highlight text={raid.recommendation} query={query} />
        </p>
      </div>
    </section>
  );
}
