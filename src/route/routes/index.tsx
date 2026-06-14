import { Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import { RouteObjectIn } from '../service';
import Page404 from '@/view/Page404';
import LAS from '@/component/LAS/index';

const Favorability = React.lazy(() => import('@/view/game/Favorability'));
const AdventureBook = React.lazy(() => import('@/view/game/AdventureBook'));
const Collectibles = React.lazy(() => import('@/view/game/Collectibles'));
const RaidChests = React.lazy(() => import('@/view/game/RaidChests'));
const MiscGuide = React.lazy(() => import('@/view/game/MiscGuide'));

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
  {
    path: '/LostArk-Strategies/game/collectibles',
    element: (
      <Suspense fallback={<></>}>
        <Collectibles />
      </Suspense>
    ),
    meta: {
      title: '收集品 | LostArk Strategies 失落的方舟攻略網',
    },
  },
  {
    path: '/LostArk-Strategies/game/raidChests',
    element: (
      <Suspense fallback={<></>}>
        <RaidChests />
      </Suspense>
    ),
    meta: {
      title: '副本開箱 | LostArk Strategies 失落的方舟攻略網',
    },
  },
  {
    path: '/LostArk-Strategies/game/miscGuide',
    element: (
      <Suspense fallback={<></>}>
        <MiscGuide />
      </Suspense>
    ),
    meta: {
      title: '雜項攻略 | LostArk Strategies 失落的方舟攻略網',
    },
  },
];

export default Routes;

