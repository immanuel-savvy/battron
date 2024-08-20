import React from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import {wp} from '../utils/dimensions';
import {domain} from '../utils/services';
import Bg_view from './bg_view';

const Icon = ({icon, component, action, text, style}) => {
  if (!icon && !component) return null;

  if (typeof icon === 'string') icon = {uri: `${domain}/icons/${icon}`};

  if (!style) style = new Object();

  return (
    <TouchableOpacity onPress={action} disabled={!action}>
      <View
        style={{
          padding: action ? wp(2.8) : 0,
          ...style,
          height: undefined,
          width: undefined,
        }}>
        <Bg_view
          no_bg
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: undefined,
            width: undefined,
          }}>
          {component || (
            <Image
              source={
                icon?.uri
                  ? {
                      uri: icon?.uri,
                      height: style.height || wp(5.5),
                      width: style.width || wp(5.5),
                    }
                  : icon
              }
              style={{
                height: wp(5.5),
                width: wp(5.5),
                ...style,
                paddingHorizontal: 0,
                marginHorizontal: 0,
                padding: 0,
                margin: 0,
                paddingVertical: 0,
                marginVertical: 0,
                marginTop: 0,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginRight: 0,
              }}
              resizeMode="contain"
              resizeMethod="auto"
            />
          )}
          {text}
        </Bg_view>
      </View>
    </TouchableOpacity>
  );
};

export default Icon;
