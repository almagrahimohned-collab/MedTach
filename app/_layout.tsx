import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0F172A" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0F172A' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="cases/index" options={{ headerShown: true, title: 'Diagnostic Room', headerStyle: { backgroundColor: '#1E293B' }, headerTintColor: '#38BDF8' }} />
        <Stack.Screen name="profile/history" options={{ headerShown: true, title: 'Medical Record', headerStyle: { backgroundColor: '#1E293B' }, headerTintColor: '#38BDF8' }} />
      </Stack>
    </>
  );
}
