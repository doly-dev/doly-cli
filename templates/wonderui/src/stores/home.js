import { observable, action } from 'mobx';
import { home as homeService} from '../services';

class HomeState {
  @observable notices = [];

  @action getNotices = ()=>{
    homeService.getNotices().then(res=>{
      this.notices = res.data;
    });
  }

  @action clearNotices = ()=>{
    this.notices.length = 0;
  }
}

const state = new HomeState;

export default state;
