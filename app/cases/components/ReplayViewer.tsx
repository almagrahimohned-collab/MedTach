// ============================================
// Replay Viewer — Timeline & Playback Controls
// ============================================

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ReplayEngine, { ReplayState, ReplaySpeed } from '../../engine/core/ReplayEngine';

interface ReplayViewerProps {
  replayData: any;
  onClose: () => void;
}

export function ReplayViewer({ replayData, onClose }: ReplayViewerProps) {
  const [engine] = useState(() => new ReplayEngine());
  const [state, setState] = useState<ReplayState>(engine.getState());

  useEffect(() => {
    const unsub = engine.subscribe(setState);
    engine.loadReplay(replayData);
    return () => {
      unsub();
      engine.destroy();
    };
  }, [replayData]);

  const handlePlay = () => {
    if (state.status === 'playing') {
      engine.pause();
    } else if (state.status === 'paused') {
      engine.resume();
    } else {
      engine.start();
    }
  };

  const handleSpeedChange = (speed: ReplaySpeed) => {
    engine.setSpeed(speed);
  };

  const handleStep = (step: number) => {
    engine.jumpTo(step);
  };

  const speeds: ReplaySpeed[] = [0.5, 1, 2, 5, 10];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🔁 Simulation Replay</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(state.progress * 100)}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Step {state.currentStep} / {state.totalSteps}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={handlePlay}
        >
          <Text style={styles.playIcon}>
            {state.status === 'playing' ? '⏸' : state.status === 'completed' ? '🔄' : '▶️'}
          </Text>
        </TouchableOpacity>

        <View style={styles.speedControls}>
          {speeds.map(speed => (
            <TouchableOpacity
              key={speed}
              style={[styles.speedButton, state.speed === speed && styles.speedActive]}
              onPress={() => handleSpeedChange(speed)}
            >
              <Text style={[styles.speedText, state.speed === speed && styles.speedTextActive]}>
                {speed}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Snapshot Timeline */}
      <ScrollView style={styles.timeline} horizontal showsHorizontalScrollIndicator={false}>
        {engine.getSnapshots().map((snap, index) => (
          <TouchableOpacity
            key={snap.id}
            style={[
              styles.timelineDot,
              index === state.currentStep - 1 && styles.timelineDotActive,
              index < state.currentStep && styles.timelineDotPast
            ]}
            onPress={() => handleStep(index + 1)}
          >
            <Text style={styles.timelineStep}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Current Snapshot Info */}
      {state.currentSnapshot && (
        <View style={styles.snapshotInfo}>
          <Text style={styles.snapshotTitle}>Current State</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phase:</Text>
            <Text style={styles.infoValue}>{state.currentSnapshot.state.phase}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Patient:</Text>
            <Text style={styles.infoValue}>{state.currentSnapshot.state.patientState}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Revealed:</Text>
            <Text style={styles.infoValue}>{state.currentSnapshot.context.revealedCount} items</Text>
          </View>
          {state.currentSnapshot.context.topDiagnosis && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Top Dx:</Text>
              <Text style={styles.infoValue}>{state.currentSnapshot.context.topDiagnosis}</Text>
            </View>
          )}
        </View>
      )}

      {/* Status */}
      <View style={styles.statusBar}>
        <View style={[styles.statusDot, { backgroundColor: 
          state.status === 'playing' ? '#2ecc71' :
          state.status === 'paused' ? '#f39c12' :
          state.status === 'completed' ? '#3498db' : '#95a5a6'
        }]} />
        <Text style={styles.statusText}>
          {state.status.toUpperCase()} • {state.speed}x
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    margin: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  closeButton: {
    color: '#fff',
    fontSize: 20,
    padding: 4
  },
  progressContainer: {
    marginBottom: 16
  },
  progressBar: {
    height: 6,
    backgroundColor: '#2d2d44',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3
  },
  progressText: {
    color: '#999',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  playIcon: {
    fontSize: 20
  },
  speedControls: {
    flexDirection: 'row',
    gap: 8
  },
  speedButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#2d2d44'
  },
  speedActive: {
    backgroundColor: '#007AFF'
  },
  speedText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600'
  },
  speedTextActive: {
    color: '#fff'
  },
  timeline: {
    marginBottom: 16,
    maxHeight: 40
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2d2d44',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6
  },
  timelineDotActive: {
    backgroundColor: '#007AFF',
    transform: [{ scale: 1.2 }]
  },
  timelineDotPast: {
    backgroundColor: '#1a6dd4'
  },
  timelineStep: {
    color: '#999',
    fontSize: 10,
    fontWeight: '600'
  },
  snapshotInfo: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12
  },
  snapshotTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  infoLabel: {
    color: '#999',
    fontSize: 12
  },
  infoValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  statusText: {
    color: '#999',
    fontSize: 11
  }
});

export default ReplayViewer;
