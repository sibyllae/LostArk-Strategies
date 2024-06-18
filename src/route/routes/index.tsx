import { Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import { RouteObjectIn } from '../service';
import Page404 from '@/view/Page404';
import LAS from '@/component/LAS/index';

const Favorability = React.lazy(() => import('@/view/game/Favorability'));
const AdventureBook = React.lazy(() => import('@/view/game/AdventureBook'));

const Routes: RouteObjectIn[] = [
  {
    path: '/',
    element: <Navigate to='/LostArk-Strategies/' />,
    meta: {
      title: '首頁 | LostArk Strategies 失落的方舟攻略網',
    },
  },
  {
    path: '*',
    element: <Page404 />,
    meta: {
      title: 'Page not found | LostArk Strategies 失落的方舟攻略網',
    },
  },
  {
    path: '/LostArk-Strategies/',
    element: <LAS />,
    meta: {
      title: '首頁 | LostArk Strategies 失落的方舟攻略網',
    },
  },
  {
    path: '/LostArk-Strategies/game/favorability',
    element: (
      <Suspense fallback={<></>}>
        <Favorability />
      </Suspense>
    ),
    meta: {
      title: '好友度 | LostArk Strategies 失落的方舟攻略網',
    },
  },
  {
    path: '/LostArk-Strategies/game/adventureBook',
    element: (
      <Suspense fallback={<></>}>
        <AdventureBook />
      </Suspense>
    ),
    meta: {
      title: '冒險之書 | LostArk Strategies 失落的方舟攻略網',
    },
  },
];

export default Routes;
