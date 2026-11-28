import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className='surface mx-auto max-w-lg p-10 text-center'>
      <p className='font-mono text-xs font-semibold uppercase tracking-widest text-rare'>
        404 · ROUTE NOT FOUND
      </p>
      <h1 className='mt-2.5 text-xl font-semibold text-ink'>找不到此快查頁面</h1>
      <p className='mt-2 text-[13.5px] leading-[1.55] text-sub'>
        您開啟的連結可能已更新，請返回啟動台首頁或按 <kbd>Q</kbd> ／ <kbd>/</kbd> 秒開全站快搜。
      </p>
      <Link
        to='/'
        className='filter-chip filter-chip-active focus-ring mt-6 px-4 py-2 text-[13px]'
      >
        返回工具啟動台首頁
      </Link>
    </div>
  );
}
