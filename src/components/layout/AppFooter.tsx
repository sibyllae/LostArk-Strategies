import { Link } from 'react-router-dom';
import { NAV_ITEMS, SITE } from '@/config/navigation';

export default function AppFooter() {
  return (
    <footer className='mt-8 border-t border-line bg-surface'>
      <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6'>
        <div className='flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center'>
          <p className='text-xs text-muted'>
            <strong className='font-semibold text-gold'>ARKESIA CODEX</strong> ·{' '}
            LostArk Strategies 非官方失落的方舟快查手冊（勾選進度自動儲存於本機）
          </p>

          <nav aria-label='頁尾快速連結' className='flex flex-wrap gap-x-3.5 gap-y-1 text-xs'>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className='focus-ring text-sub transition-colors duration-fast hover:text-gold'
              >
                {item.shortTitle}
              </Link>
            ))}
          </nav>
        </div>

        <p className='mt-2 text-[11px] text-muted'>
          資料來源：
          <a
            href={SITE.dataSource}
            target='_blank'
            rel='noreferrer'
            className='focus-ring text-sub underline-offset-4 hover:text-magic hover:underline'
          >
            LOAlazybro 試算表
          </a>
          、Maxroll、Lost Ark Nexus、Inven 與繁中／國際服社群實測整理
        </p>
      </div>
    </footer>
  );
}
