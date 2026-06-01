import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { scheduleDailyReminder, scheduleWeeklyChallengeReminder, addNotificationResponseListener } from '../src/services/notificationService';

SplashScreen.preventAutoHideAsync();

function CustomSplash({ onFinish }: { onFinish: () => void }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 }
      ),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
      <Animated.View
        style={[
          styles.splashContent,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Animated.View
          style={[
            styles.splashIconBox,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Text style={styles.splashEmoji}>🩺</Text>
        </Animated.View>
        <Text style={styles.splashTitle}>MedTach</Text>
        <Text style={styles.splashSubtitle}>Clinical Diagnostic Platform</Text>
        <View style={styles.splashLoader}>
          <View style={styles.splashLoaderBar} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export default function RootLayout() {
  const router = useRouter();
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await setupNotifications();
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn('Error preparing app:', e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onSplashFinish = useCallback(async () => {
    setIsSplashDone(true);
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (appIsReady && isSplashDone) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, isSplashDone]);

  const setupNotifications = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        await scheduleDailyReminder();
        await scheduleWeeklyChallengeReminder();
      }

      addNotificationResponseListener((response) => {
        const screen = response.notification.request.content.data?.screen;
        if (screen === 'daily-challenge') {
          router.push('/cases');
        } else if (screen === 'quests') {
          router.push('/quests');
        } else if (screen === 'specialties') {
          router.push('/specialties');
        }
      });
    } catch (e) {
      console.warn('Notification setup error:', e);
    }
  };

  if (!isSplashDone) {
    return <CustomSplash onFinish={onSplashFinish} />;
  }

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

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
    gap: 16,
  },
  splashIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
    marginBottom: 8,
  },
  splashEmoji: {
    fontSize: 44,
  },
  splashTitle: {
    color: '#F8FAFC',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1,
  },
  splashSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  splashLoader: {
    width: 120,
    height: 3,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    marginTop: 20,
    overflow: 'hidden',
  },
  splashLoaderBar: {
    width: '60%',
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
});
