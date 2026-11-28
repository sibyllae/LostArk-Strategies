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
import Toolbar from '@/components/ui/Toolbar';
import { useLocalTracker } from '@/hooks/useLocalTracker';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetAdventureBooksQuery } from '@/services/gameApi';
import type { AdventureBook } from '@/types/game';
import { cx } from '@/utils/cx';
import { rewardTone } from '@/utils/reward';
import { matchesWithAliases, toAnchorId } from '@/utils/slug';

const T4_REGIONS = new Set(['庫爾贊南部', '庫爾贊北部', '里姆雷克南部']);
const MID_REGIONS = new Set([
  '洛漢德',
  '約恩',
  '費伊頓',
  '帕夫尼卡',
  '貝倫南部',
  '洛溫',
  '普雷奇亞',
  '愛迦希亞',
  '伏爾戴克',
]);

type EraFilter = 'ALL' | 'EARLY' | 'MID' | 'T4';
type IgneaFilter = 'ALL' | 'TODO' | 'DONE';

const QUICK_REWARDS = ['技能點數', '悟性點數', '藝術品', '秘密地圖', '血爪海圖', '之歌', '卡片'] as const;

const getRegionEra = (region: string): Exclude<EraFilter, 'ALL'> => {
  if (T4_REGIONS.has(region)) return 'T4';
  if (MID_REGIONS.has(region)) return 'MID';
  return 'EARLY';
};

/** SKILL.md Section 4G：點擊冒險書獎勵膠囊直接導向對應收集品／百科視圖 */
function getMilestoneCrossLink(reward: string): string | null {
  if (reward.includes('血爪海圖')) return '/game/collectibles?tab=bloodclawCharts';
  if (reward.includes('藝術品')) return '/game/collectibles?tab=masterpieces';
  if (reward.includes('秘密地圖')) return '/game/collectibles?tab=seaBounties';
  if (reward.includes('悟性點數')) return '/game/miscGuide?section=enlightenmentPoints';
  if (reward.includes('技能點數')) return '/game/miscGuide?section=skillPoints';
  if (reward.includes('之歌') || reward.includes('武器')) return '/game/miscGuide?section=songs';
  if (reward.includes('符文')) return '/game/miscGuide?section=runes';
  if (reward.includes('卡片')) return '/game/miscGuide?section=cardSets';
  return null;
}

export default function AdventureBookPage() {
  const { data = [], isLoading, isError, refetch } = useGetAdventureBooksQuery();
  const { state, toggleIgneaRegion } = useLocalTracker();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useSearchQuery();

  const eraParam = searchParams.get('era');
  const igneaParam = searchParams.get('ignea');

  const era: EraFilter =
    eraParam === 'EARLY' || eraParam === 'MID' || eraParam === 'T4' ? eraParam : 'ALL';
  const igneaFilter: IgneaFilter =
    igneaParam === 'TODO' || igneaParam === 'DONE' ? igneaParam : 'ALL';

  const setParam = (key: string, value: string) => {
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

  const igneaSet = useMemo(() => new Set(state.igneaRegions), [state.igneaRegions]);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const done = igneaSet.has(item.region);
      if (igneaFilter === 'TODO' && done) return false;
      if (igneaFilter === 'DONE' && !done) return false;
      if (era !== 'ALL' && getRegionEra(item.region) !== era) return false;
      const rewards = item.milestones.map((m) => m.reward);
      return matchesWithAliases(query, item.region, rewards);
    });
  }, [data, query, era, igneaFilter, igneaSet]);

  const activeFilters = useMemo(() => {
    const tags: string[] = [];
    if (query.trim()) tags.push(`關鍵字: ${query.trim()}`);
    if (era !== 'ALL') tags.push(`分區: ${era === 'T4' ? 'T4 大陸' : era === 'MID' ? '中後期' : '初期'}`);
    if (igneaFilter !== 'ALL') tags.push(igneaFilter === 'TODO' ? '100%未完成' : '100%已取得');
    return tags;
  }, [query, era, igneaFilter]);

  const anchorItems = useMemo(
    () =>
      filtered.map((item) => ({
        id: toAnchorId('tome', item.region),
        label: item.region,
      })),
    [filtered]
  );

  const resetAll = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <div>
      <PageHeader
        navKey='adventureBook'
        stats={[
          { label: '收錄大陸', value: data.length },
          { label: '伊格涅亞標誌', value: `${igneaSet.size}/${data.length}` },
          { label: '顯示筆數', value: filtered.length },
        ]}
      />

      <div className='surface section-bar-category mb-4 px-3.5 py-2.5 text-xs text-sub'>
        <strong className='font-semibold text-gold'>2026 版本說明：</strong>
        「卡達魯姆群島」為通往薩克利亞的過渡篇章，官方未設置大陸冒險之書與伊格涅亞標誌（其隱藏摩可可、薩克利亞香爐海圖與{' '}
        <Link to='/game/raidChests?q=地平線大聖堂' className='font-medium text-magic hover:underline'>
          地平線大聖堂
        </Link>{' '}
        已收錄於對應專區）。
      </div>

      <Toolbar
        shownCount={filtered.length}
        totalCount={data.length}
        activeFilters={activeFilters}
        onReset={resetAll}
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder='搜尋大陸名稱或里程碑獎勵（如：技能點、悟性點、血爪海圖、微縮地圖）…'
        />

        <div className='flex flex-wrap items-center justify-between gap-2 text-xs'>
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='font-semibold text-muted'>分區：</span>
            {(
              [
                ['ALL', '全部大陸'],
                ['EARLY', '吉埃娜初期'],
                ['MID', '中後期大陸'],
                ['T4', 'T4 終局大陸'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type='button'
                onClick={() => setParam('era', val)}
                className={cx('filter-chip focus-ring', era === val && 'filter-chip-active')}
              >
                {label}
              </button>
            ))}
          </div>

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
            <span className='font-semibold text-muted'>100% 標誌：</span>
            {(
              [
                ['ALL', '全部'],
                ['TODO', '未完成'],
                ['DONE', '已取得'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type='button'
                onClick={() => setParam('ignea', val)}
                className={cx('filter-chip focus-ring', igneaFilter === val && 'filter-chip-active')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Toolbar>

      <AnchorJumpCloud items={anchorItems} title='大陸直達索引' />

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {filtered.length === 0 ? (
          <EmptyResult query={query} activeFilters={activeFilters} onReset={resetAll} />
        ) : (
          <div className='space-y-3'>
            {filtered.map((item, idx) => (
              <TomeCard3Zone
                key={item.id}
                index={idx + 1}
                item={item}
                query={query}
                igneaDone={igneaSet.has(item.region)}
                onToggleIgnea={() => toggleIgneaRegion(item.region)}
              />
            ))}
          </div>
        )}
      </QueryState>
    </div>
  );
}

function TomeCard3Zone({
  index,
  item,
  query,
  igneaDone,
  onToggleIgnea,
}: {
  index: number;
  item: AdventureBook;
  query: string;
  igneaDone: boolean;
  onToggleIgnea: () => void;
}) {
  const era = getRegionEra(item.region);
  const anchorId = toAnchorId('tome', item.region);

  return (
    <DataCard3Zone
      id={anchorId}
      highlighted={igneaDone}
      titleTone={igneaDone ? 'set' : 'gold'}
      scopeBadge={
        era === 'T4'
          ? { label: 'T4 大陸', tone: 'warning' }
          : igneaDone
            ? { label: '100% 完成', tone: 'group' }
            : undefined
      }
      title={<Highlight text={item.region} query={query} />}
      subtitleEn={`Adventurer's Tome · #${String(index).padStart(2, '0')}`}
      headerActions={
        <button
          type='button'
          onClick={onToggleIgnea}
          aria-pressed={igneaDone}
          className={cx('filter-chip focus-ring py-1 text-xs', igneaDone && 'filter-chip-active')}
        >
          <CheckOutlined className='text-[10px]' />
          <span>{igneaDone ? '100% 伊格涅亞已取' : '標記 100% 完成'}</span>
        </button>
      }
      visual={
        <div className='flex flex-col items-center justify-center gap-0.5 text-center'>
          <GlyphIcon
            name='tome'
            className={era === 'T4' ? 'size-5 text-gold' : 'size-5 text-magic'}
          />
          <span className='font-mono text-[11px] font-semibold tabular-nums text-sub'>
            #{String(index).padStart(2, '0')}
          </span>
        </div>
      }
      baseSpecs={[
        {
          label: '大陸分區',
          value: era === 'T4' ? 'T4 終局大陸' : era === 'MID' ? '中後期大陸' : '吉埃娜初期',
        },
        { label: '收錄獎勵', value: `${item.milestones.length} 個里程碑`, highlight: true },
        {
          label: '好感 NPC',
          value: (
            <Link
              to={`/game/favorability?loc=${encodeURIComponent(item.region)}`}
              className='text-magic hover:underline'
            >
              查本區好感 →
            </Link>
          ),
        },
        {
          label: '100% 標誌',
          value: (
            <Link to='/game/collectibles?tab=igneaTokens' className='text-magic hover:underline'>
              伊格涅亞獎勵 →
            </Link>
          ),
        },
      ]}
      footerMeta={`TOME · #${anchorId} · MILESTONES:${item.milestones.length} · IGNEA:${igneaDone ? 'DONE' : 'TODO'}`}
    >
      <div className='grid grid-cols-1 gap-1.5 sm:grid-cols-2'>
        {item.milestones.map((m) => {
          const crossTo = getMilestoneCrossLink(m.reward);
          const badge = (
            <span className={cx('chip min-w-0 break-words', rewardTone(m.reward))}>
              <StatRangeText text={m.reward} query={query} />
            </span>
          );
          return (
            <div key={m.percent} className='subsurface flex items-center gap-2 px-2.5 py-1.5'>
              <span className='w-9 shrink-0 font-mono text-xs font-semibold tabular-nums text-roll'>
                {m.percent}%
              </span>
              {crossTo ? (
                <Link
                  to={crossTo}
                  title='前往對應圖鑑或速查表'
                  className='focus-ring min-w-0 rounded-sm transition-opacity hover:opacity-85'
                >
                  {badge}
                </Link>
              ) : (
                badge
              )}
            </div>
          );
        })}
      </div>
    </DataCard3Zone>
  );
}
