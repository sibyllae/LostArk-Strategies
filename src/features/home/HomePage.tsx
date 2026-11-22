import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowRightOutlined, CompassOutlined, SearchOutlined } from '@ant-design/icons';
import { useLayoutContext } from '@/components/layout/layoutContext';
import { ACCENTS, getNavItem, NAV_GROUPS, SITE } from '@/config/navigation';
import { modKeyLabel } from '@/utils/platform';
import { cx } from '@/utils/cx';

export default function HomePage() {
  const { openSearch } = useLayoutContext();

  return (
    <div className='space-y-12 py-4'>
      {/* Hero Section */}
      <section className='relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/80 via-zinc-900/40 to-transparent p-8 sm:p-12 text-center backdrop-blur-md'>
        <div className='inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300'>
          <CompassOutlined /> 繁中版專屬攻略資料庫
        </div>

        <h1 className='mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl'>
          LostArk Strategies
        </h1>
        <p className='mt-3 text-lg text-zinc-400 sm:text-xl'>
          {SITE.nameZh} · 專為冒險家打造的高效查詢中心
        </p>
        <p className='mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500'>
          整合好感度回報、各大陸冒險之書進度、全系列收集品取得途徑、軍團長副本開箱收益計算以及雜項技能點與樂譜指引。
        </p>

        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <Button
            type='primary'
            size='large'
            icon={<SearchOutlined />}
            onClick={openSearch}
            className='!h-11 !rounded-xl !px-6 !font-semibold'
          >
            快速搜尋資料庫 <kbd className='ml-2 text-xs opacity-70'>{modKeyLabel} K</kbd>
          </Button>
          <Link to={getNavItem('favorability').path}>
            <Button size='large' className='!h-11 !rounded-xl !px-6 !font-semibold'>
              探索所有功能 <ArrowRightOutlined />
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Navigation Cards */}
      <section className='space-y-8'>
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className='space-y-4'>
            <h2 className='text-sm font-semibold tracking-wider text-zinc-400 uppercase'>
              {group.title}
            </h2>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {group.items.map((item) => {
                const Icon = item.icon;
                const accent = ACCENTS[item.accent];
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={cx(
                      'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-black/40',
                      accent.hoverBorder
                    )}
                  >
                    <div
                      aria-hidden
                      className={cx(
                        'absolute -right-12 -top-12 size-36 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100',
                        accent.gradient
                      )}
                    />
                    <div>
                      <div className='flex items-center justify-between'>
                        <span
                          className={cx(
                            'grid size-12 place-items-center rounded-xl text-xl ring-1',
                            accent.iconBg,
                            accent.text,
                            accent.ring
                          )}
                        >
                          <Icon />
                        </span>
                        <ArrowRightOutlined className='text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-zinc-200' />
                      </div>
                      <h3 className='mt-4 text-lg font-bold text-zinc-100'>{item.title}</h3>
                      <p className='mt-2 text-sm text-zinc-400 line-clamp-2 leading-relaxed'>
                        {item.description}
                      </p>
                    </div>

                    <div className='mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-white/5'>
                      {item.keywords.slice(0, 3).map((kw) => (
                        <span
                          key={kw}
                          className='rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-500'
                        >
                          #{kw}
                        </span>
                      ))}
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
