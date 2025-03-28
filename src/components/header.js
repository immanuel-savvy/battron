import React from 'react';
import {hp, wp} from '../utils/dimensions';
import Fr_text from './fr_text';
import {TouchableNativeFeedback} from 'react-native';
import Bg_view from './bg_view';
import Feather from 'react-native-vector-icons/Feather';
import Cool_modal from './cool_modal';
import Options from './options';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  toggle_options = () => this.options?.toggle();

  render() {
    let {title, navigation, style} = this.props;

    return (
      <>
        <Bg_view
          no_bg
          style={{
            justifyContent: 'space-between',
            borderBottomColor: '#ccc',
            paddingVertical: hp(2),
            ...style,
          }}
          horizontal>
          <TouchableNativeFeedback onPress={navigation.goBack}>
            <Feather
              name="chevron-left"
              color="#000"
              style={{marginLeft: wp(4)}}
              size={wp(6.5)}
            />
          </TouchableNativeFeedback>
          <Fr_text
            bold="900"
            size={wp(5)}
            color={title === 'home' ? '#000' : null}
            capitalise></Fr_text>
          <TouchableNativeFeedback onPress={null}>
            <Bg_view />
            {/* <Feather name="menu" color="#000" size={wp(7.5)} /> */}
          </TouchableNativeFeedback>
        </Bg_view>
        <Cool_modal ref={options => (this.options = options)}>
          <Options
            toggle={this.toggle_options}
            screen={title}
            navigation={navigation}
          />
        </Cool_modal>
      </>
    );
  }
}

export default Header;
