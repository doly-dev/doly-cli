import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import { HashRouter, Route, Switch, Link } from 'react-router-dom';

import './app.less';

// components
import Nav from './components/nav';

// pages
import HomePage from './pages/home';
import ExamplePage from './pages/example';

const pages = [
  {
    name: 'Home',
    path: '/',
    component: HomePage,
    exact: true
  },
  {
    name: 'Example',
    path: '/example',
    component: ExamplePage
  }
];

// eslint-disable-next-line
// console.log(APIURL);

// eslint-disable-next-line
class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <Fragment>
          <h1>Doly</h1>
          <Nav
            navList={pages}
          />
          <Switch>
            {
              pages.map(page=><Route key={`${page.name}${page.path}`} {...page} />)
            }
          </Switch>
        </Fragment>
      </HashRouter>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
