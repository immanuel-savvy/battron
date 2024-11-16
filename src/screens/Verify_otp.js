import React from 'react';
import Bg_view from '../components/bg_view';
import {
  TextInput,
  ScrollView,
  TouchableNativeFeedback,
  View,
  ActivityIndicator,
} from 'react-native';
import Fr_text from '../components/fr_text';
import {hp, wp} from '../utils/dimensions';
import Icon from '../components/icon';
import Feather from 'react-native-vector-icons/Feather';
import Text_btn from '../components/text_btn';
import {post_request} from '../utils/services';
import {emitter} from '../../Battron';

class Verify_otp extends React.Component {
  constructor(props) {
    super(props);

    let {email} = this.props.route.params;

    this.state = {email};
  }

  verify = async () => {
    let {email, code, loading} = this.state;
    console.log(email, code);
    if (!code.trim() || loading) return;
    this.setState({loading: true});

    let res = await post_request('verify_email', {
      email,
      verification_code: code.trim(),
    });
    if (!res?._id)
      return this.setState({
        loading: false,
        message: res || 'Err, something went wrong.',
      });
    emitter.emit('login', res);
  };

  render() {
    let {navigation} = this.props;
    let {email, code, loading, message} = this.state;

    return (
      <Bg_view flex style={{backgroundColor: '#ccc'}}>
        <ScrollView>
          <Icon
            component={<Feather name="arrow-left" size={wp(7.5)} />}
            style={{padding: wp(4)}}
            action={navigation.goBack}
          />
          <Bg_view
            style={{margin: wp(4), borderRadius: wp(0.2), padding: wp(4)}}>
            <Bg_view style={{padding: wp(4)}}>
              <Fr_text
                style={{
                  fontWeight: 'bold',
                  fontSize: wp(5.6),
                  marginBottom: hp(4),
                }}>
                Verify Your Email
              </Fr_text>

              <Bg_view>
                <Fr_text
                  centralise
                  bold
                  style={{marginBottom: hp(4), fontSize: wp(3.8)}}>
                  {email
                    ? `We have sent a verification code to your inbox at (${email})`
                    : 'Please enter your email'}
                </Fr_text>
                {email ? null : (
                  <TextInput
                    placeholder="Email address"
                    keyboardType="email-address"
                    onChangeText={em => this.setState({em})}
                    style={{
                      borderRadius: wp(2.8),
                      borderColor: '#52AE27',
                      borderWidth: 1,
                      paddingHorizontal: wp(2.8),
                      color: '#333',
                      textAlign: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                    }}
                  />
                )}
                {email ? (
                  <TextInput
                    placeholder="- - - - - -"
                    value={code}
                    keyboardType="decimal-pad"
                    onChangeText={code => this.setState({code})}
                    placeholderTextColor="#ccc"
                    style={{
                      borderRadius: wp(2.8),
                      borderColor: '#52AE27',
                      borderWidth: 1,
                      paddingHorizontal: wp(2.8),
                      color: '#333',
                      textAlign: 'center',
                      justifyContent: 'center',
                    }}
                  />
                ) : null}
              </Bg_view>
            </Bg_view>

            <Bg_view style={{alignItems: 'center'}}>
              <Text_btn text={message} italic accent />
            </Bg_view>

            <TouchableNativeFeedback onPress={this.verify}>
              <View>
                <Bg_view
                  style={{
                    borderRadius: wp(2.8),
                    backgroundColor: '#52AE27',
                    height: hp(5.6),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: wp(4),
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
                      {email ? 'Verify Code' : 'Request Code'}
                    </Fr_text>
                  )}
                </Bg_view>
              </View>
            </TouchableNativeFeedback>
          </Bg_view>
        </ScrollView>
        <Bg_view
          horizontal
          flex
          no_bg
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
    );
  }
}

export default Verify_otp;
