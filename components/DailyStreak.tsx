import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../src/store';

export default function DailyStreak() {
  const { streak } = useStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const flameAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation when streak changes
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.1, duration: 200, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    // Flame flicker
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(flameAnim, { toValue: 0.8, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [streak.currentStreak]);

  const getStreakColor = () => {
    if (streak.currentStreak >= 30) return '#FF6B35';
    if (streak.currentStreak >= 14) return '#FFD700';
    if (streak.currentStreak >= 7) return '#C0C0C0';
    if (streak.currentStreak >= 3) return '#CD7F32';
    return '#F59E0B';
  };

  const getStreakEmoji = () => {
    if (streak.currentStreak >= 60) return '👑';
    if (streak.currentStreak >= 30) return '💎';
    if (streak.currentStreak >= 14) return '🥇';
    if (streak.currentStreak >= 7) return '🥈';
    if (streak.currentStreak >= 3) return '🥉';
    return '🔥';
  };

  const streakColor = getStreakColor();

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
      <View style={styles.streakRow}>
        <View style={styles.streakLeft}>
          <Animated.Text style={[styles.flame, { opacity: flameAnim }]}>
            {getStreakEmoji()}
          </Animated.Text>
          <View>
            <Text style={styles.streakTitle}>Daily Streak</Text>
            <Text style={[styles.streakCount, { color: streakColor }]}>
              {streak.currentStreak} {streak.currentStreak === 1 ? 'Day' : 'Days'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRight}>
          <View style={styles.statItem}>
            <Ionicons name="flash" size={14} color="#F59E0B" />
            <Text style={styles.statValue}>+{useStore.getState().getStreakBonus()}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={14} color="#FFD700" />
            <Text style={styles.statValue}>{streak.longestStreak}</Text>
          </View>
        </View>
      </View>

      {/* Streak Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {[3, 7, 14, 30, 60].map((milestone) => (
            <View
              key={milestone}
              style={[
                styles.milestone,
                {
                  left: `${Math.min((streak.currentStreak / 60) * 100, 100)}%`,
                  backgroundColor: streak.currentStreak >= milestone ? '#10B981' : '#334155',
                },
              ]}
            />
          ))}
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min((streak.currentStreak / 60) * 100, 100)}%`,
                backgroundColor: streakColor,
              },
            ]}
          />
        </View>
        <View style={styles.milestoneLabels}>
          <Text style={styles.milestoneLabel}>3</Text>
          <Text style={styles.milestoneLabel}>7</Text>
          <Text style={styles.milestoneLabel}>14</Text>
          <Text style={styles.milestoneLabel}>30</Text>
          <Text style={styles.milestoneLabel}>60</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flame: {
    fontSize: 32,
  },
  streakTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  streakCount: {
    fontSize: 20,
    fontWeight: '800',
  },
  statsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#334155',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#0F172A',
    borderRadius: 3,
    position: 'relative',
    overflow: 'visible',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  milestone: {
    position: 'absolute',
    top: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1E293B',
    zIndex: 2,
  },
  milestoneLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  milestoneLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '600',
  },
});
