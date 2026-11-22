import { Spin } from 'antd';
import Logo from './Logo';

/** 首次載入 lazy route 時的全頁 fallback */
export default function FullPageLoader() {
  return (
    <div className='grid min-h-dvh place-items-center bg-zinc-950'>
      <div className='flex flex-col items-center gap-4'>
        <Logo />
        <Spin size='small' />
      </div>
    </div>
  );
}
