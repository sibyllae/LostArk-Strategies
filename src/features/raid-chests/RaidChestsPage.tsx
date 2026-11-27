import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Segmented, Switch } from 'antd';
import { CloseOutlined, PushpinFilled, PushpinOutlined } from '@ant-design/icons';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import ResponsiveList from '@/components/ui/ResponsiveList';
import SearchInput from '@/components/ui/SearchInput';
import Toolbar from '@/components/ui/Toolbar';
import { getRaidKey, useLocalTracker } from '@/hooks/useLocalTracker';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetRaidChestsQuery } from '@/services/gameApi';
import type { RaidDifficulty, RaidInfo } from '@/types/game';
import { cx } from '@/utils/cx';
import { matchesQuery } from '@/utils/text';

type TierFilter = 'ALL' | 'T3' | 'T4';
type DifficultyFilter = 'ALL' | RaidDifficulty;

const PRESET_COMBOS = [
  {
    label: '1680–1700 進階三本',
    keys: ['Brelshaza Act 2|困難', 'Mordum Act 3|困難', 'Armoche Act 4|普通'],
  },
  {
    label: '1710–1730 星圖三本',
    keys: ['Armoche Act 4|困難', 'Kazeros Denouement|困難', 'Shadow Raid: Serca|困難'],
  },
  {
    label: '1750+ 暗影頂裝三本',
    keys: ['Kazeros Denouement|困難', 'Shadow Raid: Serca|惡夢', 'Shadow Raid: Belgardin|普通'],
  },
] as const;

export default function RaidChestsPage() {
  const { data, isLoading, isError, refetch } = useGetRaidChestsQuery();
  const { state, togglePinnedRaid, setPinnedRaids, setRosterChars } = useLocalTracker();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useSearchQuery();

  const tierParam = searchParams.get('tier');
  const diffParam = searchParams.get('diff');
  const tier: TierFilter = tierParam === 'T3' || tierParam === 'T4' ? tierParam : 'ALL';
  const difficulty: DifficultyFilter =
    diffParam === '普通' || diffParam === '困難' || diffParam === '惡夢' ? diffParam : 'ALL';

  const setFilterParam = (key: 'tier' | 'diff', value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === 'ALL') next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true }
    );
  };

  const pinnedRaidObjects = useMemo(() => {
    if (!data) return [];
    return state.pinnedRaids
      .map((key) => data.raids.find((r) => getRaidKey(r.nameEn, r.difficulty) === key))
      .filter((r): r is RaidInfo => Boolean(r));
  }, [data, state.pinnedRaids]);

  const singleCharClearGold = pinnedRaidObjects.reduce((s, r) => s + r.totalGold, 0);
  const singleCharNetGold = pinnedRaidObjects.reduce((s, r) => s + r.netGold, 0);

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
        raid.partySize,
        raid.weakness,
        raid.soloAvailable ? '單人模式 solo' : '',
        raid.boundGoldNote,
        raid.recommendation,
        raid.gates.map((g) => g.chestContents)
      );
      return matchTier && matchDiff && matchText;
    });
  }, [data, query, tier, difficulty]);

  const resetAll = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <div>
      <PageHeader
        navKey='raidChests'
        stats={[
          { label: '收錄副本', value: data?.raids.length ?? 0 },
          { label: '週常排程', value: `${pinnedRaidObjects.length}/3` },
          { label: '顯示結果', value: filteredRaids.length },
        ]}
      />

      {/* 寬鬆版遠征隊每週 3 本金幣排程試算台 */}
      <section aria-label='遠征隊每週三本金幣排程試算台' className='surface mb-8 overflow-hidden'>
        <div className='flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle/60 px-6 py-4'>
          <div>
            <h2 className='text-base font-bold text-ink'>遠征隊每週 3 本金幣排程試算</h2>
            <p className='mt-0.5 text-xs text-muted'>
              點擊下方任一副本「排入週常」即可加入試算（上限 3 本），亦可直接套用快選組合
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-2 text-xs'>
            {PRESET_COMBOS.map((preset) => (
              <button
                key={preset.label}
                type='button'
                onClick={() => setPinnedRaids([...preset.keys])}
                className='focus-ring rounded-lg border border-line bg-surface px-3 py-1.5 font-medium text-sub transition-colors hover:border-brand/50 hover:text-brand'
              >
                {preset.label}
              </button>
            ))}
            {pinnedRaidObjects.length > 0 && (
              <button
                type='button'
                onClick={() => setPinnedRaids([])}
                className='focus-ring rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 font-medium text-rose-700 hover:border-rose-400 dark:border-rose-500/35 dark:bg-rose-500/10 dark:text-rose-200'
              >
                清空
              </button>
            )}
          </div>
        </div>

        <div className='grid gap-6 p-6 lg:grid-cols-12 lg:items-center'>
          <div className='grid gap-3.5 sm:grid-cols-3 lg:col-span-7'>
            {[0, 1, 2].map((slotIdx) => {
              const raid = pinnedRaidObjects[slotIdx];
              return (
                <div
                  key={slotIdx}
                  className={cx(
                    'flex min-h-[88px] flex-col justify-between rounded-xl border p-4',
                    raid
                      ? 'border-brand/40 bg-subtle'
                      : 'border-dashed border-line-strong bg-subtle/40'
                  )}
                >
                  {raid ? (
                    <>
                      <div className='flex items-start justify-between gap-2'>
                        <span className='truncate text-sm font-bold text-ink'>{raid.name}</span>
                        <button
                          type='button'
                          aria-label={`移除 ${raid.name}`}
                          onClick={() => togglePinnedRaid(getRaidKey(raid.nameEn, raid.difficulty))}
                          className='text-muted transition-colors hover:text-rose-500'
                        >
                          <CloseOutlined className='text-xs' />
                        </button>
                      </div>
                      <div className='mt-3 flex items-center justify-between text-xs'>
                        <span className='text-muted'>
                          {raid.difficulty ?? '普通'} · {raid.ilvl}
                        </span>
                        <span className='font-mono font-bold tabular-nums text-brand'>
                          +{raid.totalGold.toLocaleString()} G
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className='my-auto text-center text-xs text-muted'>
                      週常欄位 {slotIdx + 1}（尚未選擇）
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className='flex flex-col justify-between gap-4 border-t border-line pt-5 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0'>
            <div className='flex items-center justify-between text-sm'>
              <span className='font-medium text-sub'>遠征隊同級領金角色數：</span>
              <div className='flex items-center gap-1.5'>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    type='button'
                    onClick={() => setRosterChars(n)}
                    className={cx(
                      'focus-ring size-8 rounded-lg border font-mono text-xs font-bold tabular-nums transition-colors',
                      state.rosterChars === n
                        ? 'border-brand bg-brand/15 text-brand'
                        : 'border-line bg-subtle text-sub hover:text-ink'
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3.5 rounded-xl border border-line bg-subtle p-4'>
              <div>
                <span className='block text-xs text-muted'>
                  不開箱週總金 ({state.rosterChars}角)
                </span>
                <strong className='mt-1 block font-mono text-lg font-bold tabular-nums text-brand'>
                  +{(singleCharClearGold * state.rosterChars).toLocaleString()} G
                </strong>
              </div>
              <div>
                <span className='block text-xs text-muted'>
                  全開箱淨收入 ({state.rosterChars}角)
                </span>
                <strong className='mt-1 block font-mono text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400'>
                  +{(singleCharNetGold * state.rosterChars).toLocaleString()} G
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Toolbar>
        <div className='min-w-[240px] flex-1'>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder='搜尋副本名稱、裝等、弱點屬性或產出材料（如：貝爾加丁、賽爾卡、大聖堂、1750、弱雷）…'
          />
        </div>
        <Segmented
          size='large'
          value={tier}
          onChange={(v) => setFilterParam('tier', String(v))}
          options={[
            { label: '全部世代', value: 'ALL' },
            { label: 'T3 軍團長', value: 'T3' },
            { label: 'T4 卡札羅斯＆暗影', value: 'T4' },
          ]}
        />
        <Segmented
          size='large'
          value={difficulty}
          onChange={(v) => setFilterParam('diff', String(v))}
          options={[
            { label: '全部難度', value: 'ALL' },
            { label: '普通', value: '普通' },
            { label: '困難', value: '困難' },
            { label: '惡夢', value: '惡夢' },
          ]}
        />
      </Toolbar>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {filteredRaids.length === 0 ? (
          <EmptyResult query={query} onReset={resetAll} />
        ) : (
          <div className='space-y-7'>
            {filteredRaids.map((raid) => {
              const raidKey = getRaidKey(raid.nameEn, raid.difficulty);
              return (
                <RaidCard
                  key={raidKey}
                  raid={raid}
                  query={query}
                  pinned={state.pinnedRaids.includes(raidKey)}
                  onTogglePin={() => togglePinnedRaid(raidKey)}
                />
              );
            })}

            {data?.notes && (
              <section className='surface border-l-4 border-l-brand p-6'>
                <h3 className='text-base font-bold text-ink'>襲擊戰與金幣結算規則備忘</h3>
                <ul className='mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-sub'>
                  {data.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </QueryState>
    </div>
  );
}

function RaidCard({
  raid,
  query,
  pinned,
  onTogglePin,
}: {
  raid: RaidInfo;
  query: string;
  pinned: boolean;
  onTogglePin: () => void;
}) {
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

  const diffTone =
    raid.difficulty === '惡夢'
      ? 'tone-purple'
      : raid.difficulty === '困難'
        ? 'tone-rose'
        : 'tone-neutral';

  return (
    <section
      className={cx(
        'surface overflow-hidden',
        pinned ? 'border-brand ring-1 ring-brand/30' : 'hover:border-brand/40'
      )}
    >
      <div className='flex flex-wrap items-center justify-between gap-4 border-b border-line bg-subtle/60 px-6 py-4'>
        <div className='flex flex-wrap items-center gap-2.5'>
          <span className='chip tone-gold font-mono text-xs font-bold tabular-nums'>
            裝等 {raid.ilvl}
          </span>

          <h2 className='text-lg font-bold text-ink'>
            <Highlight text={raid.name} query={query} />
          </h2>

          <span className='font-mono text-xs text-muted'>
            <Highlight text={raid.nameEn} query={query} />
          </span>

          {raid.difficulty && (
            <span className={cx('chip px-2.5 py-0.5 text-xs', diffTone)}>{raid.difficulty}</span>
          )}

          {raid.partySize && <span className='meta-tag'>{raid.partySize}</span>}

          {raid.weakness && (
            <span className='chip tone-sky px-2.5 py-0.5 text-xs'>
              <Highlight text={raid.weakness} query={query} />
            </span>
          )}

          {raid.soloAvailable && (
            <span className='chip tone-emerald px-2.5 py-0.5 text-xs'>支援單人</span>
          )}

          {raid.boundGoldNote && (
            <span className='chip tone-relic px-2.5 py-0.5 text-xs'>{raid.boundGoldNote}</span>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <button
            type='button'
            onClick={onTogglePin}
            aria-pressed={pinned}
            className={cx(
              'focus-ring inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-colors',
              pinned
                ? 'border-brand bg-brand/15 text-brand'
                : 'border-line bg-surface text-sub hover:border-brand/50 hover:text-brand'
            )}
          >
            {pinned ? <PushpinFilled /> : <PushpinOutlined />}
            {pinned ? '已排入週常' : '排入週常'}
          </button>

          <Button
            size='middle'
            type={openCount === raid.gates.length ? 'default' : 'text'}
            onClick={() => setAll(true)}
          >
            全開箱
          </Button>
          <Button
            size='middle'
            type={openCount === 0 ? 'default' : 'text'}
            onClick={() => setAll(false)}
          >
            全不開
          </Button>
        </div>
      </div>

      {/* 四欄寬鬆收益總帳 */}
      <dl className='grid grid-cols-2 divide-x divide-y divide-line border-b border-line bg-subtle/30 lg:grid-cols-4 lg:divide-y-0'>
        <div className='px-6 py-4'>
          <dt className='text-xs font-medium text-muted'>通關總金幣</dt>
          <dd className='mt-1 font-mono text-lg font-bold tabular-nums text-brand'>
            {raid.totalGold.toLocaleString()} G
          </dd>
        </div>
        <div className='px-6 py-4'>
          <dt className='text-xs font-medium text-muted'>
            開箱支出（{openCount}/{raid.gates.length} 關）
          </dt>
          <dd className='mt-1 font-mono text-lg font-bold tabular-nums text-rose-600 dark:text-rose-400'>
            {selectedChestCost > 0 ? `-${selectedChestCost.toLocaleString()} G` : '0 G'}
          </dd>
        </div>
        <div className='px-6 py-4'>
          <dt className='text-xs font-medium text-muted'>實得淨收入</dt>
          <dd className='mt-1 font-mono text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400'>
            +{netGold.toLocaleString()} G
          </dd>
        </div>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between text-xs font-medium text-muted'>
            <dt>金幣留存率</dt>
            <dd className='font-mono text-sm font-bold text-ink'>{profitRate}%</dd>
          </div>
          <div className='mt-3 h-2 w-full overflow-hidden rounded-full bg-elevated'>
            <div
              className='h-full rounded-full bg-emerald-500 transition-all'
              style={{ width: `${Math.max(0, profitRate)}%` }}
            />
          </div>
        </div>
      </dl>

      <div className='p-6'>
        <ResponsiveList
          data={gates}
          columns={[
            {
              title: '關卡',
              dataIndex: 'gate',
              key: 'gate',
              width: 100,
              render: (v: string) => <span className='font-mono font-semibold text-ink'>{v}</span>,
            },
            {
              title: '通關金幣',
              dataIndex: 'goldReward',
              key: 'goldReward',
              width: 140,
              render: (v: number) => (
                <span className='font-mono font-semibold tabular-nums text-brand'>
                  +{v.toLocaleString()} G
                </span>
              ),
            },
            {
              title: '開箱花費',
              dataIndex: 'chestCost',
              key: 'chestCost',
              width: 140,
              render: (v: number, row) => (
                <span
                  className={cx(
                    'font-mono tabular-nums',
                    row.opened ? 'text-rose-600 dark:text-rose-400' : 'text-muted line-through'
                  )}
                >
                  -{v.toLocaleString()} G
                </span>
              ),
            },
            {
              title: '額外寶箱產出內容',
              dataIndex: 'chestContents',
              key: 'chestContents',
              render: (t: string, row) => (
                <span className={cx('text-sm', row.opened ? 'text-sub' : 'text-muted')}>
                  <Highlight text={t} query={query} />
                </span>
              ),
            },
            {
              title: '開箱試算',
              key: 'opened',
              width: 96,
              align: 'center',
              render: (_, row) => (
                <Switch
                  checked={row.opened}
                  onChange={(checked) => toggleGate(row.index, checked)}
                  aria-label={`${raid.name} ${row.gate} 開箱切換`}
                />
              ),
            },
          ]}
          renderCard={(g) => (
            <div className='subsurface space-y-2 p-4'>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-3'>
                  <span className='meta-tag font-mono'>{g.gate}</span>
                  <span className='font-mono text-sm font-bold tabular-nums text-brand'>
                    +{g.goldReward.toLocaleString()}G
                  </span>
                  <span
                    className={cx(
                      'font-mono text-sm tabular-nums',
                      g.opened ? 'text-rose-600 dark:text-rose-400' : 'text-muted line-through'
                    )}
                  >
                    -{g.chestCost.toLocaleString()}G
                  </span>
                </div>
                <Switch
                  checked={g.opened}
                  onChange={(checked) => toggleGate(g.index, checked)}
                  aria-label={`${raid.name} ${g.gate} 開箱切換`}
                />
              </div>
              <p className={cx('text-xs leading-relaxed', g.opened ? 'text-sub' : 'text-muted')}>
                <Highlight text={g.chestContents} query={query} />
              </p>
            </div>
          )}
        />

        <p className='mt-5 rounded-xl border border-line bg-subtle px-4 py-3 text-sm leading-relaxed text-sub'>
          <strong className='mr-2 text-brand'>開箱建議：</strong>
          <Highlight text={raid.recommendation} query={query} />
        </p>
      </div>
    </section>
  );
}
