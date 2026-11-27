import { useMemo, useState } from 'react';
import { Segmented, Select } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import SearchInput from '@/components/ui/SearchInput';
import Toolbar from '@/components/ui/Toolbar';
import { useLocalTracker } from '@/hooks/useLocalTracker';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetFavorabilitiesQuery } from '@/services/gameApi';
import type { FavorTier, Favorability } from '@/types/game';
import { cx } from '@/utils/cx';
import { rewardTone } from '@/utils/reward';
import { matchesQuery } from '@/utils/text';

const TIER_CONFIG: Record<FavorTier, { label: string; dot: string; labelColor: string }> = {
  normal: { label: '普通', dot: 'bg-slate-400', labelColor: 'text-muted' },
  attention: { label: '關注', dot: 'bg-slate-400', labelColor: 'text-muted' },
  friendly: { label: '友好', dot: 'bg-sky-500', labelColor: 'text-sky-600 dark:text-sky-300' },
  trust: { label: '信賴', dot: 'bg-amber-500', labelColor: 'text-amber-700 dark:text-amber-300' },
  love: { label: '愛情', dot: 'bg-rose-500', labelColor: 'text-rose-600 dark:text-rose-300' },
};

const QUICK_REWARDS = [
  '巨人心臟',
  '奧菲斯之星',
  '島之心',
  '血爪海圖',
  '卡片',
  '藥水',
  '金',
] as const;

type SortOrder = 'default' | 'affinityAsc' | 'affinityDesc';
type CompletionFilter = 'ALL' | 'TODO' | 'DONE';

export default function FavorabilityPage() {
  const { data = [], isLoading, isError, refetch } = useGetFavorabilitiesQuery();
  const { state, toggleNpc } = useLocalTracker();
  const [query, setQuery] = useSearchQuery();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const [completion, setCompletion] = useState<CompletionFilter>('ALL');

  const completedSet = useMemo(() => new Set(state.npcs), [state.npcs]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => item.locations.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const list = data.filter((item) => {
      const isDone = completedSet.has(item.id);
      if (completion === 'TODO' && isDone) return false;
      if (completion === 'DONE' && !isDone) return false;

      const matchLoc = selectedLocation === 'all' || item.locations.includes(selectedLocation);
      const allRewards = Object.values(item.rewards).flat();
      return matchLoc && matchesQuery(query, item.npc, item.locations, allRewards);
    });

    if (sortOrder === 'affinityAsc') {
      return [...list].sort((a, b) => a.maxAffinity - b.maxAffinity);
    }
    if (sortOrder === 'affinityDesc') {
      return [...list].sort((a, b) => b.maxAffinity - a.maxAffinity);
    }
    return list;
  }, [data, query, selectedLocation, sortOrder, completion, completedSet]);

  const resetAll = () => {
    setQuery('');
    setSelectedLocation('all');
    setSortOrder('default');
    setCompletion('ALL');
  };

  return (
    <div>
      <PageHeader
        navKey='favorability'
        stats={[
          { label: '收錄 NPC', value: data.length },
          { label: '已滿好感', value: `${completedSet.size}/${data.length}` },
          { label: '顯示結果', value: filtered.length },
        ]}
        extra={
          <div className='flex flex-wrap items-center gap-2'>
            <span className='mr-1 text-xs font-medium text-muted'>重點獎勵快篩：</span>
            {QUICK_REWARDS.map((keyword) => {
              const active = query === keyword;
              return (
                <button
                  key={keyword}
                  type='button'
                  onClick={() => setQuery(active ? '' : keyword)}
                  className={cx(
                    'focus-ring rounded-full border px-3.5 py-1 text-xs font-medium transition-colors',
                    active
                      ? 'border-brand bg-brand/15 text-brand'
                      : 'border-line bg-surface text-sub hover:border-brand/45 hover:text-ink'
                  )}
                >
                  {keyword}
                </button>
              );
            })}
          </div>
        }
      />

      <Toolbar>
        <div className='min-w-[240px] flex-1'>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder='搜尋 NPC 名稱、大陸／島嶼或階段獎勵（如：巴亨圖爾、妮娜芙、血爪海圖）…'
          />
        </div>
        <Select
          size='large'
          value={selectedLocation}
          onChange={setSelectedLocation}
          aria-label='篩選地區'
          className='w-full sm:w-44'
          options={[
            { label: '全部地區', value: 'all' },
            ...locations.map((loc) => ({ label: loc, value: loc })),
          ]}
        />
        <Select
          size='large'
          value={sortOrder}
          onChange={setSortOrder}
          aria-label='排序方式'
          className='w-full sm:w-48'
          options={[
            { label: '預設順序', value: 'default' },
            { label: '需求好感：低 → 高', value: 'affinityAsc' },
            { label: '需求好感：高 → 低', value: 'affinityDesc' },
          ]}
        />
        <Segmented
          size='large'
          value={completion}
          onChange={(v) => setCompletion(v as CompletionFilter)}
          options={[
            { label: '全部', value: 'ALL' },
            { label: '待攻略', value: 'TODO' },
            { label: '已完成', value: 'DONE' },
          ]}
        />
      </Toolbar>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {filtered.length === 0 ? (
          <EmptyResult query={query} onReset={resetAll} />
        ) : (
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {filtered.map((item) => (
              <FavorCard
                key={item.id}
                item={item}
                query={query}
                done={completedSet.has(item.id)}
                onToggle={() => toggleNpc(item.id)}
              />
            ))}
          </div>
        )}
      </QueryState>
    </div>
  );
}

function FavorCard({
  item,
  query,
  done,
  onToggle,
}: {
  item: Favorability;
  query: string;
  done: boolean;
  onToggle: () => void;
}) {
  const costRatio = Math.min(100, Math.round((item.maxAffinity / 104000) * 100));
  const tiers: FavorTier[] =
    item.rewards.love.length > 0
      ? ['normal', 'attention', 'friendly', 'trust', 'love']
      : ['normal', 'attention', 'friendly', 'trust'];

  return (
    <article
      className={cx(
        'surface flex h-full flex-col overflow-hidden',
        done ? 'border-emerald-500/40 opacity-75' : 'hover:border-brand/45'
      )}
    >
      <div className='border-b border-line bg-subtle/60 px-6 py-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0 space-y-1'>
            <h2 className='truncate text-lg font-bold text-ink'>
              <Highlight text={item.npc} query={query} />
            </h2>
            <p className='truncate text-xs text-muted'>
              <Highlight text={item.locations.join(' · ')} query={query} />
            </p>
          </div>

          <button
            type='button'
            onClick={onToggle}
            aria-pressed={done}
            className={cx(
              'focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
              done
                ? 'border-emerald-500/45 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200'
                : 'border-line bg-surface text-sub hover:border-brand/50 hover:text-brand'
            )}
          >
            <CheckOutlined className='text-[11px]' />
            {done ? '已滿' : '標記'}
          </button>
        </div>

        <div className='mt-3.5 flex items-center gap-3'>
          <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-elevated'>
            <div
              className={cx(
                'h-full rounded-full transition-all',
                item.maxAffinity >= 77000
                  ? 'bg-rose-500'
                  : item.maxAffinity >= 37000
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
              )}
              style={{ width: `${costRatio}%` }}
            />
          </div>
          <span className='shrink-0 font-mono text-xs font-semibold tabular-nums text-sub'>
            {item.maxAffinity ? `${item.maxAffinity.toLocaleString()} 點` : '—'}
          </span>
        </div>
      </div>

      {/* 寬鬆階段清單，每列留足呼吸空間 */}
      <ol className='flex-1 divide-y divide-line/60 px-6 py-2'>
        {tiers.map((tier) => {
          const rewards = item.rewards[tier];
          const cfg = TIER_CONFIG[tier];
          return (
            <li key={tier} className='flex items-start gap-3 py-3'>
              <div className='mt-1 flex w-14 shrink-0 items-center gap-2'>
                <span className={cx('size-2 shrink-0 rounded-full', cfg.dot)} />
                <span className={cx('text-xs font-semibold', cfg.labelColor)}>{cfg.label}</span>
              </div>

              <div className='flex min-w-0 flex-1 flex-wrap gap-1.5'>
                {rewards.length > 0 ? (
                  rewards.map((r, idx) => (
                    <span key={idx} className={cx('chip', rewardTone(r))}>
                      <Highlight text={r} query={query} />
                    </span>
                  ))
                ) : (
                  <span className='text-xs text-muted'>—</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
