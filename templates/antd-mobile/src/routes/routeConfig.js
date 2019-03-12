import { asyncComponent } from '../utils/asyncComponent';

const RouteConfig = [
  {
    path: '/list-a',
    component: asyncComponent(() => import('../components/containers/list/ListA')),
    title: 'ListA',
  },
  {
    path: '/list-b',
    component: asyncComponent(() => import('../components/containers/list/ListB')),
    title: 'ListB',
  },
  {
    path: '/list-c',
    component: asyncComponent(() => import('../components/containers/list/ListC')),
    title: 'ListC',
  },
];

export default RouteConfig;
