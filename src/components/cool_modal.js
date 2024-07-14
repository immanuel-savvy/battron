import React from 'react';
import {hp} from '../utils/dimensions';
import Bg_view from './bg_view';
import Modal from 'react-native-modal';

class Cool_modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  toggle = () => this.setState({show_modal: !this.state.show_modal});

  render = () => {
    let {children, height, flex, center, no_swipe} = this.props;
    let {show_modal} = this.state;

    return (
      <Modal
        isVisible={show_modal}
        backdropColor="#fff"
        deviceHeight={height}
        onBackdropPress={this.toggle_show_modal}
        swipeDirection={no_swipe ? null : center ? 'right' : 'down'}
        onSwipeComplete={no_swipe ? null : this.toggle_show_modal}
        onBackButtonPress={this.toggle_show_modal}
        style={{
          margin: 0,
          padding: 0,
          height,
          justifyContent: center ? 'center' : 'flex-end',
        }}>
        <Bg_view flex={flex} no_bg style={{marginTop: height ? null : hp(5)}}>
          {children}
        </Bg_view>
      </Modal>
    );
  };
}

export default Cool_modal;
