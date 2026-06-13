import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PhaseIndicatorProps {
  phase: string;
  patientState: string;
  timeElapsed: number;
  score?: number;
}

export function PhaseIndicator({ phase = 'history', patientState = 'INITIAL', timeElapsed = 0, score }: PhaseIndicatorProps) {
  const phases = ['history', 'examination', 'investigations', 'diagnosis', 'treatment', 'complete'];
  const currentIndex = phases.indexOf(phase);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.floor(Math.abs(seconds) % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.phases}>
        {phases.map((p, i) => (
          <View key={p} style={styles.phaseItem}>
            <View style={[
              styles.phaseDot,
              i < currentIndex && styles.phaseDone,
              i === currentIndex && styles.phaseActive
            ]} />
            {i < phases.length - 1 && (
              <View style={[styles.phaseLine, i < currentIndex && styles.phaseLineDone]} />
            )}
          </View>
        ))}
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{`Phase: ${String(phase)}`}</Text>
        <Text style={styles.infoText}>{`State: ${String(patientState)}`}</Text>
        <Text style={styles.infoText}>{`Time: ${formatTime(timeElapsed)}`}</Text>
        {score !== undefined && score > 0 && (
          <Text style={styles.infoText}>{`Score: ${Math.round(score)}%`}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#e0e0e0' },
  phases: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, marginBottom: 8 },
  phaseItem: { flexDirection: 'row', alignItems: 'center' },
  phaseDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#e0e0e0' },
  phaseDone: { backgroundColor: '#2ecc71' },
  phaseActive: { backgroundColor: '#007AFF', transform: [{ scale: 1.3 }] },
  phaseLine: { width: 20, height: 2, backgroundColor: '#e0e0e0' },
  phaseLineDone: { backgroundColor: '#2ecc71' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10, flexWrap: 'wrap' },
  infoText: { fontSize: 11, color: '#666' }
});

export default PhaseIndicator;
