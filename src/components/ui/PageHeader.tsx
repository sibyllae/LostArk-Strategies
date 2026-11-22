import type { ReactNode } from 'react';
import { ACCENTS, getNavItem, type NavKey } from '@/config/navigation';
import { cx } from '@/utils/cx';

export interface PageStat {
  label: string;
  value: ReactNode;
}

interface PageHeaderProps {
  navKey: NavKey;
  stats?: PageStat[];
  extra?: ReactNode;
}

/** 功能頁共用標頭：標題、說明、圖示與主題色皆取自導覽設定 */
export default function PageHeader({ navKey, stats, extra }: PageHeaderProps) {
  const item = getNavItem(navKey);
  const accent = ACCENTS[item.accent];
  const Icon = item.icon;

  return (
    <header className='surface relative mb-6 overflow-hidden p-5 sm:p-6'>
      <div aria-hidden className={cx('absolute inset-0 bg-gradient-to-br', accent.gradient)} />
      <div className='relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-start gap-4'>
          <span
            className={cx(
              'grid size-12 shrink-0 place-items-center rounded-2xl text-2xl ring-1',
              accent.iconBg,
              accent.text,
              accent.ring
            )}
          >
            <Icon />
          </span>
          <div className='min-w-0'>
            <h1 className='text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl'>{item.title}</h1>
            <p className='mt-1 text-sm text-zinc-400'>{item.description}</p>
          </div>
        </div>

        {stats && stats.length > 0 && (
          <dl className='flex shrink-0 gap-2'>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className='min-w-[84px] rounded-xl bg-black/20 px-3 py-2 ring-1 ring-white/5'
              >
                <dt className='text-[11px] text-zinc-500'>{stat.label}</dt>
                <dd className='font-mono text-lg font-semibold tabular-nums text-zinc-100'>
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {extra && <div className='relative mt-5'>{extra}</div>}
    </header>
  );
}
