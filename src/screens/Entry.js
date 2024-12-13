import React from 'react';
import {Image} from 'react-native';
import Bg_view from '../components/bg_view';
import {hp, wp} from '../utils/dimensions';
import Small_btn from '../components/small_btn';

class Entry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let {navigation} = this.props;

    return (
      <Bg_view flex>
        <Image
          style={{width: wp(), flex: 1}}
          source={require('../assets/images/entry.png')}
        />
        <Bg_view
          style={{
            position: 'absolute',
            bottom: 0,
            paddingVertical: hp(5),
            width: wp(),
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}>
          <Bg_view
            no_bg
            horizontal
            flex
            style={{
              justifyContent: 'space-between',
              marginHorizontal: wp(2.8),
            }}>
            <Small_btn
              color="#000"
              action={() => navigation.navigate('signup')}
              style={{
                width: wp(44),
                margin: 0,
                borderRadius: wp(7),
                backgroundColor: '#fff',
              }}
              title="Register"
            />
            <Small_btn
              title="Login"
              action={() => navigation.navigate('login')}
              style={{
                width: wp(44),
                margin: 0,
                borderRadius: wp(7),
              }}
            />
          </Bg_view>
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Entry;
