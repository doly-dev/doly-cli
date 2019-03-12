/* eslint-disable */
import { observable, action, computed, toJS } from 'mobx';

class GlobalModel {
  @observable isLoading = false;
}

export default new GlobalModel();
