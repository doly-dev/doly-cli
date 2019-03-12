import React from 'react';
import s from './list.less';

class ListA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
    };
  }

  componentDidMount() {
    // TODO
  }

  render() {
    return (
      <div>
        <div className={s.listA}>A</div>
      </div>

    );
  }
}

export default ListA;
