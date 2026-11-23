/** 掛在 route `handle` 上的頁面 SEO 資訊，由 AppLayout 透過 useMatches() 讀取 */
export interface RouteHandle {
  title?: string;
  description?: string;
  keywords?: string[];
  noindex?: boolean;
}
