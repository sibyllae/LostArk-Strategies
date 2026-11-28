import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';

type StandaloneNavigator = Navigator & { standalone?: boolean };

function checkStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    Boolean((window.navigator as StandaloneNavigator).standalone)
  );
}

/**
 * obsidian-lookup-uiux SKILL.md Section 4E & 4H：
 * 1. Mobile Filter Elevator (`直達電梯`)：捲動超過 1.5 倍視窗高度時，於右下拇指熱區提供一鍵跳回篩選列／快速跳轉雲。
 * 2. Standalone Back-Navigation Aid：偵測 PWA 獨立視窗模式（含 iOS navigator.standalone），於非首頁顯示 `← 返回` 輔助鈕，並尊重 safe-area-inset-bottom。
 */
export default function FloatingTools() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showElevator, setShowElevator] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(display-mode: standalone)');
    const updateStandalone = () => setIsStandalone(checkStandalone());
    updateStandalone();
    mq.addEventListener?.('change', updateStandalone);

    const onScroll = () => {
      setShowElevator(window.scrollY > window.innerHeight * 1.5);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      mq.removeEventListener?.('change', updateStandalone);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollToFilter = () => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const behavior = prefersReduced ? 'auto' : 'smooth';
    const target = document.getElementById('page-top-filter');
    if (target) {
      target.scrollIntoView({ behavior, block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  };

  if (!showElevator && !(isStandalone && pathname !== '/')) return null;

  return (
    <div
      className='fixed right-4 z-30 flex flex-col items-end gap-2'
      style={{ bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
    >
      {showElevator && (
        <button
          type='button'
          onClick={scrollToFilter}
          aria-label='直達電梯回到頂部篩選區'
          className='focus-ring inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-line-strong bg-elevated/95 px-3 py-2 text-xs font-semibold text-gold backdrop-blur-sm transition-colors duration-fast hover:border-active hover:bg-hover'
        >
          <VerticalAlignTopOutlined />
          <span>直達電梯</span>
        </button>
      )}

      {isStandalone && pathname !== '/' && (
        <button
          type='button'
          onClick={() => navigate(-1)}
          aria-label='返回上一頁'
          className='focus-ring inline-flex min-h-[42px] items-center gap-1.5 rounded-md border border-line-strong bg-elevated/95 px-3.5 py-2 text-xs font-semibold text-ink backdrop-blur-sm transition-colors duration-fast hover:border-active hover:bg-hover'
        >
          <ArrowLeftOutlined />
          <span>← 返回</span>
        </button>
      )}
    </div>
  );
}
