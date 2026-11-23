import { cx } from '@/utils/cx';

interface LogoProps {
  size?: 'sm' | 'md';
}

export default function Logo({ size = 'md' }: LogoProps) {
  return (
    <span
      aria-hidden
      className={cx(
        'relative grid shrink-0 place-items-center rounded-md border border-gold-500/40 bg-obsidian-850',
        size === 'sm' ? 'size-7' : 'size-8'
      )}
    >
      <svg viewBox='0 0 24 24' className={size === 'sm' ? 'size-4' : 'size-5'}>
        <path d='M12 2.5 20.5 12 12 21.5 3.5 12Z' fill='none' stroke='#c4984d' strokeWidth='1.75' />
        <path d='M12 7.5 15.8 12 12 16.5 8.2 12Z' fill='#d8b26e' />
      </svg>
    </span>
  );
}
