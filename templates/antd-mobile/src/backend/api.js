/* eslint-disable no-else-return */
import Http from './Http';
import { IsMock } from './fetchEnv';
import { ApiConfig, BaseConfig } from './apiConfig/';

const API = (() => {
  const result = {};

  Object.keys(ApiConfig).forEach((key) => {
    // combine config
    const configItem = Object.assign({}, BaseConfig, ApiConfig[key]);

    result[key] = (params) => {
      // update headers
      configItem.headers = Object.assign({}, configItem.headers, configItem.getHeaders());

      // mock
      if (IsMock && configItem.openMock) {
        configItem.headers = {};
        configItem.baseUrl = configItem.mockBaseUrl;
      } else {
        configItem.baseUrl = configItem.apiBaseUrl;
      }

      if (configItem.method === 'post') {
        return Http.post(configItem.url, params, configItem);
      } else {
        return Http.get(configItem.url, params, configItem);
      }
    };
  });

  return result;
})();

export default API;
