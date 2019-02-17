import React, { Component } from 'react';

import { home as homeService } from '../../services';

import styles from './style.less';

// 缓存
let notices = [];

export default class HomePage extends Component {
  state={
    loading: false,
    notices: notices
  }

  getNotices=()=>{
    this.setState({
      loading: true
    });

    homeService.getNotices().then(res=>{
      notices = res.data;

      this.setState({
        notices,
        loading: false
      });
    });
  }

  clearNotices=()=>{
    notices = [];

    this.setState({
      notices
    });
  }

  render(){
    const {
      notices,
      loading
    } = this.state;

    return (
      <div>
        <button className={styles.btn} onClick={this.getNotices} disabled={loading}>{loading ? '获取通知中...' : '获取通知列表（mock数据）'}</button>
        <h2>
          通知列表
          {
            notices.length > 0 ? <a href="javascript:;" style={{marginLeft: '10px', fontSize: '12px', color: 'red'}} onClick={this.clearNotices}>清空</a> : ''
          }
        </h2>
        <div>
          {
            notices.length > 0 ? notices.map(notice=><p key={`${notice.content}${notice.timestamp}`}>{notice.content}...{notice.timestamp}</p>) : '暂无通知'
          }
        </div>
      </div>
    )
  }
}
