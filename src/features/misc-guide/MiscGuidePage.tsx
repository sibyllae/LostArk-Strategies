import { useMemo, useState } from 'react';
import { Badge, Collapse, Tag, type CollapseProps } from 'antd';
import {
  ApartmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  ExperimentOutlined,
  FireOutlined,
  IdcardOutlined,
  RocketOutlined,
  StarOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import ResponsiveList from '@/components/ui/ResponsiveList';
import SearchInput from '@/components/ui/SearchInput';
import Toolbar from '@/components/ui/Toolbar';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetMiscGuideQuery } from '@/services/gameApi';
import { matchesQuery } from '@/utils/text';

export default function MiscGuidePage() {
  const { data, isLoading, isError, refetch } = useGetMiscGuideQuery();
  const [query, setQuery] = useSearchQuery();
  const [activeKeys, setActiveKeys] = useState<string[]>(['songs']);

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
      ...(filtered.songs.length > 0
        ? [
            {
              key: 'songs',
              label: (
                <span className='flex items-center gap-2 font-semibold text-zinc-100'>
                  <CustomerServiceOutlined className='text-purple-400' />
                  <span>重要樂譜/曲譜取得一覽</span>
                  <Badge count={filtered.songs.length} style={{ backgroundColor: '#8b5cf6' }} />
                </span>
              ),
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
                        <span className='font-bold text-purple-300'>
                          🎵 <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '取得途徑',
                      dataIndex: 'source',
                      key: 'source',
                      render: (t: string) => <Highlight text={t} query={query} />,
                    },
                    {
                      title: '備註',
                      dataIndex: 'note',
                      key: 'note',
                      render: (n: string) =>
                        n ? (
                          <span className='text-xs text-amber-400/90'>
                            ⚠ <Highlight text={n} query={query} />
                          </span>
                        ) : null,
                    },
                  ]}
                  renderCard={(s) => (
                    <div className='space-y-1 rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-xs'>
                      <span className='block text-sm font-bold text-purple-300'>
                        🎵 <Highlight text={s.name} query={query} />
                      </span>
                      <p className='text-zinc-300'>
                        <Highlight text={s.source} query={query} />
                      </p>
                      {s.note && (
                        <p className='text-amber-400/80'>
                          ⚠ <Highlight text={s.note} query={query} />
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
              label: (
                <span className='flex items-center gap-2 font-semibold text-zinc-100'>
                  <ThunderboltOutlined className='text-yellow-400' />
                  <span>技能點數 (+3) 任務清單</span>
                  <Badge
                    count={filtered.skillPoints.length}
                    style={{ backgroundColor: '#eab308' }}
                  />
                </span>
              ),
              children: (
                <div className='grid gap-2 sm:grid-cols-2'>
                  {filtered.skillPoints.map((sp, idx) => (
                    <div
                      key={idx}
                      className='flex items-start gap-3 rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-xs'
                    >
                      <Tag color='gold' className='!m-0 shrink-0 font-mono font-bold'>
                        #{idx + 1}
                      </Tag>
                      <div>
                        <p className='font-medium text-zinc-200'>
                          <Highlight text={sp.task} query={query} />
                        </p>
                        {sp.note && (
                          <p className='mt-1 text-[11px] text-amber-400/80'>
                            ⚠ <Highlight text={sp.note} query={query} />
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
                <span className='flex items-center gap-2 font-semibold text-zinc-100'>
                  <StarOutlined className='text-amber-400' />
                  <span>T4 悟性點數 (方舟被動) 取得來源</span>
                  <Badge
                    count={filtered.enlightenmentPoints.length}
                    style={{ backgroundColor: '#f59e0b' }}
                  />
                </span>
              ),
              children: (
                <div className='grid gap-2 sm:grid-cols-2'>
                  {filtered.enlightenmentPoints.map((ep, idx) => (
                    <div
                      key={idx}
                      className='flex items-start gap-3 rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-xs'
                    >
                      <Tag color='orange' className='!m-0 shrink-0 font-mono font-bold'>
                        #{idx + 1}
                      </Tag>
                      <div>
                        <p className='font-medium text-zinc-200'>
                          <Highlight text={ep.task} query={query} />
                        </p>
                        {ep.note && (
                          <p className='mt-1 text-[11px] text-amber-400/80'>
                            ⚠ <Highlight text={ep.note} query={query} />
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
              label: (
                <span className='flex items-center gap-2 font-semibold text-zinc-100'>
                  <ExperimentOutlined className='text-cyan-400' />
                  <span>高階技能符文取得方式 (英雄/傳說)</span>
                  <Badge count={filtered.runes.length} style={{ backgroundColor: '#06b6d4' }} />
                </span>
              ),
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
                        <Tag color='cyan' className='font-bold'>
                          <Highlight text={r} query={query} />
                        </Tag>
                      ),
                    },
                    {
                      title: '英雄等級',
                      dataIndex: 'heroic',
                      key: 'heroic',
                      render: (v: string) => (
                        <span className='text-xs text-purple-300'>
                          {v ? <Highlight text={v} query={query} /> : '-'}
                        </span>
                      ),
                    },
                    {
                      title: '傳說等級',
                      dataIndex: 'legendary',
                      key: 'legendary',
                      render: (v: string) => (
                        <span className='text-xs font-medium text-amber-300'>
                          {v ? <Highlight text={v} query={query} /> : '-'}
                        </span>
                      ),
                    },
                    {
                      title: '備註說明',
                      dataIndex: 'legendaryNote',
                      key: 'legendaryNote',
                      render: (v: string) => (
                        <span className='text-xs text-zinc-500'>
                          {v ? <Highlight text={v} query={query} /> : '-'}
                        </span>
                      ),
                    },
                  ]}
                  renderCard={(r) => (
                    <div className='space-y-1.5 rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-xs'>
                      <Tag color='cyan' className='!m-0 font-bold'>
                        <Highlight text={r.rune} query={query} />
                      </Tag>
                      {r.heroic && (
                        <p className='text-purple-300'>
                          <span className='text-zinc-500'>英雄：</span>
                          <Highlight text={r.heroic} query={query} />
                        </p>
                      )}
                      {r.legendary && (
                        <p className='text-amber-300'>
                          <span className='text-zinc-500'>傳說：</span>
                          <Highlight text={r.legendary} query={query} />
                        </p>
                      )}
                      {r.legendaryNote && (
                        <p className='text-[11px] text-zinc-500'>
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
              label: (
                <span className='flex items-center gap-2 font-semibold text-zinc-100'>
                  <IdcardOutlined className='text-rose-400' />
                  <span>核心實用卡牌組合推薦</span>
                  <Badge count={filtered.cardSets.length} style={{ backgroundColor: '#f43f5e' }} />
                </span>
              ),
              children: (
                <div className='space-y-6'>
                  {filtered.cardSets.map((cs, i) => (
                    <div key={i} className='rounded-2xl border border-white/5 bg-zinc-900/40 p-4'>
                      <h3 className='mb-3 flex items-center gap-2 text-base font-bold text-zinc-100'>
                        <span className='size-2 rounded-full bg-rose-400' />
                        <Highlight text={cs.setName} query={query} />
                      </h3>
                      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
                        {cs.cards.map((card, ci) => (
                          <div
                            key={ci}
                            className='flex items-center gap-2 rounded-xl border border-white/5 bg-zinc-950/60 p-2.5 text-xs'
                          >
                            <Tag color='magenta' className='!m-0 shrink-0 font-medium'>
                              <Highlight text={card.name} query={query} />
                            </Tag>
                            <span className='truncate text-zinc-400' title={card.source}>
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
              label: (
                <span className='flex items-center gap-2 font-semibold text-zinc-100'>
                  <ClockCircleOutlined className='text-orange-400' />
                  <span>日常週期與次數限制</span>
                  <Badge
                    count={filtered.dailyLimits.length}
                    style={{ backgroundColor: '#f97316' }}
                  />
                </span>
              ),
              children: (
                <ResponsiveList
                  data={filtered.dailyLimits.map((dl, i) => ({ ...dl, key: i }))}
                  columns={[
                    {
                      title: '遊戲內容',
                      dataIndex: 'content',
                      key: 'content',
                      width: 200,
                      render: (t: string) => <Highlight text={t} query={query} />,
                    },
                    {
                      title: '次數限制',
                      dataIndex: 'limit',
                      key: 'limit',
                      width: 180,
                      render: (v: string) => (
                        <Tag color='orange'>
                          <Highlight text={v} query={query} />
                        </Tag>
                      ),
                    },
                    {
                      title: '說明',
                      dataIndex: 'note',
                      key: 'note',
                      render: (t: string) => <Highlight text={t} query={query} />,
                    },
                  ]}
                  renderCard={(dl) => (
                    <div className='flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-xs'>
                      <div>
                        <span className='block font-semibold text-zinc-200'>
                          <Highlight text={dl.content} query={query} />
                        </span>
                        <span className='text-[11px] text-zinc-500'>
                          <Highlight text={dl.note} query={query} />
                        </span>
                      </div>
                      <Tag color='orange' className='!m-0 shrink-0'>
                        <Highlight text={dl.limit} query={query} />
                      </Tag>
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
              label: (
                <span className='flex items-center gap-2 font-semibold text-zinc-100'>
                  <CalendarOutlined className='text-emerald-400' />
                  <span>艾波娜每日委託聲望推薦</span>
                  <Badge
                    count={filtered.dailyQuests.length}
                    style={{ backgroundColor: '#10b981' }}
                  />
                </span>
              ),
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
                      render: (t: string) => <Highlight text={t} query={query} />,
                    },
                    {
                      title: '地點',
                      dataIndex: 'location',
                      key: 'location',
                      width: 140,
                      render: (t: string) => <Highlight text={t} query={query} />,
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
                      render: (t: string) => <Highlight text={t} query={query} />,
                    },
                    {
                      title: '需求天數',
                      dataIndex: 'requiredDays',
                      key: 'requiredDays',
                      width: 100,
                      render: (d: number) => (d > 0 ? <Tag color='green'>{d}天</Tag> : '-'),
                    },
                  ]}
                  renderCard={(dq) => (
                    <div className='space-y-1.5 rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-xs'>
                      <div className='flex items-center justify-between'>
                        <span className='font-bold text-emerald-300'>
                          <Highlight text={dq.name} query={query} />
                        </span>
                        {dq.requiredDays > 0 && (
                          <Tag color='green' className='!m-0'>
                            {dq.requiredDays}天
                          </Tag>
                        )}
                      </div>
                      <p className='text-zinc-400'>
                        📍 <Highlight text={dq.location} query={query} />
                      </p>
                      <p className='text-zinc-300'>
                        每日：<Highlight text={dq.dailyReward} query={query} />
                      </p>
                      {dq.reputationReward && (
                        <p className='font-medium text-amber-300'>
                          🏆 聲望獎勵：<Highlight text={dq.reputationReward} query={query} />
                        </p>
                      )}
                    </div>
                  )}
                />
              ),
            },
          ]
        : []),
      ...(filtered.progressionRoadmap.length > 0
        ? [
            {
              key: 'progressionRoadmap',
              label: (
                <span className='flex items-center gap-2 font-semibold text-zinc-100'>
                  <RocketOutlined className='text-sky-400' />
                  <span>裝等養成與系統解鎖路線 (1415 → 1730)</span>
                  <Badge
                    count={filtered.progressionRoadmap.length}
                    style={{ backgroundColor: '#0ea5e9' }}
                  />
                </span>
              ),
              children: (
                <ResponsiveList
                  data={filtered.progressionRoadmap.map((p, i) => ({ ...p, key: i }))}
                  columns={[
                    {
                      title: '裝等區間',
                      dataIndex: 'ilvl',
                      key: 'ilvl',
                      width: 130,
                      render: (t: string) => (
                        <Tag color='blue' className='font-mono font-bold'>
                          <Highlight text={t} query={query} />
                        </Tag>
                      ),
                    },
                    {
                      title: '核心副本／階段',
                      dataIndex: 'milestone',
                      key: 'milestone',
                      render: (t: string) => (
                        <span className='font-medium text-zinc-100'>
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
                        <span className='text-xs text-zinc-400'>
                          <Highlight text={n} query={query} />
                        </span>
                      ),
                    },
                  ]}
                  renderCard={(p) => (
                    <div className='space-y-1.5 rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-xs'>
                      <div className='flex items-center justify-between gap-2'>
                        <Tag color='blue' className='!m-0 font-mono font-bold'>
                          <Highlight text={p.ilvl} query={query} />
                        </Tag>
                        <span className='font-semibold text-sky-300'>
                          <Highlight text={p.system} query={query} />
                        </span>
                      </div>
                      <p className='font-medium text-zinc-200'>
                        <Highlight text={p.milestone} query={query} />
                      </p>
                      <p className='text-[11px] text-zinc-400'>
                        <Highlight text={p.note} query={query} />
                      </p>
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
              label: (
                <span className='flex items-center gap-2 font-semibold text-zinc-100'>
                  <ApartmentOutlined className='text-indigo-400' />
                  <span>T4 方舟星圖 (Ark Grid) 機制速查</span>
                  <Badge
                    count={filtered.arkGrid.length}
                    style={{ backgroundColor: '#6366f1' }}
                  />
                </span>
              ),
              children: (
                <div className='grid gap-2 sm:grid-cols-2'>
                  {filtered.arkGrid.map((item, idx) => (
                    <div
                      key={idx}
                      className='rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-xs'
                    >
                      <span className='mb-1 block font-bold text-indigo-300'>
                        <Highlight text={item.topic} query={query} />
                      </span>
                      <p className='text-zinc-200'>
                        <Highlight text={item.detail} query={query} />
                      </p>
                      {item.note && (
                        <p className='mt-1 text-[11px] text-amber-400/80'>
                          ⚠ <Highlight text={item.note} query={query} />
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
              label: (
                <span className='flex items-center gap-2 font-semibold text-zinc-100'>
                  <FireOutlined className='text-red-400' />
                  <span>副本常用戰鬥道具速查表</span>
                  <Badge
                    count={filtered.battleItems.length}
                    style={{ backgroundColor: '#ef4444' }}
                  />
                </span>
              ),
              children: (
                <ResponsiveList
                  data={filtered.battleItems.map((b, i) => ({ ...b, key: i }))}
                  columns={[
                    {
                      title: '道具名稱',
                      dataIndex: 'name',
                      key: 'name',
                      width: 170,
                      render: (t: string) => (
                        <span className='font-bold text-zinc-100'>
                          <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                    {
                      title: '類型',
                      dataIndex: 'category',
                      key: 'category',
                      width: 170,
                      render: (c: string) => (
                        <Tag color='volcano'>
                          <Highlight text={c} query={query} />
                        </Tag>
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
                        <span className='text-xs text-zinc-400'>
                          <Highlight text={t} query={query} />
                        </span>
                      ),
                    },
                  ]}
                  renderCard={(b) => (
                    <div className='space-y-1.5 rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-xs'>
                      <div className='flex items-center justify-between gap-2'>
                        <span className='font-bold text-zinc-100'>
                          <Highlight text={b.name} query={query} />
                        </span>
                        <Tag color='volcano' className='!m-0'>
                          <Highlight text={b.category} query={query} />
                        </Tag>
                      </div>
                      <p className='text-zinc-300'>
                        <Highlight text={b.effect} query={query} />
                      </p>
                      <p className='text-[11px] text-zinc-400'>
                        ⏱ <Highlight text={b.timing} query={query} />
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

  const effectiveActiveKeys = query.trim() ? items.map((it) => String(it.key)) : activeKeys;

  return (
    <div>
      <PageHeader
        navKey='miscGuide'
        stats={[
          { label: '收錄分類', value: 10 },
          { label: '符合條目', value: filtered?.total ?? 0 },
        ]}
      />

      <Toolbar>
        <div className='min-w-[240px] flex-1'>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder='搜尋樂譜、技能／悟性點、方舟星圖、裝等路線、戰鬥道具、符文或每日委託…'
          />
        </div>
      </Toolbar>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {items.length === 0 ? (
          <EmptyResult query={query} onReset={() => setQuery('')} />
        ) : (
          <Collapse
            items={items}
            activeKey={effectiveActiveKeys}
            onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys.map(String) : [String(keys)])}
            expandIconPlacement='end'
            className='!border-white/10 !bg-transparent'
          />
        )}
      </QueryState>
    </div>
  );
}
