import { useMemo } from 'react';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import SearchInput from '@/components/ui/SearchInput';
import Toolbar from '@/components/ui/Toolbar';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetAdventureBooksQuery } from '@/services/gameApi';
import type { AdventureBook } from '@/types/game';
import { cx } from '@/utils/cx';
import { rewardTone } from '@/utils/reward';
import { matchesQuery } from '@/utils/text';

export default function AdventureBookPage() {
  const { data = [], isLoading, isError, refetch } = useGetAdventureBooksQuery();
  const [query, setQuery] = useSearchQuery();

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const rewards = item.milestones.map((m) => m.reward);
      return matchesQuery(query, item.region, rewards);
    });
  }, [data, query]);

  return (
    <div>
      <PageHeader
        navKey='adventureBook'
        stats={[
          { label: '收錄大陸', value: data.length },
          { label: '符合項目', value: filtered.length },
        ]}
      />

      <Toolbar>
        <div className='min-w-[240px] flex-1'>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder='搜尋大陸名稱或里程碑獎勵（如：表情、技能點、伊格涅亞）…'
          />
        </div>
      </Toolbar>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {filtered.length === 0 ? (
          <EmptyResult query={query} onReset={() => setQuery('')} />
        ) : (
          <div className='grid gap-4 md:grid-cols-2'>
            {filtered.map((item) => (
              <AdventureBookCard key={item.id} item={item} query={query} />
            ))}
          </div>
        )}
      </QueryState>
    </div>
  );
}

function AdventureBookCard({ item, query }: { item: AdventureBook; query: string }) {
  return (
    <article className='surface overflow-hidden'>
      <div className='flex items-center justify-between gap-2 border-b border-obsidian-700/70 bg-obsidian-850/70 px-4 py-3'>
        <h2 className='text-sm font-bold text-stone-100'>
          <Highlight text={item.region} query={query} />
        </h2>
        <span className='font-mono text-xs tabular-nums text-stone-500'>
          {item.milestones.length} 項里程碑
        </span>
      </div>

      <div className='grid grid-cols-1 gap-2 p-3.5 sm:grid-cols-2'>
        {item.milestones.map((m) => (
          <div
            key={m.percent}
            className='subsurface flex items-center gap-2.5 px-2.5 py-2 text-xs'
          >
            <span className='w-10 shrink-0 text-right font-mono text-xs font-semibold tabular-nums text-gold-400'>
              {m.percent}%
            </span>
            <span
              title={m.reward}
              className={cx('chip min-w-0 break-words font-medium', rewardTone(m.reward))}
            >
              <Highlight text={m.reward} query={query} />
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
