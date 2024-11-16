import React from 'react';
// import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
import {get_request} from './src/utils/services';
import Feather from 'react-native-vector-icons/Feather';
import BackgroundActions from 'react-native-background-actions';
import DeviceBattery from 'react-native-device-battery';

const emitter = new Emitter();

const App_stack = createStackNavigator();

const Auth_stack = createStackNavigator();

const Bottom_tabs = createBottomTabNavigator();

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
      </App_stack.Navigator>
    );
  };
}

class Bottom_tabs_entry extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <Bottom_tabs.Navigator
        initialRouteName="index"
        backBehavior="initial"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#52AE27',
          /* tabBarInactiveTintColor: '#858597', */
        }}>
        <Bottom_tabs.Screen
          name="index"
          component={App_stack_entry}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <Feather name="home" color={color} size={size} />
            ),
          }}
        />
        <Bottom_tabs.Screen
          name="about"
          component={About_us}
          options={{
            tabBarLabel: 'About us',
            tabBarIcon: ({color, size}) => (
              <Feather name="user" color={color} size={size} />
            ),
          }}
        />
        <Bottom_tabs.Screen
          name="subscribe"
          component={Subscribe}
          options={{
            tabBarLabel: 'Subscribe',
            tabBarIcon: ({color, size}) => (
              <Feather name="heart" color={color} size={size} />
            ),
          }}
        />
      </Bottom_tabs.Navigator>
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
      AsyncStorage.setItem('inactive', 'true').then(() => {
        this.setState({user});
        AsyncStorage.setItem('user', user._id);
      });
    };
    this.logout = () => {
      this.setState({user: null}, () => AsyncStorage.removeItem('user'));
    };
    emitter.listen('login', this.login);
    emitter.listen('logout', this.logout);

    let preset_level = Number(await AsyncStorage.getItem('preset_level')) || 80;

    const sleep = time =>
      new Promise(resolve => setTimeout(() => resolve(), time));

    // Task to run in background
    const battery_monitoring_task = async task_arguments => {
      let {delay} = task_arguments;
      console.log('Battery Monitoring Started');

      while (BackgroundActions.isRunning() && this.state.user) {
        let battery_level = (await DeviceBattery.getBatteryLevel()) * 100;

        if (battery_level >= preset_level) {
          // Example threshold
          notificationService.localNotification(
            `Battery level has reached the preset limit of ${preset_level}%`,
          );
        }

        // Sleep to reduce CPU usage
        await sleep(delay);
      }
    };

    const options = {
      taskName: 'Battery Monitoring',
      taskTitle: 'Battery Monitor',
      taskDesc: 'Monitoring battery levels',
      taskIcon: {
        name: 'ic_notification', // Icon in drawable folder for Android
        type: 'drawable',
      },
      color: '#ff00ff',
      linkingURI: 'myapp://home', // Deep linking
      parameters: {
        delay: 60000, // 1-minute intervals
      },
    };

    const start_battery_monitoring = async () => {
      await BackgroundActions.start(battery_monitoring_task, options);
      console.log('Battery Monitoring in background started.');
    };

    // if (!(await AsyncStorage.getItem('inactive'))) start_battery_monitoring();
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
                {user?._id ? <Bottom_tabs_entry /> : <Auth_stack_entry />}
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
