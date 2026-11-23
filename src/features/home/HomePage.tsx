import { Link } from 'react-router-dom';
import { ArrowRightOutlined, SearchOutlined } from '@ant-design/icons';
import { useLayoutContext } from '@/components/layout/layoutContext';
import { NAV_GROUPS, SITE } from '@/config/navigation';
import { modKeyLabel } from '@/utils/platform';

const QUICK_LINKS = [
  { label: '巨人心臟取得', to: '/game/collectibles?tab=giantHearts' },
  { label: 'T4 副本開箱試算', to: '/game/raidChests' },
  { label: 'T4 飾品研磨詞條', to: '/game/systems?tab=accessories' },
  { label: '流浪商人傳說卡', to: '/game/systems?tab=merchants' },
  { label: '好感度：巨人心臟', to: '/game/favorability?q=%E5%B7%A8%E4%BA%BA%E5%BF%83%E8%87%9F' },
  { label: '裝等與系統路線', to: '/game/miscGuide?q=1640' },
] as const;

export default function HomePage() {
  const { openSearch } = useLayoutContext();

  return (
    <div className='space-y-8 py-2'>
      {/* 標題與直接查詢區 */}
      <section className='border-b border-obsidian-700/80 pb-7'>
        <div className='max-w-2xl'>
          <p className='font-mono text-xs uppercase tracking-widest text-gold-400'>
            Lost Ark TW Reference
          </p>
          <h1 className='mt-2 font-display text-3xl font-bold tracking-tight text-stone-100 sm:text-4xl'>
            {SITE.nameZh}
          </h1>
          <p className='mt-2 text-sm leading-relaxed text-stone-400'>
            整理 NPC 好感度、冒險之書、9 類收集品、T3／T4 副本開箱收益試算、飾品詞條與常用系統速查表。
          </p>
        </div>

        {/* 搜尋觸發列 */}
        <div className='mt-5 max-w-xl'>
          <button
            type='button'
            onClick={openSearch}
            className='focus-ring flex h-11 w-full items-center gap-3 rounded-md border border-obsidian-700 bg-obsidian-900 px-3.5 text-left text-sm text-stone-400 transition-colors hover:border-gold-500/50 hover:text-stone-200'
          >
            <SearchOutlined className='text-stone-500' />
            <span className='flex-1 truncate'>搜尋 NPC、副本、收集品、樂譜或流浪商人…</span>
            <span className='hidden items-center gap-1 sm:flex'>
              <kbd>{modKeyLabel}</kbd>
              <kbd>K</kbd>
            </span>
          </button>
        </div>

        {/* 常用直達入口 */}
        <div className='mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs'>
          <span className='text-stone-500'>常用速查：</span>
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className='focus-ring rounded border border-obsidian-700/80 bg-obsidian-900 px-2.5 py-1 text-stone-300 transition-colors hover:border-gold-500/50 hover:text-gold-300'
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 攻略分類目錄 */}
      <section className='space-y-7'>
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className='mb-3 border-l-2 border-gold-500 pl-2.5 text-xs font-semibold tracking-wider text-stone-400'>
              {group.title}
            </h2>
            <div className='grid gap-3 sm:grid-cols-2'>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className='focus-ring group flex items-start gap-3.5 rounded-lg border border-obsidian-700/80 bg-obsidian-900 px-4 py-3.5 transition-colors hover:border-gold-500/50 hover:bg-obsidian-850'
                  >
                    <Icon className='mt-0.5 shrink-0 text-base text-stone-500 transition-colors group-hover:text-gold-400' />
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center justify-between gap-2'>
                        <h3 className='text-sm font-semibold text-stone-100 transition-colors group-hover:text-gold-300'>
                          {item.title}
                        </h3>
                        <ArrowRightOutlined className='text-xs text-stone-600 transition-transform group-hover:translate-x-0.5 group-hover:text-gold-400' />
                      </div>
                      <p className='mt-1 text-xs leading-relaxed text-stone-400'>
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
