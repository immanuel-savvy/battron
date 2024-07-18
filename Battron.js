import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaView, PermissionsAndroid, Linking, Alert} from 'react-native';
import Emitter from 'semitter';
//
import Splash from './src/screens/Splash';
import {App_data} from './Contexts';
import Home from './src/screens/Home';
import About_us from './src/screens/About_us';
import Subscribe from './src/screens/Subscribe';

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
    await this.requestPermissions();

    setTimeout(() => this.setState({loading: false}), 2500);
  };

  componentWillUnmount = () => {};

  requestPermissions = async () => {
    try {
      let permissionsGranted;
      const foregroundServicePermission = await PermissionsAndroid.request(
        'android.permission.FOREGROUND_SERVICE',
      );

      if (foregroundServicePermission !== PermissionsAndroid.RESULTS.GRANTED) {
        permissionsGranted = false;
        if (
          foregroundServicePermission ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
          this.showPermissionAlert('foreground service');
        } else {
          Alert.alert(
            'Permissions required',
            'This app needs foreground service permission to function properly.',
          );
        }
      }

      if (permissionsGranted) {
        this.setState({permissionsGranted: true});
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      this.setState({error: err.message});
    }
  };

  showPermissionAlert = permission => {
    Alert.alert(
      `${permission} Permission Required`,
      `Please go to the app settings and enable the ${permission} permission manually.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
      ],
    );
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
