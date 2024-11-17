import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './bg_view';
import Fr_text from './fr_text';

class Small_btn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render = () => {
    let {
      title,
      action,
      min_width_null,
      inverted,
      disabled,
      style,
      loading,
      icon,
      right_icon,
      inner_padding_null,
    } = this.props;

    if (loading) disabled = loading;

    return (
      <View style={{margin: wp(2.8), ...style}}>
        <TouchableNativeFeedback
          onPress={disabled ? null : action}
          disabled={disabled}>
          <View>
            <Bg_view
              horizontal
              accent={!inverted && !disabled}
              background_color={
                disabled ? '#ccc' : (style && style.backgroundColor) || null
              }
              style={{
                height: hp(5.6),
                borderRadius: wp(2.8),
                minWidth: min_width_null ? null : wp(30),
                maxWidth: min_width_null ? null : wp(50),
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: inverted ? 1.5 : null,
                borderColor: inverted
                  ? disabled
                    ? '#DBD8DA'
                    : '#52AE27'
                  : null,
                ...style,
                padding: inner_padding_null ? 0 : undefined,
              }}>
              {right_icon}
              <Fr_text
                bold
                size={wp(4)}
                caps
                color="#fff"
                accent={inverted && !disabled ? '#52AE27' : null}>
                {title}
              </Fr_text>
              {icon}
            </Bg_view>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  };
}

export default Small_btn;
