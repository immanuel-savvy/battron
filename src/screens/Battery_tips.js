import React from 'react';
import {ScrollView, ImageBackground} from 'react-native';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import {hp, wp} from '../utils/dimensions';
import Base_crumbs from '../components/base_crumbs';

class Battery_tips extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render = () => {
    let {navigation} = this.props;
    return (
      <Bg_view
        flex
        style={{
          paddingBottom: 0,
          backgroundColor: '#52AE27',
        }}>
        <ImageBackground source={require('../assets/images/sub_bg.png')}>
          {/* <Header title="subscribe" navigation={navigation} /> */}

          <Bg_view
            no_bg
            horizontal
            style={{
              justifyContent: 'space-between',
              padding: wp(5.6),
              paddingVertical: hp(1.4),
            }}>
            <Bg_view no_bg flex>
              <Fr_text color="#fff" size={wp(6.7)} bold>
                Battery Tips
              </Fr_text>
              <Fr_text color="#fff" style={{marginTop: hp(1.4)}}>
                Best Hacks to Extend Your Phone Battery Life
              </Fr_text>
            </Bg_view>

            <Bg_view no_bg style={{alignItems: 'flex-end'}}>
              <Fr_text></Fr_text>
            </Bg_view>
          </Bg_view>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Bg_view
              no_bg
              style={{
                padding: wp(5.6),
                paddingTop: 0,
                marginBottom: hp(10),
              }}
              flex>
              {this.tips.map((tip, i) => {
                tip = tip.split(':');

                return (
                  <Bg_view no_bg style={{marginBottom: hp(4)}}>
                    <Bg_view
                      horizontal
                      no_bg
                      style={{alignItems: 'flex-start'}}>
                      <Bg_view no_bg>
                        <Fr_text color="#fff">{i + 1}. </Fr_text>
                      </Bg_view>
                      <Fr_text
                        style={{marginLeft: wp(i + 1 > 9 ? 1.5 : 2.8)}}
                        color="#7DFF11"
                        bold>
                        {tip[0]}
                      </Fr_text>
                    </Bg_view>
                    <Bg_view no_bg horizontal>
                      <Fr_text>{'   '}</Fr_text>
                      <Fr_text color="#fff" style={{marginLeft: wp(4)}}>
                        {tip[1]}
                      </Fr_text>
                    </Bg_view>
                  </Bg_view>
                );
              })}

              <Bg_view style={{marginBottom: hp(4)}} no_bg>
                <Fr_text color="#fff" centralise>
                  Following these tips will help extend your phone’s battery
                  life and improve its overall longevity!
                </Fr_text>
              </Bg_view>

              <Base_crumbs navigation={navigation} />
            </Bg_view>
          </ScrollView>
        </ImageBackground>
      </Bg_view>
    );
  };

  tips = [
    'Lower Screen Brightness: Keep your screen brightness low or use adaptive brightness.',
    'Use Dark Mode: On OLED screens, dark mode can significantly save power.',
    'Turn Off Location Services: Disable GPS for apps that don’t need it.',
    'Limit Background Apps: Restrict apps from running in the background unnecessarily.',
    'Disable Push Notifications: Turn off notifications for non-essential apps.',
    'Turn Off Bluetooth and Wi-Fi: When not in use, disable these features to save energy.',
    'Turn On Airplane Mode: Use airplane mode in areas with poor signal.',
    'Avoid Live Wallpapers: Stick to static wallpapers instead.',
    'Use Power-Saving Mode: Activate your phone’s built-in battery saver mode.',
    'Close Unused Apps: Fully close apps you’re no longer using.',
    'Limit Vibration Feedback: Turn off haptic feedback and vibration notifications.',
    'Shorten Screen Timeout: Set your screen to turn off after a shorter period of inactivity.',
    'Uninstall Battery-Draining Apps: Remove apps that consume excessive power.',
    'Turn Off Auto-Sync: Disable auto-sync for email and other accounts.',
    'Update Apps and Software: Keep your phone updated for optimal power efficiency.',
    'Use Wi-Fi Instead of Mobile Data: Wi-Fi consumes less power than cellular networks.',
    'Avoid Overcharging: Unplug your phone when it reaches 100%.',
    'Charge with Original Accessories: Use certified chargers to avoid battery damage.',
    'Keep Your Phone Cool: Avoid exposing your phone to excessive heat.',
    'Use Battery Monitoring Tools: Check your phone settings to see which apps drain the most battery and manage them accordingly.',
  ];
}

export default Battery_tips;
