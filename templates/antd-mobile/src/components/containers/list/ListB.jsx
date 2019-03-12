import React from 'react';
import s from './list.less';

class ListB extends React.Component {
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
      <div className={s.listB}>B</div>

    );
  }
}

export default ListB;
