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

/** 工具優先精簡頁首：3px 緋紅左側條 + 雙語對照標題 + tabular-nums 指標 */
export default function PageHeader({ navKey, stats, extra }: PageHeaderProps) {
  const item = getNavItem(navKey);

  return (
    <header id='page-top-filter' className='anchor-card mb-3.5 border-b border-line pb-3.5'>
      <div className='flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between'>
        <div className='section-bar-primary min-w-0'>
          <div className='flex flex-wrap items-baseline gap-2'>
            <h1 className='text-[18px] font-semibold text-ink sm:text-[20px]'>{item.title}</h1>
            <span className='font-mono text-xs uppercase tracking-wider text-muted'>
              ({item.subtitleEn})
            </span>
          </div>
          <p className='mt-0.5 text-[13px] text-sub'>{item.description}</p>
        </div>

        {stats && stats.length > 0 && (
          <dl className='flex shrink-0 flex-wrap items-center gap-2'>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className='surface flex items-baseline gap-2 px-2.5 py-1 text-xs'
              >
                <dt className='text-sub'>{stat.label}</dt>
                <dd className='font-mono text-[13.5px] font-semibold tabular-nums text-gold'>
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {extra && <div className='mt-2.5'>{extra}</div>}
    </header>
  );
}
