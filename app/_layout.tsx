import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0F172A' },
          headerTintColor: '#38BDF8',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#0F172A' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/index" options={{ title: 'Login' }} />
        <Stack.Screen name="specialties/index" options={{ title: 'Specialties' }} />
        <Stack.Screen name="specialties/details" options={{ title: 'Configure Session' }} />
        <Stack.Screen name="cases/index" options={{ title: 'Diagnostic Room' }} />
        <Stack.Screen name="profile/index" options={{ title: 'My Profile' }} />
        <Stack.Screen name="leaderboard/index" options={{ title: 'Leaderboard' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
