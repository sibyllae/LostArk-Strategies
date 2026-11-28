import type { Key, ReactNode } from 'react';
import { Table, type TableColumnsType } from 'antd';
import { cx } from '@/utils/cx';

interface ResponsiveListProps<T extends { key: Key }> {
  data: T[];
  columns: TableColumnsType<T>;
  renderCard: (item: T) => ReactNode;
  scrollX?: number;
  /** SKILL.md Section 4G：僅針對關鍵門檻或改動列套用 --semantic-diff-bg 差異高亮 */
  isDiffRow?: (item: T) => boolean;
}

/** md 以上顯示緊湊斑馬紋／差異高亮資料表、行動裝置自動轉換為結構化卡片 */
export default function ResponsiveList<T extends { key: Key }>({
  data,
  columns,
  renderCard,
  scrollX,
  isDiffRow,
}: ResponsiveListProps<T>) {
  return (
    <>
      <div className='surface hidden overflow-hidden md:block'>
        <Table<T>
          dataSource={data}
          columns={columns}
          pagination={false}
          size='middle'
          scroll={scrollX ? { x: scrollX } : undefined}
          rowClassName={(record) => (isDiffRow?.(record) ? 'diff-highlight-row' : '')}
        />
      </div>
      <ul className='space-y-3 md:hidden'>
        {data.map((item) => (
          <li
            key={item.key}
            className={cx(isDiffRow?.(item) && 'rounded-md ring-1 ring-rare/45')}
          >
            {renderCard(item)}
          </li>
        ))}
      </ul>
    </>
  );
}
