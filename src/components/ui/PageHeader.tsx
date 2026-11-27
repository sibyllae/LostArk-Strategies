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

export default function PageHeader({ navKey, stats, extra }: PageHeaderProps) {
  const item = getNavItem(navKey);
  const Icon = item.icon;

  return (
    <header className='mb-8 border-b border-line pb-7'>
      <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
        <div className='min-w-0 space-y-2.5'>
          <div className='inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-semibold tracking-wider text-brand'>
            <Icon className='text-xs' />
            <span>{item.subtitleEn}</span>
          </div>

          <h1 className='text-2xl font-bold tracking-[0.04em] text-ink sm:text-3xl'>
            {item.title}
          </h1>

          <p className='max-w-2xl text-[15px] leading-relaxed text-sub'>{item.description}</p>
        </div>

        {stats && stats.length > 0 && (
          <dl className='surface flex shrink-0 flex-wrap divide-x divide-line px-2 py-3'>
            {stats.map((stat) => (
              <div key={stat.label} className='px-5 py-0.5'>
                <dt className='text-xs font-medium text-muted'>{stat.label}</dt>
                <dd className='mt-1 font-mono text-xl font-bold tabular-nums text-ink'>
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {extra && <div className='mt-5'>{extra}</div>}
    </header>
  );
}
