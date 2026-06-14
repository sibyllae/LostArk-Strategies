import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider, theme } from 'antd';
import './assets/css/style.css';
import store from './store';
import Content from './view/layout/index';
import Routes from './route/index';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: '#3b82f6', // blue-500
              colorInfo: '#3b82f6',
              borderRadius: 8,
              colorBgBase: '#09090b', // zinc-950
              colorBgContainer: '#18181b', // zinc-900
              colorBgElevated: '#27272a', // zinc-800
              wireframe: false,
            },
            components: {
              Menu: {
                darkItemBg: 'transparent',
                darkSubMenuItemBg: 'transparent',
                darkItemHoverBg: 'rgba(255, 255, 255, 0.08)',
                darkItemSelectedBg: 'rgba(59, 130, 246, 0.15)',
              },
              Table: {
                colorBgContainer: '#18181b',
                headerBg: '#27272a',
                rowHoverBg: '#27272a',
              },
              Drawer: {
                colorBgElevated: 'rgba(9, 9, 11, 0.95)', // zinc-950 with opacity
              }
            },
          }}
        >
          <Content Component={<Routes />} />
        </ConfigProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
