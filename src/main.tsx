import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './assets/css/style.css';
import store from './store';
import Content from './view/layout/index';
import Routes from './route/index';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Content Component={<Routes />} />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
