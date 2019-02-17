import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './style.less';

export default class Nav extends Component{
  render(){
    const {
      navList
    } = this.props;

    return (
      <div className={styles.wrapper}>
        {
          navList.map(nav=><NavLink key={`nav${nav.name}${nav.path}`} exact={nav.exact} to={nav.path} className={styles.item} activeClassName={styles.active}>{nav.name}</NavLink>)
        }
      </div>
    )
  }
}
