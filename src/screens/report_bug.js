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

class Report_bug extends React.Component {
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
        message: 'Thanks for the submission!',
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
                Report a Bug
              </Fr_text>
              <Fr_text
                color="#fff"
                centralise
                // bold
                style={{fontSize: wp(4.5), marginVertical: hp(1.4)}}></Fr_text>

              <Fr_text color="#fff" bold>
                Title
              </Fr_text>
              <TextInput
                placeholder="Enter a title..."
                value={text}
                onChangeText={text => this.setState({text, message: ''})}
                style={{
                  backgroundColor: '#fff',
                  color: '#000',
                  marginVertical: hp(1.4),
                  borderRadius: wp(1.4),
                  paddingHorizontal: wp(2.8),
                  height: hp(5),
                }}
              />

              <Fr_text color="#fff" bold>
                Description
              </Fr_text>
              <TextInput
                placeholder="Enter a description..."
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
            </Bg_view>
          </Bg_view>
        </ScrollView>
      </Bg_view>
    );
  }
}

export default Report_bug;
