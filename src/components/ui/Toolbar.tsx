import type { ReactNode } from 'react';

/** 頁面篩選工具列：行動版直排、桌面版橫排 */
export default function Toolbar({ children }: { children: ReactNode }) {
  return <div className='mb-5 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center'>{children}</div>;
}
