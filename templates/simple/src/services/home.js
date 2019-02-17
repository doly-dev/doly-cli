import ajax from './ajax';

/**
 * 查询通知信息
 */
const getNotices = ()=>{
  return ajax('api/notices', {
      method: 'get'
  });
}

export default {
  getNotices
}
