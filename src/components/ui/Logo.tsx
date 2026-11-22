import { cx } from '@/utils/cx';

interface LogoProps {
  size?: 'sm' | 'md';
}

export default function Logo({ size = 'md' }: LogoProps) {
  return (
    <span
      aria-hidden
      className={cx(
        'relative grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20',
        size === 'sm' ? 'size-8' : 'size-9'
      )}
    >
      <svg viewBox='0 0 24 24' className={size === 'sm' ? 'size-4' : 'size-5'}>
        <path d='M12 2 20 12 12 22 4 12Z' fill='#0c0c0f' />
        <path d='M12 7.5 15.6 12 12 16.5 8.4 12Z' fill='#fbbf24' />
      </svg>
    </span>
  );
}
