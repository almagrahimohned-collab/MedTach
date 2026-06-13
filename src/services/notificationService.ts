import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export async function requestPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('Notifications only work on physical devices');
    return false;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }

  if (final !== 'granted') {
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

    await Notifications.setNotificationChannelAsync('achievements', {
      name: 'Achievements',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }

  return true;
}

export async function scheduleDailyReminder(hour = 9, minute = 0) {
  await cancelAllNotifications();

  // تذكير الصباح
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🩺 Daily Challenge Waiting!',
      body: 'Your daily diagnostic challenge is ready. Solve a case and earn bonus points!',
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

  // تذكير الظهر
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📚 Learning Reminder',
      body: 'Take a break and sharpen your diagnostic skills with a new case!',
      data: { screen: 'specialties' },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 14,
      minute: 0,
    },
  });

  // تذكير المساء
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌙 Evening Practice',
      body: 'End your day with a quick diagnostic challenge. Consistency is key!',
      data: { screen: 'cases' },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });

  await AsyncStorage.setItem(LAST_NOTIFICATION_KEY, new Date().toISOString());
}

export async function scheduleWeeklyReminder() {
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
}

export async function sendInstantNotification(title: string, body: string) {
  const hasPermission = await requestPermissions();
  if (!hasPermission) return;

  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: 'default', badge: 1 },
    trigger: null,
  });
}

export async function sendBadgeNotification(badge: string) {
  await sendInstantNotification(
    '🏆 New Badge Earned!',
    `Congratulations! You earned: ${badge}`
  );
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function addNotificationListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

export async function getBadgeCount(): Promise<number> {
  const notifications = await Notifications.getBadgeCountAsync();
  return notifications;
}

export async function clearBadge() {
  await Notifications.setBadgeCountAsync(0);
}
