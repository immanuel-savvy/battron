import React from 'react';
import Bg_view from './bg_view';
import Text_btn from './text_btn';

class Base_crumbs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let {navigation} = this.props;

    return (
      <Bg_view no_bg style={{alignItems: 'center'}}>
        <Text_btn
          color="#fff"
          italic
          bold
          text="Report a Bug"
          action={() => navigation.navigate('report_bug')}
        />
        <Text_btn
          color="#fff"
          italic
          bold
          text="Leave a Review"
          action={() => navigation.navigate('leave_review')}
        />
        <Text_btn
          color="#fff"
          italic
          bold
          text="About us"
          action={() => navigation.navigate('about_us')}
        />
        {/* <Text_btn
          color="#fff"
          italic
          bold
          text="Privacy Policy   /   Terms & Conditions"
        /> */}
      </Bg_view>
    );
  }
}

export default Base_crumbs;
