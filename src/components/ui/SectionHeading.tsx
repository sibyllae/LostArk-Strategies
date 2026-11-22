import type { ReactNode } from 'react';
import { cx } from '@/utils/cx';

interface SectionHeadingProps {
  title: ReactNode;
  count?: number;
  dotClassName?: string;
  extra?: ReactNode;
}

export default function SectionHeading({ title, count, dotClassName = 'bg-zinc-400', extra }: SectionHeadingProps) {
  return (
    <div className='mb-3 flex items-center gap-2'>
      <span aria-hidden className={cx('size-1.5 rounded-full', dotClassName)} />
      <h2 className='text-sm font-semibold text-zinc-200'>{title}</h2>
      {count !== undefined && (
        <span className='rounded-full bg-white/5 px-2 text-[11px] tabular-nums text-zinc-400'>{count}</span>
      )}
      {extra && <div className='ml-auto'>{extra}</div>}
    </div>
  );
}
