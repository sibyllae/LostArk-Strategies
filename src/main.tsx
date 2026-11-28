import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 當線上剛發布新版本導致瀏覽器快取的舊資源失效時，自動重新整理一次（以 sessionStorage 防止無限迴圈）
window.addEventListener('vite:preloadError', (event) => {
  const reloadKey = 'lostark_preload_reloaded';
  if (!sessionStorage.getItem(reloadKey)) {
    event.preventDefault();
    sessionStorage.setItem(reloadKey, '1');
    window.location.reload();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
