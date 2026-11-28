import { useCallback, useMemo, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AnchorJumpCloud, { type AnchorJumpItem } from '@/components/ui/AnchorJumpCloud';
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
import VisualTilePicker, {
  type SubGroupShortcut,
  type VisualTileOption,
} from '@/components/ui/VisualTilePicker';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { useGetMiscGuideQuery } from '@/services/gameApi';
import { cx } from '@/utils/cx';
import { matchesWithAliases, toAnchorId } from '@/utils/slug';

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
  | 'shipsAndSailors'
  | 'terminologyMap'
  | 'lifeSkills'
  | 'songs'
  | 'dailyLimits'
  | 'dailyQuests';

const SECTION_TILES: ReadonlyArray<VisualTileOption<SectionKey>> = [
  { key: 'progressionRoadmap', label: '裝等路線', sub: '快車→1780+', glyph: 'roadmap', toneClass: 'text-setgreen', group: '戰鬥與流派' },
  { key: 'guardianRaids', label: 'T4 守護者', sub: '弱點＆G格擋', glyph: 'guardian', toneClass: 'text-crimson', group: '戰鬥與流派' },
  { key: 'newClasses', label: '全職業流派', sub: '13大體系總覽', glyph: 'class', toneClass: 'text-gold', group: '戰鬥與流派' },
  { key: 'arkGrid', label: '方舟星圖', sub: '17點質變', glyph: 'arkgrid', toneClass: 'text-magic', group: '戰鬥與流派' },
  { key: 'battleItems', label: '戰鬥道具', sub: '無力/破壞/睡眠', glyph: 'bomb', toneClass: 'text-roll', group: '戰鬥與流派' },
  { key: 'cardSets', label: '卡組＆種族傷', sub: '光卡/四屬/惡魔', glyph: 'card', toneClass: 'text-magic', group: '角色底蘊養成' },
  { key: 'enlightenmentPoints', label: 'T4 悟性點', sub: 'Enlightenment', glyph: 'enlightenment', toneClass: 'text-rare', group: '角色底蘊養成' },
  { key: 'skillPoints', label: '技能點藥水', sub: '+3/+6＆Lv.70', glyph: 'skill', toneClass: 'text-setgreen', group: '角色底蘊養成' },
  { key: 'runes', label: '技能符文', sub: '英雄/傳說', glyph: 'rune', toneClass: 'text-purple-400', group: '角色底蘊養成' },
  { key: 'songs', label: '重要樂譜', sub: '15 首曲譜', glyph: 'song', toneClass: 'text-tealbar', group: '角色底蘊養成' },
  { key: 'shipsAndSailors', label: '大航海船員', sub: '盧米納斯/海盜', glyph: 'ship', toneClass: 'text-tealbar', group: '航海生活與譯名' },
  { key: 'terminologyMap', label: '跨服譯名對照', sub: '台/國際/改制', glyph: 'translate', toneClass: 'text-gold', group: '航海生活與譯名' },
  { key: 'lifeSkills', label: 'T4 生活製作', sub: '阿比多斯融合', glyph: 'lifeskill', toneClass: 'text-setgreen', group: '航海生活與譯名' },
  { key: 'dailyLimits', label: '日常週常', sub: '次數上限', glyph: 'clock', toneClass: 'text-sub', group: '航海生活與譯名' },
  { key: 'dailyQuests', label: '艾波娜委託', sub: '聲望終極獎', glyph: 'quest', toneClass: 'text-gold', group: '航海生活與譯名' },
];

const SUB_GROUPS: ReadonlyArray<SubGroupShortcut<SectionKey>> = [
  { label: '戰鬥與流派', targetKey: 'progressionRoadmap', count: 5 },
  { label: '角色底蘊養成', targetKey: 'cardSets', count: 5 },
  { label: '航海生活與譯名', targetKey: 'shipsAndSailors', count: 5 },
];

const isValidSection = (val: string | null): val is SectionKey =>
  SECTION_TILES.some((c) => c.key === val);

interface RenderedSection {
  key: SectionKey;
  title: string;
  count: number;
  totalCount: number;
  anchors?: AnchorJumpItem[];
  node: ReactNode;
}

export default function MiscGuidePage() {
  const { data, isLoading, isError, refetch } = useGetMiscGuideQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useSearchQuery();

  const secParam = searchParams.get('section');
  const activeSection: SectionKey = isValidSection(secParam) ? secParam : 'progressionRoadmap';

  const setActiveSection = useCallback(
    (key: SectionKey) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('section', key);
          next.delete('q');
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const sections = useMemo<RenderedSection[]>(() => {
    if (!data) return [];

    const progressionRoadmap = (data.progressionRoadmap ?? []).filter((p) =>
      matchesWithAliases(query, p.ilvl, p.milestone, p.system, p.note)
    );
    const guardianRaids = (data.guardianRaids ?? []).filter((g) =>
      matchesWithAliases(query, g.name, g.ilvl, g.weakness, g.battleItems, g.mechanics)
    );
    const newClasses = (data.newClasses ?? []).filter((c) =>
      matchesWithAliases(query, c.className, c.archetype, c.releaseTag, c.arkPassiveBuilds, c.highlights)
    );
    const arkGrid = (data.arkGrid ?? []).filter((a) =>
      matchesWithAliases(query, a.topic, a.detail, a.note)
    );
    const battleItems = (data.battleItems ?? []).filter((b) =>
      matchesWithAliases(query, b.name, b.category, b.effect, b.timing)
    );
    const enlightenmentPoints = (data.enlightenmentPoints ?? []).filter((ep) =>
      matchesWithAliases(query, ep.task, ep.note)
    );
    const skillPoints = (data.skillPoints ?? []).filter((sp) =>
      matchesWithAliases(query, sp.task, sp.note)
    );
    const cardSets = (data.cardSets ?? []).filter((cs) =>
      matchesWithAliases(
        query,
        cs.setName,
        cs.cards.map((c) => `${c.name} ${c.source}`)
      )
    );
    const cardRaceBonuses = (data.cardRaceBonuses ?? []).filter((cr) =>
      matchesWithAliases(query, cr.race, cr.raceEn, cr.maxBonus, cr.targetRaids, cr.keyCards)
    );
    const runes = (data.runes ?? []).filter((r) =>
      matchesWithAliases(query, r.rune, r.heroic, r.legendary, r.legendaryNote)
    );
    const shipsAndSailors = (data.shipsAndSailors ?? []).filter((s) =>
      matchesWithAliases(query, s.ship, s.shipEn, s.unlock, s.strengths, s.coreSailors, s.note)
    );
    const terminologyMap = (data.terminologyMap ?? []).filter((t) =>
      matchesWithAliases(query, t.category, t.twTerm, t.globalEn, t.communityAlias, t.t4ChangeNote)
    );
    const lifeSkills = (data.lifeSkills ?? []).filter((l) =>
      matchesWithAliases(query, l.skill, l.skillEn, l.t4Material, l.toolStats, l.note)
    );
    const songs = (data.songs ?? []).filter((s) =>
      matchesWithAliases(query, s.name, s.source, s.note)
    );
    const dailyLimits = (data.dailyLimits ?? []).filter((dl) =>
      matchesWithAliases(query, dl.content, dl.limit, dl.note)
    );
    const dailyQuests = (data.dailyQuests ?? []).filter((dq) =>
      matchesWithAliases(query, dq.name, dq.location, dq.dailyReward, dq.reputationReward)
    );

    return [
      {
        key: 'progressionRoadmap',
        title: '裝等養成與系統解鎖路線 (新手快車 → 1780+)',
        count: progressionRoadmap.length,
        totalCount: data.progressionRoadmap?.length ?? 0,
        node: (
          <ResponsiveList
            data={progressionRoadmap.map((p, i) => ({ ...p, key: i }))}
            isDiffRow={(p) => p.ilvl.includes('1640') || p.ilvl.includes('1680') || p.ilvl.includes('1750')}
            columns={[
              {
                title: '裝等區間',
                dataIndex: 'ilvl',
                key: 'ilvl',
                width: 150,
                render: (t: string) => (
                  <span className='meta-tag font-semibold text-roll'>
                    <Highlight text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '核心副本 / 里程碑',
                dataIndex: 'milestone',
                key: 'milestone',
                render: (t: string) => (
                  <span className='font-semibold text-gold'>
                    <Highlight text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '解鎖系統',
                dataIndex: 'system',
                key: 'system',
                render: (t: string) => (
                  <span className='text-magic'>
                    <StatRangeText text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '養成建議',
                dataIndex: 'note',
                key: 'note',
                render: (n: string) => (
                  <span className='text-xs text-sub'>
                    <StatRangeText text={n} query={query} />
                  </span>
                ),
              },
            ]}
            renderCard={(p) => (
              <div className='surface space-y-1.5 p-3'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='meta-tag font-semibold text-roll'>
                    <Highlight text={p.ilvl} query={query} />
                  </span>
                  <span className='text-xs font-semibold text-magic'>
                    <Highlight text={p.system} query={query} />
                  </span>
                </div>
                <p className='text-[13.5px] font-semibold text-gold'>
                  <Highlight text={p.milestone} query={query} />
                </p>
                <p className='text-xs text-sub'>
                  <StatRangeText text={p.note} query={query} />
                </p>
              </div>
            )}
          />
        ),
      },
      {
        key: 'guardianRaids',
        title: 'T4 守護者討伐＆殘影輪替道具速查',
        count: guardianRaids.length,
        totalCount: data.guardianRaids?.length ?? 0,
        anchors: guardianRaids.map((g) => ({
          id: toAnchorId('grd', g.name),
          label: g.name.split(' ')[0],
          sub: g.ilvl,
        })),
        node: (
          <div className='space-y-3'>
            {guardianRaids.map((g, i) => {
              const id = toAnchorId('grd', g.name);
              return (
                <DataCard3Zone
                  key={i}
                  id={id}
                  scopeBadge={{ label: 'Just Guard (G)', tone: 'warning' }}
                  title={<Highlight text={g.name} query={query} />}
                  subtitleEn={`ILVL ${g.ilvl}`}
                  visual={
                    <div className='flex flex-col items-center justify-center gap-0.5'>
                      <GlyphIcon name='guardian' className='size-5 text-crimson' />
                      <span className='font-mono text-xs font-semibold tabular-nums text-roll'>
                        {g.ilvl.split('/')[0]}
                      </span>
                    </div>
                  }
                  baseSpecs={[
                    { label: '入場裝等', value: g.ilvl, highlight: true },
                    {
                      label: '屬性弱點',
                      value: (
                        <button
                          type='button'
                          onClick={() => setActiveSection('cardSets')}
                          className='text-magic hover:underline'
                        >
                          {g.weakness}
                        </button>
                      ),
                    },
                  ]}
                  footerMeta={`GUARDIAN RAID · #${id}`}
                >
                  <ul className='space-y-1.5'>
                    <li className='font-semibold text-gold'>
                      ⬩ 野團推薦道具：<Highlight text={g.battleItems} query={query} />
                    </li>
                    <li className='text-magic'>
                      ⬩ 關鍵機制應對：<StatRangeText text={g.mechanics} query={query} />
                    </li>
                  </ul>
                </DataCard3Zone>
              );
            })}
          </div>
        ),
      },
      {
        key: 'newClasses',
        title: '全職業熱門流派與 2025–2026 新職指南',
        count: newClasses.length,
        totalCount: data.newClasses?.length ?? 0,
        anchors: newClasses.map((c) => ({
          id: toAnchorId('cls', c.className),
          label: c.className.split(' ')[0],
        })),
        node: (
          <div className='space-y-3'>
            {newClasses.map((c, i) => {
              const id = toAnchorId('cls', c.className);
              return (
                <DataCard3Zone
                  key={i}
                  id={id}
                  scopeBadge={{ label: c.releaseTag, tone: 'attribute' }}
                  title={<Highlight text={c.className} query={query} />}
                  subtitleEn={c.archetype}
                  visual={
                    <div className='flex flex-col items-center justify-center gap-0.5'>
                      <GlyphIcon name='class' className='size-5 text-gold' />
                      <span className='font-mono text-[10px] text-sub'>ARK T4</span>
                    </div>
                  }
                  baseSpecs={[
                    { label: '系別定位', value: c.archetype },
                    { label: '版本定位', value: c.releaseTag, highlight: true },
                  ]}
                  footerMeta={`CLASS BUILD · #${id}`}
                >
                  <ul className='space-y-1.5'>
                    <li className='font-semibold text-setgreen'>
                      ⬩ 領悟雙流派：<Highlight text={c.arkPassiveBuilds} query={query} />
                    </li>
                    <li className='text-magic'>
                      ⬩ 實戰特色：<StatRangeText text={c.highlights} query={query} />
                    </li>
                  </ul>
                </DataCard3Zone>
              );
            })}
          </div>
        ),
      },
      {
        key: 'arkGrid',
        title: 'T4 方舟星圖 (Ark Grid) 核心與 17 點星石機制',
        count: arkGrid.length,
        totalCount: data.arkGrid?.length ?? 0,
        node: (
          <div className='space-y-3'>
            {arkGrid.map((item, idx) => {
              const id = toAnchorId('grid', item.topic);
              return (
                <DataCard3Zone
                  key={idx}
                  id={id}
                  title={<Highlight text={item.topic} query={query} />}
                  subtitleEn={`Ark Grid #0${idx + 1}`}
                  visual={<GlyphIcon name='arkgrid' className='size-5 text-magic' />}
                  baseSpecs={[{ label: '開啟裝等', value: '1700+', highlight: true }]}
                  footerMeta={`ARK GRID · #${id}`}
                >
                  <ul className='space-y-1.5'>
                    <li className='text-magic'>
                      ⬩ <StatRangeText text={item.detail} query={query} />
                    </li>
                    {item.note && (
                      <li className='text-xs text-sub'>
                        ⬩ 補充：<StatRangeText text={item.note} query={query} />
                      </li>
                    )}
                  </ul>
                </DataCard3Zone>
              );
            })}
          </div>
        ),
      },
      {
        key: 'battleItems',
        title: '副本常用戰鬥道具與野團分配速查',
        count: battleItems.length,
        totalCount: data.battleItems?.length ?? 0,
        node: (
          <ResponsiveList
            data={battleItems.map((b, i) => ({ ...b, key: i }))}
            columns={[
              {
                title: '道具名稱',
                dataIndex: 'name',
                key: 'name',
                width: 180,
                render: (t: string) => (
                  <span className='font-semibold text-gold'>
                    <Highlight text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '戰術分類',
                dataIndex: 'category',
                key: 'category',
                width: 165,
                render: (c: string) => (
                  <span className='meta-tag text-ink'>
                    <Highlight text={c} query={query} />
                  </span>
                ),
              },
              {
                title: '效果數值說明',
                dataIndex: 'effect',
                key: 'effect',
                render: (e: string) => (
                  <span className='text-magic'>
                    <StatRangeText text={e} query={query} />
                  </span>
                ),
              },
              {
                title: '投擲／施放時機',
                dataIndex: 'timing',
                key: 'timing',
                render: (t: string) => (
                  <span className='text-xs text-sub'>
                    <StatRangeText text={t} query={query} />
                  </span>
                ),
              },
            ]}
            renderCard={(b) => (
              <div className='surface space-y-1.5 p-3'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='font-semibold text-gold'>
                    <Highlight text={b.name} query={query} />
                  </span>
                  <span className='meta-tag'>{b.category}</span>
                </div>
                <p className='text-[13px] text-magic'>
                  ⬩ <StatRangeText text={b.effect} query={query} />
                </p>
                <p className='text-xs text-sub'>
                  時機：<StatRangeText text={b.timing} query={query} />
                </p>
              </div>
            )}
          />
        ),
      },
      {
        key: 'cardSets',
        title: '核心卡牌套組 ＆ 圖鑑種族增傷速查',
        count: cardSets.length + cardRaceBonuses.length,
        totalCount: (data.cardSets?.length ?? 0) + (data.cardRaceBonuses?.length ?? 0),
        node: (
          <div className='space-y-5'>
            {cardSets.length > 0 && (
              <div className='space-y-3'>
                {cardSets.map((cs, i) => {
                  const id = toAnchorId('cardset', cs.setName);
                  return (
                    <DataCard3Zone
                      key={i}
                      id={id}
                      titleTone='set'
                      title={<Highlight text={cs.setName} query={query} />}
                      subtitleEn={`${cs.cards.length} Cards`}
                      headerActions={
                        <Link
                          to='/game/systems?tab=merchants&prio=必蹲傳說'
                          className='filter-chip focus-ring py-1 text-xs text-magic'
                        >
                          查流浪商人 →
                        </Link>
                      }
                      visual={<GlyphIcon name='card' className='size-5 text-setgreen' />}
                      baseSpecs={[{ label: '組成數量', value: `${cs.cards.length} 項`, highlight: true }]}
                      footerMeta={`CARD SET · #${id}`}
                    >
                      <div className='grid gap-1.5 sm:grid-cols-2'>
                        {cs.cards.map((card, ci) => (
                          <div key={ci} className='subsurface px-2.5 py-1.5'>
                            <span className='block text-[13px] font-semibold text-gold'>
                              ⬩ <Highlight text={card.name} query={query} />
                            </span>
                            <span className='block text-xs text-sub'>
                              <StatRangeText text={card.source} query={query} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </DataCard3Zone>
                  );
                })}
              </div>
            )}

            {cardRaceBonuses.length > 0 && (
              <div>
                <SectionHeading
                  title='遠征隊卡片圖鑑（書本收集）6 大種族增傷優先表'
                  count={cardRaceBonuses.length}
                  subtitle='黃底高亮列為終局副本覆蓋率最高種族'
                />
                <ResponsiveList
                  data={cardRaceBonuses.map((cr, i) => ({ ...cr, key: i }))}
                  isDiffRow={(cr) => Boolean(cr.highlight)}
                  columns={[
                    {
                      title: '種族增傷類別',
                      key: 'race',
                      width: 195,
                      render: (_, cr) => (
                        <div>
                          <span className='font-semibold text-gold'>
                            <Highlight text={cr.race} query={query} />
                          </span>
                          <span className='block font-mono text-[11px] text-muted'>{cr.raceEn}</span>
                        </div>
                      ),
                    },
                    {
                      title: '滿圖鑑上限',
                      dataIndex: 'maxBonus',
                      key: 'maxBonus',
                      width: 150,
                      render: (v: string) => (
                        <span className='font-mono font-semibold tabular-nums text-roll'>{v}</span>
                      ),
                    },
                    {
                      title: '對應主力副本首領',
                      dataIndex: 'targetRaids',
                      key: 'targetRaids',
                      render: (v: string) => <Highlight text={v} query={query} />,
                    },
                    {
                      title: '關鍵補齊卡源',
                      dataIndex: 'keyCards',
                      key: 'keyCards',
                      render: (v: string) => (
                        <span className='text-xs text-magic'>
                          <Highlight text={v} query={query} />
                        </span>
                      ),
                    },
                  ]}
                  renderCard={(cr) => (
                    <div
                      className={cx(
                        'surface space-y-1.5 p-3',
                        cr.highlight && 'diff-card-highlight'
                      )}
                    >
                      <div className='flex items-center justify-between gap-2'>
                        <span className='font-semibold text-gold'>{cr.race}</span>
                        <span className='meta-tag text-roll'>{cr.maxBonus}</span>
                      </div>
                      <p className='text-xs text-ink'>對應首領：{cr.targetRaids}</p>
                      <p className='text-xs text-magic'>補齊來源：{cr.keyCards}</p>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        ),
      },
      {
        key: 'enlightenmentPoints',
        title: 'T4 悟性／領悟點數 (Enlightenment) 全來源清單',
        count: enlightenmentPoints.length,
        totalCount: data.enlightenmentPoints?.length ?? 0,
        node: (
          <div className='grid gap-2.5 sm:grid-cols-2'>
            {enlightenmentPoints.map((ep, idx) => (
              <div key={idx} className='surface flex items-start gap-2.5 p-3'>
                <span className='meta-tag shrink-0 font-semibold text-roll'>#{idx + 1}</span>
                <div className='space-y-1'>
                  <p className='text-[13.5px] font-semibold text-ink'>
                    <StatRangeText text={ep.task} query={query} />
                  </p>
                  {ep.note && (
                    <p className='text-xs text-sub'>
                      <StatRangeText text={ep.note} query={query} />
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
        title: '戰鬥技能點數藥水 (+3 / +6) 與等級清單',
        count: skillPoints.length,
        totalCount: data.skillPoints?.length ?? 0,
        node: (
          <div className='grid gap-2.5 sm:grid-cols-2'>
            {skillPoints.map((sp, idx) => (
              <div key={idx} className='surface flex items-start gap-2.5 p-3'>
                <span className='meta-tag shrink-0'>#{idx + 1}</span>
                <div className='space-y-1'>
                  <p className='text-[13.5px] font-semibold text-ink'>
                    <StatRangeText text={sp.task} query={query} />
                  </p>
                  {sp.note && (
                    <p className='text-xs text-sub'>
                      <StatRangeText text={sp.note} query={query} />
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        key: 'runes',
        title: '高階技能符文取得方式 (英雄／傳說)',
        count: runes.length,
        totalCount: data.runes?.length ?? 0,
        node: (
          <ResponsiveList
            data={runes.map((r, i) => ({ ...r, key: i }))}
            isDiffRow={(r) => r.rune === '豐饒' || r.rune === '疾風' || r.rune === '淨化'}
            columns={[
              {
                title: '符文',
                dataIndex: 'rune',
                key: 'rune',
                width: 95,
                render: (r: string) => (
                  <span className='meta-tag font-semibold text-gold'>
                    <Highlight text={r} query={query} />
                  </span>
                ),
              },
              {
                title: '英雄等級',
                dataIndex: 'heroic',
                key: 'heroic',
                render: (v: string) => (
                  <span className='text-[13px] text-purple-600 dark:text-purple-300'>
                    {v ? <StatRangeText text={v} query={query} /> : '—'}
                  </span>
                ),
              },
              {
                title: '傳說等級',
                dataIndex: 'legendary',
                key: 'legendary',
                render: (v: string) => (
                  <span className='text-[13px] font-semibold text-gold'>
                    {v ? <StatRangeText text={v} query={query} /> : '—'}
                  </span>
                ),
              },
              {
                title: '實戰效果與前置備註',
                dataIndex: 'legendaryNote',
                key: 'legendaryNote',
                render: (v: string) => (
                  <span className='text-xs text-sub'>
                    {v ? <StatRangeText text={v} query={query} /> : '—'}
                  </span>
                ),
              },
            ]}
            renderCard={(r) => (
              <div className='surface space-y-1.5 p-3 text-[13.5px]'>
                <span className='meta-tag font-semibold text-gold'>{r.rune}</span>
                {r.heroic && (
                  <p className='text-purple-600 dark:text-purple-300'>
                    <span className='text-muted'>英雄：</span>
                    <StatRangeText text={r.heroic} query={query} />
                  </p>
                )}
                {r.legendary && (
                  <p className='font-semibold text-gold'>
                    <span className='font-normal text-muted'>傳說：</span>
                    <StatRangeText text={r.legendary} query={query} />
                  </p>
                )}
                {r.legendaryNote && (
                  <p className='text-xs text-sub'>
                    <StatRangeText text={r.legendaryNote} query={query} />
                  </p>
                )}
              </div>
            )}
          />
        ),
      },
      {
        key: 'shipsAndSailors',
        title: '大航海主力船隻與遺物船員配置 (含 2026 盧米納斯號)',
        count: shipsAndSailors.length,
        totalCount: data.shipsAndSailors?.length ?? 0,
        anchors: shipsAndSailors.map((s) => ({
          id: toAnchorId('ship', s.shipEn),
          label: s.ship,
        })),
        node: (
          <div className='space-y-3'>
            {shipsAndSailors.map((s, i) => {
              const id = toAnchorId('ship', s.shipEn);
              return (
                <DataCard3Zone
                  key={i}
                  id={id}
                  scopeBadge={
                    s.ship.includes('盧米納斯')
                      ? { label: '2026 免費 Lv.6', tone: 'group' }
                      : s.ship.includes('阿斯特雷伊')
                        ? { label: '極速畢業', tone: 'warning' }
                        : undefined
                  }
                  title={<Highlight text={s.ship} query={query} />}
                  subtitleEn={s.shipEn}
                  visual={<GlyphIcon name='ship' className='size-5 text-tealbar' />}
                  baseSpecs={[
                    { label: '取得方式', value: s.unlock.split('＋')[0], highlight: true },
                  ]}
                  footerMeta={`SAILING · #${id}`}
                >
                  <ul className='space-y-1.5'>
                    <li className='text-sub'>
                      ⬩ 完整解鎖：<StatRangeText text={s.unlock} query={query} />
                    </li>
                    <li className='font-semibold text-gold'>
                      ⬩ 海域優勢：<Highlight text={s.strengths} query={query} />
                    </li>
                    <li className='text-magic'>
                      ⬩ 推薦核心船員：<Highlight text={s.coreSailors} query={query} />
                    </li>
                    <li className='text-xs text-sub'>
                      ⬩ 戰術評析：<StatRangeText text={s.note} query={query} />
                    </li>
                  </ul>
                </DataCard3Zone>
              );
            })}
          </div>
        ),
      },
      {
        key: 'terminologyMap',
        title: '跨服譯名對照（繁中／國際服英文／玩家俗稱）＆ T4 改制差異表',
        count: terminologyMap.length,
        totalCount: data.terminologyMap?.length ?? 0,
        node: (
          <div className='space-y-3'>
            <div className='surface section-bar-category px-3.5 py-2 text-xs text-sub'>
              <strong className='font-semibold text-rare'>差異高亮說明：</strong>
              黃底高亮列代表進入 <strong className='text-ink'>T4／2026 版本後機制發生重大重製或新增</strong>
              的關鍵系統，方便回鍋或查閱國外 Maxroll／Inven 攻略時瞬間對照。
            </div>
            <ResponsiveList
              data={terminologyMap.map((t, i) => ({ ...t, key: i }))}
              scrollX={880}
              isDiffRow={(t) => Boolean(t.changed)}
              columns={[
                {
                  title: '領域',
                  dataIndex: 'category',
                  key: 'category',
                  width: 105,
                  render: (v: string) => <span className='meta-tag'>{v}</span>,
                },
                {
                  title: '繁中版正式名稱',
                  dataIndex: 'twTerm',
                  key: 'twTerm',
                  width: 210,
                  render: (v: string) => (
                    <span className='font-semibold text-gold'>
                      <Highlight text={v} query={query} />
                    </span>
                  ),
                },
                {
                  title: '國際服 / Canonical 英文',
                  dataIndex: 'globalEn',
                  key: 'globalEn',
                  width: 225,
                  render: (v: string) => (
                    <span className='font-mono text-xs text-magic'>
                      <Highlight text={v} query={query} />
                    </span>
                  ),
                },
                {
                  title: '台／陸／韓社群常用俗稱',
                  dataIndex: 'communityAlias',
                  key: 'communityAlias',
                  width: 195,
                  render: (v: string) => (
                    <span className='text-ink'>
                      <Highlight text={v} query={query} />
                    </span>
                  ),
                },
                {
                  title: 'T4 改制與實戰重點',
                  dataIndex: 't4ChangeNote',
                  key: 't4ChangeNote',
                  render: (v: string) => (
                    <span className='text-xs text-sub'>
                      <StatRangeText text={v} query={query} />
                    </span>
                  ),
                },
              ]}
              renderCard={(t) => (
                <div
                  className={cx(
                    'surface space-y-1.5 p-3',
                    t.changed && 'diff-card-highlight'
                  )}
                >
                  <div className='flex items-center justify-between gap-2'>
                    <span className='font-semibold text-gold'>{t.twTerm}</span>
                    <span className='meta-tag'>{t.category}</span>
                  </div>
                  <p className='font-mono text-xs text-magic'>{t.globalEn}</p>
                  <p className='text-xs text-ink'>俗稱：{t.communityAlias}</p>
                  <p className='text-xs text-sub'>
                    <StatRangeText text={t.t4ChangeNote} query={query} />
                  </p>
                </div>
              )}
            />
          </div>
        ),
      },
      {
        key: 'lifeSkills',
        title: 'T4 生活採集詞條與領地「阿比多斯融合材料」精算指南',
        count: lifeSkills.length,
        totalCount: data.lifeSkills?.length ?? 0,
        node: (
          <ResponsiveList
            data={lifeSkills.map((l, i) => ({ ...l, key: i }))}
            isDiffRow={(l) => l.skill.includes('伐木') || l.skill.includes('考古')}
            columns={[
              {
                title: '生活技能',
                key: 'skill',
                width: 190,
                render: (_, l) => (
                  <div>
                    <span className='font-semibold text-gold'>
                      <Highlight text={l.skill} query={query} />
                    </span>
                    <span className='block font-mono text-[11px] text-muted'>{l.skillEn}</span>
                  </div>
                ),
              },
              {
                title: 'T4 核心產出原料',
                dataIndex: 't4Material',
                key: 't4Material',
                width: 230,
                render: (v: string) => (
                  <span className='text-setgreen'>
                    <Highlight text={v} query={query} />
                  </span>
                ),
              },
              {
                title: '生活工具必洗畢業詞條',
                dataIndex: 'toolStats',
                key: 'toolStats',
                width: 240,
                render: (v: string) => (
                  <span className='text-magic'>
                    <Highlight text={v} query={query} />
                  </span>
                ),
              },
              {
                title: '效率與領地精算建議',
                dataIndex: 'note',
                key: 'note',
                render: (v: string) => (
                  <span className='text-xs text-sub'>
                    <StatRangeText text={v} query={query} />
                  </span>
                ),
              },
            ]}
            renderCard={(l) => (
              <div className='surface space-y-1.5 p-3'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='font-semibold text-gold'>{l.skill}</span>
                  <span className='font-mono text-[11px] text-muted'>{l.skillEn}</span>
                </div>
                <p className='text-xs text-setgreen'>產出：{l.t4Material}</p>
                <p className='text-xs text-magic'>工具詞條：{l.toolStats}</p>
                <p className='text-xs text-sub'>{l.note}</p>
              </div>
            )}
          />
        ),
      },
      {
        key: 'songs',
        title: '重要樂譜／曲譜取得一覽',
        count: songs.length,
        totalCount: data.songs?.length ?? 0,
        node: (
          <ResponsiveList
            data={songs.map((s, i) => ({ ...s, key: i }))}
            columns={[
              {
                title: '樂譜名稱',
                dataIndex: 'name',
                key: 'name',
                width: 190,
                render: (t: string) => (
                  <span className='font-semibold text-gold'>
                    <Highlight text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '取得途徑',
                dataIndex: 'source',
                key: 'source',
                render: (t: string) => (
                  <span className='text-ink'>
                    <StatRangeText text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '用途與備註',
                dataIndex: 'note',
                key: 'note',
                render: (n: string) =>
                  n ? (
                    <span className='text-xs text-sub'>
                      <Highlight text={n} query={query} />
                    </span>
                  ) : null,
              },
            ]}
            renderCard={(s) => (
              <div className='surface space-y-1 p-3'>
                <span className='block font-semibold text-gold'>
                  <Highlight text={s.name} query={query} />
                </span>
                <p className='text-[13.5px] text-ink'>
                  <StatRangeText text={s.source} query={query} />
                </p>
                {s.note && <p className='text-xs text-sub'>{s.note}</p>}
              </div>
            )}
          />
        ),
      },
      {
        key: 'dailyLimits',
        title: '日常與週常內容次數限制',
        count: dailyLimits.length,
        totalCount: data.dailyLimits?.length ?? 0,
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
                width: 215,
                render: (v: string) => (
                  <span className='meta-tag text-roll'>
                    <Highlight text={v} query={query} />
                  </span>
                ),
              },
              {
                title: '機制說明',
                dataIndex: 'note',
                key: 'note',
                render: (t: string) => (
                  <span className='text-xs text-sub'>
                    <StatRangeText text={t} query={query} />
                  </span>
                ),
              },
            ]}
            renderCard={(dl) => (
              <div className='surface space-y-1.5 p-3'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <span className='font-semibold text-ink'>
                    <Highlight text={dl.content} query={query} />
                  </span>
                  <span className='meta-tag text-roll'>{dl.limit}</span>
                </div>
                <p className='text-xs text-sub'>
                  <StatRangeText text={dl.note} query={query} />
                </p>
              </div>
            )}
          />
        ),
      },
      {
        key: 'dailyQuests',
        title: '艾波娜每日委託聲望重要獎勵',
        count: dailyQuests.length,
        totalCount: data.dailyQuests?.length ?? 0,
        node: (
          <ResponsiveList
            data={dailyQuests.map((dq, i) => ({ ...dq, key: i }))}
            scrollX={760}
            isDiffRow={(dq) =>
              dq.reputationReward.includes('悟性') || dq.reputationReward.includes('血爪海圖')
            }
            columns={[
              {
                title: '委託名稱',
                dataIndex: 'name',
                key: 'name',
                width: 195,
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
                  <span className='text-sub'>
                    <Highlight text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '每日回報',
                dataIndex: 'dailyReward',
                key: 'dailyReward',
                width: 120,
                render: (t: string) => <StatRangeText text={t} query={query} />,
              },
              {
                title: '聲望終極獎勵',
                dataIndex: 'reputationReward',
                key: 'reputationReward',
                render: (t: string) => (
                  <span className='font-semibold text-gold'>
                    <StatRangeText text={t} query={query} />
                  </span>
                ),
              },
              {
                title: '需求天數',
                dataIndex: 'requiredDays',
                key: 'requiredDays',
                width: 90,
                render: (d: number) =>
                  d > 0 ? <span className='meta-tag text-roll'>{d} 天</span> : '—',
              },
            ]}
            renderCard={(dq) => (
              <div className='surface space-y-1.5 p-3'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='font-semibold text-ink'>
                    <Highlight text={dq.name} query={query} />
                  </span>
                  {dq.requiredDays > 0 && (
                    <span className='meta-tag text-roll'>{dq.requiredDays} 天</span>
                  )}
                </div>
                <p className='text-xs text-muted'>地點：{dq.location}</p>
                {dq.reputationReward && (
                  <p className='text-[13.5px] font-semibold text-gold'>
                    聲望：<StatRangeText text={dq.reputationReward} query={query} />
                  </p>
                )}
              </div>
            )}
          />
        ),
      },
    ];
  }, [data, query, setActiveSection]);

  const isSearching = query.trim().length > 0;
  const visibleSections = isSearching
    ? sections.filter((s) => s.count > 0)
    : sections.filter((s) => s.key === activeSection);

  const activeSecObj = sections.find((s) => s.key === activeSection);
  const shownCount = isSearching
    ? visibleSections.reduce((sum, s) => sum + s.count, 0)
    : (activeSecObj?.count ?? 0);
  const totalCount = isSearching
    ? sections.reduce((sum, s) => sum + s.totalCount, 0)
    : (activeSecObj?.totalCount ?? 0);

  return (
    <div>
      <PageHeader
        navKey='miscGuide'
        stats={[
          { label: '速查專表', value: SECTION_TILES.length },
          { label: isSearching ? '跨表命中' : '本表條目', value: shownCount },
        ]}
      />

      {/* SKILL.md Section 4C：15 格視覺化子分類圖示磚 + 3 大分組快捷列 */}
      <VisualTilePicker
        options={SECTION_TILES}
        value={activeSection}
        onChange={setActiveSection}
        ariaLabel='百科速查子分類選擇'
        subGroups={SUB_GROUPS}
      />

      <Toolbar
        shownCount={shownCount}
        totalCount={totalCount}
        activeFilters={isSearching ? [`跨表搜尋: ${query.trim()}`] : []}
        onReset={() => setQuery('')}
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder='跨 15 張速查表即時搜尋：輸入守護者、職業（龍騎/女聖/死神）、星圖、盧米納斯、鈍器荊棘或阿比多斯…'
        />
        {isSearching && (
          <p className='text-xs font-semibold text-tealbar'>
            跨表檢索模式 · 共命中 {visibleSections.length} 張速查表（清空搜尋框即可返回單表檢視）
          </p>
        )}
      </Toolbar>

      <QueryState isLoading={isLoading} isError={isError} onRetry={refetch}>
        {visibleSections.length === 0 ? (
          <EmptyResult query={query} onReset={() => setQuery('')} />
        ) : (
          <div className='space-y-5'>
            {visibleSections.map((sec) => (
              <section key={sec.key} className='animate-fade-in'>
                <SectionHeading title={sec.title} count={sec.count} />
                {!isSearching && sec.anchors && <AnchorJumpCloud items={sec.anchors} />}
                {sec.node}
              </section>
            ))}
          </div>
        )}
      </QueryState>
    </div>
  );
}
