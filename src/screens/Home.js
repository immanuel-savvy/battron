import React from 'react';
import {NativeModules, View, TouchableNativeFeedback} from 'react-native';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import Feather from 'react-native-vector-icons/Feather';
import {hp, wp} from '../utils/dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {BatteryModule} = NativeModules;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      presetBatteryLevel: 80,
    };
  }

  componentDidMount = async () => {
    let inactive = await AsyncStorage.getItem('inactive');
    this.setState({deactivated: inactive});

    if (!inactive) this.setBatteryLevel();
  };

  setBatteryLevel = () => {
    let {presetBatteryLevel} = this.state;
    BatteryModule.setPresetBatteryLevel(presetBatteryLevel);
    BatteryModule.startBatteryService(presetBatteryLevel);
  };

  handleInputChange = (text, cb) => {
    this.setState({presetBatteryLevel: Number(text)}, cb);
  };

  toggle_options = () => this.options?.toggle();

  toggle_activation = async () => {
    let {deactivated, presetBatteryLevel} = this.state;
    if (deactivated) {
      BatteryModule.startBatteryService(presetBatteryLevel);
      await AsyncStorage.removeItem('inactive');
    } else {
      BatteryModule.deactivateBatteryService();
      await AsyncStorage.setItem('inactive', 'true');
    }
    deactivated = !deactivated;
    this.setState({deactivated});
  };

  maxs = [80, 90, 100];

  render() {
    let {presetBatteryLevel, deactivated} = this.state;

    return (
      <Bg_view style={{padding: wp(5), flex: 1}}>
        <Bg_view style={{justifyContent: 'space-between'}} horizontal>
          <Fr_text bold="900" size={wp(5)}>
            Welcome
          </Fr_text>
          <TouchableNativeFeedback onPress={this.toggle_options}>
            <Feather name="menu" size={wp(7.5)} />
          </TouchableNativeFeedback>
        </Bg_view>

        <Bg_view>
          <Fr_text
            style={{
              fontWeight: 'bold',
              fontSize: wp(5),
              marginTop: hp(2.5),
              textAlign: 'center',
            }}>
            Select Maximum
          </Fr_text>

          <Bg_view
            style={{justifyContent: 'space-between', marginTop: hp(2.5)}}
            horizontal>
            {this.maxs.map(m => (
              <TouchableNativeFeedback
                onPress={() => {
                  this.handleInputChange(m, this.setBatteryLevel);
                }}>
                <View>
                  <Bg_view
                    key={m}
                    style={{
                      borderRadius: wp(2.8),
                      borderWidth: 1,
                      borderColor: '#000',
                      padding: wp(4),
                    }}>
                    <Fr_text>{m}%</Fr_text>
                  </Bg_view>
                </View>
              </TouchableNativeFeedback>
            ))}
          </Bg_view>
        </Bg_view>
        <Bg_view style={{alignItems: 'center'}}>
          <TouchableNativeFeedback onPress={() => this.toggle_activation()}>
            <View>
              <Bg_view
                style={{
                  height: hp(40),
                  width: hp(40),
                  marginTop: hp(8),
                  backgroundColor: deactivated ? '#db8330' : '#2ab659',
                  borderRadius: hp(20),
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
      </Bg_view>
    );
  }
}

export default Home;
