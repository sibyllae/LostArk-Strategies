import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckOutlined } from '@ant-design/icons';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import ResponsiveList from '@/components/ui/ResponsiveList';
import SearchInput from '@/components/ui/SearchInput';
import SectionHeading from '@/components/ui/SectionHeading';
import StatRangeText from '@/components/ui/StatRangeText';
import Toolbar from '@/components/ui/Toolbar';
import VisualTilePicker, {
  type SubGroupShortcut,
  type VisualTileOption,
} from '@/components/ui/VisualTilePicker';
import { useLocalTracker } from '@/hooks/useLocalTracker';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetAdventureBooksQuery, useGetCollectiblesQuery } from '@/services/gameApi';
import type { CollectibleReward, CollectibleSource } from '@/types/game';
import { cx } from '@/utils/cx';
import { rewardTone } from '@/utils/reward';
import { matchesWithAliases } from '@/utils/slug';

type CollectibleTabKey =
  | 'giantHearts'
  | 'bloodclawCharts'
  | 'omniumStars'
  | 'islandTokens'
  | 'masterpieces'
  | 'igneaTokens'
  | 'memoryOrbs'
  | 'seaBounties'
  | 'worldTreeMokoko';

type TrackFilter = 'ALL' | 'TODO' | 'DONE';
type SourceTypeFilter = 'ALL' | 'RAPPORT' | 'TOME' | 'UNA' | 'BOSS' | 'EXCHANGE' | 'QUEST';

const BASE_TABS: ReadonlyArray<Omit<VisualTileOption<CollectibleTabKey>, 'sub'>> = [
  { key: 'giantHearts', label: '巨人心臟', glyph: 'heart', toneClass: 'text-roll', group: '戰鬥點數核心' },
  { key: 'bloodclawCharts', label: '血爪海圖', glyph: 'chart', toneClass: 'text-crimson', group: '戰鬥點數核心' },
  { key: 'omniumStars', label: '奧菲斯之星', glyph: 'star', toneClass: 'text-rare', group: '戰鬥點數核心' },
  { key: 'igneaTokens', label: '伊格涅亞標誌', glyph: 'ignea', toneClass: 'text-magic', group: '戰鬥點數核心' },
  { key: 'islandTokens', label: '島之心', glyph: 'island', toneClass: 'text-setgreen', group: '航海與世界探索' },
  { key: 'masterpieces', label: '偉大的藝術品', glyph: 'art', toneClass: 'text-gold', group: '航海與世界探索' },
  { key: 'seaBounties', label: '航海冒險物', glyph: 'bounty', toneClass: 'text-tealbar', group: '航海與世界探索' },
  { key: 'memoryOrbs', label: '記憶八音盒', glyph: 'orb', toneClass: 'text-purple-400', group: '生活與旋律收集' },
  { key: 'worldTreeMokoko', label: '世界樹 & 種子', glyph: 'leaf', toneClass: 'text-setgreen', group: '生活與旋律收集' },
];

const SUB_GROUPS: ReadonlyArray<SubGroupShortcut<CollectibleTabKey>> = [
  { label: '戰鬥點數核心', targetKey: 'giantHearts', count: 4 },
  { label: '航海與世界探索', targetKey: 'islandTokens', count: 3 },
  { label: '生活與旋律收集', targetKey: 'memoryOrbs', count: 2 },
];

const SOURCE_CHIPS: ReadonlyArray<readonly [SourceTypeFilter, string]> = [
  ['ALL', '全部來源'],
  ['RAPPORT', '好感度'],
  ['TOME', '冒險之書'],
  ['UNA', '每日委託'],
  ['BOSS', '首領／副本'],
  ['EXCHANGE', '商船／硬幣兌換'],
  ['QUEST', '支線／合作活動'],
];

function matchSourceType(src: string, filter: SourceTypeFilter): boolean {
  if (filter === 'ALL') return true;
  if (filter === 'RAPPORT') return /好感度/.test(src);
  if (filter === 'TOME') return /冒險之書|伊格涅亞/.test(src);
  if (filter === 'UNA') return /每日任務|委託|聲望/.test(src);
  if (filter === 'BOSS') return /首領|副本|魔方|塔|混沌/.test(src);
  if (filter === 'EXCHANGE') return /兌換|購買|商船|貿易船|海盜幣|印章/.test(src);
  if (filter === 'QUEST') return /支線|任務|合作|隱藏|互動/.test(src);
  return true;
}

const isValidTab = (value: string | null): value is CollectibleTabKey =>
  BASE_TABS.some((tab) => tab.key === value);

const makeItemKey = (tab: string, item: CollectibleSource, index: number) =>
  `${tab}:${item.island ?? item.id ?? index}`;

/** SKILL.md Section 4G：偵測來源文字中的前置系統，產生一鍵預篩選交叉查詢連結 */
function resolveSourceCrossLink(source: string): { label: string; to: string } | null {
  if (source.includes('好感度')) {
    const npcMatch = source.match(/「([^」\s(]+)/);
    return {
      label: '查好感度',
      to: npcMatch ? `/game/favorability?q=${encodeURIComponent(npcMatch[1])}` : '/game/favorability',
    };
  }
  const tomeMatch = source.match(/冒險之書\s*([^\s0-9%]+)/);
  if (tomeMatch) {
    return {
      label: '查冒險書',
      to: `/game/adventureBook?q=${encodeURIComponent(tomeMatch[1])}`,
    };
  }
  if (source.includes('每日任務') || source.includes('委託')) {
    return { label: '查艾波娜', to: '/game/miscGuide?section=dailyQuests' };
  }
  if (source.includes('商船') || source.includes('貿易船') || source.includes('偵察船')) {
    return { label: '查大航海', to: '/game/miscGuide?section=shipsAndSailors' };
  }
  return null;
}

export default function CollectiblesPage() {
  const { data, isLoading, isError, refetch } = useGetCollectiblesQuery();
  const { data: adventureBooks = [] } = useGetAdventureBooksQuery();
  const { state, toggleCollectible, clearCollectiblePrefix, toggleIgneaRegion } = useLocalTracker();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useSearchQuery();

  const tabParam = searchParams.get('tab');
  const statusParam = searchParams.get('status');
  const srcParam = searchParams.get('src');

  const activeTab: CollectibleTabKey = isValidTab(tabParam) ? tabParam : 'giantHearts';
  const trackFilter: TrackFilter =
    statusParam === 'TODO' || statusParam === 'DONE' ? statusParam : 'ALL';
  const sourceType: SourceTypeFilter = SOURCE_CHIPS.some(([k]) => k === srcParam)
    ? (srcParam as SourceTypeFilter)
    : 'ALL';

  const checkedSet = useMemo(() => new Set(state.collectibles), [state.collectibles]);
  const igneaSet = useMemo(() => new Set(state.igneaRegions), [state.igneaRegions]);

  const setParam = (key: string, value: string, defaultVal = 'ALL') => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === defaultVal) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true }
    );
  };

  const setActiveTab = (key: CollectibleTabKey) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', key);
        next.delete('q');
        next.delete('src');
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

  const visualOptions = useMemo<VisualTileOption<CollectibleTabKey>[]>(
    () =>
      BASE_TABS.map((t) => {
        const st = categoryStats[t.key];
        return {
          ...t,
          sub: st ? `${st.done}/${st.total}` : undefined,
        };
      }),
    [categoryStats]
  );

  const activeStat = categoryStats[activeTab] ?? { done: 0, total: 0 };
  const unlockedMilestoneCount =
    activeTab === 'bloodclawCharts' ? Math.floor(activeStat.done / 5) : activeStat.done;

  const activeFilters = useMemo(() => {
    const tags: string[] = [];
    if (query.trim()) tags.push(`關鍵字: ${query.trim()}`);
    if (trackFilter !== 'ALL') tags.push(trackFilter === 'TODO' ? '待收集' : '已取得');
    if (sourceType !== 'ALL') {
      const found = SOURCE_CHIPS.find(([k]) => k === sourceType);
      if (found) tags.push(`管道: ${found[1]}`);
    }
    return tags;
  }, [query, trackFilter, sourceType]);

  const resetFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams();
        const t = prev.get('tab');
        if (t) next.set('tab', t);
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const { content, visibleCount, totalCount } = useMemo(() => {
    if (!data) return { content: null, visibleCount: 0, totalCount: 0 };

    if (activeTab === 'igneaTokens') {
      const rewards = data.igneaTokens.rewards
        .map((r, i) => ({ ...r, key: i }))
        .filter((r) => matchesWithAliases(query, r.reward, r.note, String(r.count)));

      const regions = adventureBooks.filter((b) => {
        const done = igneaSet.has(b.region);
        if (trackFilter === 'TODO' && done) return false;
        if (trackFilter === 'DONE' && !done) return false;
        return matchesWithAliases(query, b.region);
      });

      return {
        visibleCount: rewards.length + regions.length,
        totalCount: data.igneaTokens.rewards.length + adventureBooks.length,
        content: (
          <div className='space-y-5'>
            {regions.length > 0 && (
              <div>
                <SectionHeading
                  title='20 大陸伊格涅亞標誌勾選板'
                  count={regions.length}
                  subtitle='與大陸冒險之書頁面即時同步'
                />
                <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5'>
                  {regions.map((b) => {
                    const done = igneaSet.has(b.region);
                    return (
                      <button
                        key={b.id}
                        type='button'
                        onClick={() => toggleIgneaRegion(b.region)}
                        aria-pressed={done}
                        className={cx(
                          'focus-ring flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-xs font-semibold transition-colors duration-fast',
                          done
                            ? 'filter-chip-active'
                            : 'border-line bg-surface text-ink hover:bg-hover'
                        )}
                      >
                        <span className='truncate'>
                          <Highlight text={b.region} query={query} />
                        </span>
                        {done && <CheckOutlined className='shrink-0 text-[10px] text-setgreen' />}
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
              <EmptyResult query={query} activeFilters={activeFilters} onReset={resetFilters} />
            ) : null}
          </div>
        ),
      };
    }

    if (activeTab === 'worldTreeMokoko') {
      const wtRewards = data.worldTreeMokoko.worldTreeRewards
        .map((r, i) => ({ ...r, key: i }))
        .filter((r) => matchesWithAliases(query, r.reward, r.note, String(r.count)));

      const wtSources = (data.worldTreeMokoko.worldTreeSources ?? [])
        .map((s, i) => {
          const trackKey = makeItemKey('worldTreeMokoko', s, i);
          return { ...s, key: i, trackKey, done: checkedSet.has(trackKey) };
        })
        .filter((s) => {
          if (trackFilter === 'TODO' && s.done) return false;
          if (trackFilter === 'DONE' && !s.done) return false;
          return matchesWithAliases(query, s.source, s.note, String(s.id ?? ''));
        });

      const mokokoRewards = data.worldTreeMokoko.mokokoRewards
        .map((r, i) => ({ ...r, key: i }))
        .filter((r) => matchesWithAliases(query, r.reward, r.note, String(r.count)));

      const shown = wtRewards.length + wtSources.length + mokokoRewards.length;
      const allCount =
        data.worldTreeMokoko.worldTreeRewards.length +
        (data.worldTreeMokoko.worldTreeSources?.length ?? 0) +
        data.worldTreeMokoko.mokokoRewards.length;

      return {
        visibleCount: shown,
        totalCount: allCount,
        content: (
          <div className='space-y-5'>
            <div className='grid gap-2.5 md:grid-cols-2'>
              <div className='surface section-bar-primary p-3 text-[13px] text-sub'>
                <strong className='font-semibold text-gold'>世界樹之葉 (120片) 提醒：</strong>
                {data.worldTreeMokoko.worldTreeNote}
              </div>
              {data.worldTreeMokoko.mokokoNote && (
                <div className='surface section-bar-category p-3 text-[13px] text-sub'>
                  <strong className='font-semibold text-setgreen'>卡達魯姆摩可可提示：</strong>
                  {data.worldTreeMokoko.mokokoNote}
                </div>
              )}
            </div>

            {shown === 0 ? (
              <EmptyResult query={query} activeFilters={activeFilters} onReset={resetFilters} />
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
                    title='世界樹之葉 里程碑獎勵 (12～120片)'
                    rewards={wtRewards}
                    unlockedCount={0}
                    query={query}
                  />
                )}
                {mokokoRewards.length > 0 && (
                  <RewardSection
                    title='摩可可種子 里程碑獎勵 (100～1450+顆)'
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
    const filteredRewards =
      sourceType === 'ALL' && trackFilter === 'ALL'
        ? cat.rewards
            .map((r, i) => ({ ...r, key: i }))
            .filter((r) => matchesWithAliases(query, r.reward, r.note, String(r.count)))
        : [];

    const filteredItems = cat.items
      .map((it, i) => {
        const trackKey = makeItemKey(activeTab, it, i);
        return { ...it, key: i, trackKey, done: checkedSet.has(trackKey) };
      })
      .filter((it) => {
        if (trackFilter === 'TODO' && it.done) return false;
        if (trackFilter === 'DONE' && !it.done) return false;
        if (!matchSourceType(it.source, sourceType)) return false;
        return matchesWithAliases(query, it.island, it.source, it.note, String(it.id ?? ''));
      });

    const shown = filteredRewards.length + filteredItems.length;
    return {
      visibleCount: filteredItems.length,
      totalCount: cat.items.length,
      content:
        shown === 0 ? (
          <EmptyResult query={query} activeFilters={activeFilters} onReset={resetFilters} />
        ) : (
          <div className='space-y-5'>
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
                title='取得途徑與本機勾選清單'
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
    sourceType,
    checkedSet,
    igneaSet,
    adventureBooks,
    unlockedMilestoneCount,
    activeFilters,
    resetFilters,
    toggleCollectible,
    toggleIgneaRegion,
  ]);

  return (
    <div>
      <PageHeader
        navKey='collectibles'
        stats={[
          { label: '收集分類', value: BASE_TABS.length },
          { label: '本類進度', value: `${activeStat.done}/${activeStat.total}` },
          { label: '顯示項目', value: visibleCount },
        ]}
      />

      {/* SKILL.md Section 4C：視覺化子分類圖示磚 + 子群組快速切換列 */}
      <VisualTilePicker
        options={visualOptions}
        value={activeTab}
        onChange={setActiveTab}
        ariaLabel='收集品子分類選擇'
        subGroups={SUB_GROUPS}
      />

      <Toolbar
        shownCount={visibleCount}
        totalCount={totalCount}
        activeFilters={activeFilters}
        onReset={resetFilters}
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder='搜尋獎勵名稱、島嶼、世界王、商船或前置任務…'
        />

        <div className='flex flex-wrap items-center justify-between gap-2 text-xs'>
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='font-semibold text-muted'>進度狀態：</span>
            {(
              [
                ['ALL', '全部項目'],
                ['TODO', '待收集'],
                ['DONE', '已取得'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type='button'
                onClick={() => setParam('status', val)}
                className={cx('filter-chip focus-ring', trackFilter === val && 'filter-chip-active')}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab !== 'igneaTokens' && activeStat.done > 0 && (
            <button
              type='button'
              onClick={() => clearCollectiblePrefix(activeTab)}
              className='focus-ring rounded-sm border border-danger/45 bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger'
            >
              清空本類已取紀錄
            </button>
          )}
        </div>

        {activeTab !== 'igneaTokens' && activeTab !== 'worldTreeMokoko' && (
          <div className='flex flex-wrap items-center gap-1.5 text-xs'>
            <span className='font-semibold text-muted'>取得管道：</span>
            {SOURCE_CHIPS.map(([val, label]) => (
              <button
                key={val}
                type='button'
                onClick={() => setParam('src', val)}
                className={cx('filter-chip focus-ring', sourceType === val && 'filter-chip-active')}
              >
                {label}
              </button>
            ))}
          </div>
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
      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
        {rewards.map((r) => {
          const unlocked = unlockedCount > 0 && unlockedCount >= r.count;
          return (
            <div
              key={r.key}
              className={cx(
                'surface flex items-start justify-between gap-2.5 p-2.5',
                unlocked && 'border-setgreen/55'
              )}
            >
              <div className='min-w-0 flex-1 space-y-1'>
                <div className='flex flex-wrap items-center gap-1.5'>
                  <span className='meta-tag shrink-0 font-semibold text-roll'>×{r.count}</span>
                  <span className={cx('chip', rewardTone(r.reward))}>
                    <StatRangeText text={r.reward} query={query} />
                  </span>
                </div>
                {r.note && (
                  <p className='text-xs text-sub'>
                    <StatRangeText text={r.note} query={query} />
                  </p>
                )}
              </div>

              {unlocked && (
                <span className='chip tone-emerald shrink-0 text-[11px]'>已達標</span>
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
      <SectionHeading title={title} count={items.length} subtitle='點擊右側按鈕儲存本機收集狀態' />
      <ResponsiveList
        data={items}
        columns={[
          {
            title: '編號 / 島嶼',
            key: 'id',
            width: 165,
            render: (_, r) => (
              <span className='meta-tag text-gold'>
                <Highlight text={r.island ?? (r.id ? `#${r.id}` : '—')} query={query} />
              </span>
            ),
          },
          {
            title: '取得途徑',
            dataIndex: 'source',
            key: 'source',
            render: (src: string, r) => {
              const cross = resolveSourceCrossLink(src);
              return (
                <div className='flex flex-wrap items-center gap-2'>
                  <span className={cx(r.done ? 'text-muted line-through' : 'text-ink')}>
                    <StatRangeText text={src} query={query} />
                  </span>
                  {cross && (
                    <Link
                      to={cross.to}
                      className='focus-ring rounded-sm border border-line bg-well px-1.5 py-0.5 text-[11px] font-medium text-magic hover:border-active'
                    >
                      {cross.label} →
                    </Link>
                  )}
                </div>
              );
            },
          },
          {
            title: '注意事項',
            dataIndex: 'note',
            key: 'note',
            render: (note: string) =>
              note ? (
                <span className='text-xs text-sub'>
                  <StatRangeText text={note} query={query} />
                </span>
              ) : null,
          },
          {
            title: '收集',
            key: 'done',
            width: 98,
            align: 'center',
            render: (_, r) => (
              <button
                type='button'
                onClick={() => onToggle(r.trackKey)}
                aria-pressed={r.done}
                className={cx(
                  'filter-chip focus-ring py-1 text-xs',
                  r.done && 'filter-chip-active'
                )}
              >
                <CheckOutlined className='text-[10px]' />
                <span>{r.done ? '已取' : '標記'}</span>
              </button>
            ),
          },
        ]}
        renderCard={(it) => {
          const cross = resolveSourceCrossLink(it.source);
          return (
            <div className={cx('surface space-y-2 p-3', it.done && 'opacity-70')}>
              <div className='flex items-start justify-between gap-2'>
                <div className='min-w-0 space-y-1'>
                  <span className='meta-tag text-gold'>
                    <Highlight text={it.island ?? (it.id ? `#${it.id}` : '—')} query={query} />
                  </span>
                  <p className={cx('text-[13.5px]', it.done ? 'text-muted line-through' : 'text-ink')}>
                    <StatRangeText text={it.source} query={query} />
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => onToggle(it.trackKey)}
                  aria-pressed={it.done}
                  className={cx(
                    'filter-chip focus-ring shrink-0 py-1 text-xs',
                    it.done && 'filter-chip-active'
                  )}
                >
                  <CheckOutlined className='text-[10px]' />
                  <span>{it.done ? '已取' : '標記'}</span>
                </button>
              </div>

              {(it.note || cross) && (
                <div className='flex flex-wrap items-center justify-between gap-2 border-t border-line pt-1.5 text-xs'>
                  {it.note && (
                    <span className='text-sub'>
                      <StatRangeText text={it.note} query={query} />
                    </span>
                  )}
                  {cross && (
                    <Link to={cross.to} className='font-medium text-magic hover:underline'>
                      {cross.label} →
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
