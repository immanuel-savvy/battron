import React from 'react';
import Bg_view from '../components/bg_view';
import {
  ScrollView,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {wp, hp} from '../utils/dimensions';
import Icon from '../components/icon';
import Feather from 'react-native-vector-icons/Feather';

class Onboarding extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active_dot: 0,
    };

    this.scrollViewRef = React.createRef();
    this.autoSwipeInterval = null;
  }

  componentDidMount() {
    this.startAutoSwipe();
  }

  componentWillUnmount() {
    this.stopAutoSwipe();
  }

  onScroll = event => {
    let pageIndex = Math.round(event.nativeEvent.contentOffset.x / wp());
    this.setState({activePage: pageIndex});
  };

  renderPaginationDots = () => {
    let pages = 3;
    let {activePage} = this.state;

    return (
      <View style={styles.dotsContainer}>
        {Array.from({length: pages}).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activePage === index ? styles.active_dot : styles.inactive_dot,
            ]}
          />
        ))}
      </View>
    );
  };

  startAutoSwipe = () => {
    const totalPages = 3; // Total number of onboarding screens

    this.autoSwipeInterval = setInterval(() => {
      this.setState(
        prevState => ({
          activePage: (prevState.activePage + 1) % totalPages,
        }),
        () => {
          this.scrollViewRef.current.scrollTo({
            x: wp() * this.state.activePage,
            animated: true,
          });
        },
      );
    }, 3000); // Change screen every 3 seconds
  };

  stopAutoSwipe = () => {
    if (this.autoSwipeInterval) {
      clearInterval(this.autoSwipeInterval);
    }
  };

  render() {
    let {navigation} = this.props;
    return (
      <Bg_view flex>
        <ScrollView
          pagingEnabled
          horizontal
          ref={this.scrollViewRef}
          scrollEventThrottle={16}
          onScroll={this.onScroll}
          showsHorizontalScrollIndicator={false}>
          <Image
            style={{width: wp(), flex: 1}}
            source={require('../assets/images/onboard1.png')}
          />
          <Image
            style={{width: wp(), flex: 1}}
            source={require('../assets/images/on2.jpg')}
          />
          <Image
            style={{width: wp(), flex: 1}}
            source={require('../assets/images/onboard2.png')}
          />
          <Image
            style={{width: wp(), flex: 1}}
            source={require('../assets/images/onboard3.png')}
          />
        </ScrollView>

        {this.renderPaginationDots()}

        <Bg_view
          style={{
            position: 'absolute',
            bottom: hp(5),
            right: wp(10),
            height: wp(15),
            width: wp(15),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: wp(15),
          }}>
          <View style={{flex: 1}}>
            <TouchableNativeFeedback
              onPress={() => navigation.navigate('entry')}
              style={{flex: 1}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  component={
                    <Feather name="arrow-right" size={wp(10)} color="#52AE27" />
                  }
                />
              </View>
            </TouchableNativeFeedback>
          </View>
        </Bg_view>
      </Bg_view>
    );
  }
}

const styles = StyleSheet.create({
  dotsContainer: {
    position: 'absolute',
    bottom: hp(10),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    marginHorizontal: wp(1),
  },
  active_dot: {
    backgroundColor: '#52AE27',
  },
  inactive_dot: {
    backgroundColor: '#C4C4C4',
  },
});

export default Onboarding;
