import React from 'react';
import Bg_view from '../components/bg_view';
import {hp, wp} from '../utils/dimensions';
import {
  ActivityIndicator,
  ImageBackground,
  Linking,
  ScrollView,
  TextInput,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Fr_text from '../components/fr_text';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {emitter} from '../../Battron';
import Text_btn from '../components/text_btn';
import {get_request, post_request} from '../utils/services';
import Cool_modal from '../components/cool_modal';
import Small_btn from '../components/small_btn';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

let secret = 'FLWSECK_TEST-781a0514728e254396ec1c3a924d02f4-X';

class Subscribe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sub_type: 'monthly',
      has_free: 'checking',
    };
  }

  componentDidMount = async () => {
    let has_free = await AsyncStorage.getItem('virgin');

    this.setState({has_free: !has_free});
  };

  trial_period = 3 * 24 * 3600 * 1000;

  sub_duration = subscription => {
    let {type, created} = subscription;

    if (type === 'monthly') {
      created += 30 * 1000 * 60 * 60 * 24;
    } else if (!type || type === 'annually') {
      created += 365 * 1000 * 60 * 60 * 24;
    }

    return `Till ${new Date(created).toDateString()}`;
  };

  cancel = async () => {
    let sub = await fetch(
      `https://api.flutterwave.com/v3/subscriptions?email=${this.user.email}`,
      {
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      },
    );
    sub = await sub.json();

    let {data} = sub;
    for (let d = 0; d < data.length; d++) {
      let tum = data[d];

      await fetch(
        `https://api.flutterwave.com/v3/subscriptions/${tum.id}/cancel`,
        {
          headers: {
            Authorization: `Bearer ${secret}`,
          },
        },
      );
    }
    await post_request('cancel_subscription', {user: this.user._id});
    this.user.subscription = null;
    emitter.emit('update_user', this.user);
  };

  proceed = async () => {
    let {sub_type} = this.state;

    Linking.openURL(
      sub_type === 'monthly'
        ? 'https://sandbox.flutterwave.com/pay/2k4xmt1nqgfe'
        : 'https://sandbox.flutterwave.com/pay/roccasmtau6x',
    );
  };

  toggle_cancel = () => this.mod?.toggle();

  annual_period = 365 * 24 * 3600 * 1000;

  monthly_period = 30 * 24 * 3600 * 1000;

  toggle_email_field = () =>
    this.setState({email_field: !this.state.email_field});

  proceed = async () => {
    let {email, retrieve_loading} = this.state;

    if (retrieve_loading) return;
    this.setState({retrieve_loading: true});
    await AsyncStorage.setItem('user', email.toLowerCase().trim());
    let user = await get_request(`user?email=${user}`);

    this.setState({email: false, retrieve_loading: false}, () =>
      emitter.emit('home', user),
    );
  };

  render() {
    let {navigation} = this.props;
    let {
      sub_type,
      email_field,
      email,
      retrieve_loading,
      loading,
      has_free,
      user,
    } = this.state;

    user = user || {};

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
                Choose Your Plan
              </Fr_text>
              <Fr_text
                color="#fff"
                size={wp(5)}
                style={{marginTop: hp(1.4)}}
                bold>
                Unlock The Full App and Gain:
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
              <Bg_view style={{padding: wp(1), paddingTop: hp(4)}} no_bg>
                {['Full charge alert', 'super responsive', 'be protected'].map(
                  (prop, i) => {
                    return (
                      <Bg_view
                        no_bg
                        horizontal
                        key={i}
                        style={{marginBottom: hp(1.4)}}>
                        <FontAwesome
                          name="check"
                          color="#52AE27"
                          size={wp(4.5)}
                        />

                        <Fr_text
                          capitalise
                          style={{
                            color: '#fff',
                            fontSize: wp(4),
                            marginLeft: wp(2.8),
                          }}>
                          {prop}
                        </Fr_text>
                      </Bg_view>
                    );
                  },
                )}
              </Bg_view>

              <Bg_view no_bg style={{marginVertical: hp(1.4)}}>
                <Bg_view
                  no_bg={email_field}
                  style={
                    email_field
                      ? null
                      : {
                          borderRadius: wp(4),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }
                  }>
                  <Text_btn
                    bold
                    action={email_field ? null : this.toggle_email_field}
                    color="#fff"
                    accent={!email_field}
                    style={{marginBottom: hp(1.5), fontSize: wp(3.8)}}
                    text="Enter email to use existing subscription"
                  />
                </Bg_view>
                {email_field ? (
                  <>
                    <TextInput
                      placeholder="Enter your email..."
                      placeholderTextColor="#ccc"
                      value={email}
                      autoFocus
                      onChangeText={email => this.setState({email})}
                      style={{
                        borderRadius: wp(2.8),
                        borderColor: '#52AE27',
                        borderWidth: 1,
                        backgroundColor: '#fff',
                        color: '#333',
                        paddingHorizontal: wp(2.8),
                        justifyContent: 'center',
                      }}
                    />
                    {email ? (
                      <Bg_view
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        no_bg
                        centralise>
                        {retrieve_loading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text_btn
                            text="Proceed"
                            bold
                            color="#fff"
                            centralise
                            size={wp(4.5)}
                            action={this.proceed}
                          />
                        )}
                      </Bg_view>
                    ) : null}
                  </>
                ) : null}

                <Bg_view no_bg style={{marginVertical: hp(2.8)}}>
                  <Fr_text bold color="#fff" centralise>
                    OR
                  </Fr_text>
                </Bg_view>
              </Bg_view>

              {user?.subscription ? (
                <Bg_view no_bg style={{alignSelf: 'center', marginTop: hp(4)}}>
                  <TouchableNativeFeedback
                    onPress={() => this.setState({sub_type: 'monthly'})}>
                    <View style={{}}>
                      <Bg_view
                        style={{
                          backgroundColor:
                            sub_type === 'monthly'
                              ? '#52AE27'
                              : 'rgba(0,0,0,0)',
                          borderWidth: 2,
                          borderColor:
                            sub_type !== 'monthly'
                              ? '#52AE27'
                              : 'rgba(0,0,0,0)',
                          paddingVertical: hp(4),
                          borderRadius: wp(4.5),
                          width: wp(42),
                          paddingHorizontal: wp(2.8),
                          minHeight: hp(38),
                        }}>
                        <Fr_text style={{fontSize: wp(5)}} bold color="#fff">
                          Monthly
                        </Fr_text>
                        <LinearGradient
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          colors={['yellow', '#D12E34']}
                          style={{
                            backgroundColor: 'yellow',
                            borderRadius: wp(2.8),
                            paddingHorizontal: wp(2.8),
                            alignSelf: 'flex-start',
                          }}>
                          <Fr_text
                            size={wp(3.5)}
                            style={{textTransform: 'uppercase'}}>
                            Running
                          </Fr_text>
                        </LinearGradient>

                        <Bg_view no_bg style={{marginTop: hp(2.8)}}>
                          <Fr_text color="#fff" size={wp(3.5)}>
                            Till:{' '}
                            {`${new Date(
                              user.subscription.updated +
                                (user.subscription.amount < 8000
                                  ? this.monthly_period
                                  : this.annual_period),
                            ).toDateString()}`}
                          </Fr_text>
                        </Bg_view>
                        <Bg_view no_bg style={{marginTop: hp(2.8)}}>
                          <Fr_text color="#fff">
                            <Fr_text color="#fff" size={wp(6)} bold>
                              $3.99
                            </Fr_text>
                          </Fr_text>
                        </Bg_view>

                        <Bg_view no_bg style={{marginTop: hp(3)}}>
                          <Fr_text color="#fff" size={wp(3.5)}>
                            * Date:{' '}
                            {new Date(user.subscription.updated).toDateString()}
                          </Fr_text>
                        </Bg_view>
                      </Bg_view>
                    </View>
                  </TouchableNativeFeedback>
                </Bg_view>
              ) : (
                <Bg_view
                  no_bg
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: hp(4),
                  }}>
                  <TouchableNativeFeedback
                    onPress={() => this.setState({sub_type: 'monthly'})}>
                    <View style={{}}>
                      <Bg_view
                        style={{
                          backgroundColor:
                            sub_type === 'monthly'
                              ? '#52AE27'
                              : 'rgba(0,0,0,0)',
                          borderWidth: 2,
                          borderColor:
                            sub_type !== 'monthly'
                              ? '#52AE27'
                              : 'rgba(0,0,0,0)',
                          paddingVertical: hp(4),
                          borderRadius: wp(4.5),
                          width: wp(42),
                          paddingHorizontal: wp(2.8),
                          minHeight: hp(38),
                        }}>
                        <Fr_text style={{fontSize: wp(5)}} bold color="#fff">
                          Monthly
                        </Fr_text>
                        <LinearGradient
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          colors={['yellow', '#D12E34']}
                          style={{
                            backgroundColor: 'yellow',
                            borderRadius: wp(2.8),
                            paddingHorizontal: wp(2.8),
                            alignSelf: 'flex-start',
                          }}>
                          <Fr_text
                            size={wp(3.5)}
                            style={{textTransform: 'uppercase'}}>
                            most popular
                          </Fr_text>
                        </LinearGradient>

                        <Bg_view no_bg style={{marginTop: hp(2.8)}}>
                          <Fr_text color="#fff" size={wp(3.5)}>
                            <Fr_text color="#fff" size={wp(4)} bold>
                              $0.99
                            </Fr_text>{' '}
                            / Week
                          </Fr_text>
                        </Bg_view>
                        <Bg_view no_bg style={{marginTop: hp(2.8)}}>
                          <Fr_text color="#fff">
                            <Fr_text color="#fff" size={wp(6)} bold>
                              $3.99
                            </Fr_text>{' '}
                            / Month
                          </Fr_text>
                        </Bg_view>

                        <Bg_view no_bg style={{marginTop: hp(3)}}>
                          <Fr_text color="#fff" size={wp(3.5)}>
                            * Included{' '}
                            <Fr_text bold color="#fff" size={wp(3.5)}>
                              3-days
                            </Fr_text>{' '}
                            trial
                          </Fr_text>
                        </Bg_view>
                      </Bg_view>
                    </View>
                  </TouchableNativeFeedback>
                  <TouchableNativeFeedback
                    onPress={() => this.setState({sub_type: 'annual'})}>
                    <View ref={vref => (this.v_ref = vref)} style={{}}>
                      <Bg_view
                        style={{
                          backgroundColor:
                            sub_type !== 'monthly'
                              ? '#52AE27'
                              : 'rgba(0,0,0,0)',
                          borderWidth: 2,
                          borderColor:
                            sub_type === 'monthly'
                              ? '#52AE27'
                              : 'rgba(0,0,0,0)',
                          paddingVertical: hp(4),
                          borderRadius: wp(4.5),
                          width: wp(42),
                          paddingHorizontal: wp(2.8),
                          minHeight: hp(38),
                        }}>
                        <Fr_text style={{fontSize: wp(5)}} bold color="#fff">
                          Yearly
                        </Fr_text>
                        <LinearGradient
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          colors={['yellow', '#D12E34']}
                          style={{
                            backgroundColor: 'yellow',
                            borderRadius: wp(2.8),
                            paddingHorizontal: wp(2.8),
                            alignSelf: 'flex-start',
                          }}>
                          <Fr_text
                            size={wp(3.5)}
                            style={{textTransform: 'uppercase'}}>
                            Best Value
                          </Fr_text>
                        </LinearGradient>

                        <Bg_view no_bg style={{marginTop: hp(2.8)}}>
                          <Fr_text color="#fff" size={wp(3.5)}>
                            <Fr_text color="#fff" size={wp(4)} bold>
                              $2.99
                            </Fr_text>{' '}
                            / Month
                          </Fr_text>
                        </Bg_view>
                        <Bg_view no_bg style={{marginTop: hp(2.8)}}>
                          <Fr_text color="#fff">
                            <Fr_text color="#fff" size={wp(6)} bold>
                              $35.88
                            </Fr_text>{' '}
                            / Annum
                          </Fr_text>
                        </Bg_view>

                        <Bg_view no_bg style={{marginTop: hp(3)}}>
                          <Fr_text color="#fff" size={wp(3.5)}>
                            * Save{' '}
                            <Fr_text bold color="#fff" size={wp(3.5)}>
                              50%
                            </Fr_text>{' '}
                          </Fr_text>
                          <Fr_text color="#fff" size={wp(3.5)}>
                            * Included{' '}
                            <Fr_text bold color="#fff" size={wp(3.5)}>
                              3-days
                            </Fr_text>{' '}
                            trial
                          </Fr_text>
                        </Bg_view>
                      </Bg_view>
                    </View>
                  </TouchableNativeFeedback>
                </Bg_view>
              )}

              {!user?.subscription ? (
                <TouchableNativeFeedback onPress={this.proceed}>
                  <View>
                    <Bg_view
                      style={{
                        borderRadius: wp(5),
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
                          Continue
                        </Fr_text>
                      )}
                    </Bg_view>
                  </View>
                </TouchableNativeFeedback>
              ) : null}

              {user.payment ? (
                <Bg_view style={{alignItems: 'center'}} no_bg>
                  <Text_btn
                    style={{
                      marginVertical: hp(4),
                      textAlign: 'center',
                      color: '#fff',
                    }}
                    color="#fff"
                    centralise
                    text="Cancel anytime"
                    action={this.toggle_cancel}
                  />
                </Bg_view>
              ) : has_free && has_free !== 'checking' ? (
                <TouchableWithoutFeedback onPress={() => emitter.emit('home')}>
                  <View>
                    <Bg_view
                      no_bg
                      style={{
                        borderRadius: wp(5),
                        // backgroundColor: '#fff',
                        marginTop: hp(2.8),
                        alignSelf: 'center',
                        paddingVertical: hp(1.4),
                        paddingHorizontal: wp(4),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Fr_text
                        bold
                        style={{
                          textDecorationLine: 'underline',
                          fontSize: wp(4.5),
                          color: '#fff',
                          fontWeight: 'bold',
                        }}>
                        Continue Free-Trial
                      </Fr_text>
                    </Bg_view>
                  </View>
                </TouchableWithoutFeedback>
              ) : null}

              <Fr_text
                color="#fff"
                style={{
                  marginVertical: hp(4),
                  fontSize: wp(3.5),
                  lineHeight: wp(5),
                  textAlign: 'justify',
                }}>
                The subscription feature of the Battery Monitor App provides
                access to advanced tools, detailed analytics, and premium
                support, but its availability may be subject to updates or
                technical issues, the accuracy of data depends on device
                hardware and software, subscriptions can be canceled anytime
                with refunds governed by the app’s policy, features may be
                modified or discontinued with prior notice, and the app’s
                developers are not liable for any damages, device issues, or
                data loss resulting from its use; by subscribing, you agree to
                these terms as outlined in the Terms of Service.
              </Fr_text>
              <Bg_view no_bg style={{alignItems: 'center'}}>
                <Text_btn
                  color="#fff"
                  italic
                  bold
                  text="Privacy Policy   /   Terms & Conditions"
                />
              </Bg_view>
            </Bg_view>
          </ScrollView>
        </ImageBackground>

        <Cool_modal ref={mod => (this.mod = mod)} toggle={this.toggle_cancel}>
          <Bg_view no_bg>
            <Bg_view
              style={{
                elevation: 5,
                shadowColor: '#000',
                padding: wp(4),
                borderRadius: wp(2.8),
                marginBottom: hp(1.4),
                marginHorizontal: wp(2.8),
              }}>
              <Bg_view horizontal style={{justifyContent: 'space-between'}}>
                <Fr_text bold size={wp(5)} style={{margin: wp(2.8)}}>
                  Unsubscribe
                </Fr_text>
                <TouchableNativeFeedback onPress={this.toggle_cancel}>
                  <View style={{padding: wp(2.8)}}>
                    <EvilIcons name="close" color="#52AE27" size={wp(7.5)} />
                  </View>
                </TouchableNativeFeedback>
              </Bg_view>

              <Fr_text
                style={{marginTop: hp(4), marginBottom: hp(2.8)}}
                centralise>
                Are you sure you want to unsubscribe? Your subscription would
                remain active till it is exhausted.
              </Fr_text>

              <Bg_view horizontal style={{justifyContent: 'center'}}>
                <Small_btn
                  title="Proceed"
                  action={() => {
                    this.cancel();
                    this.toggle_cancel();
                  }}
                />
                <Small_btn
                  title="Cancel"
                  inverted
                  action={this.toggle_cancel}
                />
              </Bg_view>
            </Bg_view>
          </Bg_view>
        </Cool_modal>
      </Bg_view>
    );
  }
}

export default Subscribe;
