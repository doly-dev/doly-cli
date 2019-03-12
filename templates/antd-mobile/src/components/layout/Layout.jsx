/* eslint-disable */
import React from 'react';
import { NavBar, Icon, Tabs, Badge, Modal } from 'antd-mobile';
import PropTypes from 'prop-types';
import s from './layout.less';

const Layout = (props) => {
  const history = props.history || {};
  const tabs = [
    { title: <Badge text={'3'}>List A</Badge>, url: '/list-a' },
    { title: <Badge text={'今日(20)'}>List B</Badge>, url: '/list-b' },
    { title: <Badge dot>List C</Badge>, url: '/list-c' },
  ];
  const tabMap = {
    '/list-a': 0,
    '/list-b': 1,
    '/list-c': 2,
  };
  return (
    <div className={`${s.container} ${props.className}`} style={{ backgroundColor: props.backgroundColor }}>
      <NavBar
        mode="dark"
        leftContent="Back"
        rightContent={[
          <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
          <Icon key="1" type="ellipsis" />,
        ]}
      >NavBar</NavBar>
      <Tabs
        tabs={tabs}
        initialPage={tabMap[history.location.pathname]}
        onChange={(tab, index) => { console.log('onChange', index, tab); }}
        onTabClick={(tab) => { location.hash = tab.url; }}
      />
      {props.children}
    </div>
  );
};

Layout.defaultProps = {
  className: '',
  backgroundColor: '',
};

Layout.propTypes = {
  className: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export default Layout;
