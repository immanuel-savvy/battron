import React from 'react';
import {TextInput} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './bg_view';
import Fr_text from './fr_text';

class Text_input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {
      label,
      placeholder,
      disabled,
      type,
      on_change_text,
      right_icon,
      no_bottom,
      secure,
      value,
      left_icon,
    } = this.props;

    return (
      <Bg_view style={{marginBottom: no_bottom ? 0 : hp(4)}}>
        {label && (
          <Fr_text
            size={wp(4.5)}
            style={{textDecorationLine: 'underline'}}
            capitalise>
            {label}
          </Fr_text>
        )}
        <Bg_view
          style={{
            borderBottomWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: '#ccc',
          }}>
          {left_icon}
          <TextInput
            placeholder={placeholder}
            keyboardType={type || 'default'}
            onChangeText={on_change_text}
            secureTextEntry={secure}
            placeholderTextColor="#ccc"
            placeholderStyle={{fontStyle: 'italic'}}
            editable={!!!disabled}
            value={value}
            style={{
              flex: 1,
              fontSize: wp(4.5),
              color: '#28100B',
              marginRight: wp(1.4),
              width: '100%',
              fontWeight: 'bold',
            }}
          />
          {right_icon}
        </Bg_view>
      </Bg_view>
    );
  }
}

export default Text_input;
