import React from 'react';
import Bg_view from '../components/bg_view';
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Fr_text from '../components/fr_text';
import {hp, wp} from '../utils/dimensions';
import Icon from '../components/icon';
import Feather from 'react-native-vector-icons/Feather';
import {post_request} from '../utils/services';
import {email_regex} from '../utils/functions';

class Reset_password extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  request_code = async () => {
    let {email, loading} = this.state;
    let {navigation} = this.props;

    if (loading) return;
    this.setState({loading: true});

    await post_request('request_otp', {
      email,
      subject: 'Reset Password',
    });

    this.setState({loading: false});
    navigation.navigate('confirm_otp', {email: email.toLowerCase()});
  };

  render() {
    let {navigation} = this.props;
    let {email, loading} = this.state;
    let ready = email_regex.test(email);

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
                Forgot Password
              </Fr_text>
              <Fr_text
                centralise
                color="#888"
                style={{marginBottom: hp(2.8)}}
                size={wp(3.8)}>
                No worries! Enter your email address below and we will send you
                a code to reset password.
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
                <TouchableNativeFeedback
                  onPress={this.request_code}
                  disabled={!ready}>
                  <View>
                    <Bg_view
                      style={{
                        borderRadius: wp(4),
                        backgroundColor: ready ? '#52AE27' : 'grey',
                        height: hp(6.5),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Fr_text
                          style={{
                            fontSize: wp(4),
                            color: '#fff',
                            fontWeight: 'bold',
                          }}>
                          Request Code
                        </Fr_text>
                      )}
                    </Bg_view>
                  </View>
                </TouchableNativeFeedback>
              </Bg_view>
            </Bg_view>
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Reset_password;
