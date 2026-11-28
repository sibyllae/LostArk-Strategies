import { Fragment } from 'react';
import Highlight from './Highlight';

interface StatRangeTextProps {
  text?: string | null;
  query?: string;
}

/**
 * 依循 d2r-world-uiux SKILL.md Section 2 & 3D：
 * 自動將詞綴與說明中的變動數值、百分比區間（如 +50,000 G、0.55% / 1.20% / 2.00%、18～21、+3）
 * 以 `--semantic-range` (#e6b85c) + tabular-nums 醒目標示。
 */
const RANGE_TOKEN_RE =
  /([+-]?\d[\d,]*(?:\.\d+)?(?:\s*[～~–-]\s*\d[\d,]*(?:\.\d+)?)?\s*(?:%|G|金|銀|點|級|階|星|天|顆|片|個|pt)?)/g;

export default function StatRangeText({ text, query = '' }: StatRangeTextProps) {
  const safe = text ?? '';
  if (!safe) return null;

  // 若使用者正在搜尋關鍵字，優先顯示搜尋高亮以免標記重疊
  if (query.trim()) {
    return <Highlight text={safe} query={query} />;
  }

  const parts = safe.split(RANGE_TOKEN_RE);
  return (
    <>
      {parts.map((part, idx) =>
        idx % 2 === 1 ? (
          <span key={idx} className='font-mono font-semibold tabular-nums text-roll'>
            {part}
          </span>
        ) : (
          <Fragment key={idx}>{part}</Fragment>
        )
      )}
    </>
  );
}
