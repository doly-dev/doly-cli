import React, { Fragment } from 'react';
import {
  Router,
  Route,
  Switch,
  Redirect,
  IndexRoute,
} from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import RouteConfig from './routeConfig';

import Layout from '../components/layout/Layout';
import { asyncComponent } from '../utils/asyncComponent';


const noMatch = asyncComponent(() => import('../components/containers/no-match/NoMatch'));
const history = createHashHistory();

const RouteCtrl = (route) => {
     document.title = route.title || '首页';
     return(
       <Route
        exact
        path={route.path}
        component={route.component}
      />
     )
};
const routes = (
  <Router history={history} key={Math.random()}>
    <Layout history={history}>
      <Fragment>
        <Switch>
          <Route exact path='/' component={asyncComponent(() => import('../components/containers/index/Index'))}  />
          {
            RouteConfig.map((route,key) => {
              return (
                <RouteCtrl key={key} {...route} />
              );
            })
          }
          <Route component={noMatch} />
        </Switch>
      </Fragment>
    </Layout>
  </Router>
);

export default routes;
