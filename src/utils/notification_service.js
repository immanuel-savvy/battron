import PushNotification from 'react-native-push-notification';
import Sound from 'react-native-sound';
import {Platform} from 'react-native';

class NotificationService {
  constructor() {
    this.alarm = null;
  }

  configure = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        if (notification.userInteraction) {
          this.stopAlarm();
        }
      }.bind(this),

      popInitialNotification: true,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      requestPermissions: Platform.OS === 'ios',
    });

    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'battery_stat',
          channelName: 'Battron',
          channelDescription: 'To alert owner of device of their battery limit',
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        created => console.log(`createChannel returned '${created}'`),
      );
    }
  };

  localNotification = (message, id) => {
    PushNotification.localNotification({
      channelId: 'battery_stat',
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      color: 'red',
      vibrate: true,
      vibration: 300,
      priority: 'high',
      importance: 'high',
      title: 'Battery Level Alert',
      message,
      playSound: true,
      id: id || 1,
      soundName: 'default',
      allowWhileIdle: true,
    });

    this.playAlarm();
  };

  playAlarm = () => {
    if (this.alarm) {
      this.alarm?.stop(() => {
        this.alarm?.release();
        this.alarm = null;
      });
    }
    this.alarm = new Sound('alarm_sound.wav', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      this.alarm?.setNumberOfLoops(-1);
      this.alarm?.play(success => {
        if (!success) {
          console.log('Playback failed due to audio decoding errors');
        }
      });
    });
  };

  stopAlarm = () => {
    if (this.alarm) {
      this.alarm?.stop(() => {
        this.alarm?.release();
        this.alarm = null;
      });
    }
  };

  disableService = () => {
    this.stopAlarm();
    PushNotification.cancelAllLocalNotifications();
  };
}

export const notificationService = new NotificationService();
