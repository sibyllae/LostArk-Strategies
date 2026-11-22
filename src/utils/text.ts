type SearchField = string | number | null | undefined | ReadonlyArray<string>;

/** 以分隔符號切割字串並去除空白項目 */
export const splitList = (value: string, separator = '、'): string[] =>
  value
    .split(separator)
    .map((part) => part.trim())
    .filter(Boolean);

/** 不分大小寫比對：任一欄位包含關鍵字即符合；關鍵字為空時一律符合 */
export const matchesQuery = (query: string, ...fields: SearchField[]): boolean => {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return true;
  return fields
    .flat()
    .some((field) => field != null && String(field).toLowerCase().includes(keyword));
};

export const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
