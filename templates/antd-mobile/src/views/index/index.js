import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import { configure } from 'mobx';
import { Provider } from 'mobx-react';

import routers from '../../routes/route';

import StateTree from '../../models/';

console.log(APP_ENV);

const stores = {
  ...StateTree,
};

const MOUNT_NODE = document.getElementById('root');

window._____APP_STATE_____ = stores;

configure({ enforceActions: 'observed' });

ReactDOM.render(
  <Provider {...stores}>
    <div>
      { routers }
    </div>
  </Provider>, MOUNT_NODE,
);


