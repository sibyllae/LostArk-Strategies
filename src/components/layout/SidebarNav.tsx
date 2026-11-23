import { Link, NavLink } from 'react-router-dom';
import { GithubOutlined, HomeOutlined } from '@ant-design/icons';
import Logo from '@/components/ui/Logo';
import { ACCENTS, NAV_GROUPS, SITE } from '@/config/navigation';
import { cx } from '@/utils/cx';

interface SidebarNavProps {
  onNavigate?: () => void;
}

const linkClass = (isActive: boolean) =>
  cx(
    'focus-ring group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-white/[0.06] text-white'
      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100'
  );

const iconClass = (isActive: boolean, activeTone: string) =>
  cx(
    'grid size-7 shrink-0 place-items-center rounded-lg text-sm transition-colors',
    isActive ? activeTone : 'bg-white/[0.04] text-zinc-500 group-hover:text-zinc-200'
  );

export default function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex h-16 shrink-0 items-center px-5'>
        <Link to='/' onClick={onNavigate} className='focus-ring flex items-center gap-3 rounded-lg'>
          <Logo />
          <div className='leading-tight'>
            <p className='text-sm font-bold text-zinc-50'>{SITE.name}</p>
            <p className='text-[11px] text-zinc-500'>{SITE.nameZh}</p>
          </div>
        </Link>
      </div>

      <nav aria-label='主要導覽' className='flex-1 space-y-6 overflow-y-auto px-3 py-4'>
        <NavLink to='/' end onClick={onNavigate} className={({ isActive }) => linkClass(isActive)}>
          {({ isActive }) => (
            <>
              <span className={iconClass(isActive, 'bg-indigo-500/15 text-indigo-300')}>
                <HomeOutlined />
              </span>
              首頁
            </>
          )}
        </NavLink>

        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className='mb-2 px-3 text-[11px] font-semibold tracking-wider text-zinc-500'>
              {group.title}
            </p>
            <ul className='space-y-1'>
              {group.items.map((item) => {
                const Icon = item.icon;
                const accent = ACCENTS[item.accent];
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
                              className={cx('absolute inset-y-2 left-0 w-0.5 rounded-full', accent.dot)}
                            />
                          )}
                          <span className={iconClass(isActive, `${accent.iconBg} ${accent.text}`)}>
                            <Icon />
                          </span>
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

      <div className='flex items-center justify-between gap-2 border-t border-white/5 px-4 py-3 text-xs text-zinc-500'>
        <a
          href={SITE.repo}
          target='_blank'
          rel='noreferrer'
          className='focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-md transition-colors hover:text-zinc-200'
        >
          <GithubOutlined /> 原始碼
        </a>
        <span className='truncate text-zinc-600'>資料僅供參考</span>
      </div>
    </div>
  );
}
