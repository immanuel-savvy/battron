import React from 'react';
import {TextInput, Button, NativeModules} from 'react-native';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';

const {BatteryModule} = NativeModules;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      presetBatteryLevel: 20,
    };
  }

  componentDidMount() {
    this.setBatteryLevel();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.presetBatteryLevel !== this.state.presetBatteryLevel) {
      this.setBatteryLevel();
    }
  }

  setBatteryLevel = () => {
    let {presetBatteryLevel} = this.state;
    BatteryModule.setPresetBatteryLevel(presetBatteryLevel);
    BatteryModule.startBatteryService(presetBatteryLevel);
  };

  handleInputChange = text => {
    this.setState({presetBatteryLevel: Number(text)});
  };

  render() {
    let {presetBatteryLevel} = this.state;
    return (
      <Bg_view style={{padding: 20}}>
        <Fr_text>Set Battery Level for Alarm:</Fr_text>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 20,
          }}
          keyboardType="numeric"
          value={String(presetBatteryLevel)}
          onChangeText={this.handleInputChange}
        />
        <Button title="Set Alarm Level" onPress={this.setBatteryLevel} />
      </Bg_view>
    );
  }
}

export default Home;
