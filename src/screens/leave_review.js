import React from 'react';
import Bg_view from '../components/bg_view';
import Fr_text from '../components/fr_text';
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Icon from '../components/icon';
import {hp, wp} from '../utils/dimensions';
import Feather from 'react-native-vector-icons/Feather';
import Text_btn from '../components/text_btn';
import Header from '../components/header';

class Leave_review extends React.Component {
  constructor(props) {
    super(props);

    this.state = {stars: 0};
  }

  submit = () => {
    let {loading} = this.state;
    if (loading) return;

    this.setState({loading: true});
    setTimeout(() => {
      this.setState({
        loading: false,
        message: 'Thanks for the review!',
        text: '',
      });
    }, 2500);
  };

  render() {
    let {navigation} = this.props;
    let {stars, loading, message, text} = this.state;

    return (
      <Bg_view flex>
        <Header navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Bg_view flex>
            <Icon
              icon={require('../assets/icons/logo_battron.png')}
              style={{height: hp(15), width: wp(70), alignSelf: 'center'}}
            />

            <Bg_view
              style={{
                backgroundColor: '#38781A',
                padding: wp(7.5),
                margin: wp(4),
                borderRadius: wp(5.6),
              }}>
              <Fr_text color="#fff" size={wp(7.5)} bold centralise>
                Leave a Review
              </Fr_text>
              <Fr_text
                color="#fff"
                centralise
                // bold
                style={{fontSize: wp(4.5), marginVertical: hp(1.4)}}>
                How would you rate your experience?
              </Fr_text>

              <Bg_view
                no_bg
                style={{justifyContent: 'center', marginVertical: hp(2.8)}}
                horizontal>
                {[1, 2, 3, 4, 5].map(star => {
                  return (
                    <TouchableNativeFeedback
                      onPress={() => this.setState({stars: star})}>
                      <Feather
                        name="star"
                        size={wp(8)}
                        color={stars >= star ? '#FBBC05' : '#ccc'}
                        style={{marginHorizontal: wp(1.4)}}
                      />
                    </TouchableNativeFeedback>
                  );
                })}
              </Bg_view>

              <Fr_text color="#fff" bold>
                Write a Review
              </Fr_text>
              <TextInput
                placeholder="Enter text here..."
                value={text}
                onChangeText={text => this.setState({text, message: ''})}
                style={{
                  backgroundColor: '#fff',
                  color: '#000',
                  marginVertical: hp(1.4),
                  borderRadius: wp(1.4),
                  paddingHorizontal: wp(2.8),
                  height: hp(10),
                }}
              />
              <TouchableNativeFeedback onPress={this.submit}>
                <View>
                  <Bg_view
                    style={{
                      borderRadius: wp(1.4),
                      backgroundColor: '#fff',
                      height: hp(6.5),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {loading ? (
                      <ActivityIndicator color="#000" size="small" />
                    ) : (
                      <Fr_text
                        style={{
                          fontSize: wp(4.5),
                          color: '#000',
                          fontWeight: 'bold',
                        }}>
                        {message || 'Submit'}
                      </Fr_text>
                    )}
                  </Bg_view>
                </View>
              </TouchableNativeFeedback>

              <Fr_text color="#fff" style={{marginTop: hp(4)}} italic>
                By submitting this form, you agree with the{' '}
                <Fr_text color="#FBBC05" bold italic>
                  Privacy Policy
                </Fr_text>{' '}
              </Fr_text>
            </Bg_view>
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Leave_review;
