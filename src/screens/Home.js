import React from 'react';
import {
  View,
  TouchableNativeFeedback,
  NativeModules,
  ScrollView,
} from 'react-native';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import {hp, wp} from '../utils/dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Text_btn from '../components/text_btn';
import DeviceBattery from 'react-native-device-battery';
import {notificationService} from '../utils/notification_service';
import Icon from '../components/icon';
import {App_data} from '../../Contexts';
import Feather from 'react-native-vector-icons/Feather';
import BackgroundActions from 'react-native-background-actions';
import Cool_modal from '../components/cool_modal';
import {emitter} from '../../Battron';
import Sound from 'react-native-sound';
import Base_crumbs from '../components/base_crumbs';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preset_battery_level: 90,
      hidden: true,
    };
  }

  new_sound = toneFile => {
    this.sound = new Sound(toneFile, error => {
      if (error) {
        console.error('Failed to load sound', error);
        return;
      }

      // Play the sound
      this.sound.play(success => {
        if (success) {
          console.log('Sound finished playing');
        } else {
          console.error('Sound playback failed');
        }
        // Release the sound when finished
        this.sound.release();
      });
    });
  };

  play_tone = toneFile => {
    if (this.sound) {
      this.sound.stop(() => {
        this.sound.release();
        this.sound = null;
        this.new_sound(toneFile);
      });
    } else this.new_sound(toneFile);
  };

  sound_names = {
    eco_chime: require('../assets/sounds/echo_chime.mp3'),
    dog_barking: require('../assets/sounds/dog_barking.mp3'),
    energy_save_alert: require('../assets/sounds/energy_save.wav'),
    power_protect_tone: require('../assets/sounds/power_protect_tone.wav'),
    battery_guardian: require('../assets/sounds/battery_guardian.wav'),
  };

  send_notifications = (message, id) => {
    notificationService.localNotification(
      message ||
        `Battery level has reached the preset limit of ${this.state.preset_battery_level}%`,
      id,
      this.sound_names[this.state.selected_tone || 'energy_save_alert'],
    );
  };

  start = async () => {
    let {BatteryModule} = NativeModules;
    let battery_level = Math.round(await BatteryModule.getBatteryPercentage());
    this.setState({battery_level});

    let inactive =
      !this.user.subscription &&
      this.user.start + this.trial_period < Date.now()
        ? false
        : await AsyncStorage.getItem('inactive');

    let selected_tone = await AsyncStorage.getItem('selected_tone');
    this.setState({deactivated: inactive, selected_tone});

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

      if (battery_level >= (preset_battery_level || 90)) {
        if (!played) this.send_notifications();
        this.setState({fully_charged: true});
      } else
        this.setState({fully_charged: false}, notificationService.stopAlarm);
    };

    let preset_level = Number(await AsyncStorage.getItem('preset_level'));

    if (!isNaN(preset_level))
      this.setState({preset_battery_level: preset_level});

    if (!inactive) {
      this.sub = DeviceBattery.addListener(this.onBatteryStateChanged);
      emitter.emit('start_listening');
    } else {
      this.sub?.remove();
    }
  };

  componentDidMount = async () => {
    let has_free = await AsyncStorage.getItem('virgin');
    !has_free && (await AsyncStorage.setItem('virgin', Date.now().toString()));
    await this.start();
  };

  set_battery_level = level => {
    this.setState({preset_battery_level: Number(level) || 90}, async () => {
      let {preset_battery_level} = this.state;

      await AsyncStorage.setItem(
        'preset_level',
        preset_battery_level.toString(),
      );
    });
  };

  alarm_tones = () => {
    return [
      'energy_save_alert',
      'eco_chime',
      'battery_guardian',
      'dog_barking',
      'power_protect_tone',
    ];
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

  trial_period = 3 * 24 * 3600 * 1000;

  toggle_activation = async () => {
    let {deactivated} = this.state;
    if (
      !deactivated &&
      !this.user?.subscription &&
      !['immanuelsavvy@gmail.com', 'ewaoluwatoyosi@yahoo.com'].includes(
        this.user?.email,
      )
    ) {
      if (this.user.start + this.trial_period < Date.now()) {
        return this.props.navigation.navigate('subscribe');
      }
    }
    // this.anim.toggle();
    this.setState({deactivated: !deactivated, loading: true}, () => {
      let {deactivated} = this.state;

      if (deactivated) {
        AsyncStorage.setItem('inactive', 'true');
        notificationService.stopAlarm();
        BackgroundActions.stop();
      } else {
        AsyncStorage.removeItem('inactive');
        this.start();
      }
    });
    setTimeout(() => {
      this.setState({loading: false});
      // this.anim.toggle();
    }, 2000);
  };

  set_chime = tone => {
    this.setState({selected_tone: tone}, () =>
      AsyncStorage.setItem('selected_tone', tone),
    );
  };

  toggle_hidden = () => this.setState({hidden: !this.state.hidden});

  maxs = [80, 90, 100];

  render() {
    let {navigation} = this.props;
    let {
      preset_battery_level,
      deactivated,
      battery_level,
      charging,
      selected_tone,
      loading,
    } = this.state;

    return (
      <App_data.Consumer>
        {({user}) => {
          this.user = user;

          return (
            <LinearGradient
              colors={['black', '#272e0e']}
              style={{
                flex: 1,
                paddingBottom: 0,
                backgroundColor: '#000',
              }}>
              <Bg_view
                no_bg
                style={{
                  justifyContent: 'space-between',
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 0,
                  paddingBottom: hp(2),
                  paddingVertical: hp(2.8),
                }}
                horizontal>
                <TouchableNativeFeedback onPress={null}>
                  <Bg_view />
                </TouchableNativeFeedback>

                <Fr_text bold="900" size={wp(5)} color={'#fff'} capitalise>
                  Battery Status
                </Fr_text>
                <TouchableNativeFeedback onPress={null}>
                  <Bg_view />
                </TouchableNativeFeedback>
              </Bg_view>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Bg_view no_bg style={{padding: wp(5)}} horizontal>
                  <Bg_view no_bg flex style={{alignItems: 'center'}}>
                    <Icon
                      style={{height: wp(30), width: wp(30)}}
                      icon={require('../assets/images/Battery.png')}
                    />
                  </Bg_view>
                  <Bg_view
                    flex
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: wp(2.8),
                      marginLeft: wp(4),
                      padding: wp(4),
                      alignItems: 'center',
                    }}>
                    <Fr_text color="#fff" size={wp(10)}>
                      {`${battery_level || 100}%`}
                    </Fr_text>
                    <Fr_text color="#577b15">
                      {charging ? 'Charging' : 'Not charging'}
                    </Fr_text>
                  </Bg_view>
                </Bg_view>

                <Bg_view
                  flex
                  no_bg
                  style={{
                    padding: wp(4),
                    borderRadius: wp(4),
                  }}>
                  <Bg_view horizontal no_bg>
                    <Bg_view
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: wp(1.4),
                        padding: wp(1.4),
                        alignItems: 'center',
                      }}>
                      <Feather name="battery" color="#ccc" size={wp(3.5)} />
                    </Bg_view>
                    <Text_btn
                      text={'SET BATTERY CHARGE %'}
                      bold
                      color="#fff"
                      size={wp(4.5)}
                    />
                  </Bg_view>

                  <Bg_view
                    no_bg
                    style={{justifyContent: 'space-evenly', marginTop: hp(2.5)}}
                    horizontal>
                    {this.maxs.map((m, i) => {
                      let colr =
                        Number(m) === 90
                          ? '#D12E34'
                          : Number(m) === 90
                          ? '#52AE27'
                          : '#DFB400';
                      return (
                        <TouchableNativeFeedback
                          key={i}
                          onPress={() => {
                            this.handleInputChange(m);
                          }}>
                          <View style={{flex: 1}}>
                            <Bg_view
                              flex
                              shadowed={10}
                              key={m}
                              style={{
                                borderRadius: wp(2.8),
                                borderColor: colr,
                                borderWidth:
                                  Number(m) === preset_battery_level ? 2.5 : 0,
                                marginBottom: 10,
                                minHeight: hp(7),
                                justifyContent: 'center',
                                marginHorizontal: wp(1.4),
                                alignItems: 'center',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                              }}>
                              <Bg_view
                                style={{
                                  height: 3.5,
                                  position: 'absolute',
                                  top: 0,
                                  width: '70%',
                                  borderBottomLeftRadius: 3.5,
                                  borderBottomRightRadius: 3.5,
                                  backgroundColor: colr,
                                }}>
                                <Fr_text
                                  style={{margin: 0, padding: 0}}></Fr_text>
                              </Bg_view>
                              <Fr_text
                                bold
                                color="#fff"
                                accent={Number(m) === preset_battery_level}>
                                {m}%
                              </Fr_text>
                              {m == 90 ? (
                                <Fr_text size={wp(3)} italic color={colr}>
                                  Recommended
                                </Fr_text>
                              ) : null}
                            </Bg_view>
                          </View>
                        </TouchableNativeFeedback>
                      );
                    })}
                  </Bg_view>

                  <Bg_view
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: hp(1),
                    }}
                    no_bg>
                    {loading ? (
                      <Icon
                        icon={
                          !deactivated
                            ? require('../assets/icons/act.gif')
                            : require('../assets/icons/deact.gif')
                        }
                        style={{
                          width: wp(50),
                          height: wp(50),
                          borderRadius: wp(4),
                          paddingVertical: 0,
                          marginVertical: 0,
                        }}
                      />
                    ) : (
                      <Icon
                        icon={
                          deactivated
                            ? require('../assets/images/act.png')
                            : require('../assets/images/deact.png')
                        }
                        action={this.toggle_activation}
                        style={{width: wp(50), height: wp(50)}}
                      />
                    )}
                  </Bg_view>

                  <Bg_view horizontal no_bg style={{marginVertical: hp(2.8)}}>
                    <Bg_view
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: wp(1.4),
                        padding: wp(1.4),
                        alignItems: 'center',
                      }}>
                      <Feather name="clock" color="#ccc" size={wp(3.5)} />
                    </Bg_view>
                    <Text_btn
                      text={'CHOOSE ALARM RINGTONE'}
                      bold
                      color="#fff"
                      size={wp(4.5)}
                    />
                  </Bg_view>

                  <Bg_view no_bg>
                    {this.alarm_tones().map((tone, i) => {
                      return (
                        <TouchableNativeFeedback
                          onPress={() => {
                            this.set_chime(tone);
                            this.play_tone(
                              this.sound_names[tone] ||
                                require('../assets/sounds/energy_save.wav'),
                            );
                          }}>
                          <View>
                            <Bg_view
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderRadius: wp(1.4),
                                padding: wp(4),
                                paddingVertical: hp(1.8),
                                marginBottom: hp(1.4),
                                justifyContent: 'space-between',
                              }}
                              horizontal>
                              <Fr_text color="#fff" capitalise>
                                {tone.replace(/_/g, ' ')}
                              </Fr_text>
                              {selected_tone === tone ||
                              (!selected_tone && !i) ? (
                                <Bg_view
                                  style={{
                                    height: 15,
                                    width: 15,
                                    borderWidth: 1,
                                    borderRadius: 2.5,
                                    borderColor: '#fff',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Feather
                                    name="check"
                                    size={wp(3.5)}
                                    color="#000"
                                  />
                                </Bg_view>
                              ) : (
                                <Bg_view
                                  no_bg
                                  style={{
                                    height: 10,
                                    width: 10,
                                    borderWidth: 1,
                                    borderRadius: 2.5,
                                    borderColor: '#fff',
                                  }}></Bg_view>
                              )}
                            </Bg_view>
                          </View>
                        </TouchableNativeFeedback>
                      );
                    })}
                  </Bg_view>
                </Bg_view>

                <Base_crumbs navigation={navigation} />
              </ScrollView>

              <Cool_modal
                ref={anim => (this.anim = anim)}
                toggle={this.close_anim}
                center
                clear>
                <Bg_view no_bg>
                  <Bg_view
                    no_bg
                    style={{
                      // backgroundColor: '#000',
                      elevation: 5,
                      shadowColor: '#000',
                      padding: wp(4),
                      borderRadius: wp(2.8),
                      marginBottom: hp(1.4),
                      alignItems: 'center',
                      marginHorizontal: wp(2.8),
                    }}>
                    <Icon
                      icon={
                        !deactivated
                          ? require('../assets/icons/act.gif')
                          : require('../assets/icons/deact.gif')
                      }
                      style={{
                        width: wp(90),
                        height: wp(90),
                        borderRadius: wp(4),
                      }}
                    />
                  </Bg_view>
                </Bg_view>
              </Cool_modal>
            </LinearGradient>
          );
        }}
      </App_data.Consumer>
    );
  }
}

export default Home;
