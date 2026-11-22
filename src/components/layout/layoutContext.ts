import { useOutletContext } from 'react-router-dom';

export interface LayoutContext {
  openSearch: () => void;
}

/** 子頁面透過 Outlet context 取得版面提供的動作（例如開啟快速搜尋） */
export const useLayoutContext = () => useOutletContext<LayoutContext>();
