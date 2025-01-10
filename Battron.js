import React from 'react';
// import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  Alert,
  NativeModules,
} from 'react-native';
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
import Onboarding from './src/screens/Onboarding';
import Entry from './src/screens/Entry';
import Reset_password from './src/screens/Reset_password';
import Confirm_otp from './src/screens/Confirm_otp';
import Update_password from './src/screens/Update_password';

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
        initialRouteName="onboarding"
        screenOptions={{
          headerShown: false,
          keyboardHandlingEnabled: true,
          gestureEnabled: true,
          animationEnabled: true,
        }}>
        <Auth_stack.Screen name="onboarding" component={Onboarding} />
        <Auth_stack.Screen name="subscribe" component={Subscribe} />
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
          tabBarStyle: {
            backgroundColor: '#000',
          },
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

    let user = await AsyncStorage.getItem('user');
    if (user) user = await get_request(`user?email=${user}`);

    this.setState({user, loading: false});

    let diff = Date.now() - start;
    let wait = 3000 - diff;
    if (wait < 0) wait = 0;

    setTimeout(() => {
      this.setState({loading: false});
    }, wait);

    try {
      await this.requestNotificationPermission();

      notificationService.configure();
    } catch (e) {}

    let preset_level = Number(await AsyncStorage.getItem('preset_level')) || 90;

    let {BatteryModule} = NativeModules;

    const sleep = time =>
      new Promise(resolve => setTimeout(() => resolve(), time));

    // Task to run in background
    const battery_monitoring_task = async task_arguments => {
      let {delay} = task_arguments;
      console.log('Battery Monitoring Started', delay);

      while (BackgroundActions.isRunning() && this.state.user) {
        // console.log('LOLA GREY', await BatteryModule.getBatteryPercentage());
        let battery_level = await BatteryModule.getBatteryPercentage();

        if (battery_level >= preset_level) {
          //   // Example threshold
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
      linkingURI: 'com.battron://battery-monitor', // Deep linking
      parameters: {
        delay: 60000, // 1-minute intervals
      },
      foreground: true,
    };

    const start_battery_monitoring = async () => {
      await BackgroundActions.start(battery_monitoring_task, options);
      console.log('Battery Monitoring in background started.');
    };

    try {
      if (!(await AsyncStorage.getItem('inactive'))) start_battery_monitoring();
    } catch (e) {
      console.log(e);
    }

    emitter.listen('start_monitoring', start_battery_monitoring);
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
