import { useMemo, useState } from 'react';
import { Segmented } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import SearchInput from '@/components/ui/SearchInput';
import Toolbar from '@/components/ui/Toolbar';
import { useLocalTracker } from '@/hooks/useLocalTracker';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetAdventureBooksQuery } from '@/services/gameApi';
import type { AdventureBook } from '@/types/game';
import { cx } from '@/utils/cx';
import { rewardTone } from '@/utils/reward';
import { matchesQuery } from '@/utils/text';

const T4_REGIONS = new Set(['庫爾贊南部', '庫爾贊北部', '里姆雷克南部']);
const MID_REGIONS = new Set([
  '洛漢德',
  '約恩',
  '費伊頓',
  '帕夫尼卡',
  '貝倫南部',
  '洛溫',
  '愛迦希亞',
  '伏爾戴克',
]);

type EraFilter = 'ALL' | 'EARLY' | 'MID' | 'T4';

const getRegionEra = (region: string): Exclude<EraFilter, 'ALL'> => {
  if (T4_REGIONS.has(region)) return 'T4';
  if (MID_REGIONS.has(region)) return 'MID';
  return 'EARLY';
};

export default function AdventureBookPage() {
  const { data = [], isLoading, isError, refetch } = useGetAdventureBooksQuery();
  const { state, toggleIgneaRegion } = useLocalTracker();
  const [query, setQuery] = useSearchQuery();
  const [era, setEra] = useState<EraFilter>('ALL');

  const igneaSet = useMemo(() => new Set(state.igneaRegions), [state.igneaRegions]);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (era !== 'ALL' && getRegionEra(item.region) !== era) return false;
      const rewards = item.milestones.map((m) => m.reward);
      return matchesQuery(query, item.region, rewards);
    });
  }, [data, query, era]);

  return (
    <div>
      <PageHeader
        navKey='adventureBook'
        stats={[
          { label: '收錄大陸', value: data.length },
          { label: '伊格涅亞標誌', value: `${igneaSet.size}/${data.length}` },
          { label: '顯示大陸', value: filtered.length },
        ]}
      />

      <Toolbar>
        <div className='min-w-[240px] flex-1'>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder='搜尋大陸名稱或完成度獎勵（如：技能點、悟性點、血爪海圖、秘密地圖）…'
          />
        </div>
        <Segmented
          size='large'
          value={era}
          onChange={(v) => setEra(v as EraFilter)}
          options={[
            { label: '全部大陸', value: 'ALL' },
            { label: '吉埃娜初期', value: 'EARLY' },
            { label: '中後期大陸', value: 'MID' },
            { label: 'T4 大陸', value: 'T4' },
          ]}
        />
      </Toolbar>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {filtered.length === 0 ? (
          <EmptyResult
            query={query}
            onReset={() => {
              setQuery('');
              setEra('ALL');
            }}
          />
        ) : (
          <div className='space-y-6'>
            {filtered.map((item, idx) => (
              <AdventureBookStrip
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

function AdventureBookStrip({
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

  return (
    <article
      className={cx(
        'surface overflow-hidden',
        igneaDone ? 'border-emerald-500/45' : 'hover:border-brand/45'
      )}
    >
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle/60 px-6 py-4'>
        <div className='flex items-center gap-3.5'>
          <span className='font-mono text-xs font-semibold text-muted tabular-nums'>
            #{String(index).padStart(2, '0')}
          </span>
          <h2 className='text-lg font-bold text-ink'>
            <Highlight text={item.region} query={query} />
          </h2>
          {era === 'T4' && (
            <span className='chip tone-gold px-2 py-0.5 text-xs'>T4 大陸</span>
          )}
        </div>

        <button
          type='button'
          onClick={onToggleIgnea}
          aria-pressed={igneaDone}
          className={cx(
            'focus-ring inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-colors',
            igneaDone
              ? 'border-emerald-500/45 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200'
              : 'border-line bg-surface text-sub hover:border-brand/50 hover:text-brand'
          )}
        >
          <CheckOutlined className='text-[11px]' />
          {igneaDone ? '100% 伊格涅亞已取' : '標記 100% 完成'}
        </button>
      </div>

      <div className='grid grid-cols-1 gap-3.5 p-6 sm:grid-cols-2 lg:grid-cols-3'>
        {item.milestones.map((m) => (
          <div
            key={m.percent}
            className='subsurface flex items-center gap-3.5 px-4 py-3'
          >
            <span className='w-11 shrink-0 font-mono text-sm font-bold tabular-nums text-brand'>
              {m.percent}%
            </span>
            <span className={cx('chip min-w-0 break-words', rewardTone(m.reward))}>
              <Highlight text={m.reward} query={query} />
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
