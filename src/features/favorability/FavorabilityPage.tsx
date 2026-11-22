import { useMemo, useState } from 'react';
import { Card, Select, Tag } from 'antd';
import { EnvironmentOutlined, HeartOutlined } from '@ant-design/icons';
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

const TIER_CONFIG: Record<FavorTier, { label: string; border: string }> = {
  normal: { label: '普通', border: 'border-zinc-800' },
  attention: { label: '關注', border: 'border-zinc-800' },
  friendly: { label: '友好', border: 'border-zinc-800' },
  trust: { label: '信賴', border: 'border-rose-500/40' },
  love: { label: '愛情', border: 'border-pink-500/50 bg-pink-500/5' },
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
            <span className='mr-1 text-xs text-zinc-500'>快速篩選：</span>
            {QUICK_REWARDS.map((keyword) => {
              const active = query === keyword;
              return (
                <button
                  key={keyword}
                  type='button'
                  onClick={() => setQuery(active ? '' : keyword)}
                  className={cx(
                    'focus-ring rounded-full px-2.5 py-0.5 text-xs transition-colors ring-1 ring-inset',
                    active
                      ? 'bg-rose-500/20 text-rose-200 ring-rose-400/40'
                      : 'bg-white/[0.04] text-zinc-400 ring-white/10 hover:bg-white/[0.08] hover:text-zinc-200'
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
          className='w-full sm:w-44'
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
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
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
    <Card
      className='flex h-full flex-col rounded-2xl !border-white/10 !bg-zinc-900/60 backdrop-blur-sm transition-all hover:!border-rose-500/40'
      title={
        <div className='flex items-center justify-between gap-2 py-1'>
          <div className='flex min-w-0 items-center gap-2'>
            <HeartOutlined className='shrink-0 text-lg text-rose-400' />
            <span className='truncate text-base font-bold text-zinc-100'>
              <Highlight text={item.npc} query={query} />
            </span>
          </div>
          <Tag color='red' className='!m-0 shrink-0 font-mono text-xs'>
            {item.maxAffinity ? item.maxAffinity.toLocaleString() : '-'}
          </Tag>
        </div>
      }
    >
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center gap-1.5 text-xs text-zinc-400'>
          <EnvironmentOutlined className='text-zinc-500' />
          <span>{item.locations.join(' / ')}</span>
        </div>

        <div className='grid flex-1 grid-cols-2 gap-2 text-xs'>
          {(['normal', 'attention', 'friendly', 'trust'] as FavorTier[]).map((tier) => {
            const rewards = item.rewards[tier];
            const cfg = TIER_CONFIG[tier];
            return (
              <div
                key={tier}
                className={cx(
                  'flex flex-col justify-between rounded-xl border bg-zinc-950/60 p-2.5',
                  cfg.border
                )}
              >
                <span className='mb-1 text-[10px] font-semibold text-zinc-500'>{cfg.label}</span>
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
                    <span className='text-zinc-600'>-</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {item.rewards.love.length > 0 && (
          <div className='rounded-xl border border-pink-500/30 bg-pink-500/10 p-2.5 text-xs'>
            <span className='mb-1 block text-[10px] font-bold text-pink-400'>愛情階段獎勵</span>
            <div className='flex flex-wrap gap-1'>
              {item.rewards.love.map((r, idx) => (
                <span
                  key={idx}
                  className='rounded bg-pink-500/20 px-2 py-0.5 text-xs font-semibold text-pink-200'
                >
                  <Highlight text={r} query={query} />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
