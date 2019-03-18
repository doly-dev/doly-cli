import React, {Component} from 'react'
import {render} from 'react-dom'
import {View, Pages} from 'wonder-ui/Core';
import {observer, Provider} from 'mobx-react';

import * as stores from './stores'

import IndexPage from './pages/home';
import OtherPage from './pages/other';

import './app.less';

@observer
class App extends Component {

  routes = [
    {path: '/', exact: true, component: IndexPage},
    {path: '/other', component: OtherPage},
  ]

  onPageInit = ({title})=>{
    document.title = title;
  }

  render() {
    return (
      <Provider {...stores}>
        <View onPageInit={this.onPageInit} >
          <Pages routes={this.routes} />
        </View>
      </Provider>
    );
  }
}

render(<App/>, document.querySelector('.root'));

if (module.hot) {
  module.hot.accept();
}
