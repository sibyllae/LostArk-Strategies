import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { Button, Result } from 'antd';

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className='grid min-h-[60vh] place-items-center p-6'>
      <Result
        status={isNotFound ? '404' : 'error'}
        title={isNotFound ? '找不到頁面' : '頁面發生錯誤'}
        subTitle={
          isNotFound
            ? '你要找的頁面可能已被移除或網址有誤。'
            : '載入時發生問題，可能是網站剛更新過，請重新整理再試一次。'
        }
        extra={
          <div className='flex justify-center gap-2'>
            <Link to='/'>
              <Button type='primary'>回到首頁</Button>
            </Link>
            <Button onClick={() => window.location.reload()}>重新整理</Button>
          </div>
        }
      />
    </div>
  );
}
