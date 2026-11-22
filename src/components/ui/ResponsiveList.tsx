import type { Key, ReactNode } from 'react';
import { Table, type TableColumnsType } from 'antd';

interface ResponsiveListProps<T extends { key: Key }> {
  data: T[];
  columns: TableColumnsType<T>;
  renderCard: (item: T) => ReactNode;
  scrollX?: number;
}

/**
 * md 以上顯示表格、行動裝置顯示卡片。
 * 以 CSS 切換（而非 JS 偵測螢幕）避免首次渲染閃爍。
 */
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
      <ul className='space-y-2 md:hidden'>
        {data.map((item) => (
          <li key={item.key}>{renderCard(item)}</li>
        ))}
      </ul>
    </>
  );
}
