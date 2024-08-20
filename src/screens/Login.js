import React from 'react';
import Bg_view from '../components/bg_view';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';
import Fr_text from '../components/fr_text';
import {
  ScrollView,
  TextInput,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Text_btn from '../components/text_btn';
import Feather from 'react-native-vector-icons/Feather';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  login = async () => {
    let {email, password} = this.state;
  };

  render() {
    let {navigation} = this.props;
    let {email, password} = this.state;

    return (
      <Bg_view flex>
        <ScrollView>
          <Bg_view flex>
            <Icon
              component={<Feather name="arrow-left" size={wp(7.5)} />}
              style={{padding: wp(4)}}
              action={navigation.goBack}
            />
            <Bg_view style={{alignItems: 'center'}}>
              <Icon
                icon={require('../assets/icons/logo_battron.png')}
                style={{height: hp(20), width: wp(50)}}
              />
            </Bg_view>
            <Bg_view style={{padding: wp(4)}}>
              <Fr_text
                style={{
                  fontWeight: 'bold',
                  fontSize: wp(5.6),
                  marginBottom: hp(4),
                }}>
                Log in to Battron
              </Fr_text>

              <Bg_view>
                <Fr_text style={{marginBottom: hp(1.5), fontSize: wp(3.8)}}>
                  Email Address
                </Fr_text>
                <TextInput
                  placeholder="Enter your email..."
                  placeholderTextColor="#ccc"
                  style={{
                    borderRadius: wp(2.8),
                    borderColor: '#52AE27',
                    borderWidth: 1,
                    color: '#333',
                    paddingHorizontal: wp(2.8),
                    justifyContent: 'center',
                  }}
                />
              </Bg_view>
              <Bg_view style={{marginTop: hp(4)}}>
                <Fr_text style={{marginBottom: hp(1.5), fontSize: wp(3.8)}}>
                  Password
                </Fr_text>
                <TextInput
                  placeholder="Enter your password..."
                  placeholderTextColor="#ccc"
                  style={{
                    borderRadius: wp(2.8),
                    borderColor: '#52AE27',
                    borderWidth: 1,
                    paddingHorizontal: wp(2.8),
                    color: '#333',
                    justifyContent: 'center',
                  }}
                />
              </Bg_view>

              <Text_btn
                text="Forgot password?"
                accent
                action={() => navigation.navigate('forgot_password')}
                style={{marginVertical: hp(2.8)}}
              />

              <TouchableNativeFeedback onPress={this.login}>
                <View>
                  <Bg_view
                    style={{
                      borderRadius: wp(2.8),
                      backgroundColor: '#52AE27',
                      height: hp(7.5),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Fr_text
                      style={{
                        fontSize: wp(4.5),
                        color: '#fff',
                        fontWeight: 'bold',
                      }}>
                      Login
                    </Fr_text>
                  </Bg_view>
                </View>
              </TouchableNativeFeedback>
            </Bg_view>

            <Bg_view
              horizontal
              flex
              style={{
                marginTop: hp(5),
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <Fr_text>Don't have an account?</Fr_text>
              <Text_btn
                accent
                text="Register Now"
                action={() => navigation.navigate('signup')}
              />
            </Bg_view>
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Login;
