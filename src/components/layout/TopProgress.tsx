import { cx } from '@/utils/cx';

interface TopProgressProps {
  active: boolean;
}

/** 路由切換（lazy 載入頁面）時顯示於頂端的進度條 */
export default function TopProgress({ active }: TopProgressProps) {
  return (
    <div
      aria-hidden
      className={cx(
        'pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden transition-opacity duration-300',
        active ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className='h-full w-1/3 animate-progress bg-gradient-to-r from-transparent via-brand to-transparent' />
    </div>
  );
}
