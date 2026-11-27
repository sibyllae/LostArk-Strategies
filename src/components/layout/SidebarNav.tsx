import { Link, NavLink } from 'react-router-dom';
import { GithubOutlined, HomeOutlined } from '@ant-design/icons';
import Logo from '@/components/ui/Logo';
import { NAV_GROUPS, SITE } from '@/config/navigation';
import { useLocalTracker } from '@/hooks/useLocalTracker';
import { useThemeMode } from '@/hooks/useThemeMode';
import { cx } from '@/utils/cx';

interface SidebarNavProps {
  onNavigate?: () => void;
}

const linkClass = (isActive: boolean) =>
  cx(
    'focus-ring flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium tracking-[0.03em] transition-colors',
    isActive
      ? 'bg-brand/12 font-semibold text-brand'
      : 'text-sub hover:bg-elevated hover:text-ink'
  );

export default function SidebarNav({ onNavigate }: SidebarNavProps) {
  const { state } = useLocalTracker();
  const { isDark, toggleTheme } = useThemeMode();
  const trackedTotal =
    state.collectibles.length + state.igneaRegions.length + state.npcs.length;

  return (
    <div className='flex h-full flex-col bg-surface text-ink'>
      <div className='border-b border-line p-5'>
        <Link to='/' onClick={onNavigate} className='focus-ring flex items-center gap-3 rounded-xl'>
          <Logo size='md' />
          <div className='leading-snug'>
            <p className='text-sm font-bold tracking-[0.05em] text-ink'>{SITE.subName}</p>
            <p className='text-xs text-muted'>失落的方舟資料庫</p>
          </div>
        </Link>

        <div className='mt-4 grid grid-cols-2 gap-2.5 rounded-xl border border-line bg-subtle p-3 text-xs'>
          <div>
            <span className='block text-muted'>已標記進度</span>
            <strong className='mt-0.5 block font-mono text-sm text-ink tabular-nums'>
              {trackedTotal} 項
            </strong>
          </div>
          <div>
            <span className='block text-muted'>週常排程</span>
            <strong className='mt-0.5 block font-mono text-sm text-ink tabular-nums'>
              {state.pinnedRaids.length} / 3 本
            </strong>
          </div>
        </div>
      </div>

      <nav aria-label='行動版導覽選單' className='flex-1 space-y-6 overflow-y-auto p-4'>
        <NavLink to='/' end onClick={onNavigate} className={({ isActive }) => linkClass(isActive)}>
          <HomeOutlined />
          <span>資料庫首頁</span>
        </NavLink>

        {NAV_GROUPS.map((group) => (
          <div key={group.title} className='space-y-1.5'>
            <p className='px-3 text-xs font-semibold tracking-wider text-muted'>{group.title}</p>
            <ul className='space-y-1'>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.key}>
                    <NavLink
                      to={item.path}
                      onClick={onNavigate}
                      className={({ isActive }) => linkClass(isActive)}
                    >
                      <Icon />
                      <span className='truncate'>{item.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className='flex items-center justify-between gap-2 border-t border-line p-4 text-xs text-sub'>
        <button
          type='button'
          onClick={toggleTheme}
          className='focus-ring rounded-lg border border-line bg-subtle px-3 py-1.5 font-medium text-ink transition-colors hover:border-brand/50'
        >
          {isDark ? '☀ 切換淺色模式' : '☾ 切換深色模式'}
        </button>

        <a
          href={SITE.repo}
          target='_blank'
          rel='noreferrer'
          className='focus-ring inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink'
        >
          <GithubOutlined /> GitHub
        </a>
      </div>
    </div>
  );
}
