import { SITE } from '@/config/navigation';

export default function AppFooter() {
  return (
    <footer className='border-t border-white/5'>
      <div className='mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8'>
        <p>
          © {new Date().getFullYear()} {SITE.name} · 非官方玩家整理網站
        </p>
        <p>
          資料來源：
          <a
            href={SITE.dataSource}
            target='_blank'
            rel='noreferrer'
            className='focus-ring rounded text-zinc-400 underline-offset-4 transition-colors hover:text-zinc-100 hover:underline'
          >
            LOAlazybro 試算表
          </a>
          ，以及 KR、NA/EU 各大社群
        </p>
      </div>
    </footer>
  );
}
