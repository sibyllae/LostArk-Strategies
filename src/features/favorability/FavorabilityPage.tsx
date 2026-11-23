import { useMemo, useState } from 'react';
import { Select } from 'antd';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import SearchInput from '@/components/ui/SearchInput';
import Toolbar from '@/components/ui/Toolbar';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetFavorabilitiesQuery } from '@/services/gameApi';
import type { FavorTier, Favorability } from '@/types/game';
import { cx } from '@/utils/cx';
import { rewardTone } from '@/utils/reward';
import { matchesQuery } from '@/utils/text';

const TIER_CONFIG: Record<FavorTier, { label: string; border: string; labelColor: string }> = {
  normal: { label: '普通', border: 'border-obsidian-700/60', labelColor: 'text-stone-500' },
  attention: { label: '關注', border: 'border-obsidian-700/60', labelColor: 'text-stone-500' },
  friendly: { label: '友好', border: 'border-obsidian-700/60', labelColor: 'text-stone-400' },
  trust: { label: '信賴', border: 'border-gold-500/35', labelColor: 'text-gold-400' },
  love: { label: '愛情', border: 'border-rose-400/35', labelColor: 'text-rose-300' },
};

const QUICK_REWARDS = ['巨人心臟', '奧菲斯之星', '卡片', '金', '藥水'] as const;
type SortOrder = 'default' | 'affinityAsc' | 'affinityDesc';

export default function FavorabilityPage() {
  const { data = [], isLoading, isError, refetch } = useGetFavorabilitiesQuery();
  const [query, setQuery] = useSearchQuery();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');

  const locations = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => item.locations.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const list = data.filter((item) => {
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
  }, [data, query, selectedLocation, sortOrder]);

  const resetAll = () => {
    setQuery('');
    setSelectedLocation('all');
    setSortOrder('default');
  };

  return (
    <div>
      <PageHeader
        navKey='favorability'
        stats={[
          { label: '收錄 NPC', value: data.length },
          { label: '篩選結果', value: filtered.length },
        ]}
        extra={
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='mr-1 text-xs text-stone-500'>快速篩選：</span>
            {QUICK_REWARDS.map((keyword) => {
              const active = query === keyword;
              return (
                <button
                  key={keyword}
                  type='button'
                  onClick={() => setQuery(active ? '' : keyword)}
                  className={cx(
                    'focus-ring rounded border px-2 py-0.5 text-xs transition-colors',
                    active
                      ? 'border-gold-500/60 bg-gold-500/15 text-gold-300'
                      : 'border-obsidian-700 bg-obsidian-900 text-stone-400 hover:border-stone-600 hover:text-stone-200'
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
            placeholder='搜尋 NPC 名稱、地區或獎勵內容（如：巨人心臟、卡片）…'
          />
        </div>
        <Select
          size='middle'
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
          size='middle'
          value={sortOrder}
          onChange={setSortOrder}
          aria-label='排序方式'
          className='w-full sm:w-48'
          options={[
            { label: '預設順序', value: 'default' },
            { label: '好感度需求：低 → 高', value: 'affinityAsc' },
            { label: '好感度需求：高 → 低', value: 'affinityDesc' },
          ]}
        />
      </Toolbar>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {filtered.length === 0 ? (
          <EmptyResult query={query} onReset={resetAll} />
        ) : (
          <div className='grid gap-3.5 md:grid-cols-2 xl:grid-cols-3'>
            {filtered.map((item) => (
              <FavorCard key={item.id} item={item} query={query} />
            ))}
          </div>
        )}
      </QueryState>
    </div>
  );
}

function FavorCard({ item, query }: { item: Favorability; query: string }) {
  return (
    <article className='surface flex h-full flex-col overflow-hidden'>
      <div className='flex items-start justify-between gap-2 border-b border-obsidian-700/70 bg-obsidian-850/70 px-4 py-3'>
        <div className='min-w-0'>
          <h2 className='truncate text-sm font-bold text-stone-100'>
            <Highlight text={item.npc} query={query} />
          </h2>
          <p className='mt-0.5 truncate text-xs text-stone-500'>
            {item.locations.join(' / ')}
          </p>
        </div>
        <span className='meta-tag shrink-0 font-mono tabular-nums text-gold-300'>
          {item.maxAffinity ? item.maxAffinity.toLocaleString() : '-'}
        </span>
      </div>

      <div className='flex flex-1 flex-col gap-2.5 p-3.5'>
        <div className='grid flex-1 grid-cols-2 gap-2 text-xs'>
          {(['normal', 'attention', 'friendly', 'trust'] as FavorTier[]).map((tier) => {
            const rewards = item.rewards[tier];
            const cfg = TIER_CONFIG[tier];
            return (
              <div
                key={tier}
                className={cx('flex flex-col rounded-md border bg-obsidian-950/60 p-2', cfg.border)}
              >
                <span className={cx('mb-1.5 text-[11px] font-medium', cfg.labelColor)}>
                  {cfg.label}
                </span>
                <div className='space-y-1'>
                  {rewards.length > 0 ? (
                    rewards.map((r, idx) => (
                      <span
                        key={idx}
                        className={cx(
                          'block rounded px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset',
                          rewardTone(r)
                        )}
                      >
                        <Highlight text={r} query={query} />
                      </span>
                    ))
                  ) : (
                    <span className='text-stone-600'>—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {item.rewards.love.length > 0 && (
          <div className='rounded-md border border-rose-400/25 bg-rose-500/5 px-2.5 py-2 text-xs'>
            <span className='mb-1 block text-[11px] font-medium text-rose-300'>愛情階段</span>
            <div className='flex flex-wrap gap-1'>
              {item.rewards.love.map((r, idx) => (
                <span
                  key={idx}
                  className='rounded bg-rose-500/15 px-1.5 py-0.5 text-[11px] font-medium text-rose-200'
                >
                  <Highlight text={r} query={query} />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
