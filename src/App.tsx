import { App as AntApp, ConfigProvider } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { store } from '@/app/store';
import { appTheme } from '@/app/theme';

export default function App() {
  return (
    <Provider store={store}>
      <ConfigProvider theme={appTheme} locale={zhTW}>
        <AntApp>
          <RouterProvider router={router} />
        </AntApp>
      </ConfigProvider>
    </Provider>
  );
}
