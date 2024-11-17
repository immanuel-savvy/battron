import React from 'react';
import {View} from 'react-native';

class Bg_view extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    let {
      children,
      no_centralise,
      style,
      flex,
      accent,
      background_color,
      no_bg,
      horizontal,
      shadowed,
    } = this.props;

    if (!style) style = new Object();
    if (shadowed) {
      style.shadowColor = '#000';
      style.elevation = typeof shadowed === 'number' ? shadowed : 5;
    }
    if (flex) style.flex = typeof flex === 'boolean' ? 1 : flex;
    if (accent) style.backgroundColor = '#52AE27';
    if (horizontal) {
      style.flexDirection = 'row';
      if (!no_centralise) style.alignItems = 'center';
    }
    if (background_color) style.backgroundColor = background_color;
    if (no_bg) style.backgroundColor = 'transparent';

    return <View style={{backgroundColor: '#fff', ...style}}>{children}</View>;
  };
}

export default Bg_view;
