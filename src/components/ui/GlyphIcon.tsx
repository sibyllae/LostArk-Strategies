import { cx } from '@/utils/cx';

export type GlyphName =
  | 'rapport'
  | 'tome'
  | 'heart'
  | 'island'
  | 'star'
  | 'chart'
  | 'orb'
  | 'art'
  | 'bounty'
  | 'leaf'
  | 'ignea'
  | 'raid'
  | 'mechanic'
  | 'planner'
  | 'ring'
  | 'bracelet'
  | 'engraving'
  | 'gem'
  | 'gear'
  | 'merchant'
  | 'roadmap'
  | 'guardian'
  | 'class'
  | 'arkgrid'
  | 'bomb'
  | 'enlightenment'
  | 'skill'
  | 'card'
  | 'rune'
  | 'song'
  | 'ship'
  | 'translate'
  | 'lifeskill'
  | 'clock'
  | 'quest';

interface GlyphIconProps {
  name: GlyphName;
  className?: string;
}

/** 專屬高對比幾何圖示精靈（置於 --bg-media-well 凹槽內，0.5 秒內快速辨識類別） */
export default function GlyphIcon({ name, className }: GlyphIconProps) {
  const cls = cx('size-6 shrink-0', className);

  switch (name) {
    case 'rapport':
    case 'heart':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M12 20.5s-7-4.4-8.8-8.6C1.8 8.6 4 5 7.5 5c2 0 3.4 1.1 4.5 2.6C13.1 6.1 14.5 5 16.5 5 20 5 22.2 8.6 20.8 11.9 19 16.1 12 20.5 12 20.5Z' />
        </svg>
      );
    case 'tome':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22.5V5.5Z' />
          <path d='M8 7h8M8 11h6' strokeLinecap='round' />
        </svg>
      );
    case 'engraving':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M5 4h11a3 3 0 0 1 3 3v13H7a2 2 0 0 1-2-2V4Z' />
          <path d='m9 9 3 3 3-3M9 14h6' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      );
    case 'gem':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <polygon points='7,3.5 17,3.5 21,9.5 12,20.5 3,9.5' strokeLinejoin='round' />
          <path d='M3 9.5h18M7 3.5l5 17 5-17' strokeLinejoin='round' />
        </svg>
      );
    case 'island':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M3 18c2.5-1.5 5.5-1.5 8 0s5.5 1.5 8 0' strokeLinecap='round' />
          <path d='M7 17c1-4 3.5-6 6-6 2.2 0 4.2 1.8 5 6' />
          <path d='M12 11V5m0 0c-2 0-3.5 1-4.5 2.5M12 5c2 0 3.5 1 4.5 2.5' strokeLinecap='round' />
        </svg>
      );
    case 'star':
    case 'arkgrid':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='m12 2.5 2.7 6.3 6.8.6-5.1 4.5 1.5 6.6L12 17l-5.9 3.5 1.5-6.6-5.1-4.5 6.8-.6L12 2.5Z' />
        </svg>
      );
    case 'chart':
    case 'bounty':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <circle cx='12' cy='12' r='8.5' />
          <path d='m15.5 8.5-2.2 5.3-5.3 2.2 2.2-5.3 5.3-2.2Z' />
        </svg>
      );
    case 'ship':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M12 3v11M12 4l6 7h-6M12 6 7 11h5' strokeLinejoin='round' />
          <path d='M3.5 15h17l-2.2 4.5H5.7L3.5 15Z' strokeLinejoin='round' />
        </svg>
      );
    case 'translate':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M4 6h10M9 4v2m-3.5 0c.5 3.5 2.5 6.5 6 8M12 6c-.8 3-2.8 5.8-6.5 8' strokeLinecap='round' />
          <path d='m13.5 19.5 3.5-8.5 3.5 8.5M14.8 16.5h4.4' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      );
    case 'lifeskill':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='m14 5 5 5-9.5 9.5H4.5V14.5L14 5Z' strokeLinejoin='round' />
          <path d='m11.5 7.5 5 5' strokeLinecap='round' />
        </svg>
      );
    case 'orb':
    case 'song':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M9 17.5V6l10-2v11.5' strokeLinecap='round' strokeLinejoin='round' />
          <circle cx='6.5' cy='17.5' r='2.5' />
          <circle cx='16.5' cy='15.5' r='2.5' />
        </svg>
      );
    case 'art':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <rect x='3.5' y='4.5' width='17' height='15' rx='1.5' />
          <circle cx='9' cy='9.5' r='1.5' />
          <path d='m5 17 4.5-4.5 3.5 3 3-2.5 3 4' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      );
    case 'leaf':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M19.5 4.5C12 4.5 6 9 5 17c8-1 12.5-7 14.5-12.5Z' />
          <path d='M5 19c2.5-3.5 6-6.5 10.5-8.5' strokeLinecap='round' />
        </svg>
      );
    case 'ignea':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z' />
          <path d='m12 8 4 4-4 4-4-4 4-4Z' />
        </svg>
      );
    case 'raid':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='m14.5 6.5 3-3 3 3-3 3M5 19l9.5-9.5M4 15l5 5M3 21l2.5-2.5' strokeLinecap='round' />
          <path d='m9.5 6.5-3-3-3 3 3 3L19 19m1-4-5 5m6 1-2.5-2.5' strokeLinecap='round' />
        </svg>
      );
    case 'mechanic':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <circle cx='12' cy='12' r='8.5' />
          <circle cx='12' cy='12' r='3.5' />
          <path d='M12 2v3M12 19v3M2 12h3M19 12h3' strokeLinecap='round' />
        </svg>
      );
    case 'planner':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <ellipse cx='12' cy='6.5' rx='7' ry='3' />
          <path d='M5 6.5V12c0 1.7 3.1 3 7 3s7-1.3 7-3V6.5' />
          <path d='M5 12v5.5c0 1.7 3.1 3 7 3s7-1.3 7-3V12' />
        </svg>
      );
    case 'ring':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <circle cx='12' cy='14' r='6.5' />
          <path d='m9.5 7.5 2.5-3.5 2.5 3.5' strokeLinejoin='round' />
        </svg>
      );
    case 'bracelet':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <ellipse cx='12' cy='12' rx='8' ry='5.5' />
          <path d='M4 12c0 3 3.6 5.5 8 5.5s8-2.5 8-5.5' />
          <circle cx='12' cy='6.5' r='1.8' fill='currentColor' />
        </svg>
      );
    case 'gear':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6l-7-3Z' />
          <path d='m9.5 12 2 2 3.5-4' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      );
    case 'merchant':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M4 9.5 5.8 4h12.4L20 9.5M4 9.5h16M5.5 9.5V20h13V9.5' strokeLinejoin='round' />
          <path d='M9.5 20v-5.5h5V20' />
        </svg>
      );
    case 'roadmap':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M4 18 9.5 12.5l4 4L20 9' strokeLinecap='round' strokeLinejoin='round' />
          <path d='M15 9h5v5' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      );
    case 'guardian':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M12 3 4 9l3 11h10l3-11-8-6Z' />
          <path d='M9 13h6M12 9v8' strokeLinecap='round' />
        </svg>
      );
    case 'class':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M12 2.5 19.5 12 12 21.5 4.5 12 12 2.5Z' />
          <circle cx='12' cy='12' r='2.5' />
        </svg>
      );
    case 'bomb':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <circle cx='11' cy='14' r='6.5' />
          <path d='M15.5 9.5 18 7m0 0h2.5M18 7V4.5' strokeLinecap='round' />
        </svg>
      );
    case 'enlightenment':
    case 'skill':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <path d='M13 2.5 5.5 13h6l-1 8.5L18.5 11h-6l.5-8.5Z' strokeLinejoin='round' />
        </svg>
      );
    case 'card':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <rect x='5' y='3.5' width='11' height='16' rx='1.5' />
          <path d='M9 6.5h9a1.5 1.5 0 0 1 1.5 1.5v11.5A1.5 1.5 0 0 1 18 21H9.5' />
        </svg>
      );
    case 'rune':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <polygon points='12,2.5 20,8 17.5,19.5 6.5,19.5 4,8' />
          <path d='M12 7v10M9 10.5l3-3 3 3' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      );
    case 'clock':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <circle cx='12' cy='12' r='8.5' />
          <path d='M12 7.5V12l3.2 2' strokeLinecap='round' />
        </svg>
      );
    case 'quest':
      return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.75' className={cls}>
          <rect x='5' y='4' width='14' height='16' rx='1.5' />
          <path d='m8.5 10 1.8 1.8 3.7-3.6M8.5 15.5h7' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      );
  }
}
