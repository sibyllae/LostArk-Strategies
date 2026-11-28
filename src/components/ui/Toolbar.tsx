import type { ReactNode } from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import { cx } from '@/utils/cx';

export type ConstraintMode = 'ceiling' | 'exact';

export interface ConstraintModeConfig {
  mode: ConstraintMode;
  onChange: (mode: ConstraintMode) => void;
  ceilingLabel?: string;
  exactLabel?: string;
}

interface ToolbarProps {
  children: ReactNode;
  /** 當前過濾後筆數 */
  shownCount?: number;
  /** 資料集總筆數 */
  totalCount?: number;
  /** 目前作用中的篩選標籤描述，非空時顯示一鍵重置鈕 */
  activeFilters?: string[];
  /** 一鍵清除所有篩選條件 */
  onReset?: () => void;
  /** SKILL.md Section 4E：門檻上限 vs 精確區間模式切換器 */
  constraintMode?: ConstraintModeConfig;
}

/**
 * obsidian-lookup-uiux SKILL.md Section 4E 多維度複合篩選列：
 * 內建 aria-live="polite" 即時筆數 (`Showing X / Y`)、門檻模式切換器與一鍵重置鈕。
 */
export default function Toolbar({
  children,
  shownCount,
  totalCount,
  activeFilters = [],
  onReset,
  constraintMode,
}: ToolbarProps) {
  const hasFooter =
    shownCount !== undefined || activeFilters.length > 0 || Boolean(constraintMode);

  return (
    <div className='surface mb-4 space-y-2.5 p-3 sm:p-3.5'>
      {children}

      {hasFooter && (
        <div className='flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2 text-xs'>
          <div className='flex flex-wrap items-center gap-2'>
            {shownCount !== undefined && totalCount !== undefined && (
              <span
                aria-live='polite'
                className='font-mono text-xs font-medium tabular-nums text-sub'
              >
                顯示 <strong className='font-semibold text-gold'>{shownCount}</strong> / {totalCount} 筆
              </span>
            )}

            {activeFilters.length > 0 && (
              <div className='flex flex-wrap items-center gap-1'>
                {activeFilters.map((tag) => (
                  <span key={tag} className='meta-tag text-[11px] text-magic'>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            {constraintMode && (
              <div
                role='group'
                aria-label='門檻比對模式'
                className='inline-flex items-center rounded-sm border border-line-strong bg-well p-0.5 text-[11.5px]'
              >
                <button
                  type='button'
                  onClick={() => constraintMode.onChange('ceiling')}
                  className={cx(
                    'focus-ring rounded-sm px-2 py-0.5 font-medium transition-colors duration-fast',
                    constraintMode.mode === 'ceiling'
                      ? 'bg-active/[0.22] font-semibold text-ink'
                      : 'text-muted hover:text-sub'
                  )}
                >
                  {constraintMode.ceilingLabel ?? '≤ 門檻上限內'}
                </button>
                <button
                  type='button'
                  onClick={() => constraintMode.onChange('exact')}
                  className={cx(
                    'focus-ring rounded-sm px-2 py-0.5 font-medium transition-colors duration-fast',
                    constraintMode.mode === 'exact'
                      ? 'bg-active/[0.22] font-semibold text-ink'
                      : 'text-muted hover:text-sub'
                  )}
                >
                  {constraintMode.exactLabel ?? '= 精確匹配'}
                </button>
              </div>
            )}

            {onReset && activeFilters.length > 0 && (
              <button
                type='button'
                onClick={onReset}
                className='focus-ring inline-flex items-center gap-1 rounded-sm border border-danger/45 bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger transition-colors duration-fast hover:bg-danger/20'
              >
                <ReloadOutlined className='text-[10px]' />
                <span>重置篩選</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
