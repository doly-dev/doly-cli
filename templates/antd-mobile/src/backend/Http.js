/* eslint-disable object-shorthand */
import axios from 'axios';

class Http {
  constructor() {
    this.baseOption = {
      method: 'post',
      url: '',
      baseUrl: '',
      commonParams: {},
      successCode: '',
      validTokenCode: '',
      params: {},
      headers: {},
      reqStart: () => { },
      reqEnd: () => { },
      handleInvalidToken: () => { },
      handleError: () => { },
    };
  }

  get(url, params, others) {
    const option = Object.assign({}, this.baseOption, {
      method: 'get',
      url: url,
      params: params || {},
      ...others,
      headers: Object.assign({}, others.headers),
    });

    return this.request(option);
  }

  post(url, params, others) {
    const option = Object.assign({}, this.baseOption, {
      method: 'post',
      url: url,
      data: params || {},
      ...others,
      headers: Object.assign({}, others.headers),
    });

    return this.request(option);
  }

  request(option) {
    return new Promise((resolve, reject) => {
      const config = Object.assign({}, this.baseOption, option);
      config.reqStart();
      axios.request({
        timeout: config.timeoutMs,
        baseURL: config.baseUrl,
        method: config.method,
        url: config.url,
        headers: config.headers,
        params: { ...config.commonParams, ...config.params },
        data: { ...config.commonParams, ...config.data },
      })
        .then(
          (res) => {
            res.data.respCode = res.data.respCode || res.data.errCode;
            res.data.respMsg = res.data.respMsg || res.data.errMsg;

            config.reqEnd(res.data);
            if (res.data.respCode === config.successCode) {
              resolve(res.data);
            } else if (res.data.respCode === config.validTokenCode) {
              config.handleInvalidToken(res.data);
            } else {
              config.handleError(res.data);
              reject(res.data);
            }
          },
          (err) => {
            console.log(err);
            const data = {
              respCode: '404',
              respMsg: '网络状况不太好,请稍后再试',
              errCode: '404',
              errMsg: '网络状况不太好,请稍后再试',
            };
            reject(data);
            config.reqEnd(data);
            config.handleError(data);
          }
        );
    });
  }
}

export default new Http();
