import { useState, type ReactNode } from 'react';
import { CheckOutlined, LinkOutlined } from '@ant-design/icons';
import { cx } from '@/utils/cx';
import { copyTextWithFallback } from '@/utils/slug';

export interface BaseSpecRow {
  label: string;
  value: ReactNode;
  highlight?: boolean;
}

export interface CardScopeBadge {
  label: string;
  tone?: 'warning' | 'danger' | 'group' | 'attribute';
}

interface DataCard3ZoneProps {
  /** 供快速跳轉與 #anchor 複製使用的唯一 id */
  id: string;
  /** 主標題（預設使用 --semantic-highlight） */
  title: ReactNode;
  /** 英文原名／副鍵值，呈現為 `Localized Name (Canonical Name)` 雙語並列 */
  subtitleEn?: ReactNode;
  /** 標題右側範圍／條件狀態徽章（如：單人可、全綁金、雙週、S+） */
  scopeBadge?: CardScopeBadge;
  /** 標題列右側額外按鈕（如排入週常、標記完成） */
  headerActions?: ReactNode;
  /** 標題色階：gold / set / magic */
  titleTone?: 'gold' | 'set' | 'magic';
  /** 第 1 區：88px 視覺凹槽 (--bg-media-well) 內容 */
  visual: ReactNode;
  /** 第 2 區：基礎規格 Key-Value 清單 */
  baseSpecs: BaseSpecRow[];
  /** 第 3 區：結構化詞綴／關卡機制／獎勵明細 */
  children: ReactNode;
  /** 頁尾左側技術中繼資料（如 ID / ILVL / TIER） */
  footerMeta?: ReactNode;
  /** 頁尾右側補充資訊或互動觸發 */
  footerRight?: ReactNode;
  /** 是否處於已標記／釘選強調態 */
  highlighted?: boolean;
  /** 是否處於已完成半透明收斂態 */
  dimmed?: boolean;
}

const SCOPE_TONE_CLASS: Record<NonNullable<CardScopeBadge['tone']>, string> = {
  warning: 'tone-warning',
  danger: 'tone-rose',
  group: 'tone-emerald',
  attribute: 'tone-sky',
};

/**
 * obsidian-lookup-uiux SKILL.md Section 3 & Section 4D 三區水平資料卡：
 * - `< 640px` (Mobile)：單欄緊湊堆疊（左側 56px 視覺井 + 基礎規格並列，下方接進階詞綴），不浪費整排空白高度
 * - `640px – 1023px` (Tablet)：2-Zone 分欄（左欄：視覺井 + 基礎規格；右欄：進階詞綴）
 * - `>= 1024px` (Desktop)：完整 3-Zone 水平網格 (`88px | minmax(200px, 1fr) | minmax(280px, 1.5fr)`)
 * - 連結複製鈕固定最小寬度 (`min-w-[74px]`) 防止點擊切換「已複製」時造成版面抖動，並內建非安全環境 fallback
 */
export default function DataCard3Zone({
  id,
  title,
  subtitleEn,
  scopeBadge,
  headerActions,
  titleTone = 'gold',
  visual,
  baseSpecs,
  children,
  footerMeta,
  footerRight,
  highlighted,
  dimmed,
}: DataCard3ZoneProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${id}`;
    void copyTextWithFallback(url);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const titleColor =
    titleTone === 'set'
      ? 'text-setgreen'
      : titleTone === 'magic'
        ? 'text-magic'
        : 'text-gold';

  return (
    <article
      id={id}
      className={cx(
        'surface anchor-card overflow-hidden transition-colors duration-normal',
        highlighted && 'border-active',
        dimmed && 'opacity-70'
      )}
    >
      {/* 1. Card Header Strip */}
      <div className='flex flex-wrap items-center justify-between gap-2 border-b border-line bg-elevated/45 px-3.5 py-2 sm:px-4'>
        <div className='flex min-w-0 flex-wrap items-center gap-2'>
          <h2 className={cx('text-[15px] font-semibold leading-snug sm:text-[16px]', titleColor)}>
            {title}
          </h2>
          {subtitleEn && (
            <span className='font-mono text-xs text-sub'>({subtitleEn})</span>
          )}
          {scopeBadge && (
            <span className={cx('chip text-[11px]', SCOPE_TONE_CLASS[scopeBadge.tone ?? 'warning'])}>
              {scopeBadge.label}
            </span>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-1.5'>
          {headerActions}
          <button
            type='button'
            onClick={handleCopyLink}
            aria-label='複製此項目深層連結'
            className={cx(
              'focus-ring inline-flex min-w-[74px] items-center justify-center gap-1 rounded-sm border px-2 py-1 text-xs font-medium transition-colors duration-fast',
              copied
                ? 'border-setgreen/60 bg-setgreen/15 text-setgreen'
                : 'border-line-strong/80 bg-surface text-sub hover:border-line-strong hover:bg-hover hover:text-ink'
            )}
          >
            {copied ? <CheckOutlined className='text-[10px]' /> : <LinkOutlined className='text-[11px]' />}
            <span>{copied ? '已複製' : '連結'}</span>
          </button>
        </div>
      </div>

      {/* 2. Responsive 1-Col (Mobile) / 2-Zone (Tablet) / 3-Zone (Desktop) Body */}
      <div className='grid grid-cols-1 gap-3.5 p-3.5 sm:grid-cols-[230px_minmax(0,1fr)] sm:items-start sm:gap-4 sm:p-4 lg:grid-cols-[88px_minmax(200px,1fr)_minmax(280px,1.5fr)] lg:gap-5'>
        {/* Zone 1 + Zone 2 wrapper on Mobile & Tablet; dissolves into 2 distinct columns on lg+ via lg:contents */}
        <div className='flex items-start gap-3 border-b border-line pb-3 sm:flex-col sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4 lg:contents'>
          {/* Zone 1: Visual Well */}
          <div className='media-well size-16 shrink-0 p-1.5 sm:h-[72px] sm:w-full lg:h-[84px] lg:w-[88px]'>
            {visual}
          </div>

          {/* Zone 2: Baseline Specs */}
          <dl className='min-w-0 flex-1 space-y-1 text-[13px] leading-[1.55] sm:w-full lg:border-r lg:border-line lg:pr-5'>
            {baseSpecs.map((spec) => (
              <div
                key={spec.label}
                className='flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 sm:justify-between lg:justify-start'
              >
                <dt className='shrink-0 text-sub'>{spec.label}：</dt>
                <dd
                  className={cx(
                    'font-mono tabular-nums',
                    spec.highlight ? 'font-semibold text-roll' : 'font-medium text-ink'
                  )}
                >
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Zone 3: Structured Modifiers / Mechanics */}
        <div className='min-w-0 text-[13.5px] leading-[1.55]'>{children}</div>
      </div>

      {/* 3. Card Footer Bar */}
      {(footerMeta || footerRight) && (
        <div className='flex flex-wrap items-center justify-between gap-2 border-t border-line bg-well/55 px-3.5 py-1.5 font-mono text-[11px] tabular-nums text-muted sm:px-4'>
          <div>{footerMeta}</div>
          {footerRight && <div className='font-sans text-[11.5px] text-sub'>{footerRight}</div>}
        </div>
      )}
    </article>
  );
}
