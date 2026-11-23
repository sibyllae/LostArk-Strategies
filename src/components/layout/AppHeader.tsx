import { Link, matchPath, useLocation } from 'react-router-dom';
import { GithubOutlined, MenuOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import Logo from '@/components/ui/Logo';
import { NAV_ITEMS, SITE } from '@/config/navigation';
import { modKeyLabel } from '@/utils/platform';

interface AppHeaderProps {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}

export default function AppHeader({ onOpenMenu, onOpenSearch }: AppHeaderProps) {
  const { pathname } = useLocation();
  const current = NAV_ITEMS.find((item) => matchPath({ path: item.path, end: true }, pathname));

  return (
    <header className='sticky top-0 z-20 border-b border-obsidian-700/70 bg-obsidian-950/95'>
      <div className='mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8'>
        <button
          type='button'
          onClick={onOpenMenu}
          aria-label='開啟選單'
          className='icon-btn -ml-1.5 lg:hidden'
        >
          <MenuOutlined />
        </button>

        <Link to='/' aria-label='回到首頁' className='focus-ring rounded lg:hidden'>
          <Logo size='sm' />
        </Link>

        {/* 行動版：目前頁面名稱 */}
        <span className='truncate text-sm font-semibold text-stone-100 sm:hidden'>
          {current?.title ?? SITE.name}
        </span>

        {/* 桌面版：麵包屑 */}
        <nav aria-label='麵包屑' className='hidden min-w-0 items-center gap-2 text-xs sm:flex'>
          <Link to='/' className='focus-ring rounded text-stone-400 transition-colors hover:text-stone-100'>
            索引首頁
          </Link>
          {current && (
            <>
              <RightOutlined className='text-[9px] text-stone-600' />
              <span aria-current='page' className='truncate font-medium text-stone-100'>
                {current.title}
              </span>
            </>
          )}
        </nav>

        <div className='ml-auto flex items-center gap-1.5'>
          <button
            type='button'
            onClick={onOpenSearch}
            aria-label='快速搜尋'
            className='focus-ring flex h-8 items-center gap-2 rounded-md border border-obsidian-700 bg-obsidian-900 px-2.5 text-xs text-stone-400 transition-colors hover:border-stone-600 hover:text-stone-200 sm:w-56'
          >
            <SearchOutlined className='text-stone-500' />
            <span className='hidden sm:inline'>全站搜尋…</span>
            <span className='ml-auto hidden items-center gap-0.5 sm:flex'>
              <kbd>{modKeyLabel}</kbd>
              <kbd>K</kbd>
            </span>
          </button>
          <a href={SITE.repo} target='_blank' rel='noreferrer' aria-label='GitHub' className='icon-btn'>
            <GithubOutlined />
          </a>
        </div>
      </div>
    </header>
  );
}
