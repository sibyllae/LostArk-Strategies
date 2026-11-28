import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Modal, type InputRef } from 'antd';
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
import { matchesWithAliases, scrollToAndPulseAnchor, toAnchorId } from '@/utils/slug';

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
}

const COLLECTIBLE_SEARCH_META = [
  ['giantHearts', '巨人心臟 (Giant Hearts)'],
  ['bloodclawCharts', '血爪海圖 (Bloodclaw Charts)'],
  ['omniumStars', '奧菲斯之星 (Omnium Stars)'],
  ['islandTokens', '島之心 (Island Souls)'],
  ['masterpieces', '偉大的藝術品 (Masterpieces)'],
  ['memoryOrbs', '記憶八音盒 (Memory Orbs)'],
  ['seaBounties', '航海冒險物 (Sea Bounties)'],
] as const;

/**
 * obsidian-lookup-uiux SKILL.md Section 4F：
 * Q / / / Ctrl+K 喚醒全站多欄位模糊快搜：
 * 1. 同時比對：繁中名稱、英文原名、玩家俗稱別名、父類別與關鍵詞綴
 * 2. ↑ / ↓ 方向鍵自動 scrollIntoView('nearest')，Enter 直達 #slug 錨點，Esc 關閉並還原焦點
 */
export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const inputRef = useRef<InputRef>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
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
      matchesWithAliases(query, item.title, item.shortTitle, item.subtitleEn, item.description, item.keywords)
    ).map((item) => ({
      id: `page-${item.key}`,
      title: `${item.title} (${item.subtitleEn})`,
      subtitle: item.description,
      to: item.path,
      badge: `章節 · ${item.roman}`,
    }));

    const trimmed = query.trim();
    if (!trimmed) return pageHits;

    const raidNav = getNavItem('raidChests');
    const raidHits: SearchHit[] = (raidChests?.raids ?? [])
      .filter((r) =>
        matchesWithAliases(
          trimmed,
          r.name,
          r.nameEn,
          r.ilvl,
          r.tier,
          r.difficulty,
          r.weakness,
          r.sidereals,
          r.battleItems,
          r.gates.map((g) => `${g.gate} ${g.boss ?? ''} ${g.chestContents} ${(g.mechanics ?? []).join(' ')}`)
        )
      )
      .slice(0, 8)
      .map((r) => {
        const slug = toAnchorId('raid', `${r.nameEn}-${r.difficulty ?? '普通'}`);
        return {
          id: slug,
          title: `${r.name} (${r.nameEn} · ${r.difficulty ?? '普通'})`,
          subtitle: `${r.tier ?? 'T3'} · 裝等 ${r.ilvl} · 通關 ${r.totalGold.toLocaleString()}G${r.sidereals ? ` · ${r.sidereals}` : ''}`,
          to: `${raidNav.path}#${slug}`,
          badge: '副本機制/帳本',
        };
      });

    const sysNav = getNavItem('systems');
    const sysHits: SearchHit[] = [
      ...(systems?.engravings ?? [])
        .filter((e) =>
          matchesWithAliases(trimmed, '刻印 engraving 遺物書', e.name, e.nameEn, e.role, e.baseEffect, e.relicBonus, e.note)
        )
        .map((e) => ({
          id: `eng-${e.nameEn}`,
          title: `${e.name} (${e.nameEn})`,
          subtitle: `${e.tier} · 基礎 ${e.baseEffect} ｜ 遺物滿書 ${e.relicBonus}`,
          to: `${sysNav.path}?tab=engravings&q=${encodeURIComponent(e.name)}`,
          badge: 'T4刻印',
        })),
      ...(systems?.bracelets ?? [])
        .filter((b) => matchesWithAliases(trimmed, '手鐲 bracelet', b.name, b.effect, b.role, b.note))
        .map((b) => {
          const slug = toAnchorId('brc', b.name);
          return {
            id: slug,
            title: b.name,
            subtitle: `${b.role} · ${b.effect}`,
            to: `${sysNav.path}?tab=bracelets#${slug}`,
            badge: 'T4手鐲',
          };
        }),
      ...(systems?.accessories ?? [])
        .filter((a) => matchesWithAliases(trimmed, '飾品 研磨 accessory', a.slot, a.role, a.primary, a.rolls, a.note))
        .map((a) => {
          const slug = toAnchorId('acc', `${a.slot}-${a.role}`);
          return {
            id: slug,
            title: `${a.slot} — ${a.role}`,
            subtitle: `${a.primary}${a.rolls ? ` (${a.rolls})` : ''}`,
            to: `${sysNav.path}?tab=accessories#${slug}`,
            badge: 'T4飾品',
          };
        }),
      ...(systems?.t4Gems ?? [])
        .filter((g) => matchesWithAliases(trimmed, 'T4寶石 劫火 光輝 gem', `Lv.${g.level}`, g.doomfireDmg, g.blazingCdr, g.conversionNote))
        .slice(0, 2)
        .map((g) => ({
          id: `gem-${g.level}`,
          title: `T4 寶石 Lv.${g.level} (劫火 ${g.doomfireDmg} / 光輝 ${g.blazingCdr})`,
          subtitle: `基礎攻強 ${g.baseAtkPower} · ${g.conversionNote}`,
          to: `${sysNav.path}?tab=gemsAndHoning`,
          badge: 'T4寶石',
        })),
      ...(systems?.gearSystems ?? [])
        .filter((g) => matchesWithAliases(trimmed, g.system, g.unlock, g.goal, g.details))
        .map((g) => {
          const slug = toAnchorId('sys', g.system);
          return {
            id: slug,
            title: g.system,
            subtitle: `${g.unlock} · ${g.goal}`,
            to: `${sysNav.path}?tab=gearSystems#${slug}`,
            badge: '養成系統',
          };
        }),
      ...(systems?.wanderingMerchants ?? [])
        .filter((m) => matchesWithAliases(trimmed, '流浪商人 merchant', m.continent, m.merchant, m.cards, m.note))
        .map((m) => ({
          id: `merchant-${m.continent}`,
          title: `${m.continent}流浪商人 (${m.merchant})`,
          subtitle: m.cards,
          to: `${sysNav.path}?tab=merchants&q=${encodeURIComponent(m.continent)}`,
          badge: '流浪商人',
        })),
    ].slice(0, 8);

    const miscNav = getNavItem('miscGuide');
    const miscHits: SearchHit[] = [
      ...(miscGuide?.guardianRaids ?? [])
        .filter((g) => matchesWithAliases(trimmed, '守護者 星辰護衛 guardian', g.name, g.ilvl, g.weakness, g.battleItems, g.mechanics))
        .map((g) => {
          const slug = toAnchorId('grd', g.name);
          return {
            id: slug,
            title: g.name,
            subtitle: `裝等 ${g.ilvl} · ${g.weakness} · ${g.battleItems}`,
            to: `${miscNav.path}?section=guardianRaids#${slug}`,
            badge: '守護者',
          };
        }),
      ...(miscGuide?.newClasses ?? [])
        .filter((c) => matchesWithAliases(trimmed, '職業 流派 class', c.className, c.archetype, c.arkPassiveBuilds, c.highlights))
        .map((c) => {
          const slug = toAnchorId('cls', c.className);
          return {
            id: slug,
            title: c.className,
            subtitle: `${c.archetype} · ${c.arkPassiveBuilds}`,
            to: `${miscNav.path}?section=newClasses#${slug}`,
            badge: '職業流派',
          };
        }),
      ...(miscGuide?.arkGrid ?? [])
        .filter((a) => matchesWithAliases(trimmed, '方舟星圖 星石 ark grid', a.topic, a.detail, a.note))
        .map((a) => {
          const slug = toAnchorId('grid', a.topic);
          return {
            id: slug,
            title: `${a.topic} (Ark Grid)`,
            subtitle: a.detail,
            to: `${miscNav.path}?section=arkGrid#${slug}`,
            badge: '方舟星圖',
          };
        }),
      ...(miscGuide?.battleItems ?? [])
        .filter((b) => matchesWithAliases(trimmed, '戰鬥道具 炸彈 藥水', b.name, b.category, b.effect, b.timing))
        .map((b) => ({
          id: `bitem-${b.name}`,
          title: `${b.name} (${b.category})`,
          subtitle: `${b.effect} · ${b.timing}`,
          to: `${miscNav.path}?section=battleItems&q=${encodeURIComponent(b.name)}`,
          badge: '戰鬥道具',
        })),
      ...(miscGuide?.cardSets ?? [])
        .filter((cs) => matchesWithAliases(trimmed, '卡組 卡片', cs.setName, cs.cards.map((c) => `${c.name} ${c.source}`)))
        .map((cs) => ({
          id: `cardset-${cs.setName}`,
          title: cs.setName,
          subtitle: cs.cards.map((c) => c.name).join('、'),
          to: `${miscNav.path}?section=cardSets#${toAnchorId('cardset', cs.setName)}`,
          badge: '卡組',
        })),
      ...(miscGuide?.shipsAndSailors ?? [])
        .filter((s) => matchesWithAliases(trimmed, '船隻 船員 航海 ship', s.ship, s.shipEn, s.coreSailors, s.strengths))
        .map((s) => ({
          id: `ship-${s.shipEn}`,
          title: `${s.ship} (${s.shipEn})`,
          subtitle: `${s.unlock} · 船員：${s.coreSailors}`,
          to: `${miscNav.path}?section=shipsAndSailors#${toAnchorId('ship', s.shipEn)}`,
          badge: '大航海',
        })),
      ...(miscGuide?.terminologyMap ?? [])
        .filter((t) => matchesWithAliases(trimmed, '譯名 術語 對照', t.twTerm, t.globalEn, t.communityAlias, t.t4ChangeNote))
        .map((t) => ({
          id: `term-${t.twTerm}`,
          title: `${t.twTerm} (${t.globalEn})`,
          subtitle: `俗稱：${t.communityAlias} · ${t.t4ChangeNote}`,
          to: `${miscNav.path}?section=terminologyMap&q=${encodeURIComponent(t.twTerm)}`,
          badge: '跨服術語',
        })),
      ...(miscGuide?.lifeSkills ?? [])
        .filter((l) => matchesWithAliases(trimmed, '生活 採集 釣魚 考古 融合', l.skill, l.skillEn, l.t4Material, l.note))
        .map((l) => ({
          id: `life-${l.skillEn}`,
          title: `${l.skill} (${l.skillEn})`,
          subtitle: `${l.t4Material} · ${l.toolStats}`,
          to: `${miscNav.path}?section=lifeSkills&q=${encodeURIComponent(l.skill)}`,
          badge: '生活製作',
        })),
      ...(miscGuide?.runes ?? [])
        .filter((r) => matchesWithAliases(trimmed, '符文 rune', r.rune, r.heroic, r.legendary))
        .map((r) => ({
          id: `rune-${r.rune}`,
          title: `${r.rune}符文`,
          subtitle: r.legendary || r.heroic,
          to: `${miscNav.path}?section=runes&q=${encodeURIComponent(r.rune)}`,
          badge: '技能符文',
        })),
      ...(miscGuide?.songs ?? [])
        .filter((s) => matchesWithAliases(trimmed, '樂譜 曲譜 之歌', s.name, s.source, s.note))
        .map((s) => ({
          id: `song-${s.name}`,
          title: s.name,
          subtitle: s.source,
          to: `${miscNav.path}?section=songs&q=${encodeURIComponent(s.name)}`,
          badge: '樂譜',
        })),
      ...(miscGuide?.dailyQuests ?? [])
        .filter((dq) => matchesWithAliases(trimmed, '艾波娜 委託 每日', dq.name, dq.location, dq.reputationReward))
        .slice(0, 3)
        .map((dq) => ({
          id: `una-${dq.name}`,
          title: `${dq.name} (${dq.location})`,
          subtitle: `聲望獎勵：${dq.reputationReward || dq.dailyReward} (${dq.requiredDays}天)`,
          to: `${miscNav.path}?section=dailyQuests&q=${encodeURIComponent(dq.name)}`,
          badge: '艾波娜委託',
        })),
    ].slice(0, 8);

    const favorNav = getNavItem('favorability');
    const npcHits: SearchHit[] = favorabilities
      .filter((f) =>
        matchesWithAliases(trimmed, '好感度 npc', f.npc, f.locations, f.virtueReq, Object.values(f.rewards).flat())
      )
      .slice(0, 5)
      .map((f) => {
        const slug = toAnchorId('npc', f.id);
        return {
          id: slug,
          title: `${f.npc} (${f.locations.join(' / ')})`,
          subtitle: `最大好感 ${f.maxAffinity.toLocaleString()} pt · 信賴：${f.rewards.trust.join('、') || '—'}`,
          to: `${favorNav.path}?q=${encodeURIComponent(f.npc)}#${slug}`,
          badge: 'NPC好感',
        };
      });

    const colNav = getNavItem('collectibles');
    const colHits: SearchHit[] = [];
    if (collectibles) {
      for (const [tabKey, tabLabel] of COLLECTIBLE_SEARCH_META) {
        const cat = collectibles[tabKey];
        cat.items
          .filter((it) => matchesWithAliases(trimmed, tabLabel, it.island, it.source, it.note))
          .slice(0, 3)
          .forEach((it, idx) => {
            const label = it.island ?? `${tabLabel.split(' ')[0]} #${it.id ?? idx + 1}`;
            colHits.push({
              id: `col-${tabKey}-${it.id ?? idx}-${label}`,
              title: label,
              subtitle: it.source,
              to: `${colNav.path}?tab=${tabKey}&q=${encodeURIComponent(it.island ?? trimmed)}`,
              badge: tabLabel.split(' ')[0],
            });
          });
      }
    }

    const advNav = getNavItem('adventureBook');
    const regionHits: SearchHit[] = adventureBooks
      .filter((b) => matchesWithAliases(trimmed, '冒險之書 伊格涅亞', b.region, b.milestones.map((m) => m.reward)))
      .slice(0, 4)
      .map((b) => {
        const slug = toAnchorId('tome', b.region);
        return {
          id: slug,
          title: `${b.region} (Adventurer's Tome)`,
          subtitle: b.milestones.map((m) => `${m.percent}% ${m.reward}`).slice(0, 4).join(' · '),
          to: `${advNav.path}#${slug}`,
          badge: '冒險之書',
        };
      });

    return [
      ...pageHits,
      ...raidHits,
      ...sysHits,
      ...miscHits,
      ...npcHits,
      ...colHits.slice(0, 6),
      ...regionHits,
    ];
  }, [query, favorabilities, adventureBooks, collectibles, raidChests, miscGuide, systems]);

  // 鍵盤上下移動時確保當前選取列自動捲動進入可視範圍
  useEffect(() => {
    const activeEl = itemRefs.current[activeIndex];
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const go = (hit: SearchHit) => {
    onClose();
    navigate(hit.to);
    const hashIdx = hit.to.indexOf('#');
    if (hashIdx !== -1) {
      const targetId = hit.to.slice(hashIdx + 1);
      window.setTimeout(() => {
        scrollToAndPulseAnchor(targetId);
      }, 90);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (results.length > 0 ? Math.min(index + 1, results.length - 1) : 0));
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
      width={660}
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
      <div className='flex items-center gap-2'>
        <Input
          ref={inputRef}
          size='large'
          variant='borderless'
          prefix={<SearchOutlined className='mr-2 text-gold' />}
          placeholder='輸入中英文、俗稱或血條機制快查（例：牛頭、x130、貝爾加丁、怨恨、劫火、盧米納斯）…'
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          aria-label='全站快速搜尋'
        />
        <span className='meta-tag shrink-0 text-[11px]' aria-live='polite'>
          {results.length} 筆
        </span>
      </div>

      <div className='my-2 h-px bg-line' />

      {results.length > 0 ? (
        <ul
          role='listbox'
          aria-label='搜尋結果'
          className='max-h-[380px] space-y-0.5 overflow-y-auto pr-0.5'
        >
          {results.map((hit, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={hit.id} role='option' aria-selected={isActive}>
                <button
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  type='button'
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => go(hit)}
                  className={cx(
                    'flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left transition-colors duration-fast',
                    isActive
                      ? 'border-active bg-active/[0.14]'
                      : 'border-transparent hover:bg-hover'
                  )}
                >
                  <span className='min-w-0 flex-1'>
                    <span className='flex items-center gap-2'>
                      <span className='truncate text-[13.5px] font-semibold text-gold'>
                        {hit.title}
                      </span>
                      <span className='meta-tag shrink-0 text-[11px]'>{hit.badge}</span>
                    </span>
                    <span className='mt-0.5 block truncate text-xs text-sub'>{hit.subtitle}</span>
                  </span>
                  {isActive && <EnterOutlined className='shrink-0 text-xs text-magic' />}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className='subsurface my-2 px-4 py-7 text-center'>
          <p className='text-[13.5px] font-medium text-ink'>
            找不到符合「<span className='text-gold'>{query}</span>」的項目
          </p>
          <p className='mt-1 text-xs text-muted'>
            試試輸入副本俗稱（阿布／卡門／蛇女／賽爾卡）、刻印（怨恨／腎腺）或大陸名稱
          </p>
          <button
            type='button'
            onClick={() => {
              setQuery('');
              setActiveIndex(0);
              inputRef.current?.focus();
            }}
            className='filter-chip filter-chip-active focus-ring mt-3 text-xs'
          >
            清空關鍵字
          </button>
        </div>
      )}

      <div className='mt-2.5 flex flex-wrap items-center gap-3.5 border-t border-line pt-2 font-mono text-[11px] text-muted'>
        <span className='flex items-center gap-1'>
          <kbd>↑</kbd>
          <kbd>↓</kbd> 移動
        </span>
        <span className='flex items-center gap-1'>
          <kbd>Enter</kbd> 直達錨點
        </span>
        <span className='flex items-center gap-1'>
          <kbd>Esc</kbd> 關閉
        </span>
        <span className='ml-auto flex items-center gap-1 font-sans'>
          全域喚醒 <kbd>Q</kbd> <kbd>/</kbd>
        </span>
      </div>
    </Modal>
  );
}
