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
import {notificationService} from '../utils/notification_service';
import Icon from '../components/icon';
import {App_data} from '../../Contexts';
import BackgroundActions from 'react-native-background-actions';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preset_battery_level: 80,
      hidden: true,
    };
  }

  send_notifications = (message, id) => {
    notificationService.localNotification(
      message ||
        `Battery level has reached the preset limit of ${this.state.preset_battery_level}%`,
      id,
    );
  };

  componentDidMount = async () => {
    let inactive = await AsyncStorage.getItem('inactive');
    this.setState({deactivated: inactive});

    this.onBatteryStateChanged = state => {
      let {preset_battery_level, charging, played, is_monitor, deactivated} =
        this.state;

      if (deactivated) return;
      if (!is_monitor) {
        this.send_notifications('Battron is monitoring your battery level', 2);
        this.setState({is_monitor: true});
      }

      if (charging !== state.charging)
        this.setState({charging: state.charging}, () => {
          if (this.state.charging) {
            this.setState({charge_loading: true}, () => {
              setTimeout(() => {
                this.setState({charge_loading: false});
              }, 2500);
            });
          }
        });

      let battery_level = Math.round(state.level * 100);

      if (battery_level !== this.state.battery_level)
        this.setState({battery_level});

      if (battery_level >= (preset_battery_level || 80)) {
        if (!played) this.send_notifications();
        this.setState({fully_charged: true});
      } else
        this.setState({fully_charged: false}, notificationService.stopAlarm);
    };

    let preset_level = Number(await AsyncStorage.getItem('preset_level'));

    if (!isNaN(preset_level))
      this.setState({preset_battery_level: preset_level});

    if (!inactive) {
      DeviceBattery.addListener(this.onBatteryStateChanged);
    }
  };

  set_battery_level = level => {
    this.setState({preset_battery_level: Number(level) || 80}, async () => {
      let {preset_battery_level} = this.state;

      await AsyncStorage.setItem(
        'preset_level',
        preset_battery_level.toString(),
      );
    });
  };

  handleInputChange = text => {
    text = Number(text);
    if (isNaN(text)) return;
    this.set_battery_level(text);
  };

  deactivate = async () => {
    this.setState({deactivated: true});
    await AsyncStorage.setItem('inactive', `true`);
    notificationService.stopAlarm();
    await BackgroundActions.stop();
  };

  toggle_activation = async () => {
    if (
      !this.user?.subscription_running &&
      this.user?.email !== 'immanuelsavvy@gmail.com'
    ) {
      return this.props.navigation.navigate('subscribe');
    }
    this.setState({deactivated: !this.state.deactivated, loading: true}, () => {
      let {deactivated} = this.state;

      if (deactivated) {
        AsyncStorage.setItem('inactive', 'true');
        notificationService.stopAlarm();
        BackgroundActions.stop();
      } else {
        AsyncStorage.removeItem('inactive');
      }
    });
    setTimeout(() => {
      this.setState({loading: false});
    }, 2500);
  };

  toggle_hidden = () => this.setState({hidden: !this.state.hidden});

  maxs = [80, 90, 100];

  render() {
    let {
      preset_battery_level,
      loading,
      hidden,
      fully_charged,
      deactivated,
      charging,
      charge_loading,
    } = this.state;
    let {navigation} = this.props;

    return (
      <App_data.Consumer>
        {({user}) => {
          this.user = user;

          return (
            <Bg_view
              style={{
                flex: 1,
                paddingBottom: 0,
                backgroundColor: '#000',
              }}>
              <Header
                style={{paddingHorizontal: wp(5), paddingTop: wp(5)}}
                title="home"
                navigation={navigation}
              />
              <ScrollView
                showsVerticalScrollIndicator={false}
                /* contentContainerStyle={{flex: 1}} */
              >
                <Bg_view no_bg style={{padding: wp(5)}}>
                  <Bg_view no_bg>
                    <Fr_text
                      color="#fff"
                      style={{
                        fontWeight: 'bold',
                        fontSize: wp(5),
                        marginTop: hp(2.5),
                        textAlign: 'center',
                      }}>
                      Select Maximum {charging ? `(Charging)` : null}
                    </Fr_text>
                  </Bg_view>

                  <Bg_view no_bg style={{alignItems: 'center'}}>
                    <TouchableNativeFeedback
                      onPress={() =>
                        fully_charged ? null : this.toggle_activation()
                      }>
                      <View>
                        <Icon
                          style={{height: hp(40), width: hp(40)}}
                          icon={
                            charge_loading
                              ? require('../assets/icons/charg.gif')
                              : fully_charged
                              ? require('../assets/icons/MET.gif')
                              : deactivated
                              ? loading
                                ? require('../assets/icons/diactivate.gif')
                                : require('../assets/icons/activate.png')
                              : loading
                              ? require('../assets/icons/diactivate.gif')
                              : require('../assets/icons/deactivate.png')
                          }
                        />
                      </View>
                    </TouchableNativeFeedback>
                  </Bg_view>

                  {fully_charged ? (
                    <Bg_view centralise no_bg style={{alignItems: 'center'}}>
                      <Fr_text color="#fff" size={wp(5.6)}>
                        {preset_battery_level}%
                      </Fr_text>
                      <Fr_text color="#fff" size={wp(5.6)}>
                        Fully Charged
                      </Fr_text>
                      <Fr_text color="#fff" size={wp(5.6)}>
                        Maximum Selected
                      </Fr_text>
                    </Bg_view>
                  ) : null}
                </Bg_view>

                <Bg_view
                  flex
                  style={{
                    backgroundColor: '#111',
                    padding: wp(4),
                    borderRadius: wp(4),
                  }}>
                  <Bg_view
                    no_bg
                    style={{
                      alignItems: 'center',
                    }}>
                    <Fr_text color="#36AFC9F0">Click button to</Fr_text>
                    <TouchableNativeFeedback onPress={this.toggle_activation}>
                      <View>
                        <Bg_view
                          style={{
                            backgroundColor: '#333',
                            paddingHorizontal: wp(7.5),
                            marginTop: hp(1.4),
                            borderRadius: wp(45),
                            height: hp(5),
                            justifyContent: 'center',
                          }}>
                          <Fr_text bold color="#fff">
                            {deactivated ? 'Start' : 'Stop'}
                          </Fr_text>
                        </Bg_view>
                      </View>
                    </TouchableNativeFeedback>
                  </Bg_view>

                  {hidden ? (
                    <Text_btn
                      text={'Enter custom'}
                      bold
                      color="#db8330"
                      accent
                      action={this.toggle_hidden}
                    />
                  ) : (
                    <Bg_view
                      // no_bg
                      style={{
                        margin: wp(4),
                        padding: wp(2.8),
                        paddingBottom: 0,
                        borderRadius: wp(2.8),
                        backgroundColor: '#eee',
                      }}>
                      <Text_input
                        no_bottom
                        label="Enter prefered limit"
                        on_change_text={preset_battery_level =>
                          this.handleInputChange(preset_battery_level)
                        }
                        placeholder="Type here..."
                        value={preset_battery_level.toString()}
                      />
                      <Text_btn
                        text={'Hide'}
                        bold
                        accent
                        action={this.toggle_hidden}
                      />
                    </Bg_view>
                  )}

                  <Bg_view
                    no_bg
                    style={{justifyContent: 'space-evenly', marginTop: hp(2.5)}}
                    horizontal>
                    {this.maxs.map((m, i) => (
                      <TouchableNativeFeedback
                        key={i}
                        onPress={() => {
                          this.handleInputChange(m);
                        }}>
                        <View>
                          <Bg_view
                            shadowed={10}
                            key={m}
                            style={{
                              borderRadius: wp(2.8),
                              borderColor: '#52AE27',
                              borderWidth: 1,
                              marginBottom: 10,
                              marginHorizontal: 10,
                              alignItems: 'center',
                              backgroundColor:
                                Number(m) === preset_battery_level
                                  ? '#52AE27'
                                  : '#333',
                              padding: wp(7),
                            }}>
                            <Icon
                              style={{height: wp(7.5), width: wp(7.5)}}
                              icon={require('../assets/icons/ba3.gif')}
                            />
                            <Fr_text color="#fff">{m}%</Fr_text>
                          </Bg_view>
                        </View>
                      </TouchableNativeFeedback>
                    ))}
                  </Bg_view>
                </Bg_view>
              </ScrollView>
            </Bg_view>
          );
        }}
      </App_data.Consumer>
    );
  }
}

export default Home;
