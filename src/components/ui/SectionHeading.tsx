import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: ReactNode;
  count?: number;
  dotClassName?: string;
  extra?: ReactNode;
}

export default function SectionHeading({ title, count, extra }: SectionHeadingProps) {
  return (
    <div className='mb-3 flex items-center gap-2 border-l-2 border-gold-500 pl-2.5'>
      <h2 className='text-sm font-semibold text-stone-100'>{title}</h2>
      {count !== undefined && (
        <span className='font-mono text-xs tabular-nums text-stone-500'>({count})</span>
      )}
      {extra && <div className='ml-auto'>{extra}</div>}
    </div>
  );
}
