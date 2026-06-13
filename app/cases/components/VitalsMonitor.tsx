import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface VitalsMonitorProps {
  vitals: Record<string, any>;
  compact?: boolean;
}

export function VitalsMonitor({ vitals = {}, compact = false }: VitalsMonitorProps) {
  const vitalConfigs: Record<string, { label: string; unit: string; color: string; warn?: (v: string) => boolean }> = {
    BP: { label: 'BP', unit: 'mmHg', color: '#e74c3c', warn: (v) => { const s = parseInt(v); return s > 140 || s < 90; } },
    HR: { label: 'HR', unit: 'bpm', color: '#e67e22', warn: (v) => parseInt(v) > 100 || parseInt(v) < 60 },
    RR: { label: 'RR', unit: '/min', color: '#2ecc71', warn: (v) => parseInt(v) > 20 || parseInt(v) < 12 },
    SpO2: { label: 'SpO2', unit: '%', color: '#3498db', warn: (v) => parseInt(v) < 95 },
    Temp: { label: 'Temp', unit: '°C', color: '#9b59b6', warn: (v) => parseFloat(v) > 38 || parseFloat(v) < 36 }
  };

  const displayVitals = Object.entries(vitals).filter(([key]) => key in vitalConfigs);

  if (displayVitals.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No vitals available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, compact && styles.compact]}>
      {displayVitals.map(([key, value]) => {
        const config = vitalConfigs[key];
        const isWarning = config.warn ? config.warn(String(value)) : false;
        return (
          <View key={key} style={[styles.vitalItem, compact && styles.vitalItemCompact]}>
            <Text style={[styles.vitalLabel, { color: config.color }]}>{config.label}</Text>
            <Text style={[styles.vitalValue, isWarning && styles.vitalWarning]}>{String(value)}</Text>
            <Text style={styles.vitalUnit}>{config.unit}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', justifyContent: 'space-around',
    padding: 12, backgroundColor: '#fff',
    borderBottomWidth: 1, borderColor: '#e0e0e0', flexWrap: 'wrap'
  },
  compact: { padding: 8, justifyContent: 'flex-start', gap: 16 },
  vitalItem: { alignItems: 'center', minWidth: 60 },
  vitalItemCompact: { minWidth: 50 },
  vitalLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  vitalValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  vitalWarning: { color: '#e74c3c', fontWeight: '900' },
  vitalUnit: { fontSize: 9, color: '#999' },
  empty: { padding: 12, alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 12 }
});

export default VitalsMonitor;
