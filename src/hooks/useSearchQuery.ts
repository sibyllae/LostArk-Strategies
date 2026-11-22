import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/** 將搜尋關鍵字同步到 URL query (?q=)，支援深層連結與瀏覽器上一頁 */
export function useSearchQuery(param = 'q') {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get(param) ?? '';

  const setQuery = useCallback(
    (value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) {
            next.set(param, value);
          } else {
            next.delete(param);
          }
          return next;
        },
        { replace: true }
      );
    },
    [param, setSearchParams]
  );

  return [query, setQuery] as const;
}
