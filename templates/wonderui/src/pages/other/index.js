import React, {Component} from 'react'
import { Page, PageContent, Link } from 'wonder-ui/Core';

import ImageTangWei from '../../assets/images/tangwei.jpeg';
import ImageCamera from '../../assets/images/camera.png';

import './style.less';

export default class OtherPage extends Component {
  render() {
    return (
      <Page title="其他页" className="otherpage">
        <PageContent>
          <h1>其他页</h1>
          <a href="javascript:;" onClick={()=>this.props.history.goBack()}>返回上一页</a>

          <h3>图片</h3>
          <p>小于8kb转为base64</p>
          <img src={ImageCamera} alt="" />
          <br/>
          <img src={ImageTangWei} alt="" />
        </PageContent>
      </Page>
    );
  }
}
