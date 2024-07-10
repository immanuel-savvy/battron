import React from 'react';
import {Dimensions} from 'react-native';

let {width, height} = Dimensions.get('window');

const wp = n => {
  n = n || 100;
  return (n / 100) * width;
};

const hp = n => {
  n = n || 100;
  return (n / 100) * height;
};

export {wp, hp};
