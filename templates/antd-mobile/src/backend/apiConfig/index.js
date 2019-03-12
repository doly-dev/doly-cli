import { Toast } from 'antd-mobile';
import { DefaultMockHead, DefaultApiHead } from '../fetchEnv';

import ApiHome from './apiHome';

console.log(DefaultApiHead);
// 基础配置
export const BaseConfig = {
  url: '', // 接口url
  method: 'post', // 请求类型
  commonParams: {}, // 通用参数
  baseUrl: DefaultApiHead, // url头部
  apiBaseUrl: DefaultApiHead,
  mockBaseUrl: DefaultMockHead,
  openMock: false, // 是否开启mock
  successCode: '00', // 请求成功code
  validTokenCode: '03', // token失效code
  handleInvalidToken: (data) => { handleInvalidToken(data.respMsg); }, // 处理token失效
  headers: {},
  getHeaders: () => ({
    'Content-Type': 'application/json;charset=UTF-8',
    authorization: '',
  }),
  reqStart: () => {}, // 请求开始
  reqEnd: () => {}, // 请求结束
  handleError: (data) => { Toast.fail(data.respMsg); }, // 请求异常
  timeoutMs: 15000, // 超时
};

// 接口配置
export const ApiConfig = {
  ...ApiHome,
};
