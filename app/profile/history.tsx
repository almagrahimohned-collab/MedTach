import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, Pressable } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useStore } from '../../src/store';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const { completedCases, badges, totalPoints, getAccuracy } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'week' | 'month'>('all');

  const filteredCases = useMemo(() => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return completedCases.filter(c => new Date(c.date) >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return completedCases.filter(c => new Date(c.date) >= monthAgo);
      default:
        return completedCases;
    }
  }, [completedCases, selectedPeriod]);

  const chartData = useMemo(() => {
    if (filteredCases.length === 0) return null;
    
    const labels = filteredCases.map((_, i) => `#${i + 1}`);
    const scores = filteredCases.map(c => c.score);
    
    if (labels.length > 10) {
      const step = Math.floor(labels.length / 8);
      return {
        labels: labels.filter((_, i) => i % step === 0),
        scores: scores,
      };
    }
    
    return { labels, scores };
  }, [filteredCases]);

  const stats = useMemo(() => {
    if (filteredCases.length === 0) return null;
    
    const scores = filteredCases.map(c => c.score);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const highScores = scores.filter(s => s >= 80).length;
    
    return { avg, max, min, highScores, total: filteredCases.length };
  }, [filteredCases]);

  const specialtystats = useMemo(() => {
    const specialties: Record<string, number> = {};
    filteredCases.forEach(c => {
      const spec = c.caseId?.split('_')[0] || 'Unknown';
      specialties[spec] = (specialties[spec] || 0) + 1;
    });
    return Object.entries(specialties).sort((a, b) => b[1] - a[1]);
  }, [filteredCases]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Medical Record</Text>
        <Text style={styles.subtitle}>Your diagnostic performance analytics</Text>
      </View>

      <View style={styles.periodSelector}>
        {(['all', 'week', 'month'] as const).map((period) => (
          <Pressable
            key={period}
            style={[styles.periodBtn, selectedPeriod === period && styles.periodBtnActive]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>
              {period === 'all' ? 'All Time' : period === 'week' ? 'This Week' : 'This Month'}
            </Text>
          </Pressable>
        ))}
      </View>

      {stats && (
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Cases</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="analytics" size={20} color="#38BDF8" />
            <Text style={styles.statValue}>{stats.avg}%</Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={20} color="#F59E0B" />
            <Text style={styles.statValue}>{stats.max}</Text>
            <Text style={styles.statLabel}>Best</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={20} color="#8B5CF6" />
            <Text style={styles.statValue}>{stats.highScores}</Text>
            <Text style={styles.statLabel}>≥80%</Text>
          </View>
        </View>
      )}

      {chartData && chartData.labels.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Performance Trend</Text>
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [{ data: chartData.scores.length > 0 ? chartData.scores : [0] }],
            }}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#0F172A',
              backgroundGradientFrom: '#1E293B',
              backgroundGradientTo: '#1E293B',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(56, 189, 248, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#38BDF8',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {specialtystats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By Specialty</Text>
          {specialtystats.map(([spec, count]) => (
            <View key={spec} style={styles.specialtyRow}>
              <Text style={styles.specialtyName}>{spec}</Text>
              <View style={styles.specialtyBar}>
                <View 
                  style={[
                    styles.specialtyFill, 
                    { width: `${Math.min(100, (count / specialtystats[0][1]) * 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.specialtyCount}>{count}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Badge Cabinet</Text>
        {badges.length > 0 ? (
          <View style={styles.badgeGrid}>
            {badges.map((badge, index) => (
              <View key={index} style={styles.badgeItem}>
                <Text style={styles.badgeEmoji}>{badge.split(' ')[0]}</Text>
                <Text style={styles.badgeText}>{badge.split(' ').slice(1).join(' ')}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="ribbon-outline" size={40} color="#334155" />
            <Text style={styles.emptyText}>No badges earned yet</Text>
            <Text style={styles.emptySubtext}>Complete cases to earn achievements</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Cases</Text>
        {filteredCases.length > 0 ? (
          filteredCases.slice(-10).reverse().map((c, i) => (
            <View key={i} style={styles.caseCard}>
              <View style={styles.caseInfo}>
                <Text style={styles.caseNumber}>Case #{completedCases.indexOf(c) + 1}</Text>
                <Text style={styles.caseDate}>
                  {new Date(c.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <View style={styles.caseScoreBox}>
                <Text style={[
                  styles.caseScore,
                  { color: c.score >= 80 ? '#10B981' : c.score >= 50 ? '#F59E0B' : '#EF4444' }
                ]}>
                  {c.score} pts
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={40} color="#334155" />
            <Text style={styles.emptyText}>No cases completed</Text>
            <Text style={styles.emptySubtext}>Start diagnosing to build your record</Text>
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 20, paddingBottom: 12 },
  title: { color: '#F8FAFC', fontSize: 28, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#94A3B8', fontSize: 14 },

  periodSelector: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 20 },
  periodBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  periodBtnActive: { backgroundColor: '#38BDF820', borderColor: '#38BDF8' },
  periodText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  periodTextActive: { color: '#38BDF8' },

  statsGrid: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#1E293B', padding: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  statValue: { color: '#F8FAFC', fontSize: 20, fontWeight: '800', marginTop: 8 },
  statLabel: { color: '#94A3B8', fontSize: 10, marginTop: 2 },

  chartSection: { marginBottom: 24 },
  sectionTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 14, paddingHorizontal: 20 },
  chart: { borderRadius: 16, marginHorizontal: 16 },

  section: { marginBottom: 24 },
  specialtyRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10, gap: 10 },
  specialtyName: { color: '#E2E8F0', fontSize: 12, width: 80, fontWeight: '500' },
  specialtyBar: { flex: 1, height: 6, backgroundColor: '#334155', borderRadius: 3, overflow: 'hidden' },
  specialtyFill: { height: '100%', backgroundColor: '#38BDF8', borderRadius: 3 },
  specialtyCount: { color: '#94A3B8', fontSize: 12, fontWeight: '600', width: 30, textAlign: 'right' },

  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 10 },
  badgeItem: { backgroundColor: '#1E293B', padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#38BDF830', width: '30%' },
  badgeEmoji: { fontSize: 28, marginBottom: 4 },
  badgeText: { color: '#E2E8F0', fontSize: 10, fontWeight: '600', textAlign: 'center' },

  emptyState: { alignItems: 'center', paddingVertical: 30 },
  emptyText: { color: '#94A3B8', fontSize: 14, fontWeight: '600', marginTop: 10 },
  emptySubtext: { color: '#64748B', fontSize: 12, marginTop: 4 },

  caseCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E293B', marginHorizontal: 20, padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  caseInfo: { flex: 1 },
  caseNumber: { color: '#F8FAFC', fontSize: 14, fontWeight: '600', marginBottom: 2 },
  caseDate: { color: '#64748B', fontSize: 11 },
  caseScoreBox: { backgroundColor: '#0F172A', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  caseScore: { fontSize: 14, fontWeight: '700' },
});
