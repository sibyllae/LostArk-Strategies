import { Link, NavLink } from 'react-router-dom';
import { GithubOutlined, HomeOutlined } from '@ant-design/icons';
import Logo from '@/components/ui/Logo';
import { NAV_GROUPS, SITE } from '@/config/navigation';
import { cx } from '@/utils/cx';

interface SidebarNavProps {
  onNavigate?: () => void;
}

const linkClass = (isActive: boolean) =>
  cx(
    'focus-ring group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors',
    isActive
      ? 'bg-obsidian-800 text-gold-300'
      : 'text-stone-400 hover:bg-obsidian-850 hover:text-stone-100'
  );

export default function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex h-14 shrink-0 items-center border-b border-obsidian-700/70 px-4'>
        <Link to='/' onClick={onNavigate} className='focus-ring flex items-center gap-2.5 rounded'>
          <Logo size='sm' />
          <div className='leading-tight'>
            <p className='font-display text-sm font-bold tracking-wide text-stone-100'>
              {SITE.name}
            </p>
            <p className='text-[11px] text-stone-500'>{SITE.nameZh}</p>
          </div>
        </Link>
      </div>

      <nav aria-label='主要導覽' className='flex-1 space-y-5 overflow-y-auto px-3 py-4'>
        <NavLink to='/' end onClick={onNavigate} className={({ isActive }) => linkClass(isActive)}>
          {({ isActive }) => (
            <>
              {isActive && (
                <span aria-hidden className='absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-gold-400' />
              )}
              <HomeOutlined className={isActive ? 'text-gold-400' : 'text-stone-500 group-hover:text-stone-300'} />
              <span>總覽索引</span>
            </>
          )}
        </NavLink>

        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className='mb-1.5 px-3 text-[11px] font-medium tracking-wider text-stone-500'>
              {group.title}
            </p>
            <ul className='space-y-0.5'>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.key}>
                    <NavLink
                      to={item.path}
                      onClick={onNavigate}
                      className={({ isActive }) => linkClass(isActive)}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span
                              aria-hidden
                              className='absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-gold-400'
                            />
                          )}
                          <Icon
                            className={
                              isActive
                                ? 'text-gold-400'
                                : 'text-stone-500 group-hover:text-stone-300'
                            }
                          />
                          <span className='truncate'>{item.title}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className='flex items-center justify-between gap-2 border-t border-obsidian-700/70 px-4 py-3 text-xs text-stone-500'>
        <a
          href={SITE.repo}
          target='_blank'
          rel='noreferrer'
          className='focus-ring inline-flex shrink-0 items-center gap-1.5 rounded transition-colors hover:text-stone-200'
        >
          <GithubOutlined /> 原始碼
        </a>
        <span className='truncate text-stone-600'>資料僅供參考</span>
      </div>
    </div>
  );
}
