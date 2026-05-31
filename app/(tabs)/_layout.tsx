import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarStyle: { backgroundColor: '#0F172A', borderTopColor: '#1E293B' },
      tabBarActiveTintColor: '#38BDF8',
      headerShown: false 
    }}>
      <Tabs.Screen name="specialties" options={{ title: 'Cases', tabBarIcon: ({ color }) => <Ionicons name="medical" size={24} color={color} /> }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Rank', tabBarIcon: ({ color }) => <Ionicons name="trophy" size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}
