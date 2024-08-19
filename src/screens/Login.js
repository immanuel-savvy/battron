import React from 'react';
import Bg_view from '../components/bg_view';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';
import Fr_text from '../components/fr_text';
import {TextInput} from 'react-native';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Bg_view flex>
        <Bg_view style={{alignItems: 'center'}}>
          <Icon
            icon={require('../assets/icons/logo_battron.png')}
            style={{height: hp(30), width: wp(60)}}
          />
        </Bg_view>
        <Bg_view style={{padding: wp(4)}}>
          <Fr_text
            style={{
              fontWeight: 'bold',
              fontSize: wp(5.6),
              marginBottom: hp(4),
            }}>
            Log in to Battron
          </Fr_text>

          <Bg_view>
            <Fr_text style={{marginBottom: hp(1.5), fontSize: wp(3.8)}}>
              Email Address
            </Fr_text>
            <TextInput
              placeholder="Enter your email..."
              style={{
                borderRadius: wp(5),
                borderColor: 'green',
                borderWidth: 1,
                paddingHorizontal: wp(2.8),
                justifyContent: 'center',
              }}
            />
          </Bg_view>
          <Bg_view style={{marginTop: hp(4)}}>
            <Fr_text style={{marginBottom: hp(1.5), fontSize: wp(3.8)}}>
              Password
            </Fr_text>
            <TextInput
              placeholder="Enter your password..."
              style={{
                borderRadius: wp(5),
                borderColor: 'green',
                borderWidth: 1,
                paddingHorizontal: wp(2.8),
                justifyContent: 'center',
              }}
            />
          </Bg_view>
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Login;
