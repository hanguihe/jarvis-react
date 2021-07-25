import ReactDOM from 'react-dom';
import { HashRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zh from 'antd/es/locale/zh_CN';
import store from '@/model';
import router, { renderRouter } from './config/router.config';

const App = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zh}>
        <HashRouter>
          <Switch>{renderRouter(router)}</Switch>
        </HashRouter>
      </ConfigProvider>
    </Provider>
  );
};

const container = document.getElementById('root');
ReactDOM.render(<App />, container);
