import { SITE } from '@/config/navigation';

export default function AppFooter() {
  return (
    <footer className='border-t border-obsidian-700/70'>
      <div className='mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-5 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8'>
        <p>
          © {new Date().getFullYear()} {SITE.name} · 非官方玩家整理網站
        </p>
        <p>
          資料來源：
          <a
            href={SITE.dataSource}
            target='_blank'
            rel='noreferrer'
            className='focus-ring rounded text-stone-400 underline-offset-4 transition-colors hover:text-gold-300 hover:underline'
          >
            LOAlazybro 試算表
          </a>
          ，以及 KR、NA/EU 各大社群
        </p>
      </div>
    </footer>
  );
}
