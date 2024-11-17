import React from 'react';
import Bg_view from '../components/bg_view';
import Header from '../components/header';
import {hp, wp} from '../utils/dimensions';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Fr_text from '../components/fr_text';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import Icon from '../components/icon';
import {emitter} from '../../Battron';
import {App_data} from '../../Contexts';
import Text_btn from '../components/text_btn';
import {get_request, post_request} from '../utils/services';
import Cool_modal from '../components/cool_modal';
import Small_btn from '../components/small_btn';

let secret = 'FLWSECK_TEST-a267cd8ead3064acf0334d386fd36577-X';

class Subscribe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sub_type: 'monthly',
    };
  }

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

    console.log(sub);

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
        ? 'https://sandbox.flutterwave.com/pay/jh4uuan2fuaw'
        : 'https://sandbox.flutterwave.com/pay/dxmwajtr2paz',
    );
  };

  toggle_cancel = () => this.mod?.toggle();

  render() {
    let {navigation} = this.props;
    let {sub_type, loading} = this.state;

    return (
      <App_data.Consumer>
        {({user}) => {
          this.user = user;
          // if (user) user.subscription = null;
          return (
            <Bg_view
              style={{
                flex: 1,
                paddingBottom: 0,
                backgroundColor: '#000',
              }}>
              {/* <Header title="subscribe" navigation={navigation} /> */}

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flex: 1}}>
                <Bg_view
                  style={{backgroundColor: '#312A2A', padding: wp(5.6)}}
                  flex>
                  <Bg_view no_bg horizontal>
                    <Bg_view no_bg flex />
                    <Bg_view no_bg flex>
                      <Fr_text color="#fff" size={wp(6.7)} centralise bold>
                        Battron
                      </Fr_text>
                    </Bg_view>

                    <Bg_view no_bg flex style={{alignItems: 'flex-end'}}>
                      <Fr_text>
                        <Icon
                          action={() => emitter.emit('logout')}
                          component={
                            <Feather
                              name="log-out"
                              color="#eee"
                              size={wp(6.5)}
                            />
                          }
                        />
                      </Fr_text>
                    </Bg_view>
                  </Bg_view>
                  <Bg_view style={{padding: wp(5.6), paddingTop: hp(10)}} no_bg>
                    <Bg_view no_bg horizontal>
                      <FontAwesome
                        name="circle"
                        color="#52AE27"
                        size={wp(4.5)}
                      />

                      <Fr_text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: wp(5),
                          marginLeft: wp(2.8),
                        }}>
                        Full charge Alert
                      </Fr_text>
                    </Bg_view>
                    <Bg_view no_bg horizontal style={{marginVertical: hp(2.8)}}>
                      <FontAwesome
                        name="circle"
                        color="#52AE27"
                        size={wp(4.5)}
                      />

                      <Fr_text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: wp(5),
                          marginLeft: wp(2.8),
                        }}>
                        Super Responsive
                      </Fr_text>
                    </Bg_view>
                    <Bg_view no_bg horizontal>
                      <FontAwesome
                        name="circle"
                        color="#52AE27"
                        size={wp(4.5)}
                      />

                      <Fr_text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: wp(5),
                          marginLeft: wp(2.8),
                        }}>
                        Be protected
                      </Fr_text>
                    </Bg_view>
                  </Bg_view>

                  {user?.subscription ? (
                    <Bg_view no_bg style={{alignSelf: 'center'}}>
                      <TouchableNativeFeedback onPress={() => {}}>
                        <View>
                          <Bg_view
                            style={{
                              width: wp(40),
                              alignItems: 'center',
                              paddingVertical: hp(4),
                              borderRadius: wp(4.5),
                              backgroundColor: '#52AE27',
                            }}>
                            <Fr_text capitalise color="#fff" bold>
                              {user?.subscription?.type || 'Annually'}
                            </Fr_text>
                            <Bg_view
                              no_bg
                              style={{
                                height: hp(1),
                                borderBottomColor: '#fff',
                                borderBottomWidth: 1,
                                marginVertical: hp(2),
                                width: '100%',
                              }}></Bg_view>

                            <Fr_text color="#fff">
                              NGN {user.subscription.amount}
                            </Fr_text>
                          </Bg_view>
                          <Bg_view
                            style={{
                              paddingHorizontal: wp(2.8),
                              paddingBottom: 0,
                              height: hp(4),
                              borderRadius: wp(4),
                              backgroundColor: '#B55959',
                              alignSelf: 'center',
                              justifyContent: 'center',
                              position: 'absolute',
                              top: -10,
                            }}>
                            <Fr_text color="#fff" bold>
                              Running
                            </Fr_text>
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
                      }}>
                      <TouchableNativeFeedback
                        onPress={() => this.setState({sub_type: 'monthly'})}>
                        <View>
                          <Bg_view
                            style={{
                              backgroundColor:
                                sub_type === 'monthly' ? '#52AE27' : '#533D3D',
                              alignItems: 'center',
                              paddingVertical: hp(4),
                              borderRadius: wp(4.5),
                              width: wp(40),
                            }}>
                            <Fr_text color="#fff" bold>
                              4 weeks
                            </Fr_text>
                            <Bg_view
                              no_bg
                              style={{
                                height: hp(1),
                                borderBottomColor: '#fff',
                                borderBottomWidth: 1,
                                marginVertical: hp(2),
                                width: '100%',
                              }}></Bg_view>

                            <Fr_text color="#fff">$0.99</Fr_text>
                          </Bg_view>
                        </View>
                      </TouchableNativeFeedback>
                      <TouchableNativeFeedback
                        onPress={() => this.setState({sub_type: 'annual'})}>
                        <View>
                          <Bg_view
                            style={{
                              width: wp(40),
                              alignItems: 'center',
                              paddingVertical: hp(4),
                              borderRadius: wp(4.5),
                              backgroundColor:
                                sub_type === 'annual' ? '#52AE27' : '#533D3D',
                            }}>
                            <Fr_text color="#fff" bold>
                              12 months
                            </Fr_text>
                            <Bg_view
                              no_bg
                              style={{
                                height: hp(1),
                                borderBottomColor: '#fff',
                                borderBottomWidth: 1,
                                marginVertical: hp(2),
                                width: '100%',
                              }}></Bg_view>

                            <Fr_text color="#fff">$2.99</Fr_text>
                          </Bg_view>
                          <Bg_view
                            style={{
                              paddingHorizontal: wp(2.8),
                              paddingBottom: 0,
                              height: hp(4),
                              borderRadius: wp(4),
                              backgroundColor: '#B55959',
                              alignSelf: 'center',
                              justifyContent: 'center',
                              position: 'absolute',
                              top: -10,
                            }}>
                            <Fr_text color="#fff" bold>
                              Save 75%
                            </Fr_text>
                          </Bg_view>
                        </View>
                      </TouchableNativeFeedback>
                    </Bg_view>
                  )}
                  <Fr_text
                    color="#fff"
                    centralise
                    bold
                    style={{marginVertical: hp(4)}}>
                    {user?.subscription
                      ? this.sub_duration(user.subscription)
                      : 'Included 3-days trial'}
                  </Fr_text>

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

                  {user?.subscription ? (
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
                  ) : null}
                </Bg_view>
              </ScrollView>

              <Cool_modal
                ref={mod => (this.mod = mod)}
                toggle={this.toggle_cancel}>
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
                    <Bg_view
                      horizontal
                      style={{justifyContent: 'space-between'}}>
                      <Fr_text bold size={wp(5)} style={{margin: wp(2.8)}}>
                        Unsubscribe
                      </Fr_text>
                      <TouchableNativeFeedback onPress={this.toggle_cancel}>
                        <View style={{padding: wp(2.8)}}>
                          <EvilIcons
                            name="close"
                            color="#52AE27"
                            size={wp(7.5)}
                          />
                        </View>
                      </TouchableNativeFeedback>
                    </Bg_view>

                    <Fr_text
                      style={{marginTop: hp(4), marginBottom: hp(2.8)}}
                      centralise>
                      Are you sure you want to unsubscribe?
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
        }}
      </App_data.Consumer>
    );
  }
}

export default Subscribe;
