import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../../src/store';
import {
  scheduleDailyReminder,
  scheduleWeeklyReminder,
  cancelAllNotifications,
  requestPermissions,
} from '../../src/services/notificationService';

export default function SettingsScreen() {
  const router = useRouter();
  const { completedCases, badges } = useStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setNotificationsEnabled(parsed.notificationsEnabled ?? false);
        setDarkMode(parsed.darkMode ?? true);
      }
    } catch { }
  };

  const saveSettings = async (key: string, value: any) => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      const parsed = settings ? JSON.parse(settings) : {};
      parsed[key] = value;
      await AsyncStorage.setItem('appSettings', JSON.stringify(parsed));
    } catch { }
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    saveSettings('notificationsEnabled', value);

    if (value) {
      const granted = await requestPermissions();
      if (granted) {
        await scheduleDailyReminder();
        await scheduleWeeklyReminder();
        Alert.alert('✅ Notifications Enabled', 'You will receive daily reminders at 9 AM, 2 PM, and 8 PM.');
      } else {
        setNotificationsEnabled(false);
        Alert.alert('Permission Required', 'Please enable notifications in your device settings.');
      }
    } else {
      await cancelAllNotifications();
      Alert.alert('Notifications Disabled', 'You will no longer receive reminders.');
    }
  };

  const handleClearData = () => {
    Alert.alert('Clear All Data', 'This will delete all progress. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => { await AsyncStorage.clear(); router.replace('/'); } },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#94A3B8" />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={20} color="#F59E0B" />
            <View>
              <Text style={styles.settingLabel}>Daily Reminders</Text>
              <Text style={styles.settingDesc}>9 AM, 2 PM, 8 PM</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: '#334155', true: '#38BDF840' }}
            thumbColor={notificationsEnabled ? '#38BDF8' : '#94A3B8'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APPEARANCE</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon" size={20} color="#8B5CF6" />
            <Text style={styles.settingLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={(v) => { setDarkMode(v); saveSettings('darkMode', v); }}
            trackColor={{ false: '#334155', true: '#38BDF840' }}
            thumbColor={darkMode ? '#38BDF8' : '#94A3B8'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>STATISTICS</Text>
        <View style={styles.statRow}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.statLabel}>Cases Completed</Text>
          <Text style={styles.statValue}>{completedCases.length}</Text>
        </View>
        <View style={styles.statRow}>
          <Ionicons name="ribbon" size={18} color="#F59E0B" />
          <Text style={styles.statLabel}>Badges Earned</Text>
          <Text style={styles.statValue}>{badges.length}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <Pressable style={styles.actionBtn} onPress={handleClearData}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text style={[styles.actionText, { color: '#EF4444' }]}>Clear All Data</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => router.push('/about')}>
          <Ionicons name="information-circle-outline" size={18} color="#38BDF8" />
          <Text style={[styles.actionText, { color: '#38BDF8' }]}>About MedTach</Text>
        </Pressable>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 14, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  title: { color: '#F8FAFC', fontSize: 22, fontWeight: '700' },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  sectionTitle: { color: '#64748B', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 14 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingLabel: { color: '#F8FAFC', fontSize: 15 },
  settingDesc: { color: '#64748B', fontSize: 11, marginTop: 2 },
  statRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  statLabel: { color: '#E2E8F0', flex: 1, fontSize: 14 },
  statValue: { color: '#38BDF8', fontSize: 16, fontWeight: '700' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  actionText: { fontSize: 15, fontWeight: '600' },
});
