import React from 'react';
import { Router, Route } from 'dva/router';
import AppView from './components/AppView';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={AppView} />
    </Router>
  );
}

export default RouterConfig;
