import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store';

export default function Dashboard() {
  const router = useRouter();
  const { completedCases, score } = useStore();
  const [timeLeft, setTimeLeft] = useState('');

  // منطق المؤقت التنازلي لمنتصف الليل
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const avgScore = completedCases.length > 0
    ? Math.round(completedCases.reduce((acc, c) => acc + c.score, 0) / completedCases.length)
    : 100;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Welcome, Doctor</Text>

      {/* قسم الإحصائيات */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg Score</Text>
          <Text style={styles.statValue}>{avgScore}%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Cases Solved</Text>
          <Text style={styles.statValue}>{completedCases.length}</Text>
        </View>
      </View>

      {/* قسم التحدي اليومي */}
      <View style={styles.challengeCard}>
        <Text style={styles.challengeTitle}>🔥 Daily Challenge</Text>
        <Text style={styles.challengeDesc}>Ends in: {timeLeft}</Text>
        <Pressable style={styles.challengeBtn} onPress={() => router.push('/cases')}>
          <Text style={styles.challengeBtnText}>Start Challenge</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>General Practice</Text>
      <Pressable style={styles.actionBtn} onPress={() => router.push('/specialties')}>
        <Text style={styles.actionBtnText}>Choose Specialty</Text>
      </Pressable>

      <Pressable style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/profile/history')}>
        <Text style={styles.secondaryBtnText}>View Medical Record & Analytics</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 20 },
  header: { color: '#F8FAFC', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, width: '48%', alignItems: 'center' },
  statLabel: { color: '#94A3B8', fontSize: 12 },
  statValue: { color: '#38BDF8', fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  sectionTitle: { color: '#F8FAFC', fontSize: 18, marginBottom: 12 },
  challengeCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#10B981' },
  challengeTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold' },
  challengeDesc: { color: '#38BDF8', marginVertical: 8, fontWeight: '600' },
  challengeBtn: { backgroundColor: '#10B981', padding: 12, borderRadius: 8, alignItems: 'center' },
  challengeBtnText: { color: '#0F172A', fontWeight: 'bold' },
  actionBtn: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  actionBtnText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: { backgroundColor: '#334155' },
  secondaryBtnText: { color: '#38BDF8', fontWeight: 'bold', fontSize: 16 }
});
