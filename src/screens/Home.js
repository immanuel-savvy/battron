import React from 'react';
import {View, TouchableNativeFeedback, ScrollView} from 'react-native';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import {hp, wp} from '../utils/dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text_input from '../components/text_input';
import Text_btn from '../components/text_btn';
import Header from '../components/header';
import DeviceBattery from 'react-native-device-battery';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preset_battery_level: 80,
      hidden: true,
    };
  }

  send_notifications = () => {};

  componentDidMount = async () => {
    let inactive = await AsyncStorage.getItem('inactive');
    this.setState({deactivated: inactive});

    this.onBatteryStateChanged = state => {
      let {preset_battery_level, charging, played, deactivated} = this.state;
      if (deactivated) return;

      if (charging !== state.charging)
        this.setState({charging: state.charging});

      let battery_level = Math.round(state.level * 100);
      if (battery_level >= preset_battery_level) {
        if (!played) this.send_notifications();
      }
    };

    if (!inactive) {
      let preset_level = Number(await AsyncStorage.getItem('preset_level'));
      if (!isNaN(preset_level))
        this.setState({preset_battery_level: preset_level});

      DeviceBattery.addListener(this.onBatteryStateChanged);
    }
  };

  set_battery_level = level => {
    this.setState({preset_battery_level: Number(level) || 80}),
      () =>
        AsyncStorage.setItem(
          'preset_level',
          this.state.preset_battery_level.toString(),
        );
  };

  handleInputChange = text => {
    text = Number(text);
    if (isNaN(text)) return;
    this.set_battery_level(text);
  };

  deactivate = async () => {
    this.setState({deactivated: true});
    await AsyncStorage.setItem('inactive', `true`);
  };

  toggle_activation = async () => {
    this.setState({deactivated: !this.state.deactivated}, () => {
      let {deactivated} = this.state;

      if (deactivated) {
        AsyncStorage.setItem('inactive', 'true');
      } else {
        AsyncStorage.removeItem('inactive');
      }
    });
  };

  toggle_hidden = () => this.setState({hidden: !this.state.hidden});

  maxs = [80, 90, 100];

  render() {
    let {preset_battery_level, hidden, deactivated, charging} = this.state;
    let {navigation} = this.props;

    return (
      <Bg_view style={{padding: wp(5), flex: 1, paddingBottom: 0}}>
        <Header title="home" navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Bg_view>
            <Fr_text
              style={{
                fontWeight: 'bold',
                fontSize: wp(5),
                marginTop: hp(2.5),
                textAlign: 'center',
              }}>
              Select Maximum {charging ? `(Charging)` : null}
            </Fr_text>

            <Bg_view
              style={{justifyContent: 'space-between', marginTop: hp(2.5)}}
              horizontal>
              {this.maxs.map((m, i) => (
                <TouchableNativeFeedback
                  key={i}
                  onPress={() => {
                    this.handleInputChange(m, this.set_battery_level);
                  }}>
                  <View>
                    <Bg_view
                      shadowed={10}
                      key={m}
                      style={{
                        borderRadius: wp(2.8),
                        borderColor: '#000',
                        marginBottom: 10,
                        backgroundColor:
                          Number(m) === preset_battery_level
                            ? '#db8330'
                            : '#fff',
                        padding: wp(4),
                      }}>
                      <Fr_text>{m}%</Fr_text>
                    </Bg_view>
                  </View>
                </TouchableNativeFeedback>
              ))}
            </Bg_view>
          </Bg_view>

          {hidden ? (
            <Text_btn
              text={'Enter custom'}
              bold
              accent
              action={this.toggle_hidden}
            />
          ) : (
            <Bg_view
              style={{
                margin: wp(4),
                padding: wp(2.8),
                paddingBottom: 0,
                borderRadius: wp(2.8),
              }}
              shadowed={10}>
              <Text_input
                no_bottom
                label="Enter prefered limit"
                on_change_text={preset_battery_level =>
                  this.handleInputChange(preset_battery_level, () =>
                    this.deactivate(),
                  )
                }
                placeholder="Type here..."
                value={preset_battery_level.toString()}
              />
              <Text_btn text={'Hide'} bold accent action={this.toggle_hidden} />
            </Bg_view>
          )}

          <Bg_view style={{alignItems: 'center'}}>
            <TouchableNativeFeedback onPress={() => this.toggle_activation()}>
              <View>
                <Bg_view
                  shadowed={20}
                  style={{
                    height: hp(30),
                    width: hp(30),
                    marginTop: hp(8),
                    backgroundColor: deactivated ? '#db8330' : '#2ab659',
                    borderRadius: hp(15),
                    marginBottom: hp(7.5),
                    justifyContent: 'center',
                    padding: wp(8),
                    textAlign: 'center',
                    alignItems: 'center',
                  }}>
                  <Fr_text
                    capitalise
                    style={{
                      fontWeight: '900',
                      textAlign: 'center',
                      fontSize: wp(8),
                    }}>
                    {deactivated ? 'Activate Mode' : 'Deactivate Mode'}
                  </Fr_text>
                </Bg_view>
              </View>
            </TouchableNativeFeedback>
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Home;
