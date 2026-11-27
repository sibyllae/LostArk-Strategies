import { Link } from 'react-router-dom';
import { ArrowRightOutlined, SearchOutlined } from '@ant-design/icons';
import { useLayoutContext } from '@/components/layout/layoutContext';
import { getNavItem, SITE } from '@/config/navigation';
import { getRaidKey, useLocalTracker } from '@/hooks/useLocalTracker';
import { useGetRaidChestsQuery } from '@/services/gameApi';
import { modKeyLabel } from '@/utils/platform';

const HOT_SHORTCUTS = [
  { label: '1750 貝爾加丁＆護腕', to: '/game/raidChests?q=%E8%B2%9D%E7%88%BE%E5%8A%A0%E4%B8%81' },
  { label: '賽爾卡暗影襲擊戰', to: '/game/raidChests?q=%E8%B3%BD%E7%88%BE%E5%8D%A1' },
  { label: 'T4 手鐲 S 級詞條', to: '/game/systems?tab=bracelets' },
  { label: '19 洲流浪商人傳說卡', to: '/game/systems?tab=merchants' },
  { label: 'T4 守護者討伐道具', to: '/game/miscGuide?section=guardianRaids' },
  { label: '龍騎士／女聖騎／幻獸師', to: '/game/miscGuide?section=newClasses' },
] as const;

const CARDS = [
  {
    key: 'raidChests' as const,
    badge: '互動試算',
    shortcuts: [
      { label: 'T4 襲擊戰', to: '/game/raidChests?tier=T4' },
      { label: '惡夢高收益', to: '/game/raidChests?diff=%E6%83%A1%E5%A4%A2' },
      { label: '單人模式', to: '/game/raidChests?q=%E5%96%AE%E4%BA%BA' },
    ],
  },
  {
    key: 'collectibles' as const,
    badge: '進度勾選',
    shortcuts: [
      { label: '巨人心臟', to: '/game/collectibles?tab=giantHearts' },
      { label: '血爪海圖', to: '/game/collectibles?tab=bloodclawCharts' },
      { label: '島之心', to: '/game/collectibles?tab=islandTokens' },
    ],
  },
  {
    key: 'systems' as const,
    badge: '配裝數據',
    shortcuts: [
      { label: '飾品研磨數值', to: '/game/systems?tab=accessories' },
      { label: 'T4 手鐲詞條', to: '/game/systems?tab=bracelets' },
      { label: '流浪商人', to: '/game/systems?tab=merchants' },
    ],
  },
  {
    key: 'miscGuide' as const,
    badge: '12 章速查',
    shortcuts: [
      { label: '裝等養成路線', to: '/game/miscGuide?section=progressionRoadmap' },
      { label: 'T4 守護者', to: '/game/miscGuide?section=guardianRaids' },
      { label: '方舟星圖', to: '/game/miscGuide?section=arkGrid' },
    ],
  },
  {
    key: 'favorability' as const,
    badge: '73 位 NPC',
    shortcuts: [
      { label: '巨人心臟 NPC', to: '/game/favorability?q=%E5%B7%A8%E4%BA%BA%E5%BF%83%E8%87%9F' },
      { label: '巴亨圖爾', to: '/game/favorability?q=%E5%B7%B4%E4%BA%A8%E5%9C%96%E7%88%BE' },
      { label: '血爪海圖：金', to: '/game/favorability?q=%E9%87%91' },
    ],
  },
  {
    key: 'adventureBook' as const,
    badge: '20 座大陸',
    shortcuts: [
      { label: '庫爾贊北部', to: '/game/adventureBook?q=%E5%BA%AB%E7%88%BE%E8%B4%8A%E5%8C%97%E9%83%A8' },
      { label: '里姆雷克南部', to: '/game/adventureBook?q=%E9%87%8C%E5%A7%86%E9%9B%B7%E5%85%8B' },
      { label: '技能點獎勵', to: '/game/adventureBook?q=%E6%8A%80%E8%83%BD%E9%BB%9E' },
    ],
  },
];

export default function HomePage() {
  const { openSearch } = useLayoutContext();
  const { state } = useLocalTracker();
  const { data: raidData } = useGetRaidChestsQuery();

  const pinnedRaidGold = (raidData?.raids ?? [])
    .filter((r) => state.pinnedRaids.includes(getRaidKey(r.nameEn, r.difficulty)))
    .reduce((sum, r) => sum + r.totalGold, 0);

  return (
    <div className='space-y-12'>
      {/* 參考 d2r.world 快查理念：居中寬鬆搜尋核心區，一眼直達目標資料 */}
      <section className='mx-auto max-w-3xl pt-2 text-center sm:pt-6'>
        <span className='inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-brand'>
          {SITE.patchBadge}
        </span>

        <h1 className='mt-5 text-3xl font-extrabold tracking-[0.05em] text-ink sm:text-4xl lg:text-[42px] lg:leading-[1.25]'>
          失落的方舟・快查資料庫
        </h1>

        <p className='mx-auto mt-4 max-w-2xl text-base leading-relaxed text-sub'>
          整合 T3 至 2026 T4 最新副本金幣開箱、9 大收集品勾選追蹤、飾品手鐲數值、19 洲流浪商人與守護者道具，隨時按{' '}
          <kbd>Q</kbd> 鍵即可秒搜。
        </p>

        {/* 大尺寸獨立搜尋框 */}
        <div className='mt-7'>
          <button
            type='button'
            onClick={openSearch}
            className='focus-ring surface group flex h-14 w-full items-center gap-3.5 px-5 text-left text-[15px] text-muted transition-all hover:border-brand/60 hover:text-ink'
          >
            <SearchOutlined className='text-lg text-brand transition-transform group-hover:scale-110' />
            <span className='flex-1 truncate'>
              搜尋副本、NPC、手鐲詞條、島之心或流浪商人（例：貝爾加丁、瓦爾格里斯、優越）…
            </span>
            <span className='hidden items-center gap-1.5 sm:flex'>
              <kbd>Q</kbd>
              <span className='text-xs text-muted'>或</span>
              <kbd>{modKeyLabel}</kbd>
              <kbd>K</kbd>
            </span>
          </button>
        </div>

        {/* 寬鬆熱門直達標籤 */}
        <div className='mt-5 flex flex-wrap items-center justify-center gap-2.5'>
          {HOT_SHORTCUTS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className='focus-ring rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-sub transition-colors hover:border-brand/50 hover:text-brand'
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 個人遠征隊進度摘要列（3 張獨立清爽指標卡） */}
      <section aria-label='個人追蹤進度摘要' className='grid gap-5 sm:grid-cols-3'>
        <Link
          to='/game/collectibles'
          className='focus-ring surface group flex items-center justify-between p-5 hover:border-brand/50'
        >
          <div className='space-y-1'>
            <span className='text-xs font-medium text-muted'>已勾選收集品</span>
            <p className='font-mono text-2xl font-bold tabular-nums text-ink'>
              {state.collectibles.length}{' '}
              <span className='font-sans text-xs font-normal text-sub'>項已記錄</span>
            </p>
          </div>
          <ArrowRightOutlined className='text-sm text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand' />
        </Link>

        <Link
          to='/game/adventureBook'
          className='focus-ring surface group flex items-center justify-between p-5 hover:border-brand/50'
        >
          <div className='space-y-1'>
            <span className='text-xs font-medium text-muted'>100% 伊格涅亞標誌</span>
            <p className='font-mono text-2xl font-bold tabular-nums text-ink'>
              {state.igneaRegions.length}
              <span className='text-base font-normal text-muted'> / 20</span>
            </p>
          </div>
          <ArrowRightOutlined className='text-sm text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand' />
        </Link>

        <Link
          to='/game/raidChests'
          className='focus-ring surface group flex items-center justify-between p-5 hover:border-brand/50'
        >
          <div className='space-y-1'>
            <span className='text-xs font-medium text-muted'>
              每週 3 本排程 ({state.rosterChars}角)
            </span>
            <p className='font-mono text-2xl font-bold tabular-nums text-brand'>
              {pinnedRaidGold > 0
                ? `${(pinnedRaidGold * state.rosterChars).toLocaleString()} G`
                : '前往設定'}
            </p>
          </div>
          <ArrowRightOutlined className='text-sm text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand' />
        </Link>
      </section>

      {/* 六大核心資料庫模組（大留白 p-6、gap-6 網格） */}
      <section aria-label='資料庫分類目錄' className='space-y-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold tracking-[0.04em] text-ink'>核心資料庫分類</h2>
          <span className='text-xs text-muted'>點擊卡片或下方子分類直接進入</span>
        </div>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {CARDS.map(({ key, badge, shortcuts }) => {
            const nav = getNavItem(key);
            const Icon = nav.icon;
            return (
              <article
                key={key}
                className='surface flex flex-col justify-between p-6 hover:border-brand/50'
              >
                <div>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='grid size-11 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-lg text-brand'>
                      <Icon />
                    </span>
                    <span className='rounded-full border border-line bg-subtle px-3 py-1 text-xs font-medium text-sub'>
                      {badge}
                    </span>
                  </div>

                  <Link to={nav.path} className='focus-ring group mt-4 block'>
                    <h3 className='flex items-center justify-between text-lg font-bold text-ink transition-colors group-hover:text-brand'>
                      <span>{nav.title}</span>
                      <ArrowRightOutlined className='text-xs text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand' />
                    </h3>
                    <p className='mt-2 text-sm leading-relaxed text-sub'>{nav.description}</p>
                  </Link>
                </div>

                <div className='mt-6 flex flex-wrap gap-2 border-t border-line pt-4'>
                  {shortcuts.map((s) => (
                    <Link
                      key={s.label}
                      to={s.to}
                      className='focus-ring rounded-lg border border-line bg-subtle px-2.5 py-1 text-xs font-medium text-sub transition-colors hover:border-brand/45 hover:text-brand'
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
