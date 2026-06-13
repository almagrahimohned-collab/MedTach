import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { setupAutoSync } from "../src/services/offlineQueue";
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { requestPermissions, scheduleDailyReminder, scheduleWeeklyReminder, addNotificationListener } from '../src/services/notificationService';

function BackButton() {
  const router = useRouter();
  return (
    <Pressable style={styles.backBtn} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
    </Pressable>
  );
}

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
  useEffect(() => {
    const unsubscribe = setupAutoSync();
    return () => unsubscribe();
  }, []);
      const granted = await requestPermissions();
      if (granted) { await scheduleDailyReminder(); await scheduleWeeklyReminder(); }
      addNotificationListener((response) => {
        const screen = response.notification.request.content.data?.screen;
        if (screen) router.push(`/${screen}`);
      });
    })();
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor="#0A0E1A" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0E1A' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth/index" />
        <Stack.Screen name="cases/index" options={{ headerShown: true, title: 'Diagnostic Room', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerTitleStyle: { fontWeight: '700', fontSize: 16, textAlign: 'center' }, headerTitleAlign: 'center', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="specialties/details" options={{ headerShown: true, title: 'Select Level', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="cases/review/[caseId]" options={{ headerShown: true, title: 'Case Review', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="profile/history" options={{ headerShown: true, title: 'Analytics', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="profile/edit" options={{ headerShown: true, title: 'Edit Profile', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="profile/upgrade" options={{ headerShown: true, title: 'Upgrade', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="settings/index" options={{ headerShown: true, title: 'Settings', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="quests/index" options={{ headerShown: true, title: 'Quests', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="question-bank/index" options={{ headerShown: true, title: 'Question Bank', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="about/index" options={{ headerShown: true, title: 'About', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="icu-sim/ICUSimulator" options={{ headerShown: true, title: 'ICU Simulator', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="flashcards/index" options={{ headerShown: true, title: 'Flashcards', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="osce-sim/index" options={{ headerShown: true, title: 'OSCE Simulator', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="image-challenge/index" options={{ headerShown: true, title: 'Image Challenge', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="community/index" options={{ headerShown: true, title: 'Community', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
        <Stack.Screen name="resident-life/index" options={{ headerShown: true, title: 'Resident Life', headerStyle: { backgroundColor: '#1A1F2E' }, headerTintColor: '#38BDF8', headerLeft: () => <BackButton /> }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
});
