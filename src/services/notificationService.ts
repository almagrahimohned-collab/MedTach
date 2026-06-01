import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_SETTINGS_KEY = 'notification_settings';
const LAST_NOTIFICATION_KEY = 'last_notification_date';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.log('Notifications only work on physical devices');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permission not granted');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-reminder', {
      name: 'Daily Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#38BDF8',
      sound: 'default',
    });
  }

  return true;
};

export const scheduleDailyReminder = async (hour: number = 9, minute: number = 0) => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  await cancelAllNotifications();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🩺 Daily Challenge Waiting!',
      body: 'Your daily diagnostic challenge is ready. Come solve a case and earn bonus points!',
      data: { screen: 'daily-challenge' },
      sound: 'default',
      badge: 1,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📚 Learning Reminder',
      body: 'Sharpen your diagnostic skills with a new case study today!',
      data: { screen: 'specialties' },
      sound: 'default',
      badge: 1,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 14,
      minute: 0,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌙 Evening Practice',
      body: 'End your day with a quick diagnostic challenge. Consistency is key!',
      data: { screen: 'cases' },
      sound: 'default',
      badge: 1,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });

  await AsyncStorage.setItem(LAST_NOTIFICATION_KEY, new Date().toISOString());
};

export const scheduleWeeklyChallengeReminder = async () => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🏆 Weekly Challenge!',
      body: 'New weekly quests are available! Complete them for exclusive rewards.',
      data: { screen: 'quests' },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1,
      hour: 9,
      minute: 0,
    },
  });
};

export const sendInstantNotification = async (title: string, body: string) => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      badge: 1,
    },
    trigger: null,
  });
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const getPendingNotifications = async () => {
  return await Notifications.getAllScheduledNotificationsAsync();
};

export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

export const getLastNotificationDate = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(LAST_NOTIFICATION_KEY);
};
