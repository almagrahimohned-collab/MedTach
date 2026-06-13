import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MetricScore {
  label: string;
  score: number; // 0-100
  icon: string;
}

interface PerformanceHeatmapProps {
  metrics: MetricScore[];
}

export default function PerformanceHeatmap({ metrics }: PerformanceHeatmapProps) {
  const getColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green - Excellent
    if (score >= 60) return '#F59E0B'; // Yellow - Good
    if (score >= 40) return '#F97316'; // Orange - Fair
    return '#EF4444'; // Red - Poor
  };

  const getLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Performance Analysis</Text>
      
      {metrics.map((metric, i) => {
        const color = getColor(metric.score);
        return (
          <View key={i} style={styles.row}>
            <View style={styles.labelBox}>
              <Text style={styles.icon}>{metric.icon}</Text>
              <Text style={styles.label}>{metric.label}</Text>
            </View>
            
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${metric.score}%`, backgroundColor: color }]} />
            </View>
            
            <View style={[styles.scoreBox, { backgroundColor: color + '20' }]}>
              <Text style={[styles.score, { color }]}>{metric.score}%</Text>
            </View>
            
            <View style={[styles.badge, { backgroundColor: color + '30' }]}>
              <Text style={[styles.badgeText, { color }]}>{getLabel(metric.score)}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 100,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  scoreBox: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    minWidth: 42,
    alignItems: 'center',
  },
  score: {
    fontSize: 12,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    width: 80,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
