import { cx } from '@/utils/cx';

interface LogoProps {
  size?: 'sm' | 'md';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const box = size === 'sm' ? 'size-7' : 'size-8';
  const icon = size === 'sm' ? 'size-4' : 'size-[18px]';

  return (
    <span aria-hidden className={cx('media-well shrink-0 text-gold', box)}>
      <svg viewBox='0 0 24 24' className={icon} fill='none'>
        <path d='M12 2.5 21 12l-9 9.5L3 12 12 2.5Z' stroke='currentColor' strokeWidth='1.8' />
        <path d='M12 7.2 16.5 12 12 16.8 7.5 12 12 7.2Z' fill='currentColor' />
      </svg>
    </span>
  );
}
