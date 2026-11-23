import type { ReactNode } from 'react';
import { getNavItem, type NavKey } from '@/config/navigation';

export interface PageStat {
  label: string;
  value: ReactNode;
}

interface PageHeaderProps {
  navKey: NavKey;
  stats?: PageStat[];
  extra?: ReactNode;
}

/** 功能頁共用標頭：平實的文件式標題列，把視覺重心留給下方資料表 */
export default function PageHeader({ navKey, stats, extra }: PageHeaderProps) {
  const item = getNavItem(navKey);

  return (
    <header className='mb-6 border-b border-obsidian-700/80 pb-5'>
      <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
        <div className='min-w-0'>
          <h1 className='font-display text-2xl font-bold tracking-tight text-stone-100 sm:text-[28px]'>
            {item.title}
          </h1>
          <p className='mt-1 text-sm text-stone-400'>{item.description}</p>
        </div>

        {stats && stats.length > 0 && (
          <dl className='flex shrink-0 items-center gap-5 text-xs'>
            {stats.map((stat) => (
              <div key={stat.label} className='flex items-baseline gap-1.5'>
                <dt className='text-stone-500'>{stat.label}</dt>
                <dd className='font-mono text-sm font-semibold tabular-nums text-stone-200'>
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {extra && <div className='mt-4'>{extra}</div>}
    </header>
  );
}
