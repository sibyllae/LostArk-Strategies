import GlyphIcon, { type GlyphName } from './GlyphIcon';
import { cx } from '@/utils/cx';

export interface VisualTileOption<K extends string> {
  key: K;
  label: string;
  sub?: string;
  glyph: GlyphName;
  toneClass?: string;
  group?: string;
}

export interface SubGroupShortcut<K extends string> {
  label: string;
  targetKey: K;
  count?: number;
}

interface VisualTilePickerProps<K extends string> {
  options: ReadonlyArray<VisualTileOption<K>>;
  value: K;
  onChange: (key: K) => void;
  ariaLabel: string;
  /** SKILL.md Section 4C：子分類較多時，於圖示磚下方提供子群組快速跳轉列 */
  subGroups?: ReadonlyArray<SubGroupShortcut<K>>;
}

/**
 * obsidian-lookup-uiux SKILL.md Section 3 & 4C：
 * 視覺化子分類圖示磚選擇器（<640px 嚴格 3 欄、640–1023px 4 欄、>=1024px 6 欄）
 * 選取態套用 rgba(92,124,250,0.14) 與 --border-active。
 */
export default function VisualTilePicker<K extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  subGroups,
}: VisualTilePickerProps<K>) {
  const activeOption = options.find((o) => o.key === value);

  return (
    <div className='mb-4 space-y-2'>
      <div
        role='tablist'
        aria-label={ariaLabel}
        className='grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6'
      >
        {options.map((opt) => {
          const isActive = opt.key === value;
          return (
            <button
              key={opt.key}
              type='button'
              role='tab'
              aria-selected={isActive}
              onClick={() => onChange(opt.key)}
              className={cx(
                'focus-ring flex flex-col items-center justify-center gap-1.5 rounded-md border px-2 py-2.5 text-center transition-colors duration-fast',
                isActive
                  ? 'border-active bg-active/[0.14] text-ink'
                  : 'border-line bg-surface text-sub hover:border-line-strong hover:bg-hover hover:text-ink'
              )}
            >
              <span className={cx('media-well size-9', opt.toneClass ?? 'text-gold')}>
                <GlyphIcon name={opt.glyph} className='size-5' />
              </span>
              <span className='w-full truncate text-xs font-semibold leading-tight text-ink'>
                {opt.label}
              </span>
              {opt.sub && (
                <span className='font-mono text-[11px] leading-none tabular-nums text-muted'>
                  {opt.sub}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {subGroups && subGroups.length > 0 && (
        <div className='flex flex-wrap items-center gap-1.5 text-xs'>
          <span className='font-mono text-[11px] font-semibold text-muted'>分組快切：</span>
          {subGroups.map((sg) => {
            const isGroupActive = activeOption?.group === sg.label;
            return (
              <button
                key={sg.label}
                type='button'
                onClick={() => onChange(sg.targetKey)}
                className={cx(
                  'filter-chip focus-ring py-0.5 text-[11.5px]',
                  isGroupActive && 'filter-chip-active'
                )}
              >
                <span>{sg.label}</span>
                {sg.count !== undefined && (
                  <span className='font-mono text-[10px] tabular-nums text-muted'>({sg.count})</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
