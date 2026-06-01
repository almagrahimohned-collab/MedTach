import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../../src/store';
import {
  scheduleDailyReminder,
  scheduleWeeklyChallengeReminder,
  cancelAllNotifications,
  requestNotificationPermissions,
} from '../../src/services/notificationService';

export default function SettingsScreen() {
  const router = useRouter();
  const { completedCases, badges } = useStore();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [aiModel, setAiModel] = useState('auto');
  const [darkMode, setDarkMode] = useState(true);
  const [morningReminder, setMorningReminder] = useState(true);
  const [eveningReminder, setEveningReminder] = useState(true);
  const [weeklyReminder, setWeeklyReminder] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setSoundEnabled(parsed.soundEnabled ?? true);
        setNotificationsEnabled(parsed.notificationsEnabled ?? true);
        setAiModel(parsed.aiModel ?? 'auto');
        setDarkMode(parsed.darkMode ?? true);
        setMorningReminder(parsed.morningReminder ?? true);
        setEveningReminder(parsed.eveningReminder ?? true);
        setWeeklyReminder(parsed.weeklyReminder ?? true);
      }
    } catch (error) {
      console.log('Error loading settings');
    }
  };

  const saveSettings = async (key: string, value: any) => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      const parsed = settings ? JSON.parse(settings) : {};
      parsed[key] = value;
      await AsyncStorage.setItem('appSettings', JSON.stringify(parsed));
    } catch (error) {
      console.log('Error saving settings');
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    saveSettings('notificationsEnabled', value);

    if (value) {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleDailyReminder();
        if (weeklyReminder) {
          await scheduleWeeklyChallengeReminder();
        }
        Alert.alert('Notifications Enabled', 'You will receive daily reminders.');
      } else {
        setNotificationsEnabled(false);
        Alert.alert('Permission Required', 'Please enable notifications in your device settings.');
      }
    } else {
      await cancelAllNotifications();
    }
  };

  const handleToggleMorning = async (value: boolean) => {
    setMorningReminder(value);
    saveSettings('morningReminder', value);
    if (notificationsEnabled) {
      await scheduleDailyReminder(value ? 9 : 14);
    }
  };

  const handleToggleEvening = async (value: boolean) => {
    setEveningReminder(value);
    saveSettings('eveningReminder', value);
  };

  const handleToggleWeekly = async (value: boolean) => {
    setWeeklyReminder(value);
    saveSettings('weeklyReminder', value);
    if (value) {
      await scheduleWeeklyChallengeReminder();
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your progress, badges, and cases. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Data Cleared', 'All app data has been reset.');
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('userData');
          router.replace('/auth');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#94A3B8" />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
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
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={20} color="#F59E0B" />
            <Text style={styles.settingLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: '#334155', true: '#38BDF840' }}
            thumbColor={notificationsEnabled ? '#38BDF8' : '#94A3B8'}
          />
        </View>

        {notificationsEnabled && (
          <>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="sunny" size={20} color="#F59E0B" />
                <View>
                  <Text style={styles.settingLabel}>Morning Reminder</Text>
                  <Text style={styles.settingDesc}>Daily at 9:00 AM</Text>
                </View>
              </View>
              <Switch
                value={morningReminder}
                onValueChange={handleToggleMorning}
                trackColor={{ false: '#334155', true: '#38BDF840' }}
                thumbColor={morningReminder ? '#38BDF8' : '#94A3B8'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="moon" size={20} color="#8B5CF6" />
                <View>
                  <Text style={styles.settingLabel}>Evening Reminder</Text>
                  <Text style={styles.settingDesc}>Daily at 8:00 PM</Text>
                </View>
              </View>
              <Switch
                value={eveningReminder}
                onValueChange={handleToggleEvening}
                trackColor={{ false: '#334155', true: '#38BDF840' }}
                thumbColor={eveningReminder ? '#38BDF8' : '#94A3B8'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="calendar" size={20} color="#10B981" />
                <View>
                  <Text style={styles.settingLabel}>Weekly Challenges</Text>
                  <Text style={styles.settingDesc}>Every Monday</Text>
                </View>
              </View>
              <Switch
                value={weeklyReminder}
                onValueChange={handleToggleWeekly}
                trackColor={{ false: '#334155', true: '#38BDF840' }}
                thumbColor={weeklyReminder ? '#38BDF8' : '#94A3B8'}
              />
            </View>
          </>
        )}
<Pressable style={styles.actionBtn} onPress={() => router.push('/about')}>
  <Ionicons name="information-circle-outline" size={20} color="#38BDF8" />
  <Text style={[styles.actionBtnText, { color: '#38BDF8' }]}>About MedTach</Text>
</Pressable>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="volume-high" size={20} color="#10B981" />
            <Text style={styles.settingLabel}>Sound Effects</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={(v) => { setSoundEnabled(v); saveSettings('soundEnabled', v); }}
            trackColor={{ false: '#334155', true: '#38BDF840' }}
            thumbColor={soundEnabled ? '#38BDF8' : '#94A3B8'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Model</Text>
        
        {['auto', 'claude', 'gemini', 'llama'].map((model) => (
          <Pressable
            key={model}
            style={styles.settingRow}
            onPress={() => { setAiModel(model); saveSettings('aiModel', model); }}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="hardware-chip" size={20} color="#38BDF8" />
              <View>
                <Text style={styles.settingLabel}>
                  {model === 'auto' ? 'Auto (Best Available)' :
                   model === 'claude' ? 'Claude 3.5 Sonnet' :
                   model === 'gemini' ? 'Gemini 2.0 Flash' :
                   'Llama 3.1 405B'}
                </Text>
                <Text style={styles.settingDesc}>
                  {model === 'auto' ? 'Automatically select best model' :
                   model === 'claude' ? 'Anthropic - Most accurate' :
                   model === 'gemini' ? 'Google - Fastest' :
                   'Meta - Open source'}
                </Text>
              </View>
            </View>
            <View style={[styles.radio, aiModel === model && styles.radioSelected]}>
              {aiModel === model && <View style={styles.radioInner} />}
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        
        <View style={styles.statItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.settingLabel}>Cases Completed</Text>
          </View>
          <Text style={styles.statValue}>{completedCases.length}</Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="ribbon" size={20} color="#F59E0B" />
            <Text style={styles.settingLabel}>Badges Earned</Text>
          </View>
          <Text style={styles.statValue}>{badges.length}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <Pressable style={styles.actionBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Logout</Text>
        </Pressable>

        <Pressable style={styles.actionBtn} onPress={handleClearData}>
          <Ionicons name="trash-outline" size={20} color="#F97316" />
          <Text style={[styles.actionBtnText, { color: '#F97316' }]}>Clear All Data</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>MedTach v1.0.0</Text>
        <Text style={styles.copyright}>© 2025 MedTach. All rights reserved.</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: { padding: 4 },
  title: { color: '#F8FAFC', fontSize: 22, fontWeight: '700' },

  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  sectionTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },

  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingLabel: { color: '#F8FAFC', fontSize: 15, fontWeight: '500' },
  settingDesc: { color: '#64748B', fontSize: 11, marginTop: 2 },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { borderColor: '#38BDF8' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#38BDF8' },

  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: { color: '#38BDF8', fontSize: 18, fontWeight: '700' },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  actionBtnText: { fontSize: 15, fontWeight: '600' },

  footer: { alignItems: 'center', padding: 30 },
  version: { color: '#64748B', fontSize: 13, fontWeight: '500' },
  copyright: { color: '#475569', fontSize: 11, marginTop: 4 },
});
