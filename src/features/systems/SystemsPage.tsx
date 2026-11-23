import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, Segmented, Tabs, Tag } from 'antd';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import ResponsiveList from '@/components/ui/ResponsiveList';
import SearchInput from '@/components/ui/SearchInput';
import Toolbar from '@/components/ui/Toolbar';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetSystemsQuery } from '@/services/gameApi';
import { matchesQuery } from '@/utils/text';

const SYSTEM_TABS = [
  { key: 'accessories', label: 'T4 飾品研磨', icon: '💎' },
  { key: 'gearSystems', label: '艾利西爾／超越／卡爾瑪', icon: '🧪' },
  { key: 'merchants', label: '流浪商人傳說卡', icon: '🛒' },
] as const;

type SystemTabKey = (typeof SYSTEM_TABS)[number]['key'];
type RoleFilter = 'ALL' | '輸出 (DPS)' | '輔助 (Support)';

const isValidTab = (value: string | null): value is SystemTabKey =>
  SYSTEM_TABS.some((t) => t.key === value);

export default function SystemsPage() {
  const { data, isLoading, isError, refetch } = useGetSystemsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useSearchQuery();
  const [role, setRole] = useState<RoleFilter>('ALL');

  const tabParam = searchParams.get('tab');
  const activeTab: SystemTabKey = isValidTab(tabParam) ? tabParam : 'accessories';

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

  const filteredAccessories = useMemo(
    () =>
      (data?.accessories ?? [])
        .map((a, i) => ({ ...a, key: i }))
        .filter(
          (a) =>
            (role === 'ALL' || a.role === role) &&
            matchesQuery(query, a.slot, a.role, a.primary, a.secondary, a.note)
        ),
    [data, query, role]
  );

  const filteredGearSystems = useMemo(
    () =>
      (data?.gearSystems ?? [])
        .map((g, i) => ({ ...g, key: i }))
        .filter((g) => matchesQuery(query, g.system, g.unlock, g.goal, g.details)),
    [data, query]
  );

  const filteredMerchants = useMemo(
    () =>
      (data?.wanderingMerchants ?? [])
        .map((m, i) => ({ ...m, key: i }))
        .filter((m) => matchesQuery(query, m.continent, m.merchant, m.cards, m.note)),
    [data, query]
  );

  const currentCount =
    activeTab === 'accessories'
      ? filteredAccessories.length
      : activeTab === 'gearSystems'
        ? filteredGearSystems.length
        : filteredMerchants.length;

  return (
    <div>
      <PageHeader
        navKey='systems'
        stats={[
          { label: '指南分類', value: SYSTEM_TABS.length },
          { label: '當前項目', value: currentCount },
        ]}
      />

      <Toolbar>
        <div className='min-w-[240px] flex-1'>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder='搜尋部位、詞條、艾利西爾、卡爾瑪、流浪商人或卡片名稱…'
          />
        </div>
        {activeTab === 'accessories' && (
          <Segmented
            size='large'
            value={role}
            onChange={(v) => setRole(v as RoleFilter)}
            options={[
              { label: '全部定位', value: 'ALL' },
              { label: '輸出', value: '輸出 (DPS)' },
              { label: '輔助', value: '輔助 (Support)' },
            ]}
          />
        )}
      </Toolbar>

      <div className='mb-6'>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type='card'
          items={SYSTEM_TABS.map((t) => ({
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
        {activeTab === 'accessories' && (
          <div className='space-y-4'>
            <Alert
              type='info'
              showIcon
              className='!border-white/10 !bg-zinc-900/60 text-zinc-300'
              title='T4 飾品研磨規則'
              description='T4 飾品已移除隨機刻印，改為分解碎片後對高品（建議 67+）飾品進行詞條研磨（分下／中／上等階），並提供方舟被動「領悟」點數。'
            />
            {filteredAccessories.length === 0 ? (
              <EmptyResult query={query} onReset={() => { setQuery(''); setRole('ALL'); }} />
            ) : (
              <ResponsiveList
                data={filteredAccessories}
                columns={[
                  {
                    title: '部位',
                    dataIndex: 'slot',
                    key: 'slot',
                    width: 150,
                    render: (t: string) => (
                      <span className='font-bold text-zinc-100'>
                        <Highlight text={t} query={query} />
                      </span>
                    ),
                  },
                  {
                    title: '定位',
                    dataIndex: 'role',
                    key: 'role',
                    width: 130,
                    render: (r: string) => (
                      <Tag color={r.includes('DPS') ? 'volcano' : 'cyan'}>
                        <Highlight text={r} query={query} />
                      </Tag>
                    ),
                  },
                  {
                    title: '畢業核心大詞條',
                    dataIndex: 'primary',
                    key: 'primary',
                    render: (t: string) => (
                      <span className='font-semibold text-amber-300'>
                        <Highlight text={t} query={query} />
                      </span>
                    ),
                  },
                  {
                    title: '次選參考',
                    dataIndex: 'secondary',
                    key: 'secondary',
                    render: (t: string) => (
                      <span className='text-zinc-400'>
                        <Highlight text={t} query={query} />
                      </span>
                    ),
                  },
                  {
                    title: '說明',
                    dataIndex: 'note',
                    key: 'note',
                    render: (n: string) => (
                      <span className='text-xs text-zinc-400'>
                        <Highlight text={n} query={query} />
                      </span>
                    ),
                  },
                ]}
                renderCard={(a) => (
                  <div className='space-y-1.5 rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-xs'>
                    <div className='flex items-center justify-between gap-2'>
                      <span className='font-bold text-zinc-100'>
                        <Highlight text={a.slot} query={query} />
                      </span>
                      <Tag color={a.role.includes('DPS') ? 'volcano' : 'cyan'} className='!m-0'>
                        <Highlight text={a.role} query={query} />
                      </Tag>
                    </div>
                    <p className='font-semibold text-amber-300'>
                      核心：<Highlight text={a.primary} query={query} />
                    </p>
                    <p className='text-zinc-400'>
                      次選：<Highlight text={a.secondary} query={query} />
                    </p>
                    <p className='text-[11px] text-zinc-500'>
                      <Highlight text={a.note} query={query} />
                    </p>
                  </div>
                )}
              />
            )}
          </div>
        )}

        {activeTab === 'gearSystems' &&
          (filteredGearSystems.length === 0 ? (
            <EmptyResult query={query} onReset={() => setQuery('')} />
          ) : (
            <div className='grid gap-4 md:grid-cols-2'>
              {filteredGearSystems.map((item) => (
                <div key={item.key} className='surface space-y-3 p-5'>
                  <div className='flex flex-wrap items-center justify-between gap-2'>
                    <h3 className='text-base font-bold text-zinc-100'>
                      <Highlight text={item.system} query={query} />
                    </h3>
                    <Tag color='blue' className='!m-0 font-mono'>
                      <Highlight text={item.unlock} query={query} />
                    </Tag>
                  </div>
                  <p className='rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-200 ring-1 ring-inset ring-amber-400/20'>
                    目標：<Highlight text={item.goal} query={query} />
                  </p>
                  <p className='text-xs leading-relaxed text-zinc-300'>
                    <Highlight text={item.details} query={query} />
                  </p>
                </div>
              ))}
            </div>
          ))}

        {activeTab === 'merchants' && (
          <div className='space-y-4'>
            <Alert
              type='warning'
              showIcon
              className='!border-amber-500/30 !bg-amber-500/10 text-amber-200'
              title='流浪商人出現規則與狩獵技巧'
              description='每次出現持續 5 小時 30 分鐘、全頻道同步庫存；傳說卡片售價 100,000 銀幣。建議把分身停在愛尼茨（韋毅）與約恩（巴亨圖爾），並配合社群通報（如 lostmerchants.com 或 Discord）搶卡！'
            />
            {filteredMerchants.length === 0 ? (
              <EmptyResult query={query} onReset={() => setQuery('')} />
            ) : (
              <ResponsiveList
                data={filteredMerchants}
                columns={[
                  {
                    title: '大陸',
                    dataIndex: 'continent',
                    key: 'continent',
                    width: 130,
                    render: (t: string) => (
                      <Tag color='geekblue' className='font-semibold'>
                        <Highlight text={t} query={query} />
                      </Tag>
                    ),
                  },
                  {
                    title: '商人名稱',
                    dataIndex: 'merchant',
                    key: 'merchant',
                    width: 150,
                    render: (t: string) => <Highlight text={t} query={query} />,
                  },
                  {
                    title: '重點卡片',
                    dataIndex: 'cards',
                    key: 'cards',
                    render: (t: string) => (
                      <span className='font-medium text-sky-300'>
                        <Highlight text={t} query={query} />
                      </span>
                    ),
                  },
                  {
                    title: '備註',
                    dataIndex: 'note',
                    key: 'note',
                    render: (n: string) =>
                      n ? (
                        <span className='text-xs text-amber-300/90'>
                          <Highlight text={n} query={query} />
                        </span>
                      ) : null,
                  },
                ]}
                renderCard={(m) => (
                  <div className='space-y-1.5 rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-xs'>
                    <div className='flex items-center justify-between gap-2'>
                      <Tag color='geekblue' className='!m-0 font-semibold'>
                        <Highlight text={m.continent} query={query} />
                      </Tag>
                      <span className='text-zinc-400'>
                        <Highlight text={m.merchant} query={query} />
                      </span>
                    </div>
                    <p className='font-medium text-sky-300'>
                      <Highlight text={m.cards} query={query} />
                    </p>
                    {m.note && (
                      <p className='text-[11px] text-amber-300/80'>
                        <Highlight text={m.note} query={query} />
                      </p>
                    )}
                  </div>
                )}
              />
            )}
          </div>
        )}
      </QueryState>
    </div>
  );
}
