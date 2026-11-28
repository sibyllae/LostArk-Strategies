import { scrollToAndPulseAnchor } from '@/utils/slug';

export interface AnchorJumpItem {
  id: string;
  label: string;
  sub?: string;
}

interface AnchorJumpCloudProps {
  items: AnchorJumpItem[];
  title?: string;
}

/**
 * obsidian-lookup-uiux SKILL.md Section 4E：
 * 緊接在複合篩選列與資料卡清單之間的行內快速跳轉錨點雲，點擊平滑捲動並觸發目標卡片邊框脈衝。
 */
export default function AnchorJumpCloud({ items, title = '直達索引' }: AnchorJumpCloudProps) {
  if (items.length <= 1) return null;

  const jumpTo = (id: string) => {
    if (scrollToAndPulseAnchor(id)) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}#${id}`
      );
    }
  };

  return (
    <nav
      aria-label='項目快速跳轉索引'
      className='surface mb-4 flex flex-wrap items-center gap-1.5 px-3 py-2'
    >
      <span className='mr-1 shrink-0 font-mono text-xs font-semibold tabular-nums text-tealbar'>
        #{title} ({items.length})：
      </span>
      {items.map((it) => (
        <button
          key={it.id}
          type='button'
          onClick={() => jumpTo(it.id)}
          className='focus-ring inline-flex items-center gap-1 rounded-sm border border-line bg-well px-2 py-0.5 text-xs text-sub transition-colors duration-fast hover:border-active hover:bg-hover hover:text-ink'
        >
          <span className='max-w-[168px] truncate'>{it.label}</span>
          {it.sub && <span className='font-mono text-[10px] tabular-nums text-muted'>{it.sub}</span>}
        </button>
      ))}
    </nav>
  );
}
