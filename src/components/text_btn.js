import React from 'react';
import {TouchableNativeFeedback, View} from 'react-native';
import {wp} from '../utils/dimensions';
import Fr_text from './fr_text';
import Icon from './icon';

const Text_btn = ({
  action,
  text,
  size,
  disabled,
  bold,
  capitalise,
  centralise,
  style,
  accent,
  italic,
  long_action,
  icon,
}) => (
  <TouchableNativeFeedback
    onLongPress={long_action}
    disabled={disabled}
    onPress={action}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp(1.4),
        ...style,
      }}>
      {icon ? <Icon style={{marginRight: wp(1.4)}} icon={icon} /> : null}
      <Fr_text
        centralise={centralise}
        accent={accent}
        size={size}
        capitalise={capitalise}
        italic={italic}
        bold={bold}>
        {text}
      </Fr_text>
    </View>
  </TouchableNativeFeedback>
);

export default Text_btn;
