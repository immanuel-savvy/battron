import React from 'react';
import Bg_view from '../components/bg_view';
import Header from '../components/header';
import {wp} from '../utils/dimensions';

class Subscribe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let {navigation} = this.props;

    return (
      <Bg_view style={{padding: wp(5), flex: 1, paddingBottom: 0}}>
        <Header title="subscribe" navigation={navigation} />
      </Bg_view>
    );
  }
}

export default Subscribe;
