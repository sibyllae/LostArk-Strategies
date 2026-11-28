import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AnchorJumpCloud from '@/components/ui/AnchorJumpCloud';
import DataCard3Zone from '@/components/ui/DataCard3Zone';
import EmptyResult from '@/components/ui/EmptyResult';
import GlyphIcon from '@/components/ui/GlyphIcon';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import ResponsiveList from '@/components/ui/ResponsiveList';
import SearchInput from '@/components/ui/SearchInput';
import SectionHeading from '@/components/ui/SectionHeading';
import StatRangeText from '@/components/ui/StatRangeText';
import Toolbar from '@/components/ui/Toolbar';
import VisualTilePicker, { type VisualTileOption } from '@/components/ui/VisualTilePicker';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetSystemsQuery } from '@/services/gameApi';
import { cx } from '@/utils/cx';
import { matchesWithAliases, toAnchorId } from '@/utils/slug';

type SystemTabKey =
  | 'accessories'
  | 'bracelets'
  | 'engravings'
  | 'gemsAndHoning'
  | 'gearSystems'
  | 'merchants';

type RoleFilter = 'ALL' | '輸出 (DPS)' | '輔助 (Support)';
type MerchantFilter = 'ALL' | '必蹲傳說' | '圖鑑核心';
type EngravingTierFilter = 'ALL' | 'S+' | 'S' | 'A';

const SYSTEM_TILES: ReadonlyArray<VisualTileOption<SystemTabKey>> = [
  { key: 'accessories', label: 'T4 飾品研磨', sub: '下/中/上數值', glyph: 'ring', toneClass: 'text-roll' },
  { key: 'bracelets', label: 'T4 手鐲詞條', sub: '飛躍點＆S級', glyph: 'bracelet', toneClass: 'text-gold' },
  { key: 'engravings', label: 'T4 遺物刻印書', sub: '16大刻印倍率', glyph: 'engraving', toneClass: 'text-crimson' },
  { key: 'gemsAndHoning', label: '寶石＆精煉斷點', sub: '1–10級/繼承表', glyph: 'gem', toneClass: 'text-magic' },
  { key: 'gearSystems', label: '八大養成系統', sub: '鍊金/超越/護腕', glyph: 'gear', toneClass: 'text-tealbar' },
  { key: 'merchants', label: '19 洲流浪商人', sub: '必蹲傳說卡', glyph: 'merchant', toneClass: 'text-setgreen' },
];

const isValidTab = (value: string | null): value is SystemTabKey =>
  SYSTEM_TILES.some((t) => t.key === value);

export default function SystemsPage() {
  const { data, isLoading, isError, refetch } = useGetSystemsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useSearchQuery();

  const tabParam = searchParams.get('tab');
  const roleParam = searchParams.get('role');
  const prioParam = searchParams.get('prio');
  const etierParam = searchParams.get('etier');

  const activeTab: SystemTabKey = isValidTab(tabParam) ? tabParam : 'accessories';
  const role: RoleFilter =
    roleParam === '輸出 (DPS)' || roleParam === '輔助 (Support)' ? roleParam : 'ALL';
  const merchantPriority: MerchantFilter =
    prioParam === '必蹲傳說' || prioParam === '圖鑑核心' ? prioParam : 'ALL';
  const engTier: EngravingTierFilter =
    etierParam === 'S+' || etierParam === 'S' || etierParam === 'A' ? etierParam : 'ALL';

  const setParam = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === 'ALL') next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true }
    );
  };

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
        .map((a, i) => ({ ...a, key: i, anchorId: toAnchorId('acc', `${a.slot}-${a.role}`) }))
        .filter(
          (a) =>
            (role === 'ALL' || a.role === role) &&
            matchesWithAliases(query, a.slot, a.role, a.primary, a.secondary, a.rolls, a.note)
        ),
    [data, query, role]
  );

  const filteredBracelets = useMemo(
    () =>
      (data?.bracelets ?? [])
        .map((b, i) => ({ ...b, key: i, anchorId: toAnchorId('brc', b.name) }))
        .filter(
          (b) =>
            (role === 'ALL' || b.role === role || b.role === '通用核心') &&
            matchesWithAliases(query, b.name, b.role, b.tier, b.effect, b.note)
        ),
    [data, query, role]
  );

  const filteredEngravings = useMemo(
    () =>
      (data?.engravings ?? [])
        .map((e, i) => ({ ...e, key: i }))
        .filter(
          (e) =>
            (role === 'ALL' || e.role === role || e.role === '通用') &&
            (engTier === 'ALL' || e.tier === engTier) &&
            matchesWithAliases(
              query,
              e.name,
              e.nameEn,
              e.role,
              e.tier,
              e.baseEffect,
              e.legendaryBonus,
              e.relicBonus,
              e.stoneBonus,
              e.note
            )
        ),
    [data, query, role, engTier]
  );

  const filteredGems = useMemo(
    () =>
      (data?.t4Gems ?? [])
        .map((g, i) => ({ ...g, key: i }))
        .filter((g) =>
          matchesWithAliases(
            query,
            `Lv.${g.level}`,
            `${g.level}級`,
            g.doomfireDmg,
            g.blazingCdr,
            g.baseAtkPower,
            g.conversionNote
          )
        ),
    [data, query]
  );

  const filteredBreakpoints = useMemo(
    () =>
      (data?.honingBreakpoints ?? [])
        .map((h, i) => ({ ...h, key: i }))
        .filter((h) =>
          matchesWithAliases(
            query,
            h.targetIlvl,
            h.normalHone,
            h.advancedHone,
            h.unlockedContent,
            h.strategy
          )
        ),
    [data, query]
  );

  const filteredGearSystems = useMemo(
    () =>
      (data?.gearSystems ?? [])
        .map((g, i) => ({ ...g, key: i, anchorId: toAnchorId('sys', g.system) }))
        .filter((g) => matchesWithAliases(query, g.system, g.unlock, g.goal, g.details)),
    [data, query]
  );

  const filteredMerchants = useMemo(
    () =>
      (data?.wanderingMerchants ?? [])
        .map((m, i) => ({ ...m, key: i }))
        .filter(
          (m) =>
            (merchantPriority === 'ALL' || m.priority === merchantPriority) &&
            matchesWithAliases(query, m.continent, m.merchant, m.priority, m.cards, m.note)
        ),
    [data, query, merchantPriority]
  );

  const anchorItems = useMemo(() => {
    if (activeTab === 'accessories') {
      return filteredAccessories.map((a) => ({
        id: a.anchorId,
        label: `${a.slot.split(' ')[0]} (${a.role.includes('DPS') ? 'DPS' : '輔助'})`,
      }));
    }
    if (activeTab === 'bracelets') {
      return filteredBracelets.map((b) => ({
        id: b.anchorId,
        label: b.name.split(' ')[0],
        sub: b.tier,
      }));
    }
    if (activeTab === 'gearSystems') {
      return filteredGearSystems.map((g) => ({
        id: g.anchorId,
        label: g.system.split(' ')[0],
      }));
    }
    return [];
  }, [activeTab, filteredAccessories, filteredBracelets, filteredGearSystems]);

  const { shownCount, totalCount } = useMemo(() => {
    switch (activeTab) {
      case 'accessories':
        return { shownCount: filteredAccessories.length, totalCount: data?.accessories.length ?? 0 };
      case 'bracelets':
        return { shownCount: filteredBracelets.length, totalCount: data?.bracelets?.length ?? 0 };
      case 'engravings':
        return { shownCount: filteredEngravings.length, totalCount: data?.engravings?.length ?? 0 };
      case 'gemsAndHoning':
        return {
          shownCount: filteredGems.length + filteredBreakpoints.length,
          totalCount: (data?.t4Gems?.length ?? 0) + (data?.honingBreakpoints?.length ?? 0),
        };
      case 'gearSystems':
        return { shownCount: filteredGearSystems.length, totalCount: data?.gearSystems.length ?? 0 };
      case 'merchants':
        return {
          shownCount: filteredMerchants.length,
          totalCount: data?.wanderingMerchants.length ?? 0,
        };
    }
  }, [
    activeTab,
    data,
    filteredAccessories.length,
    filteredBracelets.length,
    filteredEngravings.length,
    filteredGems.length,
    filteredBreakpoints.length,
    filteredGearSystems.length,
    filteredMerchants.length,
  ]);

  const activeFilters = useMemo(() => {
    const tags: string[] = [];
    if (query.trim()) tags.push(`關鍵字: ${query.trim()}`);
    if (
      (activeTab === 'accessories' || activeTab === 'bracelets' || activeTab === 'engravings') &&
      role !== 'ALL'
    ) {
      tags.push(`定位: ${role}`);
    }
    if (activeTab === 'engravings' && engTier !== 'ALL') tags.push(`投資評級: ${engTier}`);
    if (activeTab === 'merchants' && merchantPriority !== 'ALL') {
      tags.push(`優先級: ${merchantPriority}`);
    }
    return tags;
  }, [query, activeTab, role, engTier, merchantPriority]);

  const resetFilters = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams();
        const t = prev.get('tab');
        if (t) next.set('tab', t);
        return next;
      },
      { replace: true }
    );
  };

  return (
    <div>
      <PageHeader
        navKey='systems'
        stats={[
          { label: '戰術模組', value: SYSTEM_TILES.length },
          { label: '收錄刻印', value: data?.engravings?.length ?? 16 },
          { label: '顯示項目', value: shownCount },
        ]}
      />

      <VisualTilePicker
        options={SYSTEM_TILES}
        value={activeTab}
        onChange={setActiveTab}
        ariaLabel='配裝與養成子分類選擇'
      />

      <Toolbar
        shownCount={shownCount}
        totalCount={totalCount}
        activeFilters={activeFilters}
        onReset={resetFilters}
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder='搜尋部位、手鐲（優越/匕首）、刻印（怨恨/腎上腺素）、寶石斷點、護腕或商人卡片…'
        />

        {(activeTab === 'accessories' || activeTab === 'bracelets' || activeTab === 'engravings') && (
          <div className='flex flex-wrap items-center justify-between gap-2 text-xs'>
            <div className='flex flex-wrap items-center gap-1.5'>
              <span className='font-semibold text-muted'>職業定位：</span>
              {(
                [
                  ['ALL', '全部定位'],
                  ['輸出 (DPS)', '輸出 (DPS)'],
                  ['輔助 (Support)', '輔助 (Support)'],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type='button'
                  onClick={() => setParam('role', val)}
                  className={cx('filter-chip focus-ring', role === val && 'filter-chip-active')}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'engravings' && (
              <div className='flex flex-wrap items-center gap-1.5'>
                <span className='font-semibold text-muted'>投資評級：</span>
                {(['ALL', 'S+', 'S', 'A'] as const).map((val) => (
                  <button
                    key={val}
                    type='button'
                    onClick={() => setParam('etier', val)}
                    className={cx('filter-chip focus-ring', engTier === val && 'filter-chip-active')}
                  >
                    {val === 'ALL' ? '全部評級' : `${val} 級`}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'merchants' && (
          <div className='flex flex-wrap items-center gap-1.5 text-xs'>
            <span className='font-semibold text-muted'>狩獵優先級：</span>
            {(
              [
                ['ALL', '全部 19 洲'],
                ['必蹲傳說', '★ 必蹲傳說卡'],
                ['圖鑑核心', '圖鑑核心'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type='button'
                onClick={() => setParam('prio', val)}
                className={cx(
                  'filter-chip focus-ring',
                  merchantPriority === val && 'filter-chip-active'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </Toolbar>

      <AnchorJumpCloud items={anchorItems} title='詞條與系統直達' />

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {/* 1. T4 飾品研磨 */}
        {activeTab === 'accessories' &&
          (filteredAccessories.length === 0 ? (
            <EmptyResult query={query} activeFilters={activeFilters} onReset={resetFilters} />
          ) : (
            <div className='space-y-3'>
              {filteredAccessories.map((a) => {
                const isDps = a.role.includes('DPS');
                return (
                  <DataCard3Zone
                    key={a.key}
                    id={a.anchorId}
                    scopeBadge={{
                      label: isDps ? 'DPS 畢業' : '輔助畢業',
                      tone: isDps ? 'danger' : 'group',
                    }}
                    title={<Highlight text={a.slot} query={query} />}
                    subtitleEn={<Highlight text={a.role} query={query} />}
                    visual={
                      <div className='flex flex-col items-center justify-center gap-0.5'>
                        <GlyphIcon
                          name='ring'
                          className={isDps ? 'size-5 text-crimson' : 'size-5 text-setgreen'}
                        />
                        <span className='font-mono text-[11px] font-semibold text-sub'>
                          {isDps ? 'DPS' : 'SUP'}
                        </span>
                      </div>
                    }
                    baseSpecs={[
                      { label: '裝備部位', value: a.slot.split(' ')[0] },
                      { label: '適用定位', value: isDps ? '輸出職業' : '輔助職業' },
                      { label: '品質門檻', value: '67+ 滿領悟點', highlight: true },
                    ]}
                    footerMeta={`ACCESSORY · #${a.anchorId} · TIERS: LOW / MID / HIGH`}
                  >
                    <ul className='space-y-1.5'>
                      <li className='text-magic'>
                        ⬩ 畢業首選詞條：
                        <strong className='font-semibold text-gold'>
                          <StatRangeText text={a.primary} query={query} />
                        </strong>
                      </li>
                      {a.rolls && (
                        <li className='text-magic'>
                          ⬩ 下 / 中 / 上數值區間：
                          <StatRangeText text={a.rolls} query={query} />
                        </li>
                      )}
                      <li className='text-sub'>
                        ⬩ 次選過渡詞條：<StatRangeText text={a.secondary} query={query} />
                      </li>
                      <li className='text-xs text-sub'>
                        ⬩ 說明：<StatRangeText text={a.note} query={query} />
                      </li>
                    </ul>
                  </DataCard3Zone>
                );
              })}
            </div>
          ))}

        {/* 2. T4 手鐲詞條 */}
        {activeTab === 'bracelets' &&
          (filteredBracelets.length === 0 ? (
            <EmptyResult query={query} activeFilters={activeFilters} onReset={resetFilters} />
          ) : (
            <div className='space-y-3'>
              {filteredBracelets.map((b) => (
                <DataCard3Zone
                  key={b.key}
                  id={b.anchorId}
                  titleTone={b.tier === 'S' ? 'gold' : 'magic'}
                  scopeBadge={{
                    label: `${b.tier} 級詞條`,
                    tone: b.tier === 'S' ? 'warning' : 'attribute',
                  }}
                  title={<Highlight text={b.name} query={query} />}
                  subtitleEn={b.role}
                  visual={
                    <div className='flex flex-col items-center justify-center gap-0.5'>
                      <GlyphIcon
                        name='bracelet'
                        className={b.tier === 'S' ? 'size-5 text-gold' : 'size-5 text-magic'}
                      />
                      <span className='font-mono text-xs font-semibold text-roll'>{b.tier} 級</span>
                    </div>
                  }
                  baseSpecs={[
                    { label: '詞條評級', value: `${b.tier} 級核心`, highlight: b.tier === 'S' },
                    { label: '適用定位', value: b.role },
                  ]}
                  footerMeta={`BRACELET · #${b.anchorId} · TIER ${b.tier}`}
                >
                  <ul className='space-y-1.5'>
                    <li className='text-magic'>
                      ⬩ 詞條數值效果：<StatRangeText text={b.effect} query={query} />
                    </li>
                    <li className='text-xs text-sub'>
                      ⬩ 實戰建議：<StatRangeText text={b.note} query={query} />
                    </li>
                  </ul>
                </DataCard3Zone>
              ))}
            </div>
          ))}

        {/* 3. T4 遺物刻印書與能力石倍率表（SKILL.md Section 4G 差異高亮表） */}
        {activeTab === 'engravings' &&
          (filteredEngravings.length === 0 ? (
            <EmptyResult query={query} activeFilters={activeFilters} onReset={resetFilters} />
          ) : (
            <div className='space-y-3.5'>
              <div className='surface section-bar-primary px-3.5 py-2.5 text-xs text-sub'>
                <strong className='font-semibold text-gold'>T4 刻印與能力石規則：</strong>
                全角色自由配置 <span className='font-mono font-semibold text-roll'>5 槽通用戰鬥刻印</span>
                ；黃底高亮列（<span className='font-semibold text-rare'>S+ 泛用核心</span>
                ）為遠征隊投資 20 張遺物書報酬率與跨角色共用度最高的首選目標。
              </div>

              <ResponsiveList
                data={filteredEngravings}
                scrollX={920}
                isDiffRow={(e) => Boolean(e.highlight)}
                columns={[
                  {
                    title: '刻印名稱 (English)',
                    key: 'name',
                    width: 185,
                    render: (_, e) => (
                      <div>
                        <span className='font-semibold text-gold'>
                          <Highlight text={e.name} query={query} />
                        </span>
                        <span className='ml-1.5 font-mono text-[11px] text-muted'>
                          ({e.nameEn})
                        </span>
                      </div>
                    ),
                  },
                  {
                    title: '評級 / 定位',
                    key: 'tier',
                    width: 128,
                    render: (_, e) => (
                      <div className='flex items-center gap-1.5'>
                        <span
                          className={cx(
                            'chip font-mono text-xs font-semibold',
                            e.tier === 'S+'
                              ? 'tone-warning'
                              : e.tier === 'S'
                                ? 'tone-sky'
                                : 'tone-neutral'
                          )}
                        >
                          {e.tier}
                        </span>
                        <span className='text-xs text-sub'>
                          {e.role.includes('DPS') ? 'DPS' : '輔助'}
                        </span>
                      </div>
                    ),
                  },
                  {
                    title: '基礎效果 (Lv.0)',
                    dataIndex: 'baseEffect',
                    key: 'baseEffect',
                    width: 170,
                    render: (v: string) => <StatRangeText text={v} query={query} />,
                  },
                  {
                    title: '傳說滿書 (20張)',
                    dataIndex: 'legendaryBonus',
                    key: 'legendaryBonus',
                    width: 150,
                    render: (v: string) => (
                      <span className='text-magic'>
                        <StatRangeText text={v} query={query} />
                      </span>
                    ),
                  },
                  {
                    title: '遺物滿書 (20張)',
                    dataIndex: 'relicBonus',
                    key: 'relicBonus',
                    width: 180,
                    render: (v: string) => (
                      <span className='font-semibold text-gold'>
                        <StatRangeText text={v} query={query} />
                      </span>
                    ),
                  },
                  {
                    title: '能力石 [6/7/9/10] 加成 ＆ 建議',
                    key: 'stone',
                    render: (_, e) => (
                      <div className='space-y-0.5 text-xs'>
                        <p className='text-setgreen'>
                          石頭：<StatRangeText text={e.stoneBonus} query={query} />
                        </p>
                        <p className='text-sub'>
                          <Highlight text={e.note} query={query} />
                        </p>
                      </div>
                    ),
                  },
                ]}
                renderCard={(e) => (
                  <div
                    className={cx(
                      'surface space-y-1.5 p-3',
                      e.highlight && 'diff-card-highlight'
                    )}
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <div>
                        <span className='font-semibold text-gold'>
                          <Highlight text={e.name} query={query} />
                        </span>
                        <span className='ml-1.5 font-mono text-[11px] text-muted'>
                          ({e.nameEn})
                        </span>
                      </div>
                      <span
                        className={cx(
                          'chip font-mono text-xs font-semibold',
                          e.tier === 'S+' ? 'tone-warning' : 'tone-sky'
                        )}
                      >
                        {e.tier} · {e.role.includes('DPS') ? 'DPS' : '輔助'}
                      </span>
                    </div>
                    <p className='text-xs text-sub'>
                      基礎：<StatRangeText text={e.baseEffect} query={query} /> ｜ 傳說：
                      <StatRangeText text={e.legendaryBonus} query={query} />
                    </p>
                    <p className='text-[13px] font-semibold text-gold'>
                      ⬩ 遺物滿書：<StatRangeText text={e.relicBonus} query={query} />
                    </p>
                    <p className='text-xs text-setgreen'>
                      ⬩ 能力石：<StatRangeText text={e.stoneBonus} query={query} />
                    </p>
                    <p className='text-xs text-sub'>{e.note}</p>
                  </div>
                )}
              />
            </div>
          ))}

        {/* 4. T4 寶石 1–10 級倍率 ＆ 精煉黃金斷點矩陣（SKILL.md Section 4G 差異高亮表） */}
        {activeTab === 'gemsAndHoning' &&
          (shownCount === 0 ? (
            <EmptyResult query={query} activeFilters={activeFilters} onReset={resetFilters} />
          ) : (
            <div className='space-y-6'>
              {filteredBreakpoints.length > 0 && (
                <section>
                  <SectionHeading
                    title='T3 → T4 裝備繼承與精煉黃金斷點矩陣'
                    count={filteredBreakpoints.length}
                    subtitle='黃底高亮列為質變門檻斷點'
                  />
                  <ResponsiveList
                    data={filteredBreakpoints}
                    scrollX={880}
                    isDiffRow={(h) => Boolean(h.highlight)}
                    columns={[
                      {
                        title: '裝等階段',
                        dataIndex: 'targetIlvl',
                        key: 'targetIlvl',
                        width: 135,
                        render: (v: string) => (
                          <span className='meta-tag font-semibold text-roll'>
                            <Highlight text={v} query={query} />
                          </span>
                        ),
                      },
                      {
                        title: '一般精煉落點',
                        dataIndex: 'normalHone',
                        key: 'normalHone',
                        width: 195,
                        render: (v: string) => <StatRangeText text={v} query={query} />,
                      },
                      {
                        title: '進階精煉搭配',
                        dataIndex: 'advancedHone',
                        key: 'advancedHone',
                        width: 180,
                        render: (v: string) => (
                          <span className='text-magic'>
                            <StatRangeText text={v} query={query} />
                          </span>
                        ),
                      },
                      {
                        title: '解鎖核心副本與裝備',
                        dataIndex: 'unlockedContent',
                        key: 'unlockedContent',
                        width: 210,
                        render: (v: string) => (
                          <span className='font-semibold text-gold'>
                            <Highlight text={v} query={query} />
                          </span>
                        ),
                      },
                      {
                        title: '最省金衝裝策略',
                        dataIndex: 'strategy',
                        key: 'strategy',
                        render: (v: string) => (
                          <span className='text-xs text-sub'>
                            <StatRangeText text={v} query={query} />
                          </span>
                        ),
                      },
                    ]}
                    renderCard={(h) => (
                      <div
                        className={cx(
                          'surface space-y-1.5 p-3',
                          h.highlight && 'diff-card-highlight'
                        )}
                      >
                        <div className='flex items-center justify-between gap-2'>
                          <span className='meta-tag font-semibold text-roll'>{h.targetIlvl}</span>
                          <span className='text-xs text-magic'>{h.advancedHone}</span>
                        </div>
                        <p className='text-[13px] font-semibold text-gold'>{h.unlockedContent}</p>
                        <p className='text-xs text-ink'>一般精煉：{h.normalHone}</p>
                        <p className='text-xs text-sub'>
                          <StatRangeText text={h.strategy} query={query} />
                        </p>
                      </div>
                    )}
                  />
                </section>
              )}

              {filteredGems.length > 0 && (
                <section>
                  <SectionHeading
                    title='T4 劫火／光輝寶石 Lv.1–10 數值與 T3 繼承對照表'
                    count={filteredGems.length}
                    subtitle='黃底高亮列為 T3 9/10級轉換落點與滿階頂點'
                  />
                  <ResponsiveList
                    data={filteredGems}
                    scrollX={820}
                    isDiffRow={(g) => Boolean(g.highlight)}
                    columns={[
                      {
                        title: '等級',
                        dataIndex: 'level',
                        key: 'level',
                        width: 85,
                        render: (lv: number) => (
                          <span className='meta-tag font-semibold text-gold'>Lv.{lv}</span>
                        ),
                      },
                      {
                        title: '劫火 (增傷 %)',
                        dataIndex: 'doomfireDmg',
                        key: 'doomfireDmg',
                        width: 120,
                        render: (v: string) => (
                          <span className='font-mono font-semibold tabular-nums text-crimson'>
                            {v}
                          </span>
                        ),
                      },
                      {
                        title: '光輝 (冷卻 %)',
                        dataIndex: 'blazingCdr',
                        key: 'blazingCdr',
                        width: 120,
                        render: (v: string) => (
                          <span className='font-mono font-semibold tabular-nums text-magic'>
                            {v}
                          </span>
                        ),
                      },
                      {
                        title: '基礎攻擊力加成',
                        dataIndex: 'baseAtkPower',
                        key: 'baseAtkPower',
                        width: 135,
                        render: (v: string) => (
                          <span className='font-mono font-semibold tabular-nums text-roll'>
                            {v}
                          </span>
                        ),
                      },
                      {
                        title: '輔助增傷強化',
                        dataIndex: 'supportBonus',
                        key: 'supportBonus',
                        width: 120,
                        render: (v: string) => (
                          <span className='font-mono font-semibold tabular-nums text-setgreen'>
                            {v}
                          </span>
                        ),
                      },
                      {
                        title: 'T3 升階轉換與投資建議',
                        dataIndex: 'conversionNote',
                        key: 'conversionNote',
                        render: (v: string) => (
                          <span className='text-xs text-sub'>
                            <StatRangeText text={v} query={query} />
                          </span>
                        ),
                      },
                    ]}
                    renderCard={(g) => (
                      <div
                        className={cx(
                          'surface space-y-1.5 p-3',
                          g.highlight && 'diff-card-highlight'
                        )}
                      >
                        <div className='flex items-center justify-between font-mono text-xs tabular-nums'>
                          <span className='meta-tag font-semibold text-gold'>T4 Lv.{g.level}</span>
                          <span className='font-semibold text-roll'>基礎攻強 {g.baseAtkPower}</span>
                        </div>
                        <p className='font-mono text-[13px] tabular-nums'>
                          <span className='text-crimson'>劫火 {g.doomfireDmg}</span> ·{' '}
                          <span className='text-magic'>光輝 {g.blazingCdr}</span> ·{' '}
                          <span className='text-setgreen'>輔助 {g.supportBonus}</span>
                        </p>
                        <p className='text-xs text-sub'>
                          <StatRangeText text={g.conversionNote} query={query} />
                        </p>
                      </div>
                    )}
                  />
                </section>
              )}
            </div>
          ))}

        {/* 5. 八大養成系統 */}
        {activeTab === 'gearSystems' &&
          (filteredGearSystems.length === 0 ? (
            <EmptyResult query={query} activeFilters={activeFilters} onReset={resetFilters} />
          ) : (
            <div className='space-y-3'>
              {filteredGearSystems.map((item, idx) => (
                <DataCard3Zone
                  key={item.key}
                  id={item.anchorId}
                  title={<Highlight text={item.system} query={query} />}
                  subtitleEn={`System #0${idx + 1}`}
                  headerActions={
                    item.relatedRaid ? (
                      <Link
                        to={`/game/raidChests?q=${encodeURIComponent(item.relatedRaid)}`}
                        className='filter-chip focus-ring py-1 text-xs text-magic'
                      >
                        查產出副本 →
                      </Link>
                    ) : undefined
                  }
                  visual={
                    <div className='flex flex-col items-center justify-center gap-0.5'>
                      <GlyphIcon name='gear' className='size-5 text-gold' />
                      <span className='font-mono text-[11px] font-semibold tabular-nums text-sub'>
                        #0{idx + 1}
                      </span>
                    </div>
                  }
                  baseSpecs={[
                    { label: '解鎖門檻', value: item.unlock, highlight: true },
                    { label: '養成編號', value: `模組 0${idx + 1}` },
                  ]}
                  footerMeta={`GEAR SYSTEM · #${item.anchorId} · UNLOCK:${item.unlock}`}
                >
                  <ul className='space-y-1.5'>
                    <li className='font-semibold text-gold'>
                      ⬩ 畢業目標：<StatRangeText text={item.goal} query={query} />
                    </li>
                    <li className='text-magic'>
                      ⬩ 機制與減負重點：<StatRangeText text={item.details} query={query} />
                    </li>
                  </ul>
                </DataCard3Zone>
              ))}
            </div>
          ))}

        {/* 6. 19 洲流浪商人（必蹲傳說卡列套用差異高亮） */}
        {activeTab === 'merchants' &&
          (filteredMerchants.length === 0 ? (
            <EmptyResult query={query} activeFilters={activeFilters} onReset={resetFilters} />
          ) : (
            <div className='space-y-3.5'>
              <div className='surface section-bar-primary px-3.5 py-2.5 text-xs text-sub'>
                <strong className='font-semibold text-gold'>流浪商人刷新規則：</strong>
                每次出現維持 <span className='font-mono font-semibold text-roll'>5 小時 30 分鐘</span>
                、全頻道同步庫存，傳說卡均一售價{' '}
                <span className='font-mono font-semibold text-roll'>100,000 銀幣</span>
                （黃底高亮列為必放彩虹橋駐點的 6 大傳說卡大陸）。
              </div>

              <ResponsiveList
                data={filteredMerchants}
                isDiffRow={(m) => m.priority === '必蹲傳說'}
                columns={[
                  {
                    title: '大陸',
                    dataIndex: 'continent',
                    key: 'continent',
                    width: 145,
                    render: (t: string) => (
                      <Link
                        to={`/game/adventureBook?q=${encodeURIComponent(t.split('／')[0])}`}
                        className='meta-tag text-ink hover:border-active'
                        title='查看該大陸冒險之書'
                      >
                        <Highlight text={t} query={query} />
                      </Link>
                    ),
                  },
                  {
                    title: '優先級',
                    dataIndex: 'priority',
                    key: 'priority',
                    width: 116,
                    render: (p?: string) => (
                      <span
                        className={cx(
                          'chip text-xs',
                          p === '必蹲傳說'
                            ? 'tone-warning'
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
                    title: '商人名稱 (English)',
                    dataIndex: 'merchant',
                    key: 'merchant',
                    width: 185,
                    render: (t: string) => (
                      <span className='text-sub'>
                        <Highlight text={t} query={query} />
                      </span>
                    ),
                  },
                  {
                    title: '重點販售卡片',
                    dataIndex: 'cards',
                    key: 'cards',
                    render: (t: string) => (
                      <span className='font-semibold text-gold'>
                        <Highlight text={t} query={query} />
                      </span>
                    ),
                  },
                  {
                    title: '戰術備註',
                    dataIndex: 'note',
                    key: 'note',
                    render: (n: string) =>
                      n ? (
                        <span className='text-xs text-sub'>
                          <StatRangeText text={n} query={query} />
                        </span>
                      ) : null,
                  },
                ]}
                renderCard={(m) => (
                  <div
                    className={cx(
                      'surface space-y-1.5 p-3',
                      m.priority === '必蹲傳說' && 'diff-card-highlight'
                    )}
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span className='meta-tag text-ink'>
                        <Highlight text={m.continent} query={query} />
                      </span>
                      <span
                        className={cx(
                          'chip text-xs',
                          m.priority === '必蹲傳說'
                            ? 'tone-warning'
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
                    <p className='text-[13.5px] font-semibold text-gold'>
                      ⬩ <Highlight text={m.cards} query={query} />
                    </p>
                    {m.note && (
                      <p className='text-xs text-sub'>
                        <StatRangeText text={m.note} query={query} />
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          ))}
      </QueryState>
    </div>
  );
}
