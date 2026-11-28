import { ReloadOutlined } from '@ant-design/icons';

interface EmptyResultProps {
  query?: string;
  activeFilters?: string[];
  onReset?: () => void;
}

/**
 * obsidian-lookup-uiux SKILL.md Section 5 Zero-Result Filter State：
 * 明確列出導致 0 筆結果的作用中篩選條件，並提供單一主行動按鈕一鍵清除限制。
 */
export default function EmptyResult({ query, activeFilters = [], onReset }: EmptyResultProps) {
  const tags = [
    ...(query?.trim() ? [`關鍵字：「${query.trim()}」`] : []),
    ...activeFilters.filter((t) => !t.startsWith('關鍵字')),
  ];

  return (
    <div className='surface mx-auto max-w-xl px-5 py-10 text-center'>
      <p className='font-mono text-xs font-semibold uppercase tracking-wider text-rare'>
        ZERO MATCHES · 無符合條件項目
      </p>
      <p className='mt-2 text-[14px] font-medium text-ink'>
        目前的交集篩選條件未命中任何資料列
      </p>

      {tags.length > 0 && (
        <div className='mt-3 flex flex-wrap items-center justify-center gap-1.5'>
          {tags.map((tag) => (
            <span key={tag} className='meta-tag text-xs text-sub'>
              {tag}
            </span>
          ))}
        </div>
      )}

      {onReset && (
        <button
          type='button'
          onClick={onReset}
          className='filter-chip filter-chip-active focus-ring mt-4 px-4 py-1.5 text-[13px]'
        >
          <ReloadOutlined className='text-xs' />
          <span>清除所有篩選限制</span>
        </button>
      )}
    </div>
  );
}
