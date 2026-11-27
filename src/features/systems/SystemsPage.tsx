import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Segmented } from 'antd';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import ResponsiveList from '@/components/ui/ResponsiveList';
import SearchInput from '@/components/ui/SearchInput';
import Toolbar from '@/components/ui/Toolbar';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetSystemsQuery } from '@/services/gameApi';
import { cx } from '@/utils/cx';
import { matchesQuery } from '@/utils/text';

const SYSTEM_TABS = [
  { key: 'accessories', label: 'T4 飾品研磨', sub: '下 / 中 / 上精確數值' },
  { key: 'bracelets', label: 'T4 手鐲詞條', sub: '飛躍點數 ＆ S 級特效' },
  { key: 'gearSystems', label: '八大養成系統', sub: '鍊金 / 超越 / 護腕 / 寶石' },
  { key: 'merchants', label: '19 洲流浪商人', sub: '必蹲傳說卡清單' },
] as const;

type SystemTabKey = (typeof SYSTEM_TABS)[number]['key'];
type RoleFilter = 'ALL' | '輸出 (DPS)' | '輔助 (Support)';
type MerchantFilter = 'ALL' | '必蹲傳說' | '圖鑑核心';

const isValidTab = (value: string | null): value is SystemTabKey =>
  SYSTEM_TABS.some((t) => t.key === value);

export default function SystemsPage() {
  const { data, isLoading, isError, refetch } = useGetSystemsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useSearchQuery();
  const [role, setRole] = useState<RoleFilter>('ALL');
  const [merchantPriority, setMerchantPriority] = useState<MerchantFilter>('ALL');

  const tabParam = searchParams.get('tab');
  const activeTab: SystemTabKey = isValidTab(tabParam) ? tabParam : 'accessories';

  const setActiveTab = (key: SystemTabKey) => {
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
            matchesQuery(query, a.slot, a.role, a.primary, a.secondary, a.rolls, a.note)
        ),
    [data, query, role]
  );

  const filteredBracelets = useMemo(
    () =>
      (data?.bracelets ?? [])
        .map((b, i) => ({ ...b, key: i }))
        .filter(
          (b) =>
            (role === 'ALL' || b.role === role || b.role === '通用核心') &&
            matchesQuery(query, b.name, b.role, b.tier, b.effect, b.note)
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
        .filter(
          (m) =>
            (merchantPriority === 'ALL' || m.priority === merchantPriority) &&
            matchesQuery(query, m.continent, m.merchant, m.priority, m.cards, m.note)
        ),
    [data, query, merchantPriority]
  );

  const currentCount =
    activeTab === 'accessories'
      ? filteredAccessories.length
      : activeTab === 'bracelets'
        ? filteredBracelets.length
        : activeTab === 'gearSystems'
          ? filteredGearSystems.length
          : filteredMerchants.length;

  return (
    <div>
      <PageHeader
        navKey='systems'
        stats={[
          { label: '指南分類', value: SYSTEM_TABS.length },
          { label: '收錄大陸商人', value: data?.wanderingMerchants.length ?? 19 },
          { label: '顯示項目', value: currentCount },
        ]}
      />

      <div
        role='tablist'
        aria-label='養成與配裝分類'
        className='mb-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4'
      >
        {SYSTEM_TABS.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              type='button'
              role='tab'
              aria-selected={isActive}
              onClick={() => setActiveTab(t.key)}
              className={cx(
                'focus-ring rounded-2xl border p-4 text-left transition-all',
                isActive
                  ? 'border-brand bg-brand/12 shadow-sm'
                  : 'border-line bg-surface hover:border-brand/45'
              )}
            >
              <span
                className={cx(
                  'block text-base font-bold',
                  isActive ? 'text-brand' : 'text-ink'
                )}
              >
                {t.label}
              </span>
              <span className='mt-1 block text-xs text-muted'>{t.sub}</span>
            </button>
          );
        })}
      </div>

      <Toolbar>
        <div className='min-w-[240px] flex-1'>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder='搜尋部位、手鐲詞條（優越/匕首/弱點曝光）、護腕、卡爾瑪或流浪商人卡片（瓦爾格里斯/瓦爾坎）…'
          />
        </div>

        {(activeTab === 'accessories' || activeTab === 'bracelets') && (
          <Segmented
            size='large'
            value={role}
            onChange={(v) => setRole(v as RoleFilter)}
            options={[
              { label: '全部定位', value: 'ALL' },
              { label: '輸出 (DPS)', value: '輸出 (DPS)' },
              { label: '輔助 (Support)', value: '輔助 (Support)' },
            ]}
          />
        )}

        {activeTab === 'merchants' && (
          <Segmented
            size='large'
            value={merchantPriority}
            onChange={(v) => setMerchantPriority(v as MerchantFilter)}
            options={[
              { label: '全部 19 洲', value: 'ALL' },
              { label: '必蹲傳說卡', value: '必蹲傳說' },
              { label: '圖鑑核心', value: '圖鑑核心' },
            ]}
          />
        )}
      </Toolbar>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {activeTab === 'accessories' && (
          <div className='space-y-6'>
            <div className='surface border-l-4 border-l-brand p-5 text-sm leading-relaxed text-sub'>
              <strong className='text-ink'>T4 飾品研磨重點：</strong>
              飾品品質達 <strong>67 以上</strong>即可拿滿「領悟」方舟被動點數（1680 古代飾品滿研磨共提供 +72 點：項鍊 24、耳環各 22、戒指各 22）。每件飾品可研磨 3 次，詞條分為下／中／上三階。
            </div>

            {filteredAccessories.length === 0 ? (
              <EmptyResult
                query={query}
                onReset={() => {
                  setQuery('');
                  setRole('ALL');
                }}
              />
            ) : (
              <div className='grid gap-6 md:grid-cols-2'>
                {filteredAccessories.map((a) => {
                  const isDps = a.role.includes('DPS');
                  return (
                    <article key={a.key} className='surface flex flex-col justify-between p-6'>
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between gap-3 border-b border-line pb-3.5'>
                          <h3 className='text-lg font-bold text-ink'>
                            <Highlight text={a.slot} query={query} />
                          </h3>
                          <span className={cx('chip text-xs', isDps ? 'tone-rose' : 'tone-sky')}>
                            <Highlight text={a.role} query={query} />
                          </span>
                        </div>

                        <div className='space-y-1'>
                          <span className='text-xs font-medium text-muted'>畢業首選詞條</span>
                          <p className='text-base font-bold text-brand'>
                            <Highlight text={a.primary} query={query} />
                          </p>
                        </div>

                        {a.rolls && (
                          <div className='subsurface px-4 py-3 font-mono text-xs leading-relaxed text-ink'>
                            下 / 中 / 上數值：<Highlight text={a.rolls} query={query} />
                          </div>
                        )}

                        <p className='text-sm text-sub'>
                          次選過渡：<Highlight text={a.secondary} query={query} />
                        </p>
                      </div>

                      <p className='mt-5 border-t border-line pt-3.5 text-xs leading-relaxed text-muted'>
                        <Highlight text={a.note} query={query} />
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bracelets' && (
          <div className='space-y-6'>
            <div className='surface border-l-4 border-l-brand p-5 text-sm leading-relaxed text-sub'>
              <strong className='text-ink'>T4 手鐲挑選與重鑄重點：</strong>
              T4 手鐲直接決定方舟被動第 3 頁<strong>「飛躍（Leap）」</strong>點數上限（遺物 +9～18、1680 古代 +18～21），用以強化 T 鍵超覺醒技！挑選胚子以「雙高戰鬥特性 ＋ 3 個隨機槽」為最佳起手。
            </div>

            {filteredBracelets.length === 0 ? (
              <EmptyResult
                query={query}
                onReset={() => {
                  setQuery('');
                  setRole('ALL');
                }}
              />
            ) : (
              <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
                {filteredBracelets.map((b) => (
                  <article key={b.key} className='surface flex flex-col justify-between p-6'>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between gap-2'>
                        <span
                          className={cx(
                            'chip font-mono text-xs font-bold',
                            b.tier === 'S' ? 'tone-gold' : 'tone-purple'
                          )}
                        >
                          {b.tier} 級推薦
                        </span>
                        <span
                          className={cx(
                            'chip text-xs',
                            b.role.includes('Support')
                              ? 'tone-sky'
                              : b.role.includes('DPS')
                                ? 'tone-rose'
                                : 'tone-emerald'
                          )}
                        >
                          {b.role}
                        </span>
                      </div>

                      <h3 className='text-lg font-bold text-ink'>
                        <Highlight text={b.name} query={query} />
                      </h3>
                      <p className='text-sm leading-relaxed text-sub'>
                        <Highlight text={b.effect} query={query} />
                      </p>
                    </div>

                    <p className='mt-5 border-t border-line pt-3.5 text-xs leading-relaxed text-muted'>
                      <Highlight text={b.note} query={query} />
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'gearSystems' &&
          (filteredGearSystems.length === 0 ? (
            <EmptyResult query={query} onReset={() => setQuery('')} />
          ) : (
            <div className='grid gap-6 md:grid-cols-2'>
              {filteredGearSystems.map((item) => (
                <article key={item.key} className='surface overflow-hidden'>
                  <div className='flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle/60 px-6 py-4'>
                    <h3 className='text-base font-bold text-ink'>
                      <Highlight text={item.system} query={query} />
                    </h3>
                    <span className='meta-tag font-mono text-brand'>
                      <Highlight text={item.unlock} query={query} />
                    </span>
                  </div>
                  <div className='space-y-4 p-6'>
                    <p className='subsurface border-l-4 border-l-brand px-4 py-2.5 text-sm font-semibold text-ink'>
                      畢業目標：<Highlight text={item.goal} query={query} />
                    </p>
                    <p className='text-sm leading-relaxed text-sub'>
                      <Highlight text={item.details} query={query} />
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ))}

        {activeTab === 'merchants' && (
          <div className='space-y-6'>
            <div className='surface border-l-4 border-l-brand p-5 text-sm leading-relaxed text-sub'>
              <strong className='text-ink'>流浪商人刷新與狩獵情報：</strong>
              全大陸商人每輪駐留 <strong>5 小時 30 分鐘</strong>、全頻道同步庫存，傳說卡售價 <strong>100,000 銀幣</strong>。光救／風絕壁未滿優先蹲守<strong>愛尼茨（韋毅）</strong>、<strong>約恩（巴亨圖爾）</strong>、<strong>盧特蘭東部（德隆阿曼）</strong>；後期撐惡魔傷 % 務必緊盯<strong>愛迦希亞（瓦爾格里斯）</strong>、<strong>伏爾戴克（瓦爾坎）</strong>與<strong>普雷奇亞（少年阿曼）</strong>！
            </div>

            {filteredMerchants.length === 0 ? (
              <EmptyResult
                query={query}
                onReset={() => {
                  setQuery('');
                  setMerchantPriority('ALL');
                }}
              />
            ) : (
              <ResponsiveList
                data={filteredMerchants}
                columns={[
                  {
                    title: '大陸',
                    dataIndex: 'continent',
                    key: 'continent',
                    width: 150,
                    render: (t: string) => (
                      <span className='meta-tag'>
                        <Highlight text={t} query={query} />
                      </span>
                    ),
                  },
                  {
                    title: '優先級',
                    dataIndex: 'priority',
                    key: 'priority',
                    width: 120,
                    render: (p?: string) => (
                      <span
                        className={cx(
                          'chip text-xs',
                          p === '必蹲傳說'
                            ? 'tone-relic'
                            : p === '圖鑑核心'
                              ? 'tone-sky'
                              : 'tone-neutral'
                        )}
                      >
                        {p ?? '區域收集'}
                      </span>
                    ),
                  },
                  {
                    title: '商人名稱',
                    dataIndex: 'merchant',
                    key: 'merchant',
                    width: 180,
                    render: (t: string) => (
                      <span className='text-sm text-ink'>
                        <Highlight text={t} query={query} />
                      </span>
                    ),
                  },
                  {
                    title: '重點販售卡片',
                    dataIndex: 'cards',
                    key: 'cards',
                    render: (t: string) => (
                      <span className='text-sm font-semibold text-brand'>
                        <Highlight text={t} query={query} />
                      </span>
                    ),
                  },
                  {
                    title: '備註說明',
                    dataIndex: 'note',
                    key: 'note',
                    render: (n: string) =>
                      n ? (
                        <span className='text-xs leading-relaxed text-sub'>
                          <Highlight text={n} query={query} />
                        </span>
                      ) : null,
                  },
                ]}
                renderCard={(m) => (
                  <div className='surface space-y-2.5 p-5'>
                    <div className='flex items-center justify-between gap-2'>
                      <span className='meta-tag'>
                        <Highlight text={m.continent} query={query} />
                      </span>
                      <span
                        className={cx(
                          'chip text-xs',
                          m.priority === '必蹲傳說'
                            ? 'tone-relic'
                            : m.priority === '圖鑑核心'
                              ? 'tone-sky'
                              : 'tone-neutral'
                        )}
                      >
                        {m.priority ?? '區域收集'}
                      </span>
                    </div>
                    <p className='text-xs text-muted'>
                      商人：<Highlight text={m.merchant} query={query} />
                    </p>
                    <p className='text-sm font-bold text-brand'>
                      <Highlight text={m.cards} query={query} />
                    </p>
                    {m.note && (
                      <p className='text-xs leading-relaxed text-sub'>
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
