import { cx } from '@/utils/cx';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const boxSize = size === 'lg' ? 'size-11' : size === 'sm' ? 'size-8' : 'size-9';
  const svgSize = size === 'lg' ? 'size-6' : size === 'sm' ? 'size-4' : 'size-5';

  return (
    <span
      aria-hidden
      className={cx(
        'grid shrink-0 place-items-center rounded-xl border border-brand/35 bg-brand/10 text-brand',
        boxSize
      )}
    >
      <svg viewBox='0 0 24 24' className={svgSize} fill='none'>
        <path
          d='M12 2.5 21.5 12 12 21.5 2.5 12Z'
          stroke='currentColor'
          strokeWidth='1.75'
        />
        <path d='M12 7 17 12 12 17 7 12Z' fill='currentColor' fillOpacity='0.85' />
      </svg>
    </span>
  );
}
