import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, Tabs, Tag } from 'antd';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import ResponsiveList from '@/components/ui/ResponsiveList';
import SearchInput from '@/components/ui/SearchInput';
import SectionHeading from '@/components/ui/SectionHeading';
import Toolbar from '@/components/ui/Toolbar';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetCollectiblesQuery } from '@/services/gameApi';
import type { CollectibleReward, CollectibleSource } from '@/types/game';
import { matchesQuery } from '@/utils/text';

const COLLECTIBLE_TABS = [
  { key: 'giantHearts', label: '巨人心臟', icon: '❤️' },
  { key: 'islandTokens', label: '島之心', icon: '🏝️' },
  { key: 'masterpieces', label: '偉大的藝術品', icon: '🎨' },
  { key: 'omniumStars', label: '奧菲斯之星', icon: '⭐' },
  { key: 'igneaTokens', label: '伊格涅亞的標誌', icon: '🏅' },
  { key: 'seaBounties', label: '航海冒險物', icon: '⚓' },
  { key: 'memoryOrbs', label: '記憶八音盒', icon: '🎵' },
  { key: 'bloodclawCharts', label: '血爪海圖', icon: '🧭' },
  { key: 'worldTreeMokoko', label: '世界樹&摩可可', icon: '🌳' },
] as const;

type CollectibleTabKey = (typeof COLLECTIBLE_TABS)[number]['key'];

const isValidTab = (value: string | null): value is CollectibleTabKey =>
  COLLECTIBLE_TABS.some((tab) => tab.key === value);

export default function CollectiblesPage() {
  const { data, isLoading, isError, refetch } = useGetCollectiblesQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useSearchQuery();

  const tabParam = searchParams.get('tab');
  const activeTab: CollectibleTabKey = isValidTab(tabParam) ? tabParam : 'giantHearts';

  const setActiveTab = (key: string) => {
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

  const { content, visibleCount } = useMemo(() => {
    if (!data) return { content: null, visibleCount: 0 };

    if (activeTab === 'igneaTokens') {
      const rewards = data.igneaTokens.rewards
        .map((r, i) => ({ ...r, key: i }))
        .filter((r) => matchesQuery(query, r.reward, r.note, String(r.count)));

      return {
        visibleCount: rewards.length,
        content:
          rewards.length === 0 ? (
            <EmptyResult query={query} onReset={() => setQuery('')} />
          ) : (
            <RewardSection title='累計獎勵一覽' rewards={rewards} query={query} />
          ),
      };
    }

    if (activeTab === 'worldTreeMokoko') {
      const wtRewards = data.worldTreeMokoko.worldTreeRewards
        .map((r, i) => ({ ...r, key: i }))
        .filter((r) => matchesQuery(query, r.reward, r.note, String(r.count)));
      const wtSources = (data.worldTreeMokoko.worldTreeSources ?? [])
        .map((s, i) => ({ ...s, key: i }))
        .filter((s) => matchesQuery(query, s.source, s.note, String(s.id ?? '')));
      const mokokoRewards = data.worldTreeMokoko.mokokoRewards
        .map((r, i) => ({ ...r, key: i }))
        .filter((r) => matchesQuery(query, r.reward, r.note, String(r.count)));

      const total = wtRewards.length + wtSources.length + mokokoRewards.length;
      return {
        visibleCount: total,
        content: (
          <div className='space-y-6'>
            <Alert
              type='warning'
              showIcon
              className='!border-amber-500/30 !bg-amber-500/10 text-amber-200'
              title='採集世界樹之葉注意事項'
              description={data.worldTreeMokoko.worldTreeNote}
            />
            {total === 0 ? (
              <EmptyResult query={query} onReset={() => setQuery('')} />
            ) : (
              <>
                {wtRewards.length > 0 && (
                  <RewardSection title='世界樹之葉 重要獎勵' rewards={wtRewards} query={query} />
                )}
                {wtSources.length > 0 && (
                  <SourceSection title='世界樹之葉 取得攻略' items={wtSources} query={query} />
                )}
                {mokokoRewards.length > 0 && (
                  <RewardSection title='摩可可種子 重要獎勵' rewards={mokokoRewards} query={query} />
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
      .map((it, i) => ({ ...it, key: i }))
      .filter((it) => matchesQuery(query, it.island, it.source, it.note, String(it.id ?? '')));

    const total = filteredRewards.length + filteredItems.length;
    return {
      visibleCount: total,
      content:
        total === 0 ? (
          <EmptyResult query={query} onReset={() => setQuery('')} />
        ) : (
          <div className='space-y-8'>
            {filteredRewards.length > 0 && (
              <RewardSection title='里程碑累積獎勵' rewards={filteredRewards} query={query} />
            )}
            {filteredItems.length > 0 && (
              <SourceSection title='取得途徑全指南' items={filteredItems} query={query} />
            )}
          </div>
        ),
    };
  }, [data, activeTab, query, setQuery]);

  return (
    <div>
      <PageHeader
        navKey='collectibles'
        stats={[
          { label: '收集分類', value: COLLECTIBLE_TABS.length },
          { label: '當前顯示', value: visibleCount },
        ]}
      />

      <Toolbar>
        <div className='min-w-[240px] flex-1'>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder='搜尋收集品獎勵、島嶼名稱或任務來源…'
          />
        </div>
      </Toolbar>

      <div className='mb-6'>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type='card'
          items={COLLECTIBLE_TABS.map((t) => ({
            key: t.key,
            label: (
              <span className='flex items-center gap-1.5 text-sm'>
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </span>
            ),
          }))}
        />
      </div>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {content}
      </QueryState>
    </div>
  );
}

function RewardSection({
  title,
  rewards,
  query,
}: {
  title: string;
  rewards: (CollectibleReward & { key: number })[];
  query: string;
}) {
  return (
    <div>
      <SectionHeading title={title} count={rewards.length} dotClassName='bg-amber-400' />
      <ResponsiveList
        data={rewards}
        columns={[
          {
            title: '數量',
            dataIndex: 'count',
            key: 'count',
            width: 90,
            render: (val: number) => (
              <Tag color='blue' className='font-mono font-bold'>
                {val}
              </Tag>
            ),
          },
          {
            title: '獎勵內容',
            dataIndex: 'reward',
            key: 'reward',
            render: (text: string) => (
              <span className='font-medium text-zinc-100'>
                <Highlight text={text} query={query} />
              </span>
            ),
          },
          {
            title: '備註',
            dataIndex: 'note',
            key: 'note',
            render: (note: string) =>
              note ? (
                <span className='text-xs text-zinc-400'>
                  <Highlight text={note} query={query} />
                </span>
              ) : null,
          },
        ]}
        renderCard={(r) => (
          <div className='flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/60 p-3'>
            <div className='flex items-center gap-3'>
              <Tag color='blue' className='!m-0 font-mono font-bold'>
                {r.count}
              </Tag>
              <span className='text-sm font-medium text-zinc-200'>
                <Highlight text={r.reward} query={query} />
              </span>
            </div>
            {r.note && (
              <span className='ml-2 text-xs text-zinc-500'>
                <Highlight text={r.note} query={query} />
              </span>
            )}
          </div>
        )}
      />
    </div>
  );
}

function SourceSection({
  title,
  items,
  query,
}: {
  title: string;
  items: (CollectibleSource & { key: number })[];
  query: string;
}) {
  return (
    <div>
      <SectionHeading title={title} count={items.length} dotClassName='bg-emerald-400' />
      <ResponsiveList
        data={items}
        columns={[
          {
            title: '# / 島嶼',
            key: 'id',
            width: 140,
            render: (_, r) => (
              <Tag color='cyan' className='font-mono'>
                {r.island ?? (r.id ? `#${r.id}` : '-')}
              </Tag>
            ),
          },
          {
            title: '取得途徑',
            dataIndex: 'source',
            key: 'source',
            render: (src: string) => (
              <span className='text-zinc-200'>
                <Highlight text={src} query={query} />
              </span>
            ),
          },
          {
            title: '特別說明',
            dataIndex: 'note',
            key: 'note',
            render: (note: string) =>
              note ? (
                <span className='text-xs text-amber-400/90'>
                  ⚠ <Highlight text={note} query={query} />
                </span>
              ) : null,
          },
        ]}
        renderCard={(it) => (
          <div className='rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-xs'>
            <div className='mb-1.5 flex items-center gap-2'>
              <Tag color='cyan' className='!m-0 font-mono'>
                {it.island ?? (it.id ? `#${it.id}` : '-')}
              </Tag>
              <span className='font-medium text-zinc-200'>
                <Highlight text={it.source} query={query} />
              </span>
            </div>
            {it.note && (
              <p className='mt-1 border-l border-amber-500/30 pl-2 text-amber-400/80'>
                {it.note}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
