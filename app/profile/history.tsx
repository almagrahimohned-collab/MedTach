import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useStore } from '../../src/store';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const { completedCases, badges, totalPoints } = useStore();

  const stats = useMemo(() => {
    if (completedCases.length === 0) return null;
    const scores = completedCases.map(c => c.score);
    return {
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      max: Math.max(...scores),
      total: completedCases.length,
      recent: scores.slice(-10),
    };
  }, [completedCases]);

  const chartData = stats && stats.recent.length > 1 ? {
    labels: stats.recent.map((_, i) => `#${completedCases.length - stats.recent.length + i + 1}`),
    datasets: [{ data: stats.recent }],
  } : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Performance Analytics</Text>
        <Text style={styles.subtitle}>{completedCases.length} cases completed</Text>
      </View>

      {stats && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
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
            <Ionicons name="star" size={20} color="#8B5CF6" />
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>
      )}

      {chartData && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Recent Performance</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={200}
            chartConfig={{
              backgroundColor: '#0A0E1A',
              backgroundGradientFrom: '#1E293B',
              backgroundGradientTo: '#1E293B',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(56, 189, 248, ${opacity})`,
              labelColor: () => '#94A3B8',
              propsForDots: { r: '4', strokeWidth: '2', stroke: '#38BDF8' },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {badges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Badges Earned</Text>
          <View style={styles.badgeGrid}>
            {badges.map((badge, index) => (
              <View key={index} style={styles.badgeItem}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Case History</Text>
        {completedCases.length > 0 ? (
          completedCases.slice().reverse().map((c, i) => (
            <View key={i} style={styles.caseCard}>
              <View>
                <Text style={styles.caseNumber}>Case #{completedCases.length - i}</Text>
                <Text style={styles.caseDate}>
                  {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <View style={[styles.scoreBadge, { backgroundColor: c.score >= 80 ? '#10B98120' : c.score >= 50 ? '#F59E0B20' : '#EF444420' }]}>
                <Text style={[styles.scoreText, { color: c.score >= 80 ? '#10B981' : c.score >= 50 ? '#F59E0B' : '#EF4444' }]}>
                  {c.score} pts
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No cases completed yet</Text>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: { padding: 20, paddingTop: 20 },
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#94A3B8', fontSize: 13 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#1E293B', padding: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#334155', gap: 4 },
  statValue: { color: '#F8FAFC', fontSize: 18, fontWeight: '800' },
  statLabel: { color: '#94A3B8', fontSize: 10 },
  chartSection: { marginBottom: 20 },
  sectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 12, paddingHorizontal: 20 },
  chart: { borderRadius: 14, marginHorizontal: 16 },
  section: { marginBottom: 20 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 8 },
  badgeItem: { backgroundColor: '#1E293B', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#38BDF840' },
  badgeText: { color: '#E2E8F0', fontSize: 12, fontWeight: '600' },
  caseCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#1E293B', marginHorizontal: 16, padding: 14, borderRadius: 12,
    marginBottom: 6, borderWidth: 1, borderColor: '#334155',
  },
  caseNumber: { color: '#F8FAFC', fontSize: 13, fontWeight: '600', marginBottom: 2 },
  caseDate: { color: '#64748B', fontSize: 10 },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  scoreText: { fontSize: 13, fontWeight: '700' },
  emptyText: { color: '#64748B', fontSize: 13, fontStyle: 'italic', textAlign: 'center', paddingVertical: 20 },
});
