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
import {post_request} from '../utils/services';
import {email_regex} from '../utils/functions';
import {emitter} from '../../Battron';

class Update_password extends React.Component {
  constructor(props) {
    super(props);

    let {email} = this.props.route.params || {};
    this.state = {not_reveal: true, password: '', email};
  }

  toggle_password = () => this.setState({not_reveal: !this.state.not_reveal});

  reset = async () => {
    let {password, email, loading} = this.state;
    if (loading) return;

    let res = await post_request(`update_password`, {email, password});

    this.setState({loading: false});
    if (!res?._id) {
      return;
    }
    emitter.emit('login', res);
  };

  render() {
    let {navigation} = this.props;
    let {password, confirm_password, not_reveal, loading} = this.state;

    let ready =
      password && password.length >= 8 && confirm_password === password;

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
                Create New Password
              </Fr_text>

              <Bg_view style={{}}>
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
                    text={
                      password && password.length < 8
                        ? 'Password must be atleast 8 characters'
                        : null
                    }
                    italic
                    size={wp(3.5)}
                    color="red"
                  />
                </Bg_view>
              </Bg_view>
              <Bg_view style={{marginVertical: hp(4)}}>
                <Fr_text style={{marginBottom: hp(1.5), fontSize: wp(3.8)}}>
                  Confirm Password
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
                      value={confirm_password}
                      onChangeText={confirm_password =>
                        this.setState({confirm_password})
                      }
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
                    text={
                      confirm_password && password !== confirm_password
                        ? 'Passwords do not match'
                        : null
                    }
                    italic
                    size={wp(3.5)}
                    color="red"
                  />
                </Bg_view>
              </Bg_view>

              <TouchableNativeFeedback onPress={this.reset} disabled={!ready}>
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
                          fontSize: wp(4.5),
                          color: '#fff',
                          fontWeight: 'bold',
                        }}>
                        Reset Password
                      </Fr_text>
                    )}
                  </Bg_view>
                </View>
              </TouchableNativeFeedback>
            </Bg_view>
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Update_password;
