import React from 'react';
import ReactDOM from 'react-dom';
import './global.less';

import HomePage from './pages/home';

const container = document.getElementById('root');

const render = () => {
  ReactDOM.render(<HomePage />, container);
};

render();
