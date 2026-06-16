import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { clinicalReasoningEngine } from '../../src/engines/clinicalReasoningEngine';

export default function ReasoningScreen() {
  const router = useRouter();
  const analytics = useMemo(() => clinicalReasoningEngine.getAnalytics(), []);
  const recentCases = useMemo(() => clinicalReasoningEngine.getRecentCases(10), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#94A3B8" />
        </Pressable>
        <Text style={styles.title}>Clinical Reasoning</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Efficiency Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Reasoning Efficiency</Text>
          <Text style={styles.scoreValue}>{analytics.reasoningEfficiency}%</Text>
          <View style={styles.scoreBar}>
            <View style={[styles.scoreFill, { width: `${analytics.reasoningEfficiency}%` }]} />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="bulb" size={22} color="#F59E0B" />
            <Text style={styles.statValue}>{analytics.avgHypothesesGenerated}</Text>
            <Text style={styles.statLabel}>Hypotheses/Case</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flask" size={22} color="#38BDF8" />
            <Text style={styles.statValue}>{analytics.avgInvestigationsOrdered}</Text>
            <Text style={styles.statLabel}>Tests/Case</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={22} color="#10B981" />
            <Text style={styles.statValue}>{analytics.diagnosticAccuracy}%</Text>
            <Text style={styles.statLabel}>Diagnostic Accuracy</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="medkit" size={22} color="#8B5CF6" />
            <Text style={styles.statValue}>{analytics.managementAccuracy}%</Text>
            <Text style={styles.statLabel}>Management</Text>
          </View>
        </View>

        {/* Strengths */}
        {analytics.strengths.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ Strengths</Text>
            {analytics.strengths.map((s, i) => (
              <View key={i} style={styles.strengthItem}>
                <Ionicons name="star" size={16} color="#10B981" />
                <Text style={styles.strengthText}>{s}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Weaknesses */}
        {analytics.weaknesses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔴 Areas for Improvement</Text>
            {analytics.weaknesses.map((w, i) => (
              <View key={i} style={styles.weakItem}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.weakText}>{w}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recent Cases */}
        {recentCases.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Recent Cases</Text>
            {recentCases.map((c, i) => (
              <View key={i} style={styles.caseCard}>
                <View style={styles.caseHeader}>
                  <Text style={styles.caseId}>{c.caseId}</Text>
                  <Text style={[styles.caseResult, { color: c.isCorrect ? '#10B981' : '#EF4444' }]}>
                    {c.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                  </Text>
                </View>
                <View style={styles.caseSteps}>
                  {c.events.filter(e => e.step === 'hypothesis').length > 0 && (
                    <Text style={styles.stepText}>
                      💡 {c.events.filter(e => e.step === 'hypothesis').length} hypotheses
                    </Text>
                  )}
                  {c.events.filter(e => e.step === 'investigation').length > 0 && (
                    <Text style={styles.stepText}>
                      🔬 {c.events.filter(e => e.step === 'investigation').length} investigations
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {recentCases.length === 0 && (
          <View style={styles.emptyCard}>
            <Ionicons name="brain" size={60} color="#334155" />
            <Text style={styles.emptyTitle}>No reasoning data yet</Text>
            <Text style={styles.emptySub}>Complete clinical cases to see your reasoning patterns</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 20, backgroundColor: '#1A1F2E', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#F8FAFC', fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center' },
  content: { flex: 1, padding: 16 },

  scoreCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  scoreLabel: { color: '#94A3B8', fontSize: 13, marginBottom: 4 },
  scoreValue: { color: '#38BDF8', fontSize: 48, fontWeight: '900' },
  scoreBar: { width: '100%', height: 8, backgroundColor: '#334155', borderRadius: 4, marginTop: 8 },
  scoreFill: { height: '100%', backgroundColor: '#38BDF8', borderRadius: 4 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { width: '47%', backgroundColor: '#1E293B', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155', gap: 6 },
  statValue: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  statLabel: { color: '#94A3B8', fontSize: 11, textAlign: 'center' },

  section: { marginBottom: 20 },
  sectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  strengthItem: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#10B98110', padding: 10, borderRadius: 8, marginBottom: 4 },
  strengthText: { color: '#10B981', fontSize: 13 },
  weakItem: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#EF444410', padding: 10, borderRadius: 8, marginBottom: 4 },
  weakText: { color: '#EF4444', fontSize: 13 },

  caseCard: { backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  caseHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  caseId: { color: '#F8FAFC', fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  caseResult: { fontSize: 13, fontWeight: '700' },
  caseSteps: { flexDirection: 'row', gap: 12 },
  stepText: { color: '#94A3B8', fontSize: 11 },

  emptyCard: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700' },
  emptySub: { color: '#94A3B8', fontSize: 14, textAlign: 'center' },
});
