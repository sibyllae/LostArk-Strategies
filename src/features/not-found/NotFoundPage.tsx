import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

export default function NotFoundPage() {
  return (
    <div className='grid min-h-[60vh] place-items-center py-12'>
      <Result
        status='404'
        title={<span className='text-white text-3xl font-bold'>404</span>}
        subTitle={<span className='text-zinc-400'>找不到您請求的頁面或攻略資訊。</span>}
        extra={
          <Link to='/'>
            <Button type='primary' size='large' icon={<HomeOutlined />}>
              返回首頁
            </Button>
          </Link>
        }
      />
    </div>
  );
}
