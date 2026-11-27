import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Empty, Input, Modal, type InputRef } from 'antd';
import { EnterOutlined, SearchOutlined } from '@ant-design/icons';
import { getNavItem, NAV_ITEMS } from '@/config/navigation';
import {
  useGetAdventureBooksQuery,
  useGetCollectiblesQuery,
  useGetFavorabilitiesQuery,
  useGetMiscGuideQuery,
  useGetRaidChestsQuery,
  useGetSystemsQuery,
} from '@/services/gameApi';
import { cx } from '@/utils/cx';
import { matchesQuery } from '@/utils/text';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface SearchHit {
  id: string;
  title: string;
  subtitle: string;
  to: string;
  badge: string;
  icon: (typeof NAV_ITEMS)[number]['icon'];
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const inputRef = useRef<InputRef>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: favorabilities = [] } = useGetFavorabilitiesQuery(undefined, { skip: !open });
  const { data: adventureBooks = [] } = useGetAdventureBooksQuery(undefined, { skip: !open });
  const { data: collectibles } = useGetCollectiblesQuery(undefined, { skip: !open });
  const { data: raidChests } = useGetRaidChestsQuery(undefined, { skip: !open });
  const { data: miscGuide } = useGetMiscGuideQuery(undefined, { skip: !open });
  const { data: systems } = useGetSystemsQuery(undefined, { skip: !open });

  const results = useMemo<SearchHit[]>(() => {
    const pageHits: SearchHit[] = NAV_ITEMS.filter((item) =>
      matchesQuery(query, item.title, item.shortTitle, item.description, item.keywords)
    ).map((item) => ({
      id: `page-${item.key}`,
      title: item.title,
      subtitle: item.description,
      to: item.path,
      badge: '分類頁面',
      icon: item.icon,
    }));

    const trimmed = query.trim();
    if (!trimmed) return pageHits;

    const favorNav = getNavItem('favorability');
    const npcHits: SearchHit[] = favorabilities
      .filter((f) => matchesQuery(trimmed, f.npc, f.locations, Object.values(f.rewards).flat()))
      .slice(0, 4)
      .map((f) => ({
        id: `npc-${f.id}`,
        title: f.npc,
        subtitle: `${f.locations.join(' / ')} · 需求 ${f.maxAffinity.toLocaleString()}`,
        to: `${favorNav.path}?q=${encodeURIComponent(f.npc)}`,
        badge: '好感度',
        icon: favorNav.icon,
      }));

    const raidNav = getNavItem('raidChests');
    const raidHits: SearchHit[] = (raidChests?.raids ?? [])
      .filter((r) =>
        matchesQuery(trimmed, r.name, r.nameEn, r.ilvl, r.tier, r.difficulty, r.weakness)
      )
      .slice(0, 4)
      .map((r) => ({
        id: `raid-${r.nameEn}-${r.difficulty ?? '普通'}`,
        title: `${r.name} (${r.difficulty ?? '普通'})`,
        subtitle: `${r.tier ?? 'T3'} · 裝等 ${r.ilvl} · 通關 ${r.totalGold.toLocaleString()}G`,
        to: `${raidNav.path}?q=${encodeURIComponent(r.name)}`,
        badge: '副本',
        icon: raidNav.icon,
      }));

    const colNav = getNavItem('collectibles');
    const islandHits: SearchHit[] = (collectibles?.islandTokens.items ?? [])
      .filter((it) => matchesQuery(trimmed, it.island, it.source, it.note))
      .slice(0, 3)
      .map((it, idx) => ({
        id: `island-${idx}-${it.island}`,
        title: `${it.island ?? '島之心'}`,
        subtitle: it.source,
        to: `${colNav.path}?tab=islandTokens&q=${encodeURIComponent(it.island ?? trimmed)}`,
        badge: '島之心',
        icon: colNav.icon,
      }));

    const advNav = getNavItem('adventureBook');
    const regionHits: SearchHit[] = adventureBooks
      .filter((b) => matchesQuery(trimmed, b.region, b.milestones.map((m) => m.reward)))
      .slice(0, 3)
      .map((b) => ({
        id: `adv-${b.id}`,
        title: b.region,
        subtitle: `冒險之書 · ${b.milestones.length} 項關鍵里程碑`,
        to: `${advNav.path}?q=${encodeURIComponent(b.region)}`,
        badge: '冒險之書',
        icon: advNav.icon,
      }));

    const sysNav = getNavItem('systems');
    const sysHits: SearchHit[] = [
      ...(systems?.wanderingMerchants ?? [])
        .filter((m) => matchesQuery(trimmed, m.continent, m.merchant, m.cards, m.note))
        .map((m) => ({
          id: `merchant-${m.continent}`,
          title: `${m.continent}流浪商人 · ${m.merchant}`,
          subtitle: m.cards,
          to: `${sysNav.path}?tab=merchants&q=${encodeURIComponent(m.continent)}`,
          badge: '流浪商人',
          icon: sysNav.icon,
        })),
      ...(systems?.bracelets ?? [])
        .filter((b) => matchesQuery(trimmed, b.name, b.effect, b.role))
        .map((b) => ({
          id: `bracelet-${b.name}`,
          title: b.name,
          subtitle: b.effect,
          to: `${sysNav.path}?tab=bracelets&q=${encodeURIComponent(trimmed)}`,
          badge: 'T4手鐲',
          icon: sysNav.icon,
        })),
      ...(systems?.gearSystems ?? [])
        .filter((g) => matchesQuery(trimmed, g.system, g.unlock, g.details))
        .map((g) => ({
          id: `gear-${g.system}`,
          title: g.system,
          subtitle: `${g.unlock} · ${g.goal}`,
          to: `${sysNav.path}?tab=gearSystems&q=${encodeURIComponent(trimmed)}`,
          badge: '養成系統',
          icon: sysNav.icon,
        })),
    ].slice(0, 4);

    const miscNav = getNavItem('miscGuide');
    const miscHits: SearchHit[] = [
      ...(miscGuide?.guardianRaids ?? [])
        .filter((g) => matchesQuery(trimmed, g.name, g.ilvl, g.weakness, g.battleItems))
        .map((g) => ({
          id: `guardian-${g.name}`,
          title: g.name,
          subtitle: `裝等 ${g.ilvl} · ${g.weakness} · ${g.battleItems}`,
          to: `${miscNav.path}?section=guardianRaids&q=${encodeURIComponent(trimmed)}`,
          badge: '守護者',
          icon: miscNav.icon,
        })),
      ...(miscGuide?.newClasses ?? [])
        .filter((c) => matchesQuery(trimmed, c.className, c.archetype, c.arkPassiveBuilds))
        .map((c) => ({
          id: `class-${c.className}`,
          title: c.className,
          subtitle: `${c.archetype} · ${c.arkPassiveBuilds}`,
          to: `${miscNav.path}?section=newClasses&q=${encodeURIComponent(trimmed)}`,
          badge: '職業流派',
          icon: miscNav.icon,
        })),
      ...(miscGuide?.songs ?? [])
        .filter((s) => matchesQuery(trimmed, s.name, s.source))
        .map((s) => ({
          id: `song-${s.name}`,
          title: s.name,
          subtitle: s.source,
          to: `${miscNav.path}?section=songs&q=${encodeURIComponent(s.name)}`,
          badge: '樂譜',
          icon: miscNav.icon,
        })),
      ...(miscGuide?.runes ?? [])
        .filter((r) => matchesQuery(trimmed, r.rune, r.heroic, r.legendary))
        .map((r) => ({
          id: `rune-${r.rune}`,
          title: `${r.rune}符文`,
          subtitle: r.legendary || r.heroic,
          to: `${miscNav.path}?section=runes&q=${encodeURIComponent(r.rune)}`,
          badge: '符文',
          icon: miscNav.icon,
        })),
    ].slice(0, 4);

    return [
      ...pageHits,
      ...raidHits,
      ...sysHits,
      ...miscHits,
      ...npcHits,
      ...islandHits,
      ...regionHits,
    ];
  }, [query, favorabilities, adventureBooks, collectibles, raidChests, miscGuide, systems]);

  const go = (hit: SearchHit) => {
    onClose();
    navigate(hit.to);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      go(results[activeIndex]);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={640}
      title={null}
      afterOpenChange={(visible) => {
        if (visible) {
          inputRef.current?.focus();
        } else {
          setQuery('');
          setActiveIndex(0);
        }
      }}
    >
      <Input
        ref={inputRef}
        size='large'
        variant='borderless'
        prefix={<SearchOutlined className='mr-2 text-brand' />}
        placeholder='輸入中英文關鍵字搜尋副本、NPC、手鐲詞條、守護者或商人（如：貝爾加丁、瓦爾格里斯）…'
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={onKeyDown}
        aria-label='全站快速搜尋'
        className='text-base'
      />
      <div className='my-3 h-px bg-line' />

      {results.length > 0 ? (
        <ul role='listbox' aria-label='搜尋結果' className='max-h-96 space-y-1 overflow-y-auto pr-1'>
          {results.map((hit, index) => {
            const Icon = hit.icon;
            const isActive = index === activeIndex;
            return (
              <li key={hit.id} role='option' aria-selected={isActive}>
                <button
                  type='button'
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => go(hit)}
                  className={cx(
                    'flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-left transition-colors',
                    isActive ? 'bg-brand/12' : 'hover:bg-elevated'
                  )}
                >
                  <span
                    className={cx(
                      'grid size-8 shrink-0 place-items-center rounded-lg border',
                      isActive
                        ? 'border-brand/35 bg-brand/15 text-brand'
                        : 'border-line bg-subtle text-muted'
                    )}
                  >
                    <Icon className='text-sm' />
                  </span>
                  <span className='min-w-0 flex-1 space-y-0.5'>
                    <span className='flex items-center gap-2.5'>
                      <span className='truncate text-sm font-semibold text-ink'>{hit.title}</span>
                      <span className='shrink-0 rounded-md border border-line bg-subtle px-2 py-0.5 text-xs font-medium text-sub'>
                        {hit.badge}
                      </span>
                    </span>
                    <span className='block truncate text-xs text-muted'>{hit.subtitle}</span>
                  </span>
                  {isActive && <EnterOutlined className='shrink-0 text-sm text-brand' />}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className='py-8'>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='找不到相符的資料庫項目' />
        </div>
      )}

      <div className='mt-4 flex flex-wrap items-center gap-5 border-t border-line pt-3 text-xs text-muted'>
        <span className='flex items-center gap-1.5'>
          <kbd>↑</kbd>
          <kbd>↓</kbd> 選擇項目
        </span>
        <span className='flex items-center gap-1.5'>
          <kbd>Enter</kbd> 前往頁面
        </span>
        <span className='flex items-center gap-1.5'>
          <kbd>Esc</kbd> 關閉視窗
        </span>
        <span className='ml-auto hidden sm:inline'>平時按 Q 鍵即可隨時開啟</span>
      </div>
    </Modal>
  );
}
