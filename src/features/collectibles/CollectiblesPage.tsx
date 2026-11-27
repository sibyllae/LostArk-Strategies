import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Segmented } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import ResponsiveList from '@/components/ui/ResponsiveList';
import SearchInput from '@/components/ui/SearchInput';
import SectionHeading from '@/components/ui/SectionHeading';
import Toolbar from '@/components/ui/Toolbar';
import { useLocalTracker } from '@/hooks/useLocalTracker';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetAdventureBooksQuery, useGetCollectiblesQuery } from '@/services/gameApi';
import type { CollectibleReward, CollectibleSource } from '@/types/game';
import { cx } from '@/utils/cx';
import { rewardTone } from '@/utils/reward';
import { matchesQuery } from '@/utils/text';

const COLLECTIBLE_TABS = [
  { key: 'giantHearts', label: '巨人心臟' },
  { key: 'bloodclawCharts', label: '血爪海圖' },
  { key: 'omniumStars', label: '奧菲斯之星' },
  { key: 'islandTokens', label: '島之心' },
  { key: 'masterpieces', label: '偉大的藝術品' },
  { key: 'igneaTokens', label: '伊格涅亞標誌' },
  { key: 'memoryOrbs', label: '記憶八音盒' },
  { key: 'seaBounties', label: '航海冒險物' },
  { key: 'worldTreeMokoko', label: '世界樹 & 摩可可' },
] as const;

type CollectibleTabKey = (typeof COLLECTIBLE_TABS)[number]['key'];
type TrackFilter = 'ALL' | 'TODO' | 'DONE';

const isValidTab = (value: string | null): value is CollectibleTabKey =>
  COLLECTIBLE_TABS.some((tab) => tab.key === value);

const makeItemKey = (tab: string, item: CollectibleSource, index: number) =>
  `${tab}:${item.island ?? item.id ?? index}`;

export default function CollectiblesPage() {
  const { data, isLoading, isError, refetch } = useGetCollectiblesQuery();
  const { data: adventureBooks = [] } = useGetAdventureBooksQuery();
  const { state, toggleCollectible, clearCollectiblePrefix, toggleIgneaRegion } = useLocalTracker();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useSearchQuery();
  const [trackFilter, setTrackFilter] = useState<TrackFilter>('ALL');

  const tabParam = searchParams.get('tab');
  const activeTab: CollectibleTabKey = isValidTab(tabParam) ? tabParam : 'giantHearts';

  const checkedSet = useMemo(() => new Set(state.collectibles), [state.collectibles]);
  const igneaSet = useMemo(() => new Set(state.igneaRegions), [state.igneaRegions]);

  const setActiveTab = (key: CollectibleTabKey) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', key);
        next.delete('q');
        return next;
      },
      { replace: true }
    );
  };

  const categoryStats = useMemo(() => {
    if (!data) return {} as Record<CollectibleTabKey, { done: number; total: number }>;

    const countCategory = (tab: Exclude<CollectibleTabKey, 'igneaTokens' | 'worldTreeMokoko'>) => {
      const items = data[tab].items;
      const done = items.filter((it, idx) => checkedSet.has(makeItemKey(tab, it, idx))).length;
      return { done, total: items.length };
    };

    const wtSources = data.worldTreeMokoko.worldTreeSources ?? [];
    const wtDone = wtSources.filter((it, idx) =>
      checkedSet.has(makeItemKey('worldTreeMokoko', it, idx))
    ).length;

    return {
      giantHearts: countCategory('giantHearts'),
      bloodclawCharts: countCategory('bloodclawCharts'),
      omniumStars: countCategory('omniumStars'),
      islandTokens: countCategory('islandTokens'),
      masterpieces: countCategory('masterpieces'),
      memoryOrbs: countCategory('memoryOrbs'),
      seaBounties: countCategory('seaBounties'),
      igneaTokens: { done: igneaSet.size, total: adventureBooks.length || 20 },
      worldTreeMokoko: { done: wtDone, total: wtSources.length },
    };
  }, [data, checkedSet, igneaSet, adventureBooks.length]);

  const activeStat = categoryStats[activeTab] ?? { done: 0, total: 0 };
  const unlockedMilestoneCount =
    activeTab === 'bloodclawCharts' ? Math.floor(activeStat.done / 5) : activeStat.done;

  const { content, visibleCount } = useMemo(() => {
    if (!data) return { content: null, visibleCount: 0 };

    if (activeTab === 'igneaTokens') {
      const rewards = data.igneaTokens.rewards
        .map((r, i) => ({ ...r, key: i }))
        .filter((r) => matchesQuery(query, r.reward, r.note, String(r.count)));

      const regions = adventureBooks.filter((b) => {
        const done = igneaSet.has(b.region);
        if (trackFilter === 'TODO' && done) return false;
        if (trackFilter === 'DONE' && !done) return false;
        return matchesQuery(query, b.region);
      });

      return {
        visibleCount: rewards.length + regions.length,
        content: (
          <div className='space-y-10'>
            {regions.length > 0 && (
              <div>
                <SectionHeading
                  title='20 大陸伊格涅亞標誌（100% 冒險之書）'
                  count={regions.length}
                  subtitle='勾選狀態與「大陸冒險之書」頁面同步'
                />
                <div className='grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                  {regions.map((b) => {
                    const done = igneaSet.has(b.region);
                    return (
                      <button
                        key={b.id}
                        type='button'
                        onClick={() => toggleIgneaRegion(b.region)}
                        aria-pressed={done}
                        className={cx(
                          'focus-ring flex items-center justify-between gap-2.5 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors',
                          done
                            ? 'border-emerald-500/45 bg-emerald-500/12 text-emerald-800 dark:text-emerald-200'
                            : 'border-line bg-surface text-ink hover:border-brand/50'
                        )}
                      >
                        <span className='truncate'>
                          <Highlight text={b.region} query={query} />
                        </span>
                        <span
                          className={cx(
                            'grid size-5 shrink-0 place-items-center rounded-md border text-[11px]',
                            done
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-line-strong text-transparent'
                          )}
                        >
                          <CheckOutlined />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {rewards.length > 0 ? (
              <RewardSection
                title='伊格涅亞標誌累積獎勵'
                rewards={rewards}
                unlockedCount={igneaSet.size}
                query={query}
              />
            ) : regions.length === 0 ? (
              <EmptyResult query={query} onReset={() => setQuery('')} />
            ) : null}
          </div>
        ),
      };
    }

    if (activeTab === 'worldTreeMokoko') {
      const wtRewards = data.worldTreeMokoko.worldTreeRewards
        .map((r, i) => ({ ...r, key: i }))
        .filter((r) => matchesQuery(query, r.reward, r.note, String(r.count)));

      const wtSources = (data.worldTreeMokoko.worldTreeSources ?? [])
        .map((s, i) => {
          const trackKey = makeItemKey('worldTreeMokoko', s, i);
          return { ...s, key: i, trackKey, done: checkedSet.has(trackKey) };
        })
        .filter((s) => {
          if (trackFilter === 'TODO' && s.done) return false;
          if (trackFilter === 'DONE' && !s.done) return false;
          return matchesQuery(query, s.source, s.note, String(s.id ?? ''));
        });

      const mokokoRewards = data.worldTreeMokoko.mokokoRewards
        .map((r, i) => ({ ...r, key: i }))
        .filter((r) => matchesQuery(query, r.reward, r.note, String(r.count)));

      const total = wtRewards.length + wtSources.length + mokokoRewards.length;
      return {
        visibleCount: total,
        content: (
          <div className='space-y-10'>
            <div className='surface border-l-4 border-l-brand p-5 text-sm leading-relaxed text-sub'>
              <strong className='text-ink'>採集世界樹之葉提醒：</strong>
              {data.worldTreeMokoko.worldTreeNote}
            </div>

            {total === 0 ? (
              <EmptyResult query={query} onReset={() => setQuery('')} />
            ) : (
              <>
                {wtSources.length > 0 && (
                  <SourceSection
                    title='世界樹之葉 6 大取得途徑'
                    items={wtSources}
                    query={query}
                    onToggle={toggleCollectible}
                  />
                )}
                {wtRewards.length > 0 && (
                  <RewardSection
                    title='世界樹之葉 里程碑獎勵 (12～108片)'
                    rewards={wtRewards}
                    unlockedCount={0}
                    query={query}
                  />
                )}
                {mokokoRewards.length > 0 && (
                  <RewardSection
                    title='摩可可種子 里程碑獎勵 (100～1450顆)'
                    rewards={mokokoRewards}
                    unlockedCount={0}
                    query={query}
                  />
                )}
              </>
            )}
          </div>
        ),
      };
    }

    const cat = data[activeTab];
    const filteredRewards = cat.rewards
      .map((r, i) => ({ ...r, key: i }))
      .filter((r) => matchesQuery(query, r.reward, r.note, String(r.count)));

    const filteredItems = cat.items
      .map((it, i) => {
        const trackKey = makeItemKey(activeTab, it, i);
        return { ...it, key: i, trackKey, done: checkedSet.has(trackKey) };
      })
      .filter((it) => {
        if (trackFilter === 'TODO' && it.done) return false;
        if (trackFilter === 'DONE' && !it.done) return false;
        return matchesQuery(query, it.island, it.source, it.note, String(it.id ?? ''));
      });

    const total = filteredRewards.length + filteredItems.length;
    return {
      visibleCount: total,
      content:
        total === 0 ? (
          <EmptyResult
            query={query}
            onReset={() => {
              setQuery('');
              setTrackFilter('ALL');
            }}
          />
        ) : (
          <div className='space-y-10'>
            {filteredRewards.length > 0 && (
              <RewardSection
                title='里程碑累積獎勵'
                rewards={filteredRewards}
                unlockedCount={unlockedMilestoneCount}
                query={query}
              />
            )}
            {filteredItems.length > 0 && (
              <SourceSection
                title='取得途徑與勾選清單'
                items={filteredItems}
                query={query}
                onToggle={toggleCollectible}
              />
            )}
          </div>
        ),
    };
  }, [
    data,
    activeTab,
    query,
    trackFilter,
    checkedSet,
    igneaSet,
    adventureBooks,
    unlockedMilestoneCount,
    setQuery,
    toggleCollectible,
    toggleIgneaRegion,
  ]);

  return (
    <div>
      <PageHeader
        navKey='collectibles'
        stats={[
          { label: '收集分類', value: COLLECTIBLE_TABS.length },
          { label: '本類進度', value: `${activeStat.done}/${activeStat.total}` },
          { label: '顯示條目', value: visibleCount },
        ]}
      />

      {/* 清爽留白膠囊分類列（不擠成九宮格小方塊） */}
      <div
        role='tablist'
        aria-label='收集品分類切換'
        className='mb-7 flex flex-wrap gap-2.5'
      >
        {COLLECTIBLE_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const stat = categoryStats[tab.key];

          return (
            <button
              key={tab.key}
              type='button'
              role='tab'
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={cx(
                'focus-ring inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'border-brand bg-brand/12 font-semibold text-brand shadow-sm'
                  : 'border-line bg-surface text-sub hover:border-brand/45 hover:text-ink'
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cx(
                  'rounded-md px-2 py-0.5 font-mono text-xs tabular-nums',
                  isActive ? 'bg-brand/15 text-brand' : 'bg-subtle text-muted'
                )}
              >
                {stat ? `${stat.done}/${stat.total}` : '—'}
              </span>
            </button>
          );
        })}
      </div>

      <Toolbar>
        <div className='min-w-[240px] flex-1'>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder='搜尋獎勵、島嶼名稱、世界王或前置聲望任務…'
          />
        </div>
        <Segmented
          size='large'
          value={trackFilter}
          onChange={(v) => setTrackFilter(v as TrackFilter)}
          options={[
            { label: '全部項目', value: 'ALL' },
            { label: '待收集', value: 'TODO' },
            { label: '已取得', value: 'DONE' },
          ]}
        />
        {activeTab !== 'igneaTokens' && activeStat.done > 0 && (
          <Button size='large' onClick={() => clearCollectiblePrefix(activeTab)}>
            重置本類紀錄
          </Button>
        )}
      </Toolbar>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {content}
      </QueryState>
    </div>
  );
}

function RewardSection({
  title,
  rewards,
  unlockedCount,
  query,
}: {
  title: string;
  rewards: (CollectibleReward & { key: number })[];
  unlockedCount: number;
  query: string;
}) {
  return (
    <div>
      <SectionHeading title={title} count={rewards.length} />
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {rewards.map((r) => {
          const unlocked = unlockedCount > 0 && unlockedCount >= r.count;
          return (
            <div
              key={r.key}
              className={cx(
                'surface flex items-start justify-between gap-3 p-4',
                unlocked && 'border-emerald-500/45 bg-emerald-500/[0.05]'
              )}
            >
              <div className='min-w-0 flex-1 space-y-2'>
                <div className='flex flex-wrap items-center gap-2.5'>
                  <span className='meta-tag shrink-0 font-mono tabular-nums text-brand'>
                    ×{r.count}
                  </span>
                  <span className={cx('chip', rewardTone(r.reward))}>
                    <Highlight text={r.reward} query={query} />
                  </span>
                </div>
                {r.note && (
                  <p className='text-xs leading-relaxed text-muted'>
                    <Highlight text={r.note} query={query} />
                  </p>
                )}
              </div>

              {unlocked && (
                <span className='chip tone-emerald shrink-0 px-2 py-0.5 text-xs'>已達標</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TrackableSource extends CollectibleSource {
  key: number;
  trackKey: string;
  done: boolean;
}

function SourceSection({
  title,
  items,
  query,
  onToggle,
}: {
  title: string;
  items: TrackableSource[];
  query: string;
  onToggle: (trackKey: string) => void;
}) {
  return (
    <div>
      <SectionHeading
        title={title}
        count={items.length}
        subtitle='點擊右側按鈕即可將進度儲存在瀏覽器'
      />
      <ResponsiveList
        data={items}
        columns={[
          {
            title: '編號 / 島嶼',
            key: 'id',
            width: 170,
            render: (_, r) => (
              <span className='meta-tag font-mono'>
                <Highlight text={r.island ?? (r.id ? `#${r.id}` : '—')} query={query} />
              </span>
            ),
          },
          {
            title: '取得途徑',
            dataIndex: 'source',
            key: 'source',
            render: (src: string, r) => (
              <span className={cx('text-sm', r.done ? 'text-muted line-through' : 'text-ink')}>
                <Highlight text={src} query={query} />
              </span>
            ),
          },
          {
            title: '注意事項',
            dataIndex: 'note',
            key: 'note',
            render: (note: string) =>
              note ? (
                <span className='text-xs leading-relaxed text-sub'>
                  <Highlight text={note} query={query} />
                </span>
              ) : null,
          },
          {
            title: '狀態',
            key: 'done',
            width: 120,
            align: 'center',
            render: (_, r) => (
              <button
                type='button'
                onClick={() => onToggle(r.trackKey)}
                aria-pressed={r.done}
                className={cx(
                  'focus-ring inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                  r.done
                    ? 'border-emerald-500/45 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200'
                    : 'border-line bg-subtle text-sub hover:border-brand/50 hover:text-brand'
                )}
              >
                <CheckOutlined className='text-[11px]' />
                {r.done ? '已取得' : '標記'}
              </button>
            ),
          },
        ]}
        renderCard={(it) => (
          <div
            className={cx(
              'surface space-y-2.5 p-5',
              it.done && 'border-emerald-500/40 opacity-75'
            )}
          >
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0 space-y-2'>
                <span className='meta-tag font-mono'>
                  <Highlight text={it.island ?? (it.id ? `#${it.id}` : '—')} query={query} />
                </span>
                <p
                  className={cx(
                    'text-sm font-medium leading-relaxed',
                    it.done ? 'text-muted line-through' : 'text-ink'
                  )}
                >
                  <Highlight text={it.source} query={query} />
                </p>
              </div>
              <button
                type='button'
                onClick={() => onToggle(it.trackKey)}
                aria-pressed={it.done}
                className={cx(
                  'focus-ring inline-flex shrink-0 items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold',
                  it.done
                    ? 'border-emerald-500/45 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200'
                    : 'border-line bg-subtle text-sub'
                )}
              >
                <CheckOutlined className='text-[11px]' />
                {it.done ? '已取' : '標記'}
              </button>
            </div>
            {it.note && (
              <p className='border-l-2 border-brand/60 pl-3 text-xs leading-relaxed text-sub'>
                <Highlight text={it.note} query={query} />
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
