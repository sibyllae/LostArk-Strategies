import type { Key, ReactNode } from 'react';
import { Table, type TableColumnsType } from 'antd';

interface ResponsiveListProps<T extends { key: Key }> {
  data: T[];
  columns: TableColumnsType<T>;
  renderCard: (item: T) => ReactNode;
  scrollX?: number;
}

/** md 以上顯示寬鬆表格、行動裝置顯示獨立留白卡片 */
export default function ResponsiveList<T extends { key: Key }>({
  data,
  columns,
  renderCard,
  scrollX,
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
        />
      </div>
      <ul className='space-y-3.5 md:hidden'>
        {data.map((item) => (
          <li key={item.key}>{renderCard(item)}</li>
        ))}
      </ul>
    </>
  );
}
