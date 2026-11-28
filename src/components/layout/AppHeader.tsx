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

/**
 * obsidian-lookup-uiux SKILL.md Section 3 & 4A：
 * - 固定高度 52px (--header-height: 52px) + 1px solid var(--border-subtle) 底線
 * - 行動版 (< lg)：標準對稱三格列（左 44x44px 選單鈕 · 置中品牌字標 · 右 44x44px 快搜鈕）
 * - 桌面版 (lg+)：左側字標 + 醒目 `搜尋 (Q)` 快搜膠囊 + 直接分類導覽連結 + 主題切換
 */
export default function AppHeader({ onOpenMenu, onOpenSearch }: AppHeaderProps) {
  const { isDark, toggleTheme } = useThemeMode();

  return (
    <header className='sticky top-0 z-30 h-[52px] border-b border-line bg-surface'>
      {/* 行動版三格列 (< lg)：強制最小 44x44px 觸控目標並維持字標正中對齊 */}
      <div className='grid h-full grid-cols-[44px_1fr_44px] items-center px-2.5 lg:hidden'>
        <button
          type='button'
          onClick={onOpenMenu}
          aria-label='開啟導覽選單'
          className='touch-btn'
        >
          <MenuOutlined />
        </button>

        <Link
          to='/'
          aria-label='回到首頁'
          className='focus-ring mx-auto inline-flex min-h-[44px] items-center gap-2 rounded-md px-2'
        >
          <Logo size='sm' />
          <span className='text-[15px] font-semibold tracking-[0.03em] text-gold'>
            ARKESIA CODEX
          </span>
        </Link>

        <button
          type='button'
          onClick={onOpenSearch}
          aria-label='開啟全站搜尋 (Q)'
          className='touch-btn text-gold'
        >
          <SearchOutlined />
        </button>
      </div>

      {/* 桌面版緊湊指揮列 (lg+) */}
      <div className='mx-auto hidden h-full max-w-7xl items-center gap-3.5 px-6 lg:flex'>
        <Link
          to='/'
          aria-label='回到首頁'
          className='focus-ring flex shrink-0 items-center gap-2.5 rounded-md py-1'
        >
          <Logo size='md' />
          <div className='leading-tight'>
            <span className='block text-[14px] font-semibold tracking-[0.04em] text-gold'>
              ARKESIA CODEX
            </span>
            <span className='block text-[11px] text-muted'>失落的方舟快查手冊</span>
          </div>
        </Link>

        <button
          type='button'
          onClick={onOpenSearch}
          aria-label='開啟全站搜尋 (快捷鍵 Q 或 /)'
          className='focus-ring flex h-[34px] w-56 shrink-0 items-center gap-2 rounded-md border border-line-strong bg-well px-3 text-[12.5px] text-sub transition-colors duration-fast hover:border-active hover:text-ink xl:w-64'
        >
          <SearchOutlined className='text-gold' />
          <span className='flex-1 text-left'>搜尋 (Q)</span>
          <span className='flex items-center gap-1'>
            <kbd>Q</kbd>
            <kbd>/</kbd>
          </span>
        </button>

        <nav aria-label='主要導覽' className='flex items-center gap-1'>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                cx(
                  'focus-ring rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-fast',
                  isActive
                    ? 'border border-active bg-active/[0.14] font-semibold text-ink'
                    : 'border border-transparent text-sub hover:bg-hover hover:text-ink'
                )
              }
            >
              {item.shortTitle}
            </NavLink>
          ))}
        </nav>

        <div className='ml-auto flex items-center gap-1.5'>
          <button
            type='button'
            onClick={toggleTheme}
            aria-label={isDark ? '切換為淺色模式 (Light)' : '切換為深色模式 (Dark)'}
            title={isDark ? '切換為淺色模式' : '切換為深色模式'}
            className='icon-btn'
          >
            {isDark ? (
              <svg viewBox='0 0 24 24' className='size-4' fill='none' stroke='currentColor' strokeWidth='1.8'>
                <circle cx='12' cy='12' r='4.2' />
                <path d='M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6' strokeLinecap='round' />
              </svg>
            ) : (
              <svg viewBox='0 0 24 24' className='size-4' fill='none' stroke='currentColor' strokeWidth='1.8'>
                <path d='M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z' strokeLinejoin='round' />
              </svg>
            )}
          </button>

          <a
            href={SITE.repo}
            target='_blank'
            rel='noreferrer'
            aria-label='GitHub 原始碼'
            className='icon-btn'
          >
            <GithubOutlined />
          </a>
        </div>
      </div>
    </header>
  );
}
