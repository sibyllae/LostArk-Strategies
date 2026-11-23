import { useMemo, useState } from 'react';
import { Button, Collapse, type CollapseProps } from 'antd';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import ResponsiveList from '@/components/ui/ResponsiveList';
import SearchInput from '@/components/ui/SearchInput';
import Toolbar from '@/components/ui/Toolbar';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetMiscGuideQuery } from '@/services/gameApi';
import { cx } from '@/utils/cx';
import { matchesQuery } from '@/utils/text';

const SECTION_SHORT_LABELS: Record<string, string> = {
  songs: '樂譜',
  skillPoints: '技能點',
  enlightenmentPoints: '悟性點',
  runes: '符文',
  cardSets: '卡組',
  dailyLimits: '日常限制',
  dailyQuests: '艾波娜委託',
  progressionRoadmap: '裝等路線',
  arkGrid: '方舟星圖',
  battleItems: '戰鬥道具',
};

function PanelHeader({ title, count }: { title: string; count: number }) {
  return (
    <span className='flex items-center gap-2 text-sm font-semibold text-stone-100'>
      <span>{title}</span>
      <span className='font-mono text-xs font-normal tabular-nums text-stone-500'>({count})</span>
    </span>
  );
}

export default function MiscGuidePage() {
  const { data, isLoading, isError, refetch } = useGetMiscGuideQuery();
  const [query, setQuery] = useSearchQuery();
  const [activeKeys, setActiveKeys] = useState<string[]>(['songs', 'progressionRoadmap']);

  const filtered = useMemo(() => {
    if (!data) return null;

    const songs = data.songs.filter((s) => matchesQuery(query, s.name, s.source, s.note));
    const skillPoints = data.skillPoints.filter((sp) => matchesQuery(query, sp.task, sp.note));
    const enlightenmentPoints = (data.enlightenmentPoints ?? []).filter((ep) =>
      matchesQuery(query, ep.task, ep.note)
    );
    const runes = data.runes.filter((r) =>
      matchesQuery(query, r.rune, r.heroic, r.legendary, r.legendaryNote)
    );
    const cardSets = data.cardSets.filter((cs) =>
      matchesQuery(
        query,
        cs.setName,
        cs.cards.map((c) => `${c.name} ${c.source}`)
      )
    );
    const dailyLimits = data.dailyLimits.filter((dl) =>
      matchesQuery(query, dl.content, dl.limit, dl.note)
    );
    const dailyQuests = data.dailyQuests.filter((dq) =>
      matchesQuery(query, dq.name, dq.location, dq.dailyReward, dq.reputationReward)
    );
    const progressionRoadmap = (data.progressionRoadmap ?? []).filter((p) =>
      matchesQuery(query, p.ilvl, p.milestone, p.system, p.note)
    );
    const arkGrid = (data.arkGrid ?? []).filter((a) =>
      matchesQuery(query, a.topic, a.detail, a.note)
    );
    const battleItems = (data.battleItems ?? []).filter((b) =>
      matchesQuery(query, b.name, b.category, b.effect, b.timing)
    );

    const total =
      songs.length +
      skillPoints.length +
      enlightenmentPoints.length +
      runes.length +
      cardSets.length +
      dailyLimits.length +
      dailyQuests.length +
      progressionRoadmap.length +
      arkGrid.length +
      battleItems.length;

    return {
      songs,
      skillPoints,
      enlightenmentPoints,
      runes,
      cardSets,
      dailyLimits,
      dailyQuests,
      progressionRoadmap,
      arkGrid,
      battleItems,
      total,
    };
  }, [data, query]);

  const items: CollapseProps['items'] = useMemo(() => {
    if (!filtered) return [];

    const allSections: NonNullable<CollapseProps['items']> = [
      ...(filtered.progressionRoadmap.length > 0
        ? [
            {
              key: 'progressionRoadmap',
              label: (
                <PanelHeader
                  title='裝等養成與系統解鎖路線 (1415 → 1730)'
                  count={filtered.progressionRoadmap.length}
                />
              ),
              children: (
                <ResponsiveList
                  data={filtered.progressionRoadmap.map((p, i) => ({ ...p, key: i }))}
                  columns={[
                    {
                      title: '裝等區間',
                      dataIndex: 'ilvl',
                      key: 'ilvl',
                      width: 120,
                      render: (t: string) => (
                        <span className='meta-tag font-mono text-gold-300'>
                          <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '核心副本／階段',
                      dataIndex: 'milestone',
                      key: 'milestone',
                      render: (t: string) => (
                        <span className='font-medium text-stone-100'>
                          <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '解鎖系統',
                      dataIndex: 'system',
                      key: 'system',
                      render: (t: string) => (
                        <span className='text-sky-300'>
                          <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '建議備註',
                      dataIndex: 'note',
                      key: 'note',
                      render: (n: string) => (
                        <span className='text-xs text-stone-400'>
                          <Highlight text={n} query={query} />
                        </span>
                      ),
                    },
                  ]}
                  renderCard={(p) => (
                    <div className='subsurface space-y-1.5 p-3 text-xs'>
                      <div className='flex items-center justify-between gap-2'>
                        <span className='meta-tag font-mono text-gold-300'>
                          <Highlight text={p.ilvl} query={query} />
                        </span>
                        <span className='font-medium text-sky-300'>
                          <Highlight text={p.system} query={query} />
                        </span>
                      </div>
                      <p className='font-medium text-stone-200'>
                        <Highlight text={p.milestone} query={query} />
                      </p>
                      <p className='text-[11px] text-stone-400'>
                        <Highlight text={p.note} query={query} />
                      </p>
                    </div>
                  )}
                />
              ),
            },
          ]
        : []),
      ...(filtered.songs.length > 0
        ? [
            {
              key: 'songs',
              label: <PanelHeader title='重要樂譜／曲譜取得一覽' count={filtered.songs.length} />,
              children: (
                <ResponsiveList
                  data={filtered.songs.map((s, i) => ({ ...s, key: i }))}
                  columns={[
                    {
                      title: '樂譜名稱',
                      dataIndex: 'name',
                      key: 'name',
                      width: 180,
                      render: (t: string) => (
                        <span className='font-semibold text-stone-100'>
                          <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '取得途徑',
                      dataIndex: 'source',
                      key: 'source',
                      render: (t: string) => (
                        <span className='text-stone-300'>
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
                          <span className='text-xs text-gold-300/90'>
                            <Highlight text={n} query={query} />
                          </span>
                        ) : null,
                    },
                  ]}
                  renderCard={(s) => (
                    <div className='subsurface space-y-1 p-3 text-xs'>
                      <span className='block text-sm font-semibold text-stone-100'>
                        <Highlight text={s.name} query={query} />
                      </span>
                      <p className='text-stone-300'>
                        <Highlight text={s.source} query={query} />
                      </p>
                      {s.note && (
                        <p className='text-gold-300/85'>
                          <Highlight text={s.note} query={query} />
                        </p>
                      )}
                    </div>
                  )}
                />
              ),
            },
          ]
        : []),
      ...(filtered.skillPoints.length > 0
        ? [
            {
              key: 'skillPoints',
              label: <PanelHeader title='技能點數 (+3) 任務清單' count={filtered.skillPoints.length} />,
              children: (
                <div className='grid gap-2 sm:grid-cols-2'>
                  {filtered.skillPoints.map((sp, idx) => (
                    <div key={idx} className='subsurface flex items-start gap-2.5 p-3 text-xs'>
                      <span className='meta-tag shrink-0 font-mono text-[11px] tabular-nums'>
                        #{idx + 1}
                      </span>
                      <div>
                        <p className='font-medium text-stone-200'>
                          <Highlight text={sp.task} query={query} />
                        </p>
                        {sp.note && (
                          <p className='mt-1 text-[11px] text-gold-300/85'>
                            <Highlight text={sp.note} query={query} />
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]
        : []),
      ...(filtered.enlightenmentPoints.length > 0
        ? [
            {
              key: 'enlightenmentPoints',
              label: (
                <PanelHeader
                  title='T4 悟性點數 (方舟被動) 取得來源'
                  count={filtered.enlightenmentPoints.length}
                />
              ),
              children: (
                <div className='grid gap-2 sm:grid-cols-2'>
                  {filtered.enlightenmentPoints.map((ep, idx) => (
                    <div key={idx} className='subsurface flex items-start gap-2.5 p-3 text-xs'>
                      <span className='meta-tag shrink-0 font-mono text-[11px] tabular-nums text-gold-300'>
                        #{idx + 1}
                      </span>
                      <div>
                        <p className='font-medium text-stone-200'>
                          <Highlight text={ep.task} query={query} />
                        </p>
                        {ep.note && (
                          <p className='mt-1 text-[11px] text-gold-300/85'>
                            <Highlight text={ep.note} query={query} />
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]
        : []),
      ...(filtered.runes.length > 0
        ? [
            {
              key: 'runes',
              label: <PanelHeader title='高階技能符文取得方式 (英雄／傳說)' count={filtered.runes.length} />,
              children: (
                <ResponsiveList
                  data={filtered.runes.map((r, i) => ({ ...r, key: i }))}
                  columns={[
                    {
                      title: '符文',
                      dataIndex: 'rune',
                      key: 'rune',
                      width: 100,
                      render: (r: string) => (
                        <span className='meta-tag font-semibold'>
                          <Highlight text={r} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '英雄等級',
                      dataIndex: 'heroic',
                      key: 'heroic',
                      render: (v: string) => (
                        <span className='text-xs text-purple-300'>
                          {v ? <Highlight text={v} query={query} /> : '—'}
                        </span>
                      ),
                    },
                    {
                      title: '傳說等級',
                      dataIndex: 'legendary',
                      key: 'legendary',
                      render: (v: string) => (
                        <span className='text-xs font-medium text-gold-300'>
                          {v ? <Highlight text={v} query={query} /> : '—'}
                        </span>
                      ),
                    },
                    {
                      title: '備註說明',
                      dataIndex: 'legendaryNote',
                      key: 'legendaryNote',
                      render: (v: string) => (
                        <span className='text-xs text-stone-500'>
                          {v ? <Highlight text={v} query={query} /> : '—'}
                        </span>
                      ),
                    },
                  ]}
                  renderCard={(r) => (
                    <div className='subsurface space-y-1.5 p-3 text-xs'>
                      <span className='meta-tag font-semibold'>
                        <Highlight text={r.rune} query={query} />
                      </span>
                      {r.heroic && (
                        <p className='text-purple-300'>
                          <span className='text-stone-500'>英雄：</span>
                          <Highlight text={r.heroic} query={query} />
                        </p>
                      )}
                      {r.legendary && (
                        <p className='text-gold-300'>
                          <span className='text-stone-500'>傳說：</span>
                          <Highlight text={r.legendary} query={query} />
                        </p>
                      )}
                      {r.legendaryNote && (
                        <p className='text-[11px] text-stone-500'>
                          <Highlight text={r.legendaryNote} query={query} />
                        </p>
                      )}
                    </div>
                  )}
                />
              ),
            },
          ]
        : []),
      ...(filtered.cardSets.length > 0
        ? [
            {
              key: 'cardSets',
              label: <PanelHeader title='核心實用卡牌組合推薦' count={filtered.cardSets.length} />,
              children: (
                <div className='space-y-4'>
                  {filtered.cardSets.map((cs, i) => (
                    <div key={i} className='subsurface p-3.5'>
                      <h3 className='mb-2.5 border-l-2 border-gold-500 pl-2 text-sm font-semibold text-stone-100'>
                        <Highlight text={cs.setName} query={query} />
                      </h3>
                      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
                        {cs.cards.map((card, ci) => (
                          <div
                            key={ci}
                            className='flex items-center gap-2 rounded border border-obsidian-700/70 bg-obsidian-900 px-2.5 py-2 text-xs'
                          >
                            <span className='shrink-0 font-medium text-gold-300'>
                              <Highlight text={card.name} query={query} />
                            </span>
                            <span className='truncate text-stone-400' title={card.source}>
                              <Highlight text={card.source} query={query} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]
        : []),
      ...(filtered.dailyLimits.length > 0
        ? [
            {
              key: 'dailyLimits',
              label: <PanelHeader title='日常週期與次數限制' count={filtered.dailyLimits.length} />,
              children: (
                <ResponsiveList
                  data={filtered.dailyLimits.map((dl, i) => ({ ...dl, key: i }))}
                  columns={[
                    {
                      title: '遊戲內容',
                      dataIndex: 'content',
                      key: 'content',
                      width: 200,
                      render: (t: string) => (
                        <span className='font-medium text-stone-100'>
                          <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '次數限制',
                      dataIndex: 'limit',
                      key: 'limit',
                      width: 170,
                      render: (v: string) => (
                        <span className='meta-tag text-gold-300'>
                          <Highlight text={v} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '說明',
                      dataIndex: 'note',
                      key: 'note',
                      render: (t: string) => (
                        <span className='text-stone-300'>
                          <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                  ]}
                  renderCard={(dl) => (
                    <div className='subsurface flex items-center justify-between gap-3 p-3 text-xs'>
                      <div>
                        <span className='block font-semibold text-stone-200'>
                          <Highlight text={dl.content} query={query} />
                        </span>
                        <span className='text-[11px] text-stone-500'>
                          <Highlight text={dl.note} query={query} />
                        </span>
                      </div>
                      <span className='meta-tag shrink-0 text-gold-300'>
                        <Highlight text={dl.limit} query={query} />
                      </span>
                    </div>
                  )}
                />
              ),
            },
          ]
        : []),
      ...(filtered.dailyQuests.length > 0
        ? [
            {
              key: 'dailyQuests',
              label: <PanelHeader title='艾波娜每日委託聲望推薦' count={filtered.dailyQuests.length} />,
              children: (
                <ResponsiveList
                  data={filtered.dailyQuests.map((dq, i) => ({ ...dq, key: i }))}
                  scrollX={760}
                  columns={[
                    {
                      title: '委託名稱',
                      dataIndex: 'name',
                      key: 'name',
                      width: 180,
                      render: (t: string) => (
                        <span className='font-medium text-stone-100'>
                          <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '地點',
                      dataIndex: 'location',
                      key: 'location',
                      width: 140,
                      render: (t: string) => (
                        <span className='text-stone-400'>
                          <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '每日回報',
                      dataIndex: 'dailyReward',
                      key: 'dailyReward',
                      width: 120,
                      render: (t: string) => <Highlight text={t} query={query} />,
                    },
                    {
                      title: '聲望終極獎勵',
                      dataIndex: 'reputationReward',
                      key: 'reputationReward',
                      render: (t: string) => (
                        <span className='text-gold-300'>
                          <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '需求天數',
                      dataIndex: 'requiredDays',
                      key: 'requiredDays',
                      width: 96,
                      render: (d: number) =>
                        d > 0 ? <span className='meta-tag font-mono'>{d} 天</span> : '—',
                    },
                  ]}
                  renderCard={(dq) => (
                    <div className='subsurface space-y-1 p-3 text-xs'>
                      <div className='flex items-center justify-between gap-2'>
                        <span className='font-semibold text-stone-100'>
                          <Highlight text={dq.name} query={query} />
                        </span>
                        {dq.requiredDays > 0 && (
                          <span className='meta-tag font-mono'>{dq.requiredDays} 天</span>
                        )}
                      </div>
                      <p className='text-stone-400'>
                        地點：<Highlight text={dq.location} query={query} />
                      </p>
                      <p className='text-stone-300'>
                        每日：<Highlight text={dq.dailyReward} query={query} />
                      </p>
                      {dq.reputationReward && (
                        <p className='font-medium text-gold-300'>
                          聲望獎勵：<Highlight text={dq.reputationReward} query={query} />
                        </p>
                      )}
                    </div>
                  )}
                />
              ),
            },
          ]
        : []),
      ...(filtered.arkGrid.length > 0
        ? [
            {
              key: 'arkGrid',
              label: <PanelHeader title='T4 方舟星圖 (Ark Grid) 機制速查' count={filtered.arkGrid.length} />,
              children: (
                <div className='grid gap-2 sm:grid-cols-2'>
                  {filtered.arkGrid.map((item, idx) => (
                    <div key={idx} className='subsurface p-3 text-xs'>
                      <span className='mb-1 block font-semibold text-gold-300'>
                        <Highlight text={item.topic} query={query} />
                      </span>
                      <p className='text-stone-200'>
                        <Highlight text={item.detail} query={query} />
                      </p>
                      {item.note && (
                        <p className='mt-1 text-[11px] text-stone-400'>
                          <Highlight text={item.note} query={query} />
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ),
            },
          ]
        : []),
      ...(filtered.battleItems.length > 0
        ? [
            {
              key: 'battleItems',
              label: <PanelHeader title='副本常用戰鬥道具速查表' count={filtered.battleItems.length} />,
              children: (
                <ResponsiveList
                  data={filtered.battleItems.map((b, i) => ({ ...b, key: i }))}
                  columns={[
                    {
                      title: '道具名稱',
                      dataIndex: 'name',
                      key: 'name',
                      width: 160,
                      render: (t: string) => (
                        <span className='font-semibold text-stone-100'>
                          <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '類型',
                      dataIndex: 'category',
                      key: 'category',
                      width: 150,
                      render: (c: string) => (
                        <span className='meta-tag'>
                          <Highlight text={c} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '效果說明',
                      dataIndex: 'effect',
                      key: 'effect',
                      render: (e: string) => <Highlight text={e} query={query} />,
                    },
                    {
                      title: '使用時機',
                      dataIndex: 'timing',
                      key: 'timing',
                      render: (t: string) => (
                        <span className='text-xs text-stone-400'>
                          <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                  ]}
                  renderCard={(b) => (
                    <div className='subsurface space-y-1.5 p-3 text-xs'>
                      <div className='flex items-center justify-between gap-2'>
                        <span className='font-semibold text-stone-100'>
                          <Highlight text={b.name} query={query} />
                        </span>
                        <span className='meta-tag'>
                          <Highlight text={b.category} query={query} />
                        </span>
                      </div>
                      <p className='text-stone-300'>
                        <Highlight text={b.effect} query={query} />
                      </p>
                      <p className='text-[11px] text-stone-400'>
                        時機：<Highlight text={b.timing} query={query} />
                      </p>
                    </div>
                  )}
                />
              ),
            },
          ]
        : []),
    ];

    return allSections;
  }, [filtered, query]);

  const allKeys = useMemo(() => items.map((it) => String(it.key)), [items]);
  const effectiveActiveKeys = query.trim() ? allKeys : activeKeys;

  const toggleSection = (key: string) => {
    setActiveKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div>
      <PageHeader
        navKey='miscGuide'
        stats={[
          { label: '收錄分類', value: 10 },
          { label: '符合條目', value: filtered?.total ?? 0 },
        ]}
        extra={
          allKeys.length > 0 && !query.trim() ? (
            <div className='flex flex-wrap items-center gap-1.5'>
              <span className='mr-1 text-xs text-stone-500'>快速切換章節：</span>
              {allKeys.map((key) => {
                const isOpen = activeKeys.includes(key);
                return (
                  <button
                    key={key}
                    type='button'
                    onClick={() => toggleSection(key)}
                    className={cx(
                      'focus-ring rounded border px-2 py-0.5 text-xs transition-colors',
                      isOpen
                        ? 'border-gold-500/60 bg-gold-500/15 text-gold-300'
                        : 'border-obsidian-700 bg-obsidian-900 text-stone-400 hover:border-stone-600 hover:text-stone-200'
                    )}
                  >
                    {SECTION_SHORT_LABELS[key] ?? key}
                  </button>
                );
              })}
            </div>
          ) : undefined
        }
      />

      <Toolbar>
        <div className='min-w-[240px] flex-1'>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder='搜尋樂譜、技能／悟性點、方舟星圖、裝等路線、戰鬥道具、符文或每日委託…'
          />
        </div>
        {!query.trim() && allKeys.length > 0 && (
          <div className='flex items-center gap-1.5'>
            <Button size='middle' onClick={() => setActiveKeys(allKeys)}>
              全部展開
            </Button>
            <Button size='middle' onClick={() => setActiveKeys([])}>
              全部收合
            </Button>
          </div>
        )}
      </Toolbar>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {items.length === 0 ? (
          <EmptyResult query={query} onReset={() => setQuery('')} />
        ) : (
          <Collapse
            items={items}
            activeKey={effectiveActiveKeys}
            onChange={(keys) =>
              setActiveKeys(Array.isArray(keys) ? keys.map(String) : [String(keys)])
            }
            expandIconPlacement='end'
            className='!border-obsidian-700/80 !bg-transparent'
          />
        )}
      </QueryState>
    </div>
  );
}
