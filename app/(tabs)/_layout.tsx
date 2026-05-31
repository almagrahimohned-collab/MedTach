import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#38BDF8' }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="specialties" options={{ title: 'Cases', tabBarIcon: ({color}) => <Ionicons name="medkit" size={24} color={color} /> }} />
    </Tabs>
  );
}
