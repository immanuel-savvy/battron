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
import Text_btn from '../components/text_btn';
import {emitter} from '../../Battron';

class Confirm_otp extends React.Component {
  constructor(props) {
    super(props);

    let {email, user} = this.props.route.params || {};
    this.state = {email, code: '', user};
  }

  confirm = async () => {
    let {code, email, user, loading} = this.state;
    let {navigation} = this.props;

    if (loading) return;
    this.setState({loading: true});

    let res = await post_request('verify_email', {
      verification_code: code,
      email,
    });

    if (!res._id) {
      return this.setState({message: 'Invalid Code!', loading: false});
    }
    this.setState({loading: false});
    user
      ? emitter.emit('login', {...res, first: true})
      : navigation.navigate('update_password', {email});
  };

  render() {
    let {navigation} = this.props;
    let {code, email, user, message, loading} = this.state;
    let ready = code.trim().length === 6 && !isNaN(Number(code.trim()));

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
                component={<Feather name="arrow-left" size={wp(7.5)} />}
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
                Verify Account
              </Fr_text>
              <Fr_text
                centralise
                color="#888"
                style={{marginBottom: hp(2.8)}}
                size={wp(3.8)}>
                {`Code has been sent to ${email}.\nEnter the code to verify your account.`}
              </Fr_text>

              <Bg_view>
                <Fr_text style={{marginBottom: hp(1.5), fontSize: wp(3.8)}}>
                  Enter Code
                </Fr_text>
                <TextInput
                  placeholder="- - - - - -"
                  placeholderTextColor="#ccc"
                  value={code}
                  keyboardType="decimal-pad"
                  onChangeText={code => this.setState({code, message: ''})}
                  style={{
                    borderRadius: wp(2.8),
                    borderColor: '#52AE27',
                    borderWidth: 1,
                    color: '#333',
                    textAlign: 'center',
                    paddingHorizontal: wp(2.8),
                    justifyContent: 'center',
                  }}
                />
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

              <Bg_view style={{marginTop: hp(4)}}>
                <TouchableNativeFeedback
                  onPress={this.confirm}
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
                          Confirm
                        </Fr_text>
                      )}
                    </Bg_view>
                  </View>
                </TouchableNativeFeedback>
              </Bg_view>
              {user ? (
                <Bg_view style={{alignItems: 'center', marginTop: hp(2.8)}}>
                  <Text_btn
                    centralise
                    accent
                    size={wp(4.5)}
                    text="Skip"
                    action={() => emitter.emit('login', {...user, first: true})}
                  />
                </Bg_view>
              ) : null}
            </Bg_view>
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Confirm_otp;
