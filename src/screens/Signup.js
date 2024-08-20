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
  View,
} from 'react-native';
import Text_btn from '../components/text_btn';
import Feather from 'react-native-vector-icons/Feather';
import {email_regex} from '../utils/functions';
import {post_request} from '../utils/services';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      not_reveal: true,
    };
  }

  signup = async () => {
    let {navigation} = this.props;
    let {email, password, confirm_password, loading} = this.state;
    if (loading) return;

    if (!email_regex.test(email))
      return this.setState({message: 'Invalid email'});
    if (password !== confirm_password)
      return this.setState({message: 'Passwords does not match'});

    this.setState({loading: true});
    let details = {email, password};
    let res = await post_request('signup', details);

    if (!res?.email) {
      return this.setState({
        message: res || 'Err, something went wrong!',
        loading: false,
      });
    }

    this.setState({loading: false}, () =>
      navigation.navigate('verify_otp', {email: res.email, user: res._id}),
    );
  };

  render() {
    let {navigation} = this.props;
    let {email, password, confirm_password, not_reveal, loading, message} =
      this.state;

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
                Create your account
              </Fr_text>

              <Bg_view>
                <Fr_text style={{marginBottom: hp(1.5), fontSize: wp(3.8)}}>
                  Email Address
                </Fr_text>
                <TextInput
                  placeholder="Enter your email..."
                  value={email}
                  onChangeText={email => this.setState({email})}
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
              <Bg_view
                horizontal
                style={{
                  justifyContent: 'space-between',
                  marginTop: hp(4),
                }}>
                <Bg_view style={{marginRight: wp(1.5)}} flex>
                  <Fr_text style={{marginBottom: hp(1.5), fontSize: wp(3.8)}}>
                    Password
                  </Fr_text>
                  <TextInput
                    placeholder="Enter your password..."
                    value={password}
                    secureTextEntry={not_reveal}
                    placeholderTextColor="#ccc"
                    onChangeText={password => this.setState({password})}
                    style={{
                      borderRadius: wp(2.8),
                      borderColor: '#52AE27',
                      borderWidth: 1,
                      paddingHorizontal: wp(2.8),
                      justifyContent: 'center',
                      color: '#333',
                    }}
                  />
                </Bg_view>
                <Bg_view style={{marginLeft: wp(1.5)}} flex>
                  <Fr_text style={{marginBottom: hp(1.5), fontSize: wp(3.8)}}>
                    Re-type Password
                  </Fr_text>
                  <TextInput
                    placeholder="Confirm password..."
                    secureTextEntry={not_reveal}
                    value={confirm_password}
                    placeholderTextColor="#ccc"
                    onChangeText={confirm_password =>
                      this.setState({confirm_password})
                    }
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
              </Bg_view>

              <Text_btn
                text={!not_reveal ? 'Hide passwords' : 'Show passwords'}
                accent
                action={() =>
                  this.setState({not_reveal: !this.state.not_reveal})
                }
                style={{marginBottom: hp(2.8)}}
              />

              <Bg_view style={{alignItems: 'center'}}>
                <Text_btn text={message} italic accent />
              </Bg_view>

              <TouchableNativeFeedback onPress={this.signup}>
                <View>
                  <Bg_view
                    style={{
                      borderRadius: wp(2.8),
                      backgroundColor: '#52AE27',
                      height: hp(7.5),
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
                        Register
                      </Fr_text>
                    )}
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
              <Fr_text>Already have an account?</Fr_text>
              <Text_btn
                accent
                text="Login"
                action={() => navigation.navigate('login')}
              />
            </Bg_view>
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Signup;