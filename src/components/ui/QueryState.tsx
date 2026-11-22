import type { ReactNode } from 'react';
import { Button, Result, Skeleton } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => unknown;
  skeleton?: ReactNode;
  children: ReactNode;
}

/** 統一處理 RTK Query 的載入中／錯誤狀態 */
export default function QueryState({ isLoading, isError, onRetry, skeleton, children }: QueryStateProps) {
  if (isLoading) return <>{skeleton ?? <CardGridSkeleton />}</>;

  if (isError) {
    return (
      <div className='surface py-6'>
        <Result
          status='warning'
          title='資料載入失敗'
          subTitle='請確認網路連線後再試一次。'
          extra={
            <Button type='primary' icon={<ReloadOutlined />} onClick={() => onRetry()}>
              重新載入
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3' aria-busy='true' aria-live='polite'>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className='surface p-5'>
          <Skeleton active title={{ width: '40%' }} paragraph={{ rows: 4 }} />
        </div>
      ))}
    </div>
  );
}
