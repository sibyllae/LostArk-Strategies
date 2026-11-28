import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: ReactNode;
  count?: number;
  subtitle?: ReactNode;
  primary?: boolean;
  extra?: ReactNode;
}

/**
 * obsidian-lookup-uiux SKILL.md Section 2：
 * Section Header 16px-18px, font-weight: 600, 3px left accent bar + 10px left padding
 */
export default function SectionHeading({
  title,
  count,
  subtitle,
  primary = false,
  extra,
}: SectionHeadingProps) {
  return (
    <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
      <div
        className={
          primary
            ? 'section-bar-primary flex flex-wrap items-baseline gap-2'
            : 'section-bar-category flex flex-wrap items-baseline gap-2'
        }
      >
        <h2 className='text-[16px] font-semibold leading-snug text-ink sm:text-[17px]'>{title}</h2>
        {count !== undefined && (
          <span className='font-mono text-xs font-semibold tabular-nums text-gold'>({count})</span>
        )}
        {subtitle && <span className='text-xs text-muted'>{subtitle}</span>}
      </div>
      {extra && <div>{extra}</div>}
    </div>
  );
}
