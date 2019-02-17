import React, {Component} from 'react';
import {render} from 'react-dom';
import {Page, PageContent, Link} from 'wonder-ui/Core';
import Button from 'wonder-ui/Button';
import {GridRow, GridCol} from 'wonder-ui/Grid';
import {inject, observer} from 'mobx-react';

import './style.less';

@inject('home')
@observer
export default class HomePage extends Component {

  handleGetNotices = ()=>{
    const {
      home
    } = this.props;

    home.getNotices();
  }

  render() {
    const {
      home: {
        notices,
        getNotices,
        clearNotices
      }
    } = this.props;

    return (
      <Page title="首页" className='homepage'>
        <PageContent>
          <h1>首页</h1>
          <Link to="other">跳转other页面</Link>
          <br/>
          <br/>
          <div><Button onClick={getNotices}>获取通知列表（mock数据）</Button></div>
          <br/>
          <h2>
            通知列表
            {
              notices.length > 0 ? <a href="javascript:;" style={{marginLeft: '10px', fontSize: '12px', color: 'red'}} onClick={clearNotices}>清空</a> : ''
            }
          </h2>
          <div>
            {
              notices.length > 0 ? notices.map(notice=><p key={`${notice.content}${notice.timestamp}`}>{notice.content}...{notice.timestamp}</p>) : '暂无通知'
            }
          </div>
        </PageContent>
      </Page>
    );
  }
}
