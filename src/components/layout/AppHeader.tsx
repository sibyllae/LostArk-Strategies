import { Link, NavLink } from 'react-router-dom';
import { GithubOutlined, MenuOutlined, SearchOutlined } from '@ant-design/icons';
import Logo from '@/components/ui/Logo';
import { NAV_ITEMS, SITE } from '@/config/navigation';
import { useThemeMode } from '@/hooks/useThemeMode';
import { cx } from '@/utils/cx';

interface AppHeaderProps {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}

export default function AppHeader({ onOpenMenu, onOpenSearch }: AppHeaderProps) {
  const { isDark, toggleTheme } = useThemeMode();

  return (
    <header className='sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur-md'>
      <div className='mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-10'>
        <button
          type='button'
          onClick={onOpenMenu}
          aria-label='開啟導覽選單'
          className='icon-btn lg:hidden'
        >
          <MenuOutlined />
        </button>

        <Link
          to='/'
          aria-label='回到首頁'
          className='focus-ring flex shrink-0 items-center gap-3 rounded-xl py-1'
        >
          <Logo size='md' />
          <div className='leading-snug'>
            <span className='block text-sm font-bold tracking-[0.06em] text-ink'>
              {SITE.subName}
            </span>
            <span className='block text-xs text-muted'>失落的方舟資料庫</span>
          </div>
        </Link>

        {/* 桌面版：清爽留白的膠囊導覽列 */}
        <nav
          aria-label='主要導覽'
          className='mx-4 hidden flex-1 items-center justify-center gap-1.5 lg:flex'
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) =>
                  cx(
                    'focus-ring flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium tracking-[0.04em] transition-colors',
                    isActive
                      ? 'bg-brand/12 font-semibold text-brand'
                      : 'text-sub hover:bg-elevated hover:text-ink'
                  )
                }
              >
                <Icon className='text-[13px]' />
                <span>{item.shortTitle}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* 右側操作區：快搜 (支援 Q 鍵) + 淺色/深色切換 + GitHub */}
        <div className='ml-auto flex items-center gap-2.5 lg:ml-0'>
          <button
            type='button'
            onClick={onOpenSearch}
            aria-label='開啟全站搜尋'
            className='focus-ring flex h-9 items-center gap-2.5 rounded-xl border border-line bg-subtle px-3.5 text-xs text-sub transition-colors hover:border-brand/50 hover:text-ink sm:w-52'
          >
            <SearchOutlined className='text-muted' />
            <span className='hidden truncate sm:inline'>快速搜尋…</span>
            <span className='ml-auto hidden items-center gap-1 sm:flex'>
              <kbd>Q</kbd>
            </span>
          </button>

          <button
            type='button'
            onClick={toggleTheme}
            aria-label={isDark ? '切換為淺色模式 (Light)' : '切換為深色模式 (Dark)'}
            title={isDark ? '切換為淺色模式' : '切換為深色模式'}
            className='icon-btn'
          >
            {isDark ? (
              <svg viewBox='0 0 24 24' className='size-[18px]' fill='none' stroke='currentColor' strokeWidth='1.8'>
                <circle cx='12' cy='12' r='4.2' />
                <path d='M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6' strokeLinecap='round' />
              </svg>
            ) : (
              <svg viewBox='0 0 24 24' className='size-[18px]' fill='none' stroke='currentColor' strokeWidth='1.8'>
                <path d='M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z' strokeLinejoin='round' />
              </svg>
            )}
          </button>

          <a
            href={SITE.repo}
            target='_blank'
            rel='noreferrer'
            aria-label='GitHub 原始碼'
            className='icon-btn hidden sm:grid'
          >
            <GithubOutlined />
          </a>
        </div>
      </div>
    </header>
  );
}
