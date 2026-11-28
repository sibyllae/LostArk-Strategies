import { useEffect } from 'react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { Button, Result } from 'antd';

const CHUNK_ERR_RE =
  /Failed to fetch dynamically imported module|Importing a module script failed|Outdated Optimize Dep|Loading chunk/i;

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const message = error instanceof Error ? error.message : '';
  const isChunkError = CHUNK_ERR_RE.test(message);

  // 若偵測到開發伺服器重新最佳化依賴或線上換版造成的模組載入錯誤，自動無感重整一次
  useEffect(() => {
    if (!isChunkError) return;
    const key = `lostark_chunk_retry:${window.location.pathname}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      window.location.reload();
    }
  }, [isChunkError]);

  return (
    <div className='surface mx-auto my-8 max-w-xl p-8'>
      <Result
        status={isNotFound ? '404' : 'error'}
        title={isNotFound ? '找不到頁面' : '頁面載入異常'}
        subTitle={
          isNotFound
            ? '您前往的網址可能已變更或移除。'
            : '網站剛完成更新或資源快取已過期，請點擊重新整理載入最新內容。'
        }
        extra={
          <div className='space-y-4'>
            <div className='flex justify-center gap-3'>
              <Link to='/'>
                <Button type='primary' size='large'>
                  回到首頁
                </Button>
              </Link>
              <Button size='large' onClick={() => window.location.reload()}>
                重新整理
              </Button>
            </div>
            {message && !isNotFound && (
              <p className='mx-auto max-w-md break-all rounded-lg border border-line bg-subtle px-3 py-2 font-mono text-xs text-muted'>
                {message}
              </p>
            )}
          </div>
        }
      />
    </div>
  );
}
