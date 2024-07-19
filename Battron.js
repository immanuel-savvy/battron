import React from 'react';
// import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaView, PermissionsAndroid, Platform, Alert} from 'react-native';
import Emitter from 'semitter';
//
import Splash from './src/screens/Splash';
import {App_data} from './Contexts';
import Home from './src/screens/Home';
import About_us from './src/screens/About_us';
import Subscribe from './src/screens/Subscribe';
import {notificationService} from './src/utils/notification_service';

const emitter = new Emitter();

const App_stack = createStackNavigator();

class App_stack_entry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render = () => {
    return (
      <App_stack.Navigator
        initialRouteName="home"
        screenOptions={{
          headerShown: false,
          keyboardHandlingEnabled: true,
          gestureEnabled: true,
          animationEnabled: true,
        }}>
        <App_stack.Screen name="home" component={Home} />
        <App_stack.Screen name="about_us" component={About_us} />
        <App_stack.Screen name="subscribe" component={Subscribe} />
      </App_stack.Navigator>
    );
  };
}

class Battron extends React.Component {
  constructor(props) {
    super(props);

    this.state = {loading: true};
  }

  componentDidMount = async () => {
    await this.requestNotificationPermission();

    setTimeout(
      () =>
        this.setState({loading: false}, () => notificationService.configure()),
      2500,
    );
  };

  componentWillUnmount = () => {};

  requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app needs access to show notifications',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  render = () => {
    let {loading} = this.state;

    return (
      <NavigationContainer>
        <SafeAreaView collapsable={false} style={{flex: 1}}>
          {loading ? (
            <Splash />
          ) : (
            <App_data.Provider value={{}}>
              <SafeAreaView style={{flex: 1}}>
                <App_stack_entry />
              </SafeAreaView>
            </App_data.Provider>
          )}
        </SafeAreaView>
      </NavigationContainer>
    );
  };
}

export default Battron;
export {emitter};
