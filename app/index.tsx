import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
      setChecking(false);
    } catch (error) {
      setChecking(false);
    }
  };

  const handleEnter = async () => {
    const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
    if (hasOnboarded === 'true') {
      router.replace('/auth');
    } else {
      router.push('/onboarding');
    }
  };

  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🩺</Text>
      </View>
      <Text style={styles.title}>MedTach</Text>
      <Text style={styles.subtitle}>AI-Powered Clinical Diagnostic Platform</Text>
      <Text style={styles.description}>
        Train your diagnostic skills with real-world cases guided by AI attending physicians.
      </Text>

      <Pressable style={styles.button} onPress={handleEnter}>
        <Text style={styles.buttonText}>Enter Platform</Text>
      </Pressable>

      <View style={styles.features}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🧠</Text>
          <Text style={styles.featureText}>AI Diagnosis</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🏆</Text>
          <Text style={styles.featureText}>Leaderboard</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📊</Text>
          <Text style={styles.featureText}>Analytics</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  icon: {
    fontSize: 44,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#38BDF8',
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#38BDF8',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
  },
  features: {
    flexDirection: 'row',
    gap: 30,
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
});
