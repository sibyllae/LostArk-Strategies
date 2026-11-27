import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: ReactNode;
  count?: number;
  subtitle?: ReactNode;
  extra?: ReactNode;
}

export default function SectionHeading({ title, count, subtitle, extra }: SectionHeadingProps) {
  return (
    <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
      <div className='flex flex-wrap items-center gap-3'>
        <span aria-hidden className='h-5 w-1 rounded-full bg-brand' />
        <h2 className='text-lg font-bold tracking-[0.04em] text-ink'>{title}</h2>
        {count !== undefined && (
          <span className='rounded-full border border-line bg-subtle px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums text-sub'>
            {count}
          </span>
        )}
        {subtitle && <span className='text-xs text-muted'>{subtitle}</span>}
      </div>
      {extra && <div>{extra}</div>}
    </div>
  );
}
