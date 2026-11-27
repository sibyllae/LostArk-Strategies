import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className='surface mx-auto max-w-lg p-12 text-center'>
      <p className='font-mono text-xs font-semibold uppercase tracking-widest text-brand'>
        404 NOT FOUND
      </p>
      <h1 className='mt-3 text-2xl font-bold text-ink'>找不到此資料庫頁面</h1>
      <p className='mt-2.5 text-sm leading-relaxed text-sub'>
        您開啟的連結可能已變更，請返回首頁或按 <kbd>Q</kbd> 鍵直接搜尋。
      </p>
      <Link
        to='/'
        className='focus-ring mt-7 inline-flex items-center rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:text-slate-950'
      >
        返回資料庫首頁
      </Link>
    </div>
  );
}
