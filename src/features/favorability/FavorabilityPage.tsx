import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckOutlined } from '@ant-design/icons';
import AnchorJumpCloud from '@/components/ui/AnchorJumpCloud';
import DataCard3Zone from '@/components/ui/DataCard3Zone';
import EmptyResult from '@/components/ui/EmptyResult';
import GlyphIcon from '@/components/ui/GlyphIcon';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import SearchInput from '@/components/ui/SearchInput';
import StatRangeText from '@/components/ui/StatRangeText';
import Toolbar, { type ConstraintMode } from '@/components/ui/Toolbar';
import { useLocalTracker } from '@/hooks/useLocalTracker';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetFavorabilitiesQuery } from '@/services/gameApi';
import type { FavorTier, Favorability } from '@/types/game';
import { cx } from '@/utils/cx';
import { rewardTone } from '@/utils/reward';
import { matchesWithAliases, toAnchorId } from '@/utils/slug';

const TIER_LABELS: Record<FavorTier, string> = {
  normal: '普通',
  attention: '關注',
  friendly: '友好',
  trust: '信賴',
  love: '愛情',
};

const QUICK_REWARDS = [
  '巨人心臟',
  '奧菲斯之星',
  '島之心',
  '血爪海圖',
  '藝術品',
  '卡片',
  '藥水',
  '金',
] as const;

type AffinityBracket = 'ALL' | '20000' | '38000' | '58000' | '78000' | '105000';
type SortOrder = 'default' | 'affinityAsc' | 'affinityDesc';
type CompletionFilter = 'ALL' | 'TODO' | 'DONE';

const AFFINITY_BRACKETS: ReadonlyArray<readonly [AffinityBracket, string, number, number]> = [
  ['ALL', '不限點數', 0, 999999],
  ['20000', '≤18k 極速', 1, 20000],
  ['38000', '38k 標準', 20001, 38000],
  ['58000', '58k 中階', 38001, 58000],
  ['78000', '78k 大陸核心', 58001, 78000],
  ['105000', '100k+ 愛情/頂級', 78001, 200000],
];

/** SKILL.md Section 4G：依獎勵語意回傳對應收集品或卡組交叉查詢連結 */
function getCollectibleCrossLink(reward: string): string | null {
  if (reward.includes('巨人心臟')) return '/game/collectibles?tab=giantHearts';
  if (reward.includes('奧菲斯之星')) return '/game/collectibles?tab=omniumStars';
  if (reward.includes('島之心')) return '/game/collectibles?tab=islandTokens';
  if (reward.includes('血爪海圖')) return '/game/collectibles?tab=bloodclawCharts';
  if (reward.includes('藝術品')) return '/game/collectibles?tab=masterpieces';
  if (reward.includes('秘密地圖')) return '/game/collectibles?tab=seaBounties';
  if (reward.includes('符文')) return '/game/miscGuide?section=runes';
  if (reward.includes('卡片')) return '/game/miscGuide?section=cardSets';
  return null;
}

export default function FavorabilityPage() {
  const { data = [], isLoading, isError, refetch } = useGetFavorabilitiesQuery();
  const { state, toggleNpc } = useLocalTracker();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useSearchQuery();

  const locParam = searchParams.get('loc') ?? 'all';
  const sortParam = searchParams.get('sort');
  const statusParam = searchParams.get('status');
  const affParam = searchParams.get('aff');
  const modeParam = searchParams.get('mode');

  const sortOrder: SortOrder =
    sortParam === 'affinityAsc' || sortParam === 'affinityDesc' ? sortParam : 'default';
  const completion: CompletionFilter =
    statusParam === 'TODO' || statusParam === 'DONE' ? statusParam : 'ALL';
  const affFilter: AffinityBracket = AFFINITY_BRACKETS.some(([k]) => k === affParam)
    ? (affParam as AffinityBracket)
    : 'ALL';
  const constraintMode: ConstraintMode = modeParam === 'exact' ? 'exact' : 'ceiling';

  const setParam = (key: string, value: string, defaultVal: string) => {
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

  const completedSet = useMemo(() => new Set(state.npcs), [state.npcs]);

  const topContinents = useMemo(() => {
    const counts = new Map<string, number>();
    data.forEach((item) => {
      const region = item.locations.at(-1) ?? item.locations[0];
      if (region) counts.set(region, (counts.get(region) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([loc]) => loc);
  }, [data]);

  const filtered = useMemo(() => {
    const bracket = AFFINITY_BRACKETS.find(([k]) => k === affFilter);

    const list = data.filter((item) => {
      const isDone = completedSet.has(item.id);
      if (completion === 'TODO' && isDone) return false;
      if (completion === 'DONE' && !isDone) return false;

      const matchLoc = locParam === 'all' || item.locations.includes(locParam);

      let matchAff = true;
      if (bracket && affFilter !== 'ALL') {
        const [, , minPt, maxPt] = bracket;
        matchAff =
          constraintMode === 'ceiling'
            ? item.maxAffinity > 0 && item.maxAffinity <= maxPt
            : item.maxAffinity >= minPt && item.maxAffinity <= maxPt;
      }

      const allRewards = Object.values(item.rewards).flat();
      return (
        matchLoc &&
        matchAff &&
        matchesWithAliases(query, item.npc, item.locations, item.virtueReq, allRewards)
      );
    });

    if (sortOrder === 'affinityAsc') {
      return [...list].sort((a, b) => a.maxAffinity - b.maxAffinity);
    }
    if (sortOrder === 'affinityDesc') {
      return [...list].sort((a, b) => b.maxAffinity - a.maxAffinity);
    }
    return list;
  }, [data, query, locParam, sortOrder, completion, affFilter, constraintMode, completedSet]);

  const activeFilters = useMemo(() => {
    const tags: string[] = [];
    if (query.trim()) tags.push(`關鍵字: ${query.trim()}`);
    if (locParam !== 'all') tags.push(`地區: ${locParam}`);
    if (affFilter !== 'ALL') {
      const b = AFFINITY_BRACKETS.find(([k]) => k === affFilter);
      tags.push(
        constraintMode === 'ceiling' ? `需求 ≤ ${Number(affFilter) / 1000}k pt` : `區間: ${b?.[1]}`
      );
    }
    if (completion !== 'ALL') tags.push(completion === 'TODO' ? '待攻略' : '已完成');
    if (sortOrder !== 'default') {
      tags.push(sortOrder === 'affinityAsc' ? '排序: 低→高' : '排序: 高→低');
    }
    return tags;
  }, [query, locParam, affFilter, constraintMode, completion, sortOrder]);

  const anchorItems = useMemo(
    () =>
      filtered.map((item) => ({
        id: toAnchorId('npc', item.id),
        label: item.npc,
        sub: item.maxAffinity ? `${Math.round(item.maxAffinity / 1000)}k` : undefined,
      })),
    [filtered]
  );

  const resetAll = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <div>
      <PageHeader
        navKey='favorability'
        stats={[
          { label: '收錄 NPC', value: data.length },
          { label: '已完成', value: `${completedSet.size}/${data.length}` },
          { label: '顯示筆數', value: filtered.length },
        ]}
      />

      {/* SKILL.md Section 4E & Section 8：桌面端直接攤開高頻切換晶片，不藏在下拉選單內 */}
      <Toolbar
        shownCount={filtered.length}
        totalCount={data.length}
        activeFilters={activeFilters}
        onReset={resetAll}
        constraintMode={{
          mode: constraintMode,
          onChange: (m) => setParam('mode', m, 'ceiling'),
          ceilingLabel: '≤ 點數預算上限內',
          exactLabel: '= 該量級區間',
        }}
      >
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <div className='flex-1'>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder='搜尋 NPC 名稱、地區、四維門檻或獎勵（如：巴亨圖爾、妮娜芙、金、血爪海圖）…'
            />
          </div>

          <div className='flex flex-wrap items-center gap-1 text-xs'>
            {(
              [
                ['default', '預設排序'],
                ['affinityAsc', '點數 低→高'],
                ['affinityDesc', '點數 高→低'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type='button'
                onClick={() => setParam('sort', val, 'default')}
                className={cx('filter-chip focus-ring', sortOrder === val && 'filter-chip-active')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-2 text-xs'>
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='font-semibold text-muted'>獎勵快篩：</span>
            {QUICK_REWARDS.map((kw) => {
              const active = query === kw;
              return (
                <button
                  key={kw}
                  type='button'
                  onClick={() => setQuery(active ? '' : kw)}
                  className={cx('filter-chip focus-ring', active && 'filter-chip-active')}
                >
                  {kw}
                </button>
              );
            })}
          </div>

          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='font-semibold text-muted'>進度：</span>
            {(
              [
                ['ALL', '全部'],
                ['TODO', '待攻略'],
                ['DONE', '已完成'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type='button'
                onClick={() => setParam('status', val, 'ALL')}
                className={cx('filter-chip focus-ring', completion === val && 'filter-chip-active')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-1.5 text-xs'>
          <span className='font-semibold text-muted'>好感需求：</span>
          {AFFINITY_BRACKETS.map(([val, label]) => (
            <button
              key={val}
              type='button'
              onClick={() => setParam('aff', val, 'ALL')}
              className={cx('filter-chip focus-ring font-mono tabular-nums', affFilter === val && 'filter-chip-active')}
            >
              {label}
            </button>
          ))}
        </div>

        <div className='flex flex-wrap items-center gap-1.5 text-xs'>
          <span className='font-semibold text-muted'>熱門地區：</span>
          <button
            type='button'
            onClick={() => setParam('loc', 'all', 'all')}
            className={cx('filter-chip focus-ring', locParam === 'all' && 'filter-chip-active')}
          >
            全部地區
          </button>
          {topContinents.map((loc) => (
            <button
              key={loc}
              type='button'
              onClick={() => setParam('loc', locParam === loc ? 'all' : loc, 'all')}
              className={cx('filter-chip focus-ring', locParam === loc && 'filter-chip-active')}
            >
              {loc}
            </button>
          ))}
        </div>
      </Toolbar>

      <AnchorJumpCloud items={anchorItems} title='NPC 直達索引' />

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {filtered.length === 0 ? (
          <EmptyResult query={query} activeFilters={activeFilters} onReset={resetAll} />
        ) : (
          <div className='space-y-3'>
            {filtered.map((item) => (
              <FavorCard3Zone
                key={item.id}
                item={item}
                query={query}
                done={completedSet.has(item.id)}
                onToggle={() => toggleNpc(item.id)}
                onSelectRegion={(loc) => setParam('loc', loc, 'all')}
              />
            ))}
          </div>
        )}
      </QueryState>
    </div>
  );
}

function FavorCard3Zone({
  item,
  query,
  done,
  onToggle,
  onSelectRegion,
}: {
  item: Favorability;
  query: string;
  done: boolean;
  onToggle: () => void;
  onSelectRegion: (loc: string) => void;
}) {
  const anchorId = toAnchorId('npc', item.id);
  const hasLove = item.rewards.love.length > 0;
  const tiers: FavorTier[] = hasLove
    ? ['normal', 'attention', 'friendly', 'trust', 'love']
    : ['normal', 'attention', 'friendly', 'trust'];

  return (
    <DataCard3Zone
      id={anchorId}
      dimmed={done}
      highlighted={done}
      scopeBadge={
        hasLove
          ? { label: '5階愛情', tone: 'danger' }
          : item.virtueReq
            ? { label: item.virtueReq, tone: 'warning' }
            : undefined
      }
      title={<Highlight text={item.npc} query={query} />}
      subtitleEn={<Highlight text={item.locations.join(' / ')} query={query} />}
      headerActions={
        <button
          type='button'
          onClick={onToggle}
          aria-pressed={done}
          className={cx('filter-chip focus-ring py-1 text-xs', done && 'filter-chip-active')}
        >
          <CheckOutlined className='text-[10px]' />
          <span>{done ? '已滿好感' : '標記完成'}</span>
        </button>
      }
      visual={
        <div className='flex flex-col items-center justify-center gap-0.5 text-center'>
          <GlyphIcon
            name='rapport'
            className={hasLove ? 'size-5 text-danger' : 'size-5 text-gold'}
          />
          <span className='font-mono text-[11px] font-semibold tabular-nums text-roll'>
            {item.maxAffinity ? `${Math.round(item.maxAffinity / 1000)}k` : '—'}
          </span>
        </div>
      }
      baseSpecs={[
        {
          label: '所在地區',
          value: (
            <button
              type='button'
              onClick={() => onSelectRegion(item.locations.at(-1) ?? item.locations[0])}
              className='text-magic hover:underline'
              title='篩選同地區 NPC'
            >
              {item.locations.join(' / ')}
            </button>
          ),
        },
        {
          label: '最大好感',
          value: item.maxAffinity ? `${item.maxAffinity.toLocaleString()} pt` : '—',
          highlight: true,
        },
        { label: '最高階段', value: hasLove ? '愛情 (5階)' : '信賴 (4階)' },
        ...(item.virtueReq ? [{ label: '四維門檻', value: item.virtueReq }] : []),
      ]}
      footerMeta={`RAPPORT · #${anchorId} · MAX:${item.maxAffinity.toLocaleString()}PT`}
    >
      <ul className='space-y-1.5'>
        {tiers.map((tier) => {
          const rewards = item.rewards[tier];
          return (
            <li key={tier} className='flex flex-wrap items-baseline gap-2'>
              <span className='w-14 shrink-0 font-mono text-xs font-semibold text-sub'>
                ⬩ {TIER_LABELS[tier]}：
              </span>
              <div className='flex min-w-0 flex-1 flex-wrap gap-1.5'>
                {rewards.length > 0 ? (
                  rewards.map((r, idx) => {
                    const crossTo = getCollectibleCrossLink(r);
                    const badge = (
                      <span className={cx('chip', rewardTone(r))}>
                        <StatRangeText text={r} query={query} />
                      </span>
                    );
                    return crossTo ? (
                      <Link
                        key={idx}
                        to={crossTo}
                        title='點擊前往對應收集品或卡組圖鑑'
                        className='focus-ring rounded-sm transition-opacity hover:opacity-85'
                      >
                        {badge}
                      </Link>
                    ) : (
                      <span key={idx}>{badge}</span>
                    );
                  })
                ) : (
                  <span className='text-xs text-muted'>—</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </DataCard3Zone>
  );
}
