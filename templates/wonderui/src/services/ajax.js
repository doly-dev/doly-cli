import axios from 'axios';
// import Dialog from 'wonder-ui/Dialog';
import { showPreloader, hidePreloader } from 'wonder-ui/Preloader';

// eslint-disable-next-line
const baseUrl = location.port === '9000' ? '/' : APIURL;

const ajax = (url, options) => {
  if(!url){
    throw new Error('url is required.');
  }

  if(typeof url !== 'string'){
    throw new Error('url should be string.');
  }

  const {
    method,
    showPreload,
    ...restOptions
  } = options;

  const isShowPreload = (typeof showPreload !== 'undefined' || !showPreload) ? true : false;

  if(isShowPreload){
    showPreloader();
  }

  return axios({
    url: baseUrl + url,
    method: method.toUpperCase() || 'POST',
    ...restOptions
  }).then(res=>{
    if(isShowPreload){
      hidePreloader();
    }

    return res.data;
  }).catch(err=>{
    // do something  
    // Dialog.toast('请求失败'); //全局错误提示

    return err;
  });
};

export default ajax;