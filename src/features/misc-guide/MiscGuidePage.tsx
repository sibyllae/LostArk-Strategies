import { useMemo, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmptyResult from '@/components/ui/EmptyResult';
import Highlight from '@/components/ui/Highlight';
import PageHeader from '@/components/ui/PageHeader';
import QueryState from '@/components/ui/QueryState';
import ResponsiveList from '@/components/ui/ResponsiveList';
import SearchInput from '@/components/ui/SearchInput';
import SectionHeading from '@/components/ui/SectionHeading';
import Toolbar from '@/components/ui/Toolbar';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetMiscGuideQuery } from '@/services/gameApi';
import { cx } from '@/utils/cx';
import { matchesQuery } from '@/utils/text';

type SectionKey =
  | 'progressionRoadmap'
  | 'guardianRaids'
  | 'newClasses'
  | 'arkGrid'
  | 'battleItems'
  | 'enlightenmentPoints'
  | 'skillPoints'
  | 'cardSets'
  | 'runes'
  | 'songs'
  | 'dailyLimits'
  | 'dailyQuests';

interface ChapterItem {
  key: SectionKey;
  num: string;
  label: string;
}

interface ChapterGroup {
  group: string;
  items: ChapterItem[];
}

const CHAPTER_GROUPS: ChapterGroup[] = [
  {
    group: '終局拓荒與職業',
    items: [
      { key: 'progressionRoadmap', num: '01', label: '裝等養成路線 (新手→1780)' },
      { key: 'guardianRaids', num: '02', label: 'T4 守護者討伐＆殘影' },
      { key: 'newClasses', num: '03', label: '新職業＆方舟被動流派' },
      { key: 'arkGrid', num: '04', label: '方舟星圖 (Ark Grid)' },
      { key: 'battleItems', num: '05', label: '副本戰鬥道具速查' },
    ],
  },
  {
    group: '遠征隊角色底蘊',
    items: [
      { key: 'enlightenmentPoints', num: '06', label: 'T4 悟性點數來源' },
      { key: 'skillPoints', num: '07', label: '技能點數 (+3/+6) 清單' },
      { key: 'cardSets', num: '08', label: '核心屬性卡組推薦' },
      { key: 'runes', num: '09', label: '高階技能符文取得' },
      { key: 'songs', num: '10', label: '重要樂譜／曲譜' },
    ],
  },
  {
    group: '日常與聲望週期',
    items: [
      { key: 'dailyLimits', num: '11', label: '日常週常次數限制' },
      { key: 'dailyQuests', num: '12', label: '艾波娜委託聲望推薦' },
    ],
  },
];

const ALL_CHAPTERS: ChapterItem[] = CHAPTER_GROUPS.flatMap((g) => g.items);

const isValidSection = (val: string | null): val is SectionKey =>
  ALL_CHAPTERS.some((c) => c.key === val);

interface RenderedSection {
  key: SectionKey;
  num: string;
  title: string;
  count: number;
  node: ReactNode;
}

export default function MiscGuidePage() {
  const { data, isLoading, isError, refetch } = useGetMiscGuideQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useSearchQuery();

  const secParam = searchParams.get('section');
  const activeSection: SectionKey = isValidSection(secParam) ? secParam : 'progressionRoadmap';

  const setActiveSection = (key: SectionKey) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('section', key);
        return next;
      },
      { replace: true }
    );
  };

  const sections = useMemo<RenderedSection[]>(() => {
    if (!data) return [];

    const progressionRoadmap = (data.progressionRoadmap ?? []).filter((p) =>
      matchesQuery(query, p.ilvl, p.milestone, p.system, p.note)
    );
    const guardianRaids = (data.guardianRaids ?? []).filter((g) =>
      matchesQuery(query, g.name, g.ilvl, g.weakness, g.battleItems, g.mechanics)
    );
    const newClasses = (data.newClasses ?? []).filter((c) =>
      matchesQuery(query, c.className, c.archetype, c.releaseTag, c.arkPassiveBuilds, c.highlights)
    );
    const arkGrid = (data.arkGrid ?? []).filter((a) =>
      matchesQuery(query, a.topic, a.detail, a.note)
    );
    const battleItems = (data.battleItems ?? []).filter((b) =>
      matchesQuery(query, b.name, b.category, b.effect, b.timing)
    );
    const enlightenmentPoints = (data.enlightenmentPoints ?? []).filter((ep) =>
      matchesQuery(query, ep.task, ep.note)
    );
    const skillPoints = data.skillPoints.filter((sp) => matchesQuery(query, sp.task, sp.note));
    const cardSets = data.cardSets.filter((cs) =>
      matchesQuery(
        query,
        cs.setName,
        cs.cards.map((c) => `${c.name} ${c.source}`)
      )
    );
    const runes = data.runes.filter((r) =>
      matchesQuery(query, r.rune, r.heroic, r.legendary, r.legendaryNote)
    );
    const songs = data.songs.filter((s) => matchesQuery(query, s.name, s.source, s.note));
    const dailyLimits = data.dailyLimits.filter((dl) =>
      matchesQuery(query, dl.content, dl.limit, dl.note)
    );
    const dailyQuests = data.dailyQuests.filter((dq) =>
      matchesQuery(query, dq.name, dq.location, dq.dailyReward, dq.reputationReward)
    );

    return [
      {
        key: 'progressionRoadmap',
        num: '01',
        title: '裝等養成與系統解鎖路線 (新手快車 → 1780+)',
        count: progressionRoadmap.length,
        node: (
          <div className='space-y-4'>
            {progressionRoadmap.map((p, i) => (
              <article
                key={i}
                className='surface grid gap-4 p-6 md:grid-cols-[170px_1fr] md:items-center'
              >
                <div className='border-b border-line pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-5'>
                  <span className='font-mono text-xs font-medium text-muted'>STAGE 0{i + 1}</span>
                  <p className='mt-1 font-mono text-base font-bold text-brand'>
                    <Highlight text={p.ilvl} query={query} />
                  </p>
                </div>
                <div className='space-y-2'>
                  <div className='flex flex-wrap items-center justify-between gap-2.5'>
                    <h3 className='text-base font-bold text-ink'>
                      <Highlight text={p.milestone} query={query} />
                    </h3>
                    <span className='chip tone-sky text-xs'>
                      <Highlight text={p.system} query={query} />
                    </span>
                  </div>
                  <p className='text-sm leading-relaxed text-sub'>
                    <Highlight text={p.note} query={query} />
                  </p>
                </div>
              </article>
            ))}
          </div>
        ),
      },
      {
        key: 'guardianRaids',
        num: '02',
        title: 'T4 守護者討伐＆殘影輪替道具速查',
        count: guardianRaids.length,
        node: (
          <div className='grid gap-6 md:grid-cols-2'>
            {guardianRaids.map((g, i) => (
              <article key={i} className='surface flex flex-col justify-between p-6'>
                <div className='space-y-3.5'>
                  <div className='flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3.5'>
                    <h3 className='text-lg font-bold text-ink'>
                      <Highlight text={g.name} query={query} />
                    </h3>
                    <span className='chip tone-gold font-mono text-xs font-bold'>
                      裝等 <Highlight text={g.ilvl} query={query} />
                    </span>
                  </div>

                  <p className='text-sm text-sub'>
                    弱點剋制：
                    <strong className='text-ink'>
                      <Highlight text={g.weakness} query={query} />
                    </strong>
                  </p>

                  <div className='subsurface px-4 py-2.5 text-sm font-semibold text-brand'>
                    推薦道具：<Highlight text={g.battleItems} query={query} />
                  </div>

                  <p className='text-sm leading-relaxed text-sub'>
                    <Highlight text={g.mechanics} query={query} />
                  </p>
                </div>
              </article>
            ))}
          </div>
        ),
      },
      {
        key: 'newClasses',
        num: '03',
        title: '2025–2026 新職業與方舟被動流派指南',
        count: newClasses.length,
        node: (
          <div className='grid gap-6 md:grid-cols-2'>
            {newClasses.map((c, i) => (
              <article key={i} className='surface flex flex-col justify-between p-6'>
                <div className='space-y-3.5'>
                  <div className='flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3.5'>
                    <h3 className='text-lg font-bold text-ink'>
                      <Highlight text={c.className} query={query} />
                    </h3>
                    <span className='chip tone-gold text-xs'>
                      <Highlight text={c.releaseTag} query={query} />
                    </span>
                  </div>
                  <p className='text-xs font-medium text-muted'>
                    定位：<Highlight text={c.archetype} query={query} />
                  </p>
                  <p className='subsurface border-l-4 border-l-brand px-4 py-2.5 text-sm font-semibold text-ink'>
                    流派：<Highlight text={c.arkPassiveBuilds} query={query} />
                  </p>
                  <p className='text-sm leading-relaxed text-sub'>
                    <Highlight text={c.highlights} query={query} />
                  </p>
                </div>
              </article>
            ))}
          </div>
        ),
      },
      {
        key: 'arkGrid',
        num: '04',
        title: 'T4 方舟星圖 (Ark Grid) 核心與星石機制',
        count: arkGrid.length,
        node: (
          <div className='grid gap-5 sm:grid-cols-2'>
            {arkGrid.map((item, idx) => (
              <div key={idx} className='surface space-y-2.5 p-6'>
                <span className='font-mono text-xs font-semibold text-brand'>重點 0{idx + 1}</span>
                <h3 className='text-base font-bold text-ink'>
                  <Highlight text={item.topic} query={query} />
                </h3>
                <p className='text-sm leading-relaxed text-sub'>
                  <Highlight text={item.detail} query={query} />
                </p>
                {item.note && (
                  <p className='border-t border-line pt-3 text-xs leading-relaxed text-muted'>
                    <Highlight text={item.note} query={query} />
                  </p>
                )}
              </div>
            ))}
          </div>
        ),
      },
      {
        key: 'battleItems',
        num: '05',
        title: '副本常用戰鬥道具速查表',
        count: battleItems.length,
        node: (
          <ResponsiveList
            data={battleItems.map((b, i) => ({ ...b, key: i }))}
            columns={[
              {
                title: '道具名稱',
                dataIndex: 'name',
                key: 'name',
                width: 175,
                render: (t: string) => (
                  <span className='font-semibold text-ink'>
                    <Highlight text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '分類',
                dataIndex: 'category',
                key: 'category',
                width: 165,
                render: (c: string) => (
                  <span className='chip tone-gold text-xs'>
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
                title: '投擲／施放時機',
                dataIndex: 'timing',
                key: 'timing',
                render: (t: string) => (
                  <span className='text-xs leading-relaxed text-sub'>
                    <Highlight text={t} query={query} />
                  </span>
                ),
              },
            ]}
            renderCard={(b) => (
              <div className='surface space-y-2 p-5'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-base font-bold text-ink'>
                    <Highlight text={b.name} query={query} />
                  </span>
                  <span className='chip tone-gold text-xs'>
                    <Highlight text={b.category} query={query} />
                  </span>
                </div>
                <p className='text-sm text-sub'>
                  <Highlight text={b.effect} query={query} />
                </p>
                <p className='text-xs leading-relaxed text-muted'>
                  時機：<Highlight text={b.timing} query={query} />
                </p>
              </div>
            )}
          />
        ),
      },
      {
        key: 'enlightenmentPoints',
        num: '06',
        title: 'T4 悟性／領悟點數 (Enlightenment) 全來源清單',
        count: enlightenmentPoints.length,
        node: (
          <div className='grid gap-4 sm:grid-cols-2'>
            {enlightenmentPoints.map((ep, idx) => (
              <div key={idx} className='surface flex items-start gap-3.5 p-5'>
                <span className='meta-tag shrink-0 font-mono tabular-nums text-brand'>
                  #{idx + 1}
                </span>
                <div className='space-y-1.5'>
                  <p className='text-sm font-semibold leading-relaxed text-ink'>
                    <Highlight text={ep.task} query={query} />
                  </p>
                  {ep.note && (
                    <p className='text-xs leading-relaxed text-sub'>
                      <Highlight text={ep.note} query={query} />
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        key: 'skillPoints',
        num: '07',
        title: '戰鬥技能點數藥水 (+3 / +6) 任務清單',
        count: skillPoints.length,
        node: (
          <div className='grid gap-4 sm:grid-cols-2'>
            {skillPoints.map((sp, idx) => (
              <div key={idx} className='surface flex items-start gap-3.5 p-5'>
                <span className='meta-tag shrink-0 font-mono tabular-nums'>#{idx + 1}</span>
                <div className='space-y-1.5'>
                  <p className='text-sm font-semibold leading-relaxed text-ink'>
                    <Highlight text={sp.task} query={query} />
                  </p>
                  {sp.note && (
                    <p className='text-xs leading-relaxed text-sub'>
                      <Highlight text={sp.note} query={query} />
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        key: 'cardSets',
        num: '08',
        title: 'T3／T4 核心實用卡牌套組推薦',
        count: cardSets.length,
        node: (
          <div className='space-y-6'>
            {cardSets.map((cs, i) => (
              <div key={i} className='surface p-6'>
                <h3 className='mb-4 border-l-4 border-brand pl-3 text-base font-bold text-ink'>
                  <Highlight text={cs.setName} query={query} />
                </h3>
                <div className='grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3'>
                  {cs.cards.map((card, ci) => (
                    <div key={ci} className='subsurface space-y-1 p-4'>
                      <span className='block text-sm font-bold text-brand'>
                        <Highlight text={card.name} query={query} />
                      </span>
                      <span className='block text-xs leading-relaxed text-sub'>
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
      {
        key: 'runes',
        num: '09',
        title: '高階技能符文取得方式 (英雄／傳說)',
        count: runes.length,
        node: (
          <ResponsiveList
            data={runes.map((r, i) => ({ ...r, key: i }))}
            columns={[
              {
                title: '符文',
                dataIndex: 'rune',
                key: 'rune',
                width: 110,
                render: (r: string) => (
                  <span className='meta-tag text-ink'>
                    <Highlight text={r} query={query} />
                  </span>
                ),
              },
              {
                title: '英雄等級',
                dataIndex: 'heroic',
                key: 'heroic',
                render: (v: string) => (
                  <span className='text-sm text-purple-700 dark:text-purple-300'>
                    {v ? <Highlight text={v} query={query} /> : '—'}
                  </span>
                ),
              },
              {
                title: '傳說等級',
                dataIndex: 'legendary',
                key: 'legendary',
                render: (v: string) => (
                  <span className='text-sm font-semibold text-brand'>
                    {v ? <Highlight text={v} query={query} /> : '—'}
                  </span>
                ),
              },
              {
                title: '前置與備註',
                dataIndex: 'legendaryNote',
                key: 'legendaryNote',
                render: (v: string) => (
                  <span className='text-xs leading-relaxed text-sub'>
                    {v ? <Highlight text={v} query={query} /> : '—'}
                  </span>
                ),
              },
            ]}
            renderCard={(r) => (
              <div className='surface space-y-2 p-5 text-sm'>
                <span className='meta-tag text-ink'>
                  <Highlight text={r.rune} query={query} />
                </span>
                {r.heroic && (
                  <p className='text-purple-700 dark:text-purple-300'>
                    <span className='text-muted'>英雄：</span>
                    <Highlight text={r.heroic} query={query} />
                  </p>
                )}
                {r.legendary && (
                  <p className='font-semibold text-brand'>
                    <span className='font-normal text-muted'>傳說：</span>
                    <Highlight text={r.legendary} query={query} />
                  </p>
                )}
                {r.legendaryNote && (
                  <p className='text-xs text-sub'>
                    <Highlight text={r.legendaryNote} query={query} />
                  </p>
                )}
              </div>
            )}
          />
        ),
      },
      {
        key: 'songs',
        num: '10',
        title: '重要樂譜／曲譜取得一覽',
        count: songs.length,
        node: (
          <ResponsiveList
            data={songs.map((s, i) => ({ ...s, key: i }))}
            columns={[
              {
                title: '樂譜名稱',
                dataIndex: 'name',
                key: 'name',
                width: 200,
                render: (t: string) => (
                  <span className='font-semibold text-ink'>
                    <Highlight text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '取得途徑',
                dataIndex: 'source',
                key: 'source',
                render: (t: string) => (
                  <span className='text-sm text-sub'>
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
                    <span className='text-xs text-brand'>
                      <Highlight text={n} query={query} />
                    </span>
                  ) : null,
              },
            ]}
            renderCard={(s) => (
              <div className='surface space-y-1.5 p-5'>
                <span className='block text-base font-bold text-ink'>
                  <Highlight text={s.name} query={query} />
                </span>
                <p className='text-sm text-sub'>
                  <Highlight text={s.source} query={query} />
                </p>
                {s.note && (
                  <p className='text-xs text-brand'>
                    <Highlight text={s.note} query={query} />
                  </p>
                )}
              </div>
            )}
          />
        ),
      },
      {
        key: 'dailyLimits',
        num: '11',
        title: '日常與週常內容次數限制',
        count: dailyLimits.length,
        node: (
          <ResponsiveList
            data={dailyLimits.map((dl, i) => ({ ...dl, key: i }))}
            columns={[
              {
                title: '遊戲內容',
                dataIndex: 'content',
                key: 'content',
                width: 230,
                render: (t: string) => (
                  <span className='font-semibold text-ink'>
                    <Highlight text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '次數限制',
                dataIndex: 'limit',
                key: 'limit',
                width: 210,
                render: (v: string) => (
                  <span className='chip tone-gold text-xs'>
                    <Highlight text={v} query={query} />
                  </span>
                ),
              },
              {
                title: '機制說明',
                dataIndex: 'note',
                key: 'note',
                render: (t: string) => (
                  <span className='text-sm leading-relaxed text-sub'>
                    <Highlight text={t} query={query} />
                  </span>
                ),
              },
            ]}
            renderCard={(dl) => (
              <div className='surface space-y-2 p-5'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <span className='text-base font-bold text-ink'>
                    <Highlight text={dl.content} query={query} />
                  </span>
                  <span className='chip tone-gold text-xs'>
                    <Highlight text={dl.limit} query={query} />
                  </span>
                </div>
                <p className='text-xs leading-relaxed text-sub'>
                  <Highlight text={dl.note} query={query} />
                </p>
              </div>
            )}
          />
        ),
      },
      {
        key: 'dailyQuests',
        num: '12',
        title: '艾波娜每日委託聲望重要獎勵',
        count: dailyQuests.length,
        node: (
          <ResponsiveList
            data={dailyQuests.map((dq, i) => ({ ...dq, key: i }))}
            scrollX={780}
            columns={[
              {
                title: '委託名稱',
                dataIndex: 'name',
                key: 'name',
                width: 190,
                render: (t: string) => (
                  <span className='font-semibold text-ink'>
                    <Highlight text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '地點',
                dataIndex: 'location',
                key: 'location',
                width: 150,
                render: (t: string) => (
                  <span className='text-sm text-sub'>
                    <Highlight text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '每日回報',
                dataIndex: 'dailyReward',
                key: 'dailyReward',
                width: 130,
                render: (t: string) => <Highlight text={t} query={query} />,
              },
              {
                title: '聲望終極獎勵',
                dataIndex: 'reputationReward',
                key: 'reputationReward',
                render: (t: string) => (
                  <span className='font-semibold text-brand'>
                    <Highlight text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '天數',
                dataIndex: 'requiredDays',
                key: 'requiredDays',
                width: 96,
                render: (d: number) =>
                  d > 0 ? <span className='meta-tag font-mono'>{d} 天</span> : '—',
              },
            ]}
            renderCard={(dq) => (
              <div className='surface space-y-2 p-5'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-base font-bold text-ink'>
                    <Highlight text={dq.name} query={query} />
                  </span>
                  {dq.requiredDays > 0 && (
                    <span className='meta-tag font-mono'>{dq.requiredDays} 天</span>
                  )}
                </div>
                <p className='text-xs text-muted'>
                  地點：<Highlight text={dq.location} query={query} />
                </p>
                {dq.reputationReward && (
                  <p className='text-sm font-semibold text-brand'>
                    聲望獎勵：<Highlight text={dq.reputationReward} query={query} />
                  </p>
                )}
              </div>
            )}
          />
        ),
      },
    ];
  }, [data, query]);

  const countMap = useMemo(() => {
    const map: Record<string, number> = {};
    sections.forEach((s) => {
      map[s.key] = s.count;
    });
    return map;
  }, [sections]);

  const totalMatches = sections.reduce((sum, s) => sum + s.count, 0);
  const isSearching = query.trim().length > 0;
  const visibleSections = isSearching
    ? sections.filter((s) => s.count > 0)
    : sections.filter((s) => s.key === activeSection);

  return (
    <div>
      <PageHeader
        navKey='miscGuide'
        stats={[
          { label: '百科章節', value: ALL_CHAPTERS.length },
          { label: isSearching ? '搜尋命中' : '收錄條目', value: totalMatches },
        ]}
      />

      <Toolbar>
        <div className='min-w-[240px] flex-1'>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder='跨 12 章節同步搜尋：輸入守護者（史可拉奇亞）、新職業（龍騎士/女聖騎）、星圖、符文或樂譜…'
          />
        </div>
        {isSearching && (
          <span className='text-xs font-semibold text-brand'>
            全章節檢索中 · 共命中 {visibleSections.length} 個章節
          </span>
        )}
      </Toolbar>

      {/* 行動版橫向章節膠囊列 */}
      {!isSearching && (
        <div className='mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden'>
          {ALL_CHAPTERS.map((ch) => {
            const active = activeSection === ch.key;
            return (
              <button
                key={ch.key}
                type='button'
                onClick={() => setActiveSection(ch.key)}
                className={cx(
                  'focus-ring shrink-0 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors',
                  active
                    ? 'border-brand bg-brand/12 font-semibold text-brand'
                    : 'border-line bg-surface text-sub'
                )}
              >
                {ch.label}
              </button>
            );
          })}
        </div>
      )}

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        <div className='grid gap-8 lg:grid-cols-[260px_1fr] lg:items-start'>
          {/* 桌面版：左側寬鬆目錄欄 */}
          <aside className='surface sticky top-24 hidden p-4 lg:block'>
            <div className='space-y-5'>
              {CHAPTER_GROUPS.map((grp) => (
                <div key={grp.group} className='space-y-1.5'>
                  <p className='px-3 text-xs font-semibold tracking-wider text-muted'>
                    {grp.group}
                  </p>
                  <ul className='space-y-1'>
                    {grp.items.map((ch) => {
                      const active = !isSearching && activeSection === ch.key;
                      const cnt = countMap[ch.key] ?? 0;
                      return (
                        <li key={ch.key}>
                          <button
                            type='button'
                            onClick={() => {
                              if (isSearching) setQuery('');
                              setActiveSection(ch.key);
                            }}
                            className={cx(
                              'focus-ring flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors',
                              active
                                ? 'bg-brand/12 font-semibold text-brand'
                                : 'text-sub hover:bg-elevated hover:text-ink'
                            )}
                          >
                            <span className='truncate'>{ch.label}</span>
                            <span
                              className={cx(
                                'shrink-0 font-mono text-xs tabular-nums',
                                active || (isSearching && cnt > 0) ? 'text-brand' : 'text-muted'
                              )}
                            >
                              {cnt}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* 右側主內容區 */}
          <div className='min-w-0 space-y-10'>
            {visibleSections.length === 0 ? (
              <EmptyResult query={query} onReset={() => setQuery('')} />
            ) : (
              visibleSections.map((sec) => (
                <section key={sec.key} className='animate-fade-in'>
                  <SectionHeading title={sec.title} count={sec.count} />
                  {sec.node}
                </section>
              ))
            )}
          </div>
        </div>
      </QueryState>
    </div>
  );
}
