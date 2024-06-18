import { useLocation } from 'react-router-dom';

import { NonIndexRouteObject } from 'react-router-dom';

export interface RouteObjectIn extends NonIndexRouteObject {
  meta: MetaIn;
  children?: RouteObjectIn[];
}

interface MetaIn {
  title: string;
}

const useService = () => {
  /**
   * hook
   */
  const location = useLocation();

  // Route BeforeEach
  const beforeEach = (route: RouteObjectIn[]): RouteObjectIn[] => {
    route.forEach((to) => {
      // 判斷 path
      if (to.path === location.pathname) {
        document.title = to.meta.title;
      }
    });
    return route;
  };

  return { beforeEach };
};

export default useService;
