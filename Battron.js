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
import Login from './src/screens/Login';
import Verify_otp from './src/screens/Verify_otp';
import Signup from './src/screens/Signup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {get_request, post_request} from './src/utils/services';

const emitter = new Emitter();

const App_stack = createStackNavigator();

const Auth_stack = createStackNavigator();

class Auth_stack_entry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render = () => {
    return (
      <Auth_stack.Navigator
        initialRouteName="login"
        screenOptions={{
          headerShown: false,
          keyboardHandlingEnabled: true,
          gestureEnabled: true,
          animationEnabled: true,
        }}>
        <Auth_stack.Screen name="login" component={Login} />
        <Auth_stack.Screen name="verify_otp" component={Verify_otp} />
        <Auth_stack.Screen name="signup" component={Signup} />
      </Auth_stack.Navigator>
    );
  };
}

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
    let start = Date.now();
    await this.requestNotificationPermission();

    notificationService.configure();

    let user = await AsyncStorage.getItem('user');
    if (user) user = await get_request(`user/${user}`);

    this.setState({user});

    let diff = Date.now() - start;
    let wait = 3000 - diff;
    if (wait < 0) wait = 0;
    setTimeout(() => {
      this.setState({loading: false});
    }, wait);

    this.login = user => {
      this.setState({user});
      AsyncStorage.setItem('user', user._id);
    };
    emitter.listen('login', this.login);
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
    let {loading, user} = this.state;

    return (
      <NavigationContainer>
        <SafeAreaView collapsable={false} style={{flex: 1}}>
          {loading ? (
            <Splash />
          ) : (
            <App_data.Provider value={{user}}>
              <SafeAreaView style={{flex: 1}}>
                {user?._id ? (
                  <App_stack_entry user={user} />
                ) : (
                  <Auth_stack_entry />
                )}
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
