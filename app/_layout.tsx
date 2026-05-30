import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/*StatusBar باللون الفاتح ليناسب الثيم المظلم */}
      <StatusBar style="light" />
      
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F172A', // لون الخلفية المظلم (Slate 900)
          },
          headerTintColor: '#38BDF8', // اللون الأزرق الطبي للأزرار والنصوص (Sky 400)
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#0F172A', // تطبيق الثيم المظلم على كل الشاشات تلقائياً
          },
        }}
      >
        {/* تعريف الشاشات ومساراتها */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/index" options={{ title: 'تسجيل الدخول' }} />
        <Stack.Screen name="specialties/index" options={{ title: 'التخصصات الطبية' }} />
        <Stack.Screen name="cases/index" options={{ title: 'غرفة التشخيص' }} />
        <Stack.Screen name="settings/index" options={{ title: 'الإعدادات' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
