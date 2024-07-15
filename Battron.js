import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaView, PermissionsAndroid, NativeModules} from 'react-native';
import Emitter from 'semitter';
import AsyncStorage from '@react-native-async-storage/async-storage';
//
import Splash from './src/screens/Splash';
import {App_data} from './Contexts';
import Home from './src/screens/Home';
import About_us from './src/screens/About_us';
import Subscribe from './src/screens/Subscribe';

const {BatteryModule} = NativeModules;

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
    setTimeout(() => this.setState({loading: false}), 2500);
  };

  componentWillUnmount = () => {};

  requestPhoneStatePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: 'Phone State Permission',
          message:
            'This app needs access to your phone state to retrieve network information.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('READ_PHONE_STATE permission granted');
        // You can now proceed to use the permission
      } else {
        console.log('READ_PHONE_STATE permission denied');
        // Handle the case where the user denied the permission
      }
    } catch (err) {
      console.warn(err);
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
