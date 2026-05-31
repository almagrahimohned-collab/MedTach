import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store';

export default function Dashboard() {
  const router = useRouter();
  const { completedCases } = useStore();

  const avgScore = completedCases.length > 0
    ? Math.round(completedCases.reduce((acc, c) => acc + c.score, 0) / completedCases.length)
    : 100;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Welcome, Doctor</Text>

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

      <Text style={styles.sectionTitle}>Continue Learning</Text>
      <Pressable style={styles.actionBtn} onPress={() => router.push('/specialties')}>
        <Text style={styles.actionBtnText}>Start New Diagnostic Case</Text>
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
  actionBtn: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  actionBtnText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: { backgroundColor: '#334155' },
  secondaryBtnText: { color: '#38BDF8', fontWeight: 'bold', fontSize: 16 }
});
