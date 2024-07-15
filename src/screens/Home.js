import React from 'react';
import {NativeModules, View, TouchableNativeFeedback} from 'react-native';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import Feather from 'react-native-vector-icons/Feather';
import {hp, wp} from '../utils/dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text_input from '../components/text_input';
import Text_btn from '../components/text_btn';
import Cool_modal from '../components/cool_modal';
import Options from '../components/options';
import Header from '../components/header';

const {BatteryModule} = NativeModules;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      presetBatteryLevel: 80,
      hidden: true,
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
    text = Number(text);
    if (isNaN(text)) return;
    this.setState({presetBatteryLevel: text}, cb);
  };

  deactivate = async () => {
    this.setState({deactivated: true});
    BatteryModule.deactivateBatteryService();
    await AsyncStorage.setItem('inactive', 'true');
  };

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

  toggle_hidden = () => this.setState({hidden: !this.state.hidden});

  maxs = [80, 90, 100];

  render() {
    let {presetBatteryLevel, hidden, deactivated} = this.state;
    let {navigation} = this.props;

    return (
      <Bg_view style={{padding: wp(5), flex: 1, paddingBottom: 0}}>
        <Header title="home" navigation={navigation} />

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
                    shadowed={10}
                    key={m}
                    style={{
                      borderRadius: wp(2.8),
                      borderColor: '#000',
                      marginBottom: 10,
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
              on_change_text={presetBatteryLevel =>
                this.handleInputChange(presetBatteryLevel, () =>
                  this.deactivate(),
                )
              }
              placeholder="Type here..."
              value={presetBatteryLevel.toString()}
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
