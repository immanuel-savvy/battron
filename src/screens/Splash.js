import React from 'react';
import {StatusBar} from 'react-native';
import Bg_view from '../components/bg_view';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';
import RadialGradient from 'react-native-radial-gradient';

class Splash extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <RadialGradient
        style={{flex: 1}}
        colors={['#fff', '#fff']}
        stops={[0.1, 1]}
        center={[wp(50), hp(50)]}
        radius={wp(75)}>
        <Bg_view
          no_bg
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <StatusBar hidden />
          <Icon
            icon={require('../assets/icons/logo_battron.png')}
            style={{height: hp(40), width: wp(70)}}
          />
        </Bg_view>
      </RadialGradient>
    );
  };
}

export default Splash;
