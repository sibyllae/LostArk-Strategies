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
    'focus-ring flex min-h-[44px] items-center gap-2.5 rounded-md border px-3 py-2 text-[13.5px] font-medium transition-colors duration-fast',
    isActive
      ? 'border-active bg-active/[0.14] font-semibold text-ink'
      : 'border-transparent text-sub hover:bg-hover hover:text-ink'
  );

export default function SidebarNav({ onNavigate }: SidebarNavProps) {
  const { state } = useLocalTracker();
  const { isDark, toggleTheme } = useThemeMode();
  const trackedTotal =
    state.collectibles.length + state.igneaRegions.length + state.npcs.length;

  return (
    <div className='flex h-full flex-col bg-surface text-ink'>
      <div className='border-b border-line p-4'>
        <Link to='/' onClick={onNavigate} className='focus-ring flex items-center gap-2.5 rounded-md'>
          <Logo size='md' />
          <div className='leading-tight'>
            <p className='text-[14px] font-semibold text-gold'>ARKESIA CODEX</p>
            <p className='text-xs text-muted'>失落的方舟快查手冊</p>
          </div>
        </Link>

        <div className='mt-3 grid grid-cols-2 gap-2 rounded-md border border-line bg-well p-2.5 text-xs'>
          <div>
            <span className='block text-muted'>已勾選收集</span>
            <strong className='font-mono text-sm tabular-nums text-gold'>{trackedTotal} 項</strong>
          </div>
          <div>
            <span className='block text-muted'>週常排程</span>
            <strong className='font-mono text-sm tabular-nums text-setgreen'>
              {state.pinnedRaids.length} / 3 本
            </strong>
          </div>
        </div>
      </div>

      <nav aria-label='行動版分類選單' className='flex-1 space-y-4 overflow-y-auto p-3.5'>
        <NavLink to='/' end onClick={onNavigate} className={({ isActive }) => linkClass(isActive)}>
          <HomeOutlined />
          <span>工具啟動台首頁</span>
        </NavLink>

        {NAV_GROUPS.map((group, idx) => (
          <div key={group.title} className='space-y-1.5'>
            <p
              className={cx(
                idx < 2 ? 'section-bar-primary' : 'section-bar-category',
                'text-xs font-semibold text-ink'
              )}
            >
              {group.title}
            </p>
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
                      <Icon className='text-gold' />
                      <span className='truncate'>{item.title}</span>
                      <span className='ml-auto font-mono text-[11px] text-muted'>{item.roman}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div
        className='flex items-center justify-between gap-2 border-t border-line p-3.5 text-xs text-sub'
        style={{ paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          type='button'
          onClick={toggleTheme}
          className='focus-ring min-h-[44px] rounded-md border border-line-strong bg-well px-3.5 py-2 font-medium text-ink transition-colors hover:border-active'
        >
          {isDark ? '☀ 切換淺色模式' : '☾ 切換深色模式'}
        </button>

        <a
          href={SITE.repo}
          target='_blank'
          rel='noreferrer'
          className='focus-ring inline-flex min-h-[44px] items-center gap-1.5 px-2 text-muted transition-colors hover:text-ink'
        >
          <GithubOutlined /> GitHub
        </a>
      </div>
    </div>
  );
}
