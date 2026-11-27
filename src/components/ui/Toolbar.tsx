import type { ReactNode } from 'react';

/** 篩選工具列：寬鬆間距讓搜尋框與條件切換互不擁擠 */
export default function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className='surface mb-7 flex flex-col gap-3.5 p-4 md:flex-row md:flex-wrap md:items-center'>
      {children}
    </div>
  );
}
