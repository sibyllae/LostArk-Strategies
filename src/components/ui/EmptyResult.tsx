import { Button, Empty } from 'antd';

interface EmptyResultProps {
  query?: string;
  onReset?: () => void;
}

export default function EmptyResult({ query, onReset }: EmptyResultProps) {
  return (
    <div className='surface py-12'>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span className='text-zinc-400'>
            {query ? `找不到符合「${query}」的結果` : '沒有符合條件的結果'}
          </span>
        }
      >
        {onReset && <Button onClick={onReset}>清除篩選</Button>}
      </Empty>
    </div>
  );
}
