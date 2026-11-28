import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Switch } from 'antd';
import { CloseOutlined, PushpinFilled, PushpinOutlined } from '@ant-design/icons';
import AnchorJumpCloud from '@/components/ui/AnchorJumpCloud';
import DataCard3Zone, { type CardScopeBadge } from '@/components/ui/DataCard3Zone';
import EmptyResult from '@/components/ui/EmptyResult';
import GlyphIcon from '@/components/ui/GlyphIcon';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import SearchInput from '@/components/ui/SearchInput';
import SectionHeading from '@/components/ui/SectionHeading';
import StatRangeText from '@/components/ui/StatRangeText';
import Toolbar, { type ConstraintMode } from '@/components/ui/Toolbar';
import { getRaidKey, useLocalTracker } from '@/hooks/useLocalTracker';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetRaidChestsQuery } from '@/services/gameApi';
import type { RaidDifficulty, RaidInfo } from '@/types/game';
import { cx } from '@/utils/cx';
import { matchesWithAliases, toAnchorId } from '@/utils/slug';

type TierFilter = 'ALL' | 'T3' | 'T4';
type DifficultyFilter = 'ALL' | RaidDifficulty;
type ScaleFilter = 'ALL' | '4人' | '8人' | '16人' | 'SOLO';
type ViewMode = 'all' | 'mechanics' | 'ledger';
type IlvlThreshold = 'ALL' | '1580' | '1620' | '1660' | '1680' | '1700' | '1730' | '1750';

const ILVL_BRACKETS: ReadonlyArray<readonly [IlvlThreshold, string, number, number]> = [
  ['ALL', '不限裝等', 0, 9999],
  ['1580', '1415–1580', 1415, 1580],
  ['1620', '1600–1630', 1600, 1630],
  ['1660', '1640–1660', 1640, 1660],
  ['1680', '1670–1680', 1670, 1680],
  ['1700', '1690–1700', 1690, 1700],
  ['1730', '1710–1730', 1710, 1730],
  ['1750', '1740–1780', 1740, 1780],
];

const PRESET_COMBOS = [
  {
    label: '1680–1700 三本',
    keys: ['Brelshaza Act 2|困難', 'Mordum Act 3|困難', 'Armoche Act 4|普通'],
  },
  {
    label: '1710–1730 三本',
    keys: ['Armoche Act 4|困難', 'Kazeros Denouement|困難', 'Shadow Raid: Serca|困難'],
  },
  {
    label: '1750+ 頂裝三本',
    keys: ['Kazeros Denouement|困難', 'Shadow Raid: Serca|惡夢', 'Shadow Raid: Belgardin|普通'],
  },
  {
    label: '1780 巔峰三本',
    keys: ['Kazeros Denouement|困難', 'Shadow Raid: Serca|惡夢', 'Shadow Raid: Belgardin|惡夢'],
  },
] as const;

export default function RaidChestsPage() {
  const { data, isLoading, isError, refetch } = useGetRaidChestsQuery();
  const { state, togglePinnedRaid, setPinnedRaids, setRosterChars } = useLocalTracker();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useSearchQuery();

  const tierParam = searchParams.get('tier');
  const diffParam = searchParams.get('diff');
  const scaleParam = searchParams.get('scale');
  const ilvlParam = searchParams.get('ilvl');
  const modeParam = searchParams.get('mode');
  const viewParam = searchParams.get('view');

  const tier: TierFilter = tierParam === 'T3' || tierParam === 'T4' ? tierParam : 'ALL';
  const difficulty: DifficultyFilter =
    diffParam === '普通' || diffParam === '困難' || diffParam === '惡夢' ? diffParam : 'ALL';
  const scale: ScaleFilter =
    scaleParam === '4人' || scaleParam === '8人' || scaleParam === '16人' || scaleParam === 'SOLO'
      ? scaleParam
      : 'ALL';
  const ilvlFilter: IlvlThreshold = ILVL_BRACKETS.some(([k]) => k === ilvlParam)
    ? (ilvlParam as IlvlThreshold)
    : 'ALL';
  const constraintMode: ConstraintMode = modeParam === 'exact' ? 'exact' : 'ceiling';
  const viewMode: ViewMode =
    viewParam === 'mechanics' || viewParam === 'ledger' ? viewParam : 'all';

  const setParam = (key: string, value: string, defaultVal = 'ALL') => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === defaultVal) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true }
    );
  };

  const pinnedRaidObjects = useMemo(() => {
    if (!data) return [];
    return state.pinnedRaids
      .map((key) => data.raids.find((r) => getRaidKey(r.nameEn, r.difficulty) === key))
      .filter((r): r is RaidInfo => Boolean(r));
  }, [data, state.pinnedRaids]);

  const singleCharClearGold = pinnedRaidObjects.reduce((s, r) => s + r.totalGold, 0);
  const singleCharNetGold = pinnedRaidObjects.reduce((s, r) => s + r.netGold, 0);

  const filteredRaids = useMemo(() => {
    if (!data) return [];
    const bracket = ILVL_BRACKETS.find(([k]) => k === ilvlFilter);

    return data.raids.filter((raid) => {
      const matchTier = tier === 'ALL' || raid.tier === tier;
      const matchDiff = difficulty === 'ALL' || (raid.difficulty ?? '普通') === difficulty;
      const matchScale =
        scale === 'ALL'
          ? true
          : scale === 'SOLO'
            ? Boolean(raid.soloAvailable)
            : raid.partySize === scale;

      let matchIlvl = true;
      if (bracket && ilvlFilter !== 'ALL') {
        const [, , minIlvl, maxIlvl] = bracket;
        matchIlvl =
          constraintMode === 'ceiling'
            ? raid.ilvl <= maxIlvl
            : raid.ilvl >= minIlvl && raid.ilvl <= maxIlvl;
      }

      const matchText = matchesWithAliases(
        query,
        raid.name,
        raid.nameEn,
        raid.ilvl,
        raid.tier,
        raid.difficulty,
        raid.partySize,
        raid.weakness,
        raid.sidereals,
        raid.battleItems,
        raid.soloAvailable ? '單人模式 solo' : '',
        raid.boundGoldNote,
        raid.recommendation,
        raid.gates.map((g) => `${g.gate} ${g.boss ?? ''} ${g.chestContents} ${(g.mechanics ?? []).join(' ')}`)
      );
      return matchTier && matchDiff && matchScale && matchIlvl && matchText;
    });
  }, [data, query, tier, difficulty, scale, ilvlFilter, constraintMode]);

  const activeFilters = useMemo(() => {
    const list: string[] = [];
    if (query.trim()) list.push(`關鍵字: ${query.trim()}`);
    if (tier !== 'ALL') list.push(`世代: ${tier}`);
    if (difficulty !== 'ALL') list.push(`難度: ${difficulty}`);
    if (scale !== 'ALL') list.push(`規模: ${scale === 'SOLO' ? '支援單人' : scale}`);
    if (ilvlFilter !== 'ALL') {
      const b = ILVL_BRACKETS.find(([k]) => k === ilvlFilter);
      list.push(
        constraintMode === 'ceiling'
          ? `裝等 ≤ ${b?.[3] ?? ilvlFilter}`
          : `裝等區間 ${b?.[1] ?? ilvlFilter}`
      );
    }
    return list;
  }, [query, tier, difficulty, scale, ilvlFilter, constraintMode]);

  const anchorItems = useMemo(
    () =>
      filteredRaids.map((r) => ({
        id: toAnchorId('raid', `${r.nameEn}-${r.difficulty ?? '普通'}`),
        label: `${r.name.split(' ')[0]} (${r.difficulty ?? '普通'})`,
        sub: String(r.ilvl),
      })),
    [filteredRaids]
  );

  const resetAll = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams();
        const v = prev.get('view');
        if (v) next.set('view', v);
        return next;
      },
      { replace: true }
    );
  };

  return (
    <div>
      <PageHeader
        navKey='raidChests'
        stats={[
          { label: '收錄副本', value: data?.raids.length ?? 0 },
          { label: '週常排程', value: `${pinnedRaidObjects.length}/3` },
          { label: '顯示筆數', value: filteredRaids.length },
        ]}
      />

      {/* 每週 3 本排程試算面板（純血條機制檢視時自動收斂為緊湊列） */}
      {viewMode !== 'mechanics' && (
        <section aria-label='每週三本金幣排程試算' className='surface mb-4 p-3.5'>
          <div className='flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2'>
            <div className='section-bar-category flex flex-wrap items-baseline gap-2'>
              <h2 className='text-[14px] font-semibold text-ink'>遠征隊每週 3 本排程試算</h2>
              <span className='text-xs text-muted'>點擊卡片「排入週常」或一鍵套用裝等模板</span>
            </div>

            <div className='flex flex-wrap items-center gap-1.5'>
              {PRESET_COMBOS.map((preset) => (
                <button
                  key={preset.label}
                  type='button'
                  onClick={() => setPinnedRaids([...preset.keys])}
                  className='filter-chip focus-ring text-xs'
                >
                  {preset.label}
                </button>
              ))}
              {pinnedRaidObjects.length > 0 && (
                <button
                  type='button'
                  onClick={() => setPinnedRaids([])}
                  className='focus-ring rounded-sm border border-danger/45 bg-danger/10 px-2 py-1 text-xs font-medium text-danger'
                >
                  清空
                </button>
              )}
            </div>
          </div>

          <div className='mt-2.5 grid gap-3 lg:grid-cols-12 lg:items-center'>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 lg:col-span-7'>
              {[0, 1, 2].map((slotIdx) => {
                const raid = pinnedRaidObjects[slotIdx];
                return (
                  <div
                    key={slotIdx}
                    className={cx(
                      'flex min-h-[60px] flex-col justify-between rounded-md border px-3 py-2 text-xs',
                      raid ? 'border-active/60 bg-well' : 'border-dashed border-line-strong bg-well/40'
                    )}
                  >
                    {raid ? (
                      <>
                        <div className='flex items-start justify-between gap-1.5'>
                          <span className='truncate font-semibold text-gold'>
                            {raid.name.split(' ')[0]}
                          </span>
                          <button
                            type='button'
                            aria-label={`移除 ${raid.name}`}
                            onClick={() => togglePinnedRaid(getRaidKey(raid.nameEn, raid.difficulty))}
                            className='text-muted hover:text-danger'
                          >
                            <CloseOutlined className='text-[10px]' />
                          </button>
                        </div>
                        <div className='mt-1 flex items-center justify-between font-mono tabular-nums'>
                          <span className='text-sub'>
                            {raid.difficulty ?? '普通'} · {raid.ilvl}
                          </span>
                          <span className='font-semibold text-roll'>
                            +{raid.totalGold.toLocaleString()} G
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className='my-auto text-center font-mono text-muted'>
                        SLOT 0{slotIdx + 1} · 未選擇
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className='flex flex-col gap-2 border-t border-line pt-2.5 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0'>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-sub'>遠征隊領金角色數：</span>
                <div className='flex items-center gap-1'>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      type='button'
                      onClick={() => setRosterChars(n)}
                      className={cx(
                        'focus-ring size-7 rounded-sm border font-mono text-xs font-semibold tabular-nums',
                        state.rosterChars === n
                          ? 'filter-chip-active'
                          : 'border-line bg-well text-sub hover:text-ink'
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-2 rounded-md border border-line bg-well px-3 py-1.5 font-mono tabular-nums'>
                <div>
                  <span className='block font-sans text-[11px] text-muted'>
                    不開箱總金 ({state.rosterChars}角)
                  </span>
                  <strong className='text-[14px] font-semibold text-roll sm:text-[15px]'>
                    +{(singleCharClearGold * state.rosterChars).toLocaleString()} G
                  </strong>
                </div>
                <div>
                  <span className='block font-sans text-[11px] text-muted'>
                    全開箱淨收 ({state.rosterChars}角)
                  </span>
                  <strong className='text-[14px] font-semibold text-setgreen sm:text-[15px]'>
                    +{(singleCharNetGold * state.rosterChars).toLocaleString()} G
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* URL 同步多維度複合切換列 + 裝等門檻模式切換器 */}
      <Toolbar
        shownCount={filteredRaids.length}
        totalCount={data?.raids.length ?? 0}
        activeFilters={activeFilters}
        onReset={resetAll}
        constraintMode={{
          mode: constraintMode,
          onChange: (m) => setParam('mode', m, 'ceiling'),
          ceilingLabel: '≤ 當前裝等可入場',
          exactLabel: '= 該裝等區間',
        }}
      >
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <div className='flex-1'>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder='即時過濾：輸入首領俗稱（牛頭/阿布/卡門/蛇女）、血條（x130/x420）、聯手技或材料…'
            />
          </div>

          {/* 檢視模式切換 */}
          <div
            role='tablist'
            aria-label='卡片內容檢視模式'
            className='inline-flex shrink-0 items-center rounded-md border border-line-strong bg-well p-0.5 text-xs'
          >
            {(
              [
                ['all', '機制＋帳本'],
                ['mechanics', '純血條機制'],
                ['ledger', '純開箱帳本'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type='button'
                role='tab'
                aria-selected={viewMode === val}
                onClick={() => setParam('view', val, 'all')}
                className={cx(
                  'focus-ring rounded-sm px-2.5 py-1.5 font-medium transition-colors duration-fast',
                  viewMode === val ? 'bg-active/[0.22] font-semibold text-ink' : 'text-sub hover:text-ink'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-xs'>
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='font-semibold text-muted'>世代：</span>
            {(
              [
                ['ALL', '全部'],
                ['T4', 'T4 卡札羅斯＆暗影'],
                ['T3', 'T3 軍團長'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type='button'
                onClick={() => setParam('tier', val)}
                className={cx('filter-chip focus-ring', tier === val && 'filter-chip-active')}
              >
                {label}
              </button>
            ))}
          </div>

          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='font-semibold text-muted'>難度：</span>
            {(['ALL', '普通', '困難', '惡夢'] as const).map((val) => (
              <button
                key={val}
                type='button'
                onClick={() => setParam('diff', val)}
                className={cx('filter-chip focus-ring', difficulty === val && 'filter-chip-active')}
              >
                {val === 'ALL' ? '全部' : val}
              </button>
            ))}
          </div>

          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='font-semibold text-muted'>規模：</span>
            {(
              [
                ['ALL', '全部'],
                ['4人', '4人'],
                ['8人', '8人'],
                ['16人', '16人'],
                ['SOLO', '支援單人'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type='button'
                onClick={() => setParam('scale', val)}
                className={cx('filter-chip focus-ring', scale === val && 'filter-chip-active')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-1.5 text-xs'>
          <span className='font-semibold text-muted'>裝等門檻：</span>
          {ILVL_BRACKETS.map(([val, label, , maxVal]) => (
            <button
              key={val}
              type='button'
              onClick={() => setParam('ilvl', val)}
              className={cx('filter-chip focus-ring font-mono tabular-nums', ilvlFilter === val && 'filter-chip-active')}
            >
              {val === 'ALL'
                ? label
                : constraintMode === 'ceiling'
                  ? `≤ ${maxVal}`
                  : label}
            </button>
          ))}
        </div>
      </Toolbar>

      {/* 行內快速跳轉錨點標籤雲 */}
      <AnchorJumpCloud items={anchorItems} title='副本快速跳轉' />

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {filteredRaids.length === 0 ? (
          <EmptyResult query={query} activeFilters={activeFilters} onReset={resetAll} />
        ) : (
          <div className='space-y-3.5'>
            {filteredRaids.map((raid) => {
              const raidKey = getRaidKey(raid.nameEn, raid.difficulty);
              return (
                <RaidCard3Zone
                  key={raidKey}
                  raid={raid}
                  query={query}
                  viewMode={viewMode}
                  pinned={state.pinnedRaids.includes(raidKey)}
                  onTogglePin={() => togglePinnedRaid(raidKey)}
                />
              );
            })}

            {data?.notes && (
              <section className='surface p-3.5'>
                <SectionHeading title='襲擊戰機制與綁定金結算備註' />
                <ul className='space-y-1.5 text-[13px] text-sub'>
                  {data.notes.map((note, idx) => (
                    <li key={idx} className='flex items-start gap-2'>
                      <span className='text-magic'>⬩</span>
                      <span>
                        <StatRangeText text={note} />
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </QueryState>
    </div>
  );
}

function resolveScopeBadge(raid: RaidInfo): CardScopeBadge | undefined {
  if (raid.boundGoldNote) return { label: '全額角色綁金', tone: 'warning' };
  if (raid.difficulty === '惡夢') return { label: '惡夢無復活', tone: 'danger' };
  if (raid.soloAvailable) return { label: '支援單人', tone: 'group' };
  return undefined;
}

function RaidCard3Zone({
  raid,
  query,
  viewMode,
  pinned,
  onTogglePin,
}: {
  raid: RaidInfo;
  query: string;
  viewMode: ViewMode;
  pinned: boolean;
  onTogglePin: () => void;
}) {
  const [openChests, setOpenChests] = useState<boolean[]>(() => raid.gates.map(() => true));

  const toggleGate = (index: number, checked: boolean) => {
    setOpenChests((prev) => prev.map((v, i) => (i === index ? checked : v)));
  };

  const setAll = (checked: boolean) => {
    setOpenChests(raid.gates.map(() => checked));
  };

  const selectedChestCost = raid.gates.reduce(
    (sum, g, i) => sum + (openChests[i] ? g.chestCost : 0),
    0
  );
  const netGold = raid.totalGold - selectedChestCost;
  const profitRate = raid.totalGold > 0 ? Math.round((netGold / raid.totalGold) * 100) : 0;
  const openCount = openChests.filter(Boolean).length;
  const anchorId = toAnchorId('raid', `${raid.nameEn}-${raid.difficulty ?? '普通'}`);
  const showMechanics = viewMode !== 'ledger';
  const showLedger = viewMode !== 'mechanics';

  return (
    <DataCard3Zone
      id={anchorId}
      highlighted={pinned}
      scopeBadge={resolveScopeBadge(raid)}
      title={<Highlight text={raid.name} query={query} />}
      subtitleEn={
        <>
          <Highlight text={raid.nameEn} query={query} /> · {raid.difficulty ?? '普通'}
        </>
      }
      headerActions={
        <>
          <button
            type='button'
            onClick={onTogglePin}
            aria-pressed={pinned}
            className={cx('filter-chip focus-ring py-1 text-xs', pinned && 'filter-chip-active')}
          >
            {pinned ? <PushpinFilled className='text-gold' /> : <PushpinOutlined />}
            <span>{pinned ? '已排週常' : '排入週常'}</span>
          </button>
          {showLedger && (
            <button
              type='button'
              onClick={() => setAll(openCount < raid.gates.length)}
              className='filter-chip focus-ring py-1 text-xs'
            >
              {openCount < raid.gates.length ? '全開箱' : '全不開'}
            </button>
          )}
        </>
      }
      visual={
        <div className='flex flex-col items-center justify-center gap-0.5 text-center'>
          <GlyphIcon
            name={viewMode === 'mechanics' ? 'mechanic' : 'raid'}
            className={raid.tier === 'T4' ? 'size-5 text-gold' : 'size-5 text-sub'}
          />
          <span className='font-mono text-xs font-semibold tabular-nums text-roll'>{raid.ilvl}</span>
        </div>
      }
      baseSpecs={[
        { label: '入場裝等', value: raid.ilvl, highlight: true },
        {
          label: '規模 / 世代',
          value: `${raid.partySize ?? '8人'} · ${raid.tier ?? 'T3'}`,
        },
        ...(raid.weakness
          ? [
              {
                label: '屬性弱點',
                value: (
                  <Link
                    to='/game/miscGuide?section=cardSets'
                    className='text-magic hover:underline'
                    title='查看剋制屬性卡組'
                  >
                    {raid.weakness}
                  </Link>
                ),
              },
            ]
          : []),
        { label: '通關總金', value: `+${raid.totalGold.toLocaleString()} G`, highlight: true },
        {
          label: `開箱 (${openCount}/${raid.gates.length})`,
          value: selectedChestCost > 0 ? `-${selectedChestCost.toLocaleString()} G` : '0 G',
        },
        {
          label: '實得淨收',
          value: (
            <span className='font-semibold text-setgreen'>
              +{netGold.toLocaleString()} G ({profitRate}%)
            </span>
          ),
        },
      ]}
      footerMeta={`${raid.tier ?? 'T3'} · ${raid.difficulty ?? '普通'} · #${anchorId} · GATES:${raid.gates.length}`}
      footerRight={
        raid.boundGoldNote ? (
          <span className='font-semibold text-rare'>{raid.boundGoldNote}</span>
        ) : undefined
      }
    >
      <div className='space-y-2.5'>
        {/* 艾斯特聯手技與戰鬥道具電報列 */}
        {showMechanics && (raid.sidereals || raid.battleItems) && (
          <div className='subsurface space-y-1 px-3 py-2 text-xs'>
            {raid.sidereals && (
              <p className='text-sub'>
                <strong className='font-semibold text-gold'>⬩ 艾斯特／聯手技：</strong>
                <StatRangeText text={raid.sidereals} query={query} />
              </p>
            )}
            {raid.battleItems && (
              <p className='flex flex-wrap items-center justify-between gap-2 text-sub'>
                <span>
                  <strong className='font-semibold text-tealbar'>⬩ 推薦戰鬥道具：</strong>
                  <Highlight text={raid.battleItems} query={query} />
                </span>
                <Link
                  to='/game/miscGuide?section=battleItems'
                  className='shrink-0 font-medium text-magic hover:underline'
                >
                  道具效果 →
                </Link>
              </p>
            )}
          </div>
        )}

        {/* 各關卡血條機制與開箱試算 */}
        <ul className='space-y-2'>
          {raid.gates.map((g, idx) => {
            const opened = openChests[idx] ?? true;
            return (
              <li key={g.gate} className='subsurface space-y-1.5 px-3 py-2'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <div className='flex flex-wrap items-center gap-2 font-mono text-xs tabular-nums'>
                    <span className='font-semibold text-ink'>
                      {g.gate}
                      {g.boss ? ` · ${g.boss}` : ''}
                    </span>
                    {showLedger && (
                      <>
                        <span className='font-semibold text-roll'>
                          +{g.goldReward.toLocaleString()} G
                        </span>
                        <span className={opened ? 'text-danger' : 'text-muted line-through'}>
                          開箱 -{g.chestCost.toLocaleString()} G
                        </span>
                      </>
                    )}
                  </div>

                  {showLedger && (
                    <Switch
                      size='small'
                      checked={opened}
                      onChange={(checked) => toggleGate(idx, checked)}
                      aria-label={`${raid.name} ${g.gate} 開箱切換`}
                    />
                  )}
                </div>

                {showMechanics && g.mechanics && g.mechanics.length > 0 && (
                  <ul className='space-y-1 border-t border-line/70 pt-1.5 text-[13px]'>
                    {g.mechanics.map((mech, mIdx) => (
                      <li key={mIdx} className='flex items-start gap-1.5 text-ink'>
                        <span className='shrink-0 text-crimson'>▸</span>
                        <span>
                          <StatRangeText text={mech} query={query} />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {showLedger && (
                  <p className={cx('text-[12.5px]', opened ? 'text-magic' : 'text-muted')}>
                    <span className='mr-1'>⬩ 寶箱產出：</span>
                    <StatRangeText text={g.chestContents} query={query} />
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        <p className='text-[12.5px] text-sub'>
          <span className='mr-1 font-semibold text-gold'>⬩ 戰術建議：</span>
          <StatRangeText text={raid.recommendation} query={query} />
        </p>
      </div>
    </DataCard3Zone>
  );
}
