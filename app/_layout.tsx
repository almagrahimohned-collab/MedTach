import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { scheduleDailyReminder, scheduleWeeklyChallengeReminder, addNotificationResponseListener } from '../src/services/notificationService';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        await scheduleDailyReminder();
        await scheduleWeeklyChallengeReminder();
      }
      addNotificationResponseListener((response) => {
        const screen = response.notification.request.content.data?.screen;
        if (screen === 'daily-challenge') router.push('/cases');
        else if (screen === 'quests') router.push('/quests');
        else if (screen === 'specialties') router.push('/specialties');
      });
    } catch (e) {
      console.warn('Notification setup error:', e);
    }
  };

  return (
    <>
      <StatusBar style="light" backgroundColor="#0F172A" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0F172A' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth/index" />
        <Stack.Screen name="cases/index" options={{ headerShown: true, title: 'Diagnostic Room', headerStyle: { backgroundColor: '#1E293B' }, headerTintColor: '#38BDF8' }} />
        <Stack.Screen name="cases/review/[caseId]" options={{ headerShown: true, title: 'Case Review', headerStyle: { backgroundColor: '#1E293B' }, headerTintColor: '#38BDF8' }} />
        <Stack.Screen name="profile/history" options={{ headerShown: true, title: 'Medical Record', headerStyle: { backgroundColor: '#1E293B' }, headerTintColor: '#38BDF8' }} />
        <Stack.Screen name="settings/index" options={{ headerShown: true, title: 'Settings', headerStyle: { backgroundColor: '#1E293B' }, headerTintColor: '#38BDF8' }} />
        <Stack.Screen name="quests/index" options={{ headerShown: true, title: 'Quests', headerStyle: { backgroundColor: '#1E293B' }, headerTintColor: '#38BDF8' }} />
        <Stack.Screen name="about/index" options={{ headerShown: true, title: 'About', headerStyle: { backgroundColor: '#1E293B' }, headerTintColor: '#38BDF8' }} />
      </Stack>
    </>
  );
}
