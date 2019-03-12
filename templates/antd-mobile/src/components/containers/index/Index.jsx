import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from '../../layout/Layout';

@inject('GlobalModel')
@observer
class Index extends React.Component {
  componentDidMount() {
    const { history } = this.props;
    console.log(this.props)
  }

  render() {
    return (
      <div>
          index
      </div>
    );
  }
}

export default Index;
