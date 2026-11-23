import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Empty, Input, Modal, type InputRef } from 'antd';
import { EnterOutlined, SearchOutlined } from '@ant-design/icons';
import { ACCENTS, getNavItem, NAV_ITEMS, type Accent } from '@/config/navigation';
import {
  useGetAdventureBooksQuery,
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
  accent: Accent;
  badge: string;
  icon: (typeof NAV_ITEMS)[number]['icon'];
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const inputRef = useRef<InputRef>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  // 開啟搜尋時才請求資料並由 RTK Query 自動快取
  const { data: favorabilities = [] } = useGetFavorabilitiesQuery(undefined, { skip: !open });
  const { data: adventureBooks = [] } = useGetAdventureBooksQuery(undefined, { skip: !open });
  const { data: raidChests } = useGetRaidChestsQuery(undefined, { skip: !open });
  const { data: miscGuide } = useGetMiscGuideQuery(undefined, { skip: !open });
  const { data: systems } = useGetSystemsQuery(undefined, { skip: !open });

  const results = useMemo<SearchHit[]>(() => {
    const pageHits: SearchHit[] = NAV_ITEMS.filter((item) =>
      matchesQuery(query, item.title, item.description, item.keywords)
    ).map((item) => ({
      id: `page-${item.key}`,
      title: item.title,
      subtitle: item.description,
      to: item.path,
      accent: item.accent,
      badge: '頁面',
      icon: item.icon,
    }));

    const trimmed = query.trim();
    if (!trimmed) return pageHits;

    const favorNav = getNavItem('favorability');
    const npcHits: SearchHit[] = favorabilities
      .filter((f) => matchesQuery(trimmed, f.npc, f.locations, Object.values(f.rewards).flat()))
      .slice(0, 5)
      .map((f) => ({
        id: `npc-${f.id}`,
        title: f.npc,
        subtitle: `${f.locations.join(' / ')} · 最大好感度 ${f.maxAffinity.toLocaleString()}`,
        to: `${favorNav.path}?q=${encodeURIComponent(f.npc)}`,
        accent: favorNav.accent,
        badge: '好友度',
        icon: favorNav.icon,
      }));

    const advNav = getNavItem('adventureBook');
    const regionHits: SearchHit[] = adventureBooks
      .filter((b) => matchesQuery(trimmed, b.region, b.milestones.map((m) => m.reward)))
      .slice(0, 4)
      .map((b) => ({
        id: `adv-${b.id}`,
        title: b.region,
        subtitle: `冒險之書 · ${b.milestones.length} 項關鍵里程碑`,
        to: `${advNav.path}?q=${encodeURIComponent(b.region)}`,
        accent: advNav.accent,
        badge: '冒險之書',
        icon: advNav.icon,
      }));

    const raidNav = getNavItem('raidChests');
    const raidHits: SearchHit[] = (raidChests?.raids ?? [])
      .filter((r) => matchesQuery(trimmed, r.name, r.nameEn, r.ilvl, r.tier, r.difficulty))
      .slice(0, 4)
      .map((r) => ({
        id: `raid-${r.nameEn}-${r.difficulty ?? '普通'}`,
        title: `${r.name} (${r.difficulty ?? '普通'})`,
        subtitle: `${r.tier ?? 'T3'} · 裝等 ${r.ilvl} · 通關 ${r.totalGold.toLocaleString()}G`,
        to: `${raidNav.path}?q=${encodeURIComponent(r.name)}`,
        accent: raidNav.accent,
        badge: '副本',
        icon: raidNav.icon,
      }));

    const miscNav = getNavItem('miscGuide');
    const miscHits: SearchHit[] = [
      ...(miscGuide?.songs ?? [])
        .filter((s) => matchesQuery(trimmed, s.name, s.source))
        .map((s) => ({
          id: `song-${s.name}`,
          title: `🎵 ${s.name}`,
          subtitle: s.source,
          to: `${miscNav.path}?q=${encodeURIComponent(s.name)}`,
          accent: miscNav.accent,
          badge: '樂譜',
          icon: miscNav.icon,
        })),
      ...(miscGuide?.runes ?? [])
        .filter((r) => matchesQuery(trimmed, r.rune, r.heroic, r.legendary))
        .map((r) => ({
          id: `rune-${r.rune}`,
          title: `${r.rune}符文`,
          subtitle: r.legendary || r.heroic,
          to: `${miscNav.path}?q=${encodeURIComponent(r.rune)}`,
          accent: miscNav.accent,
          badge: '符文',
          icon: miscNav.icon,
        })),
    ].slice(0, 4);

    const sysNav = getNavItem('systems');
    const sysHits: SearchHit[] = (systems?.wanderingMerchants ?? [])
      .filter((m) => matchesQuery(trimmed, m.continent, m.merchant, m.cards))
      .slice(0, 3)
      .map((m) => ({
        id: `merchant-${m.continent}`,
        title: `${m.continent}流浪商人 (${m.merchant})`,
        subtitle: m.cards,
        to: `${sysNav.path}?tab=merchants&q=${encodeURIComponent(m.continent)}`,
        accent: sysNav.accent,
        badge: '流浪商人',
        icon: sysNav.icon,
      }));

    return [...pageHits, ...npcHits, ...regionHits, ...raidHits, ...sysHits, ...miscHits];
  }, [query, favorabilities, adventureBooks, raidChests, miscGuide, systems]);

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
      width={580}
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
        prefix={<SearchOutlined className='mr-1 text-zinc-500' />}
        placeholder='搜尋頁面、NPC、大陸、副本或樂譜（例如：莎夏、伐爾坦、巨人心臟）…'
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={onKeyDown}
        aria-label='全站快速搜尋'
      />
      <div className='my-2 h-px bg-white/5' />

      {results.length > 0 ? (
        <ul role='listbox' aria-label='搜尋結果' className='max-h-80 space-y-1 overflow-y-auto'>
          {results.map((hit, index) => {
            const Icon = hit.icon;
            const accent = ACCENTS[hit.accent];
            const isActive = index === activeIndex;
            return (
              <li key={hit.id} role='option' aria-selected={isActive}>
                <button
                  type='button'
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => go(hit)}
                  className={cx(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                    isActive ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'
                  )}
                >
                  <span
                    className={cx(
                      'grid size-9 shrink-0 place-items-center rounded-lg ring-1',
                      accent.iconBg,
                      accent.text,
                      accent.ring
                    )}
                  >
                    <Icon />
                  </span>
                  <span className='min-w-0 flex-1'>
                    <span className='flex items-center gap-2'>
                      <span className='truncate text-sm font-medium text-zinc-100'>
                        {hit.title}
                      </span>
                      <span className='shrink-0 rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400'>
                        {hit.badge}
                      </span>
                    </span>
                    <span className='block truncate text-xs text-zinc-500'>{hit.subtitle}</span>
                  </span>
                  {isActive && <EnterOutlined className='shrink-0 text-zinc-500' />}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='找不到符合的功能或攻略項目' />
      )}

      <div className='mt-3 flex flex-wrap gap-4 border-t border-white/5 pt-3 text-[11px] text-zinc-500'>
        <span className='flex items-center gap-1'>
          <kbd>↑</kbd>
          <kbd>↓</kbd> 選擇
        </span>
        <span className='flex items-center gap-1'>
          <kbd>Enter</kbd> 前往
        </span>
        <span className='flex items-center gap-1'>
          <kbd>Esc</kbd> 關閉
        </span>
      </div>
    </Modal>
  );
}
