import { Button, Empty } from 'antd';

interface EmptyResultProps {
  query?: string;
  onReset?: () => void;
}

export default function EmptyResult({ query, onReset }: EmptyResultProps) {
  return (
    <div className='surface py-16'>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span className='text-sm text-muted'>
            {query ? `找不到符合「${query}」的攻略條目` : '目前篩選條件下沒有符合的項目'}
          </span>
        }
      >
        {onReset && <Button onClick={onReset}>清除篩選條件</Button>}
      </Empty>
    </div>
  );
}
