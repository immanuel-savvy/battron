import React from 'react';
import Bg_view from '../components/bg_view';
import Header from '../components/header';
import {hp, wp} from '../utils/dimensions';
import {
  ActivityIndicator,
  ScrollView,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Fr_text from '../components/fr_text';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class Subscribe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sub_type: 'monthly',
    };
  }

  render() {
    let {navigation} = this.props;
    let {sub_type, loading} = this.state;

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
          <Bg_view style={{backgroundColor: '#312A2A', padding: wp(5.6)}} flex>
            <Fr_text color="#fff" size={wp(6.7)} centralise bold>
              Battron
            </Fr_text>
            <Bg_view style={{padding: wp(5.6), paddingTop: hp(10)}} no_bg>
              <Bg_view no_bg horizontal>
                <FontAwesome name="circle" color="#52AE27" size={wp(4.5)} />

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
                <FontAwesome name="circle" color="#52AE27" size={wp(4.5)} />

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
                <FontAwesome name="circle" color="#52AE27" size={wp(4.5)} />

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

            <Bg_view
              no_bg
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
            <Fr_text
              color="#fff"
              centralise
              bold
              style={{marginVertical: hp(4)}}>
              Included 3-days trial
            </Fr_text>

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

            <Fr_text color="#fff" centralise style={{marginVertical: hp(4)}}>
              Cancel anytime
            </Fr_text>
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Subscribe;
