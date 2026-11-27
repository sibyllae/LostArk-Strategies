import { useMemo } from 'react';
import { App as AntApp, ConfigProvider } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { store } from '@/app/store';
import { getAppTheme } from '@/app/theme';
import { useThemeMode } from '@/hooks/useThemeMode';

function ThemedRouter() {
  const { mode } = useThemeMode();
  const themeConfig = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ConfigProvider theme={themeConfig} locale={zhTW}>
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemedRouter />
    </Provider>
  );
}
