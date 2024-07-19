/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Battron from './Battron';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';

AppRegistry.registerComponent(appName, () => Battron);

// PushNotification.configure({
//   onNotification: function (notification) {
//     console.log('NOTIFICATION:', notification);
//   },
//   // popInitialNotification: true,
//   // requestPermissions: true,
// });
