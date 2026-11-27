import { Link } from 'react-router-dom';
import { NAV_ITEMS, SITE } from '@/config/navigation';

export default function AppFooter() {
  return (
    <footer className='mt-16 border-t border-line bg-surface/60'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10'>
        <div className='flex flex-col justify-between gap-5 border-b border-line pb-6 md:flex-row md:items-center'>
          <div className='space-y-1'>
            <p className='text-sm font-bold tracking-[0.05em] text-ink'>{SITE.subName}</p>
            <p className='text-xs leading-relaxed text-muted'>
              失落的方舟玩家快查資料庫 · 收集品與每週副本排程紀錄皆自動保存在您的瀏覽器本機
            </p>
          </div>

          <nav aria-label='頁尾導覽' className='flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium'>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className='focus-ring text-sub transition-colors hover:text-brand'
              >
                {item.shortTitle}
              </Link>
            ))}
          </nav>
        </div>

        <div className='mt-5 flex flex-col gap-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between'>
          <p>© {new Date().getFullYear()} LostArk Strategies · 非官方玩家社群整理網站</p>
          <p>
            資料整理參考：
            <a
              href={SITE.dataSource}
              target='_blank'
              rel='noreferrer'
              className='focus-ring text-sub underline-offset-4 transition-colors hover:text-brand hover:underline'
            >
              LOAlazybro 試算表
            </a>
            、Maxroll、Inven 與繁中／國際服玩家社群
          </p>
        </div>
      </div>
    </footer>
  );
}
