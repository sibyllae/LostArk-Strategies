import { useMemo } from 'react';
import { Card, Tag } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
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
            placeholder='搜尋大陸名稱或里程碑獎勵（如：表情、無聊、聖物）…'
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
    <Card
      className='rounded-2xl !border-white/10 !bg-zinc-900/60 backdrop-blur-sm transition-all hover:!border-sky-500/40'
      title={
        <div className='flex items-center justify-between gap-2 py-1'>
          <div className='flex items-center gap-2'>
            <ReadOutlined className='text-lg text-sky-400' />
            <span className='text-base font-bold text-zinc-100'>
              <Highlight text={item.region} query={query} />
            </span>
          </div>
          <span className='text-xs font-normal text-zinc-500'>
            {item.milestones.length} 項關鍵里程碑
          </span>
        </div>
      }
    >
      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
        {item.milestones.map((m) => (
          <div
            key={m.percent}
            className='flex items-center gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/60 px-3 py-2 text-xs'
          >
            <Tag color='blue' className='!m-0 w-12 shrink-0 text-center font-mono font-bold'>
              {m.percent}%
            </Tag>
            <span
              title={m.reward}
              className={cx('chip min-w-0 break-words font-medium', rewardTone(m.reward))}
            >
              <Highlight text={m.reward} query={query} />
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
