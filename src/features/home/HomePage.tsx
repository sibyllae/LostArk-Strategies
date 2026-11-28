import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { useLayoutContext } from '@/components/layout/layoutContext';
import GlyphIcon, { type GlyphName } from '@/components/ui/GlyphIcon';
import SectionHeading from '@/components/ui/SectionHeading';
import { getRaidKey, useLocalTracker } from '@/hooks/useLocalTracker';
import { useGetRaidChestsQuery } from '@/services/gameApi';
import { cx } from '@/utils/cx';

interface LaunchTile {
  label: string;
  sub: string;
  to: string;
  glyph: GlyphName;
  tone: string;
}

const BUCKET_DATABASE: LaunchTile[] = [
  { label: 'NPC 好友度', sub: 'Rapport 圖鑑', to: '/game/favorability', glyph: 'rapport', tone: 'text-crimson' },
  { label: '大陸冒險之書', sub: '20 大陸橫軸', to: '/game/adventureBook', glyph: 'tome', tone: 'text-gold' },
  { label: '巨人心臟', sub: '15 顆技能點', to: '/game/collectibles?tab=giantHearts', glyph: 'heart', tone: 'text-roll' },
  { label: '血爪海圖', sub: 'T4 悟性藥水', to: '/game/collectibles?tab=bloodclawCharts', glyph: 'chart', tone: 'text-crimson' },
  { label: '奧菲斯之星', sub: '10 顆傳說符文', to: '/game/collectibles?tab=omniumStars', glyph: 'star', tone: 'text-rare' },
  { label: '島之心', sub: '106+ 島嶼', to: '/game/collectibles?tab=islandTokens', glyph: 'island', tone: 'text-setgreen' },
  { label: '偉大的藝術品', sub: '60 幅金幣箱', to: '/game/collectibles?tab=masterpieces', glyph: 'art', tone: 'text-gold' },
  { label: '伊格涅亞標誌', sub: '100% 淨化符文', to: '/game/collectibles?tab=igneaTokens', glyph: 'ignea', tone: 'text-magic' },
  { label: '記憶八音盒', sub: '20 首旋律', to: '/game/collectibles?tab=memoryOrbs', glyph: 'orb', tone: 'text-purple-400' },
  { label: '航海冒險物', sub: '51 張海圖', to: '/game/collectibles?tab=seaBounties', glyph: 'bounty', tone: 'text-tealbar' },
  { label: '世界樹 & 種子', sub: '120片 / 1450+顆', to: '/game/collectibles?tab=worldTreeMokoko', glyph: 'leaf', tone: 'text-setgreen' },
  { label: '流浪商人傳說卡', sub: '19 洲必蹲點', to: '/game/systems?tab=merchants', glyph: 'merchant', tone: 'text-gold' },
];

const BUCKET_TOOLS: LaunchTile[] = [
  { label: '副本血條機制', sub: 'x血條一圖流', to: '/game/raidChests?view=mechanics', glyph: 'mechanic', tone: 'text-crimson' },
  { label: 'T4 襲擊戰帳本', sub: '至 1780 貝爾加丁', to: '/game/raidChests?tier=T4', glyph: 'raid', tone: 'text-gold' },
  { label: '每週 3 本排程', sub: '1～6 角週收試算', to: '/game/raidChests', glyph: 'planner', tone: 'text-setgreen' },
  { label: '單人模式專區', sub: '綁金＆代幣兌換', to: '/game/raidChests?scale=SOLO', glyph: 'raid', tone: 'text-magic' },
  { label: 'T4 遺物刻印書', sub: '倍率＆石頭格數', to: '/game/systems?tab=engravings', glyph: 'engraving', tone: 'text-gold' },
  { label: 'T4 寶石＆斷點', sub: '1–10級/精煉表', to: '/game/systems?tab=gemsAndHoning', glyph: 'gem', tone: 'text-magic' },
  { label: 'T4 飾品研磨', sub: '下/中/上數值', to: '/game/systems?tab=accessories', glyph: 'ring', tone: 'text-roll' },
  { label: 'T4 手鐲詞條', sub: '飛躍點＆S級', to: '/game/systems?tab=bracelets', glyph: 'bracelet', tone: 'text-gold' },
  { label: '八大養成系統', sub: '鍊金/超越/護腕', to: '/game/systems?tab=gearSystems', glyph: 'gear', tone: 'text-tealbar' },
  { label: '地平線大聖堂', sub: '3萬～5萬綁金', to: '/game/raidChests?q=地平線大聖堂', glyph: 'planner', tone: 'text-rare' },
  { label: 'T4 守護者討伐', sub: '弱點＆G鍵格擋', to: '/game/miscGuide?section=guardianRaids', glyph: 'guardian', tone: 'text-crimson' },
  { label: '方舟星圖核心', sub: '17 點星石質變', to: '/game/miscGuide?section=arkGrid', glyph: 'arkgrid', tone: 'text-magic' },
];

const BUCKET_CHEATSHEETS: LaunchTile[] = [
  { label: '裝等養成路線', sub: '快車→1780+', to: '/game/miscGuide?section=progressionRoadmap', glyph: 'roadmap', tone: 'text-setgreen' },
  { label: '全職業＆流派', sub: '13 大體系總覽', to: '/game/miscGuide?section=newClasses', glyph: 'class', tone: 'text-gold' },
  { label: '副本戰鬥道具', sub: '無力/破壞/睡眠', to: '/game/miscGuide?section=battleItems', glyph: 'bomb', tone: 'text-roll' },
  { label: '卡組＆種族增傷', sub: '光卡/四屬/惡魔傷', to: '/game/miscGuide?section=cardSets', glyph: 'card', tone: 'text-magic' },
  { label: 'T4 悟性點來源', sub: 'Enlightenment', to: '/game/miscGuide?section=enlightenmentPoints', glyph: 'enlightenment', tone: 'text-rare' },
  { label: '技能點藥水', sub: '+3/+6 ＆ Lv.70', to: '/game/miscGuide?section=skillPoints', glyph: 'skill', tone: 'text-setgreen' },
  { label: '高階技能符文', sub: '英雄 / 傳說', to: '/game/miscGuide?section=runes', glyph: 'rune', tone: 'text-purple-400' },
  { label: '大航海船隻船員', sub: '盧米納斯/海盜船', to: '/game/miscGuide?section=shipsAndSailors', glyph: 'ship', tone: 'text-tealbar' },
  { label: '跨服譯名對照表', sub: '台/國際/T4改制', to: '/game/miscGuide?section=terminologyMap', glyph: 'translate', tone: 'text-gold' },
  { label: 'T4 生活與融合', sub: '阿比多斯精算', to: '/game/miscGuide?section=lifeSkills', glyph: 'lifeskill', tone: 'text-setgreen' },
  { label: '重要樂譜曲譜', sub: '15 首來源', to: '/game/miscGuide?section=songs', glyph: 'song', tone: 'text-tealbar' },
  { label: '日常＆艾波娜', sub: '次數＆聲望獎勵', to: '/game/miscGuide?section=dailyQuests', glyph: 'quest', tone: 'text-sub' },
];

/**
 * obsidian-lookup-uiux SKILL.md Section 1.1, Section 3 & Section 4B：
 * Zero-Fluff Icon Launchpad 首頁：零行銷橫幅，首屏直接展示鍵盤快搜觸發器、個人本機電報與 3/4/6 欄響應式圖示磚。
 */
export default function HomePage() {
  const { openSearch } = useLayoutContext();
  const { state } = useLocalTracker();
  const { data: raidData } = useGetRaidChestsQuery();

  const pinnedRaidGold = (raidData?.raids ?? [])
    .filter((r) => state.pinnedRaids.includes(getRaidKey(r.nameEn, r.difficulty)))
    .reduce((sum, r) => sum + r.totalGold, 0);

  return (
    <div className='space-y-5'>
      <h1 className='sr-only'>ARKESIA CODEX · LostArk Strategies 失落的方舟快查手冊</h1>

      {/* 首屏即用：全站快搜觸發列 + 單行遠征隊本機進度電報 */}
      <section aria-label='快速檢索與個人進度' className='surface p-3 sm:p-3.5'>
        <div className='flex flex-col gap-2.5 lg:flex-row lg:items-center'>
          <button
            type='button'
            onClick={openSearch}
            className='focus-ring flex h-10 flex-1 items-center gap-2.5 rounded-md border border-line-strong bg-well px-3.5 text-left text-[13.5px] text-sub transition-colors duration-fast hover:border-active hover:text-ink'
          >
            <SearchOutlined className='text-base text-gold' />
            <span className='flex-1 truncate'>
              輸入中英文、俗稱或血條機制秒查：x130、貝爾加丁、怨恨、劫火、盧米納斯、瓦爾格里斯…
            </span>
            <span className='hidden items-center gap-1 font-mono text-xs sm:flex'>
              <kbd>Q</kbd>
              <kbd>/</kbd>
            </span>
          </button>

          <div className='grid grid-cols-3 divide-x divide-line rounded-md border border-line bg-well text-center text-xs lg:w-[390px] lg:shrink-0'>
            <Link
              to='/game/collectibles'
              className='focus-ring px-2 py-1.5 transition-colors duration-fast hover:bg-hover'
            >
              <span className='block text-[11px] text-muted'>已取收集品</span>
              <strong className='font-mono text-[13.5px] font-semibold tabular-nums text-gold'>
                {state.collectibles.length}
              </strong>
            </Link>
            <Link
              to='/game/adventureBook'
              className='focus-ring px-2 py-1.5 transition-colors duration-fast hover:bg-hover'
            >
              <span className='block text-[11px] text-muted'>伊格涅亞</span>
              <strong className='font-mono text-[13.5px] font-semibold tabular-nums text-setgreen'>
                {state.igneaRegions.length}/20
              </strong>
            </Link>
            <Link
              to='/game/raidChests'
              className='focus-ring px-2 py-1.5 transition-colors duration-fast hover:bg-hover'
            >
              <span className='block text-[11px] text-muted'>週收 ({state.rosterChars}角)</span>
              <strong className='font-mono text-[13.5px] font-semibold tabular-nums text-roll'>
                {pinnedRaidGold > 0
                  ? `${Math.round((pinnedRaidGold * state.rosterChars) / 1000)}k G`
                  : '排程試算'}
              </strong>
            </Link>
          </div>
        </div>
      </section>

      {/* Bucket 1 (Primary Crimson Bar)：核心收集與世界圖鑑資料庫 */}
      <LaunchSection
        title='核心收集與圖鑑資料庫 (Core Catalogs)'
        tiles={BUCKET_DATABASE}
        primary
      />

      {/* Bucket 2 (Secondary Teal Bar)：副本血條機制、金幣帳本與 T4 配裝試算 */}
      <LaunchSection
        title='副本血條機制與 T4 配裝試算 (Raid Mechanics & Gear)'
        tiles={BUCKET_TOOLS}
      />

      {/* Bucket 3 (Secondary Teal Bar)：戰鬥底蘊與航海生活速查表 */}
      <LaunchSection
        title='戰鬥底蘊、大航海與跨服百科速查 (Reference Cheat Sheets)'
        tiles={BUCKET_CHEATSHEETS}
      />
    </div>
  );
}

function LaunchSection({
  title,
  tiles,
  primary = false,
}: {
  title: string;
  tiles: LaunchTile[];
  primary?: boolean;
}) {
  return (
    <section>
      <SectionHeading title={title} count={tiles.length} primary={primary} />
      <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6'>
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            to={tile.to}
            className='focus-ring group flex flex-col items-center justify-center gap-1.5 rounded-md border border-line bg-surface px-2 py-3 text-center transition-colors duration-fast hover:border-active hover:bg-hover'
          >
            <span className={cx('media-well size-10', tile.tone)}>
              <GlyphIcon name={tile.glyph} className='size-5' />
            </span>
            <div className='w-full min-w-0 space-y-0.5'>
              <span className='block truncate text-[13px] font-semibold leading-snug text-ink group-hover:text-gold'>
                {tile.label}
              </span>
              <span className='block truncate font-mono text-[11px] leading-none tabular-nums text-muted'>
                {tile.sub}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
