import React, { Component, Fragment } from 'react';
import ImageTangWei from '../../assets/images/tangwei.jpeg';
import ImageCamera from '../../assets/images/camera.png';

export default class ExamplePage extends Component {
  render(){
    return (
      <Fragment>
        <h3>图片</h3>
        <p>小于8kb转为base64</p>
        <img src={ImageCamera} alt="" />
        <br/>
        <img src={ImageTangWei} alt="" />
      </Fragment>
    )
  }
}
