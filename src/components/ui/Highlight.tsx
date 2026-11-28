import { Fragment } from 'react';
import { escapeRegExp } from '@/utils/text';

interface HighlightProps {
  text?: string | null;
  query: string;
}

/** 將文字中符合搜尋關鍵字的部分以高對比雙主題 <mark> 標示（具空值防護） */
export default function Highlight({ text, query }: HighlightProps) {
  const safeText = text ?? '';
  const keyword = query.trim();
  if (!keyword || !safeText) return <>{safeText}</>;

  const parts = safeText.split(new RegExp(`(${escapeRegExp(keyword)})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark
            key={index}
            className='rounded bg-amber-200/80 px-1 py-0.5 font-semibold text-amber-950 dark:bg-amber-400/25 dark:text-amber-200'
          >
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  );
}
