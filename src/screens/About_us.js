import React from 'react';
import Bg_view from '../components/bg_view';
import Header from '../components/header';
import {hp, wp} from '../utils/dimensions';
import Fr_text from '../components/fr_text';
import Icon from '../components/icon';
import {ScrollView} from 'react-native';

class About_us extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let {navigation} = this.props;

    return (
      <Bg_view flex style={{padding: wp(5), paddingBottom: 0}}>
        <Header title="about us" navigation={navigation} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Bg_view style={{paddingBottom: hp(10)}}>
            <Fr_text bold size={wp(6)} style={{marginTop: hp(2.5)}}>
              About us
            </Fr_text>
            <Bg_view style={{alignItems: 'center'}}>
              <Icon
                icon={require('../assets/icons/logo_battron.png')}
                style={{width: wp(95), height: wp(60)}}
              />
            </Bg_view>
            <Bg_view
              shadowed
              style={{padding: wp(4), margin: wp(2.8), borderRadius: wp(2.8)}}>
              <Fr_text style={{fontSize: wp(4.5), lineHeight: 30}}>
                Battron is on a mission to add value and relevance to everyone
                who owns a gadget which enables them to preserve their battery
                life which red uces unnecessary costs to replace your battery.
              </Fr_text>
            </Bg_view>
            <Fr_text
              style={{
                fontSize: wp(5.5),
                fontWeight: 'bold',
                marginTop: hp(2.5),
                paddingLeft: wp(4),
              }}>
              Our Purpose
            </Fr_text>
            <Bg_view
              shadowed
              style={{padding: wp(4), margin: wp(2.8), borderRadius: wp(2.8)}}>
              <Fr_text
                style={{
                  fontSize: wp(4.5),
                  lineHeight: 30,
                  // textAlign: 'justify',
                }}>
                Many brands are using personalisation to build better customer
                journeys but we believe it takes more than personalisation to
                build truly unforgettable digital experiences. Thats why we’re
                committed to delivering relevancy Many brands are using
                personalisation to build better customer journeys but we believe
                it takes more than personalisation to build truly unforgettable
                digital experiences. Thats why we’re committed to delivering
                relevancy.
              </Fr_text>
            </Bg_view>
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default About_us;