import { Stack } from 'expo-router';

export default function ICULayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="play" />
      <Stack.Screen name="ICUSimulator" />
    </Stack>
  );
}
