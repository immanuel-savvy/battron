import React from 'react';
import Bg_view from './bg_view';
import Fr_text from './fr_text';
import {wp} from '../utils/dimensions';
import {TouchableNativeFeedback, View} from 'react-native';

class Options extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handle_option = option => {
    let {screen, toggle, navigation} = this.props;

    if (screen === option) return toggle && toggle();

    navigation.navigate(option.replace(/ /g, '_'));
  };

  options = ['home', 'about us', 'subscribe'];

  render() {
    return (
      <Bg_view style={{padding: wp(4)}}>
        {this.options.map((op, i) => {
          return (
            <TouchableNativeFeedback
              key={i}
              onPress={() => this.handle_option(op)}>
              <View>
                <Bg_view
                  key={i}
                  style={{
                    padding: wp(4),
                    borderBottomColor: '#ccc',
                    borderBottomWidth: 1,
                  }}>
                  <Fr_text size={wp(5)} capitalise>
                    {op}
                  </Fr_text>
                </Bg_view>
              </View>
            </TouchableNativeFeedback>
          );
        })}
      </Bg_view>
    );
  }
}

export default Options;
