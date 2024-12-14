import React from 'react';
import Bg_view from '../components/bg_view';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';
import Fr_text from '../components/fr_text';
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Text_btn from '../components/text_btn';
import Feather from 'react-native-vector-icons/Feather';
import {post_request} from '../utils/services';
import {email_regex} from '../utils/functions';
import {emitter} from '../../Battron';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {not_reveal: true};
  }

  toggle_password = () => this.setState({not_reveal: !this.state.not_reveal});

  login = async () => {
    let {navigation} = this.props;
    let {email, password, loading} = this.state;
    if (loading) return;

    if (!email_regex.test(email))
      return this.setState({message: 'Invalid email'});
    if (!password) return this.setState({message: 'Password cannot be blank'});

    this.setState({loading: true});

    let res = await post_request(`login`, {email, password});
    if (!res?._id)
      return this.setState({
        message: res || 'Err, something went wrong.',
        loading: false,
      });

    if (!res?.verified) {
      await post_request(`request_otp`, {email, user: res._id});
      navigation.navigate('verify_otp', {email, _id: res._id});
      this.setState({loading: false});
    } else {
      emitter.emit('login', res);
    }
  };

  render() {
    let {navigation} = this.props;
    let {email, password, message, not_reveal, loading} = this.state;

    return (
      <Bg_view flex>
        <ScrollView>
          <Bg_view flex>
            <View
              style={{
                borderRadius: wp(7),
                backgroundColor: '#F1F5F9',
                height: wp(12),
                width: wp(12),
                alignItems: 'center',
                justifyContent: 'center',
                margin: wp(4),
              }}>
              <Icon
                component={
                  <Feather color="#000" name="arrow-left" size={wp(7.5)} />
                }
                action={navigation.goBack}
              />
            </View>

            <Bg_view style={{padding: wp(4)}}>
              <Fr_text
                centralise
                style={{
                  fontWeight: 'bold',
                  fontSize: wp(6.5),
                  marginBottom: hp(4),
                }}>
                Login
              </Fr_text>

              <Bg_view>
                <Fr_text style={{marginBottom: hp(1.5), fontSize: wp(3.8)}}>
                  Email
                </Fr_text>
                <TextInput
                  placeholder="Enter your email..."
                  placeholderTextColor="#ccc"
                  value={email}
                  onChangeText={email => this.setState({email})}
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
                <Bg_view
                  horizontal
                  style={{
                    borderRadius: wp(2.8),
                    borderColor: '#52AE27',
                    paddingLeft: wp(1.4),
                    borderWidth: 1,
                  }}>
                  <Bg_view flex>
                    <TextInput
                      placeholder="Enter your password..."
                      placeholderTextColor="#ccc"
                      secureTextEntry={not_reveal}
                      value={password}
                      onChangeText={password => this.setState({password})}
                      style={{
                        paddingHorizontal: wp(2.8),
                        color: '#333',
                        justifyContent: 'center',
                      }}
                    />
                  </Bg_view>
                  <Icon
                    component={
                      <Feather
                        color="#52AE27"
                        name={not_reveal ? 'eye-off' : 'eye'}
                        size={wp(5)}
                      />
                    }
                    action={this.toggle_password}
                  />
                </Bg_view>
                <Bg_view>
                  <Text_btn
                    icon_component={
                      <Feather name="info" size={wp(4.5)} color="red" />
                    }
                    text={message}
                    italic
                    size={wp(3.5)}
                    color="red"
                  />
                </Bg_view>
              </Bg_view>

              <Bg_view style={{alignItems: 'flex-end'}}>
                <Text_btn
                  text="Forgot password?"
                  color="#3C9AFB"
                  action={() =>
                    navigation.navigate('reset_password', {reset: true})
                  }
                  style={{marginVertical: hp(1.4), marginBottom: hp(2.8)}}
                />
              </Bg_view>

              <TouchableNativeFeedback onPress={this.login}>
                <View>
                  <Bg_view
                    style={{
                      borderRadius: wp(4),
                      backgroundColor: '#52AE27',
                      height: hp(6.5),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Fr_text
                        style={{
                          fontSize: wp(4.5),
                          color: '#fff',
                          fontWeight: 'bold',
                        }}>
                        Login
                      </Fr_text>
                    )}
                  </Bg_view>
                </View>
              </TouchableNativeFeedback>

              <Bg_view
                style={{alignItems: 'center', marginVertical: hp(1.4)}}
                flex>
                <Fr_text opacity={0.8} style={{marginVertical: hp(1.4)}}>
                  Or login with
                </Fr_text>

                <TouchableNativeFeedback
                  onPress={() => console.log('login with google')}>
                  <View
                    style={{
                      borderRadius: wp(2.8),
                      borderColor: '#ccc',
                      borderWidth: 1,
                      padding: wp(4),
                    }}>
                    <Icon icon={require('../assets/icons/Google.png')} />
                  </View>
                </TouchableNativeFeedback>
              </Bg_view>
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
