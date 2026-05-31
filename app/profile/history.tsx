import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useStore } from '../../src/store';

export default function HistoryScreen() {
  const { completedCases, badges } = useStore();
  
  // تحضير البيانات للرسم البياني
  const labels = completedCases.map((_, index) => (index + 1).toString());
  const dataPoints = completedCases.length > 0 ? completedCases.map(c => c.score) : [0];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Performance History</Text>
      
      {completedCases.length > 0 ? (
        <LineChart
          data={{
            labels: labels,
            datasets: [{ data: dataPoints }]
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
          }}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noData}>No cases completed yet.</Text>
      )}

      {/* خزانة الأوسمة */}
      <Text style={styles.sectionTitle}>🏆 Badge Cabinet</Text>
      <View style={styles.badgeGrid}>
        {badges.length > 0 ? (
          badges.map((badge, index) => (
            <View key={index} style={styles.badgeItem}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noBadges}>No badges earned yet. Keep diagnosing!</Text>
        )}
      </View>

      {/* قائمة الحالات السابقة */}
      <View style={styles.statsContainer}>
        {completedCases.map((c, i) => (
          <View key={i} style={styles.statItem}>
            <Text style={styles.statText}>Case #{i + 1}</Text>
            <Text style={styles.statScore}>{c.score} Pts</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  sectionTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
  chart: { borderRadius: 16, marginVertical: 8 },
  noData: { color: '#94A3B8', textAlign: 'center', marginTop: 20, marginBottom: 20 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeItem: { backgroundColor: '#1E293B', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#38BDF8' },
  badgeText: { color: '#F8FAFC', fontWeight: 'bold' },
  noBadges: { color: '#94A3B8', fontStyle: 'italic' },
  statsContainer: { marginTop: 20, marginBottom: 40 },
  statItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#1E293B', borderRadius: 8, marginBottom: 8 },
  statText: { color: '#F8FAFC' },
  statScore: { color: '#10B981', fontWeight: 'bold' }
});
