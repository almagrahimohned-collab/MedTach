import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ACHIEVEMENTS, Achievement } from './achievements';

interface AchievementGalleryProps {
  unlockedIds: string[];
  onClose: () => void;
}

export default function AchievementGallery({ unlockedIds, onClose }: AchievementGalleryProps) {
  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = unlockedIds.length;
  const completionPercent = Math.round((unlockedCount / totalAchievements) * 100);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>🏆</Text>
          <View>
            <Text style={styles.title}>Achievements</Text>
            <Text style={styles.subtitle}>{unlockedCount}/{totalAchievements} Unlocked</Text>
          </View>
        </View>
        <Pressable onPress={onClose}>
          <Ionicons name="close" size={24} color="#94A3B8" />
        </Pressable>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${completionPercent}%` }]} />
        </View>
        <Text style={styles.progressText}>{completionPercent}% Complete</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{unlockedCount}</Text>
          <Text style={styles.statLabel}>Unlocked</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{totalAchievements - unlockedCount}</Text>
          <Text style={styles.statLabel}>Locked</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {unlockedIds.filter(id => id !== '').length > 0 ? '🦅' : '🔒'}
          </Text>
          <Text style={styles.statLabel}>Rarest</Text>
        </View>
      </View>

      {/* Achievements Grid */}
      <ScrollView style={styles.grid} showsVerticalScrollIndicator={false}>
        {ACHIEVEMENTS.map((achievement, index) => {
          const unlocked = unlockedIds.includes(achievement.id);
          return (
            <View key={index} style={[styles.card, !unlocked && styles.cardLocked]}>
              <View style={[styles.cardIcon, { backgroundColor: unlocked ? '#F59E0B20' : '#334155' }]}>
                <Text style={styles.cardEmoji}>{unlocked ? achievement.emoji : '🔒'}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, !unlocked && styles.cardTitleLocked]}>
                  {achievement.title}
                </Text>
                <Text style={styles.cardDesc}>
                  {unlocked ? achievement.description : 'Complete the challenge to unlock'}
                </Text>
              </View>
              {unlocked && (
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Rarity Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Rarity</Text>
        <View style={styles.legendRow}>
          {[
            { color: '#64748B', label: 'Common' },
            { color: '#10B981', label: 'Uncommon' },
            { color: '#38BDF8', label: 'Rare' },
            { color: '#F59E0B', label: 'Epic' },
            { color: '#EF4444', label: 'Legendary' },
          ].map((r, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: r.color }]} />
              <Text style={styles.legendLabel}>{r.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },
  progressSection: {
    marginBottom: 16,
    gap: 6,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '700',
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  stat: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  grid: {
    flex: 1,
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    marginBottom: 8,
  },
  cardLocked: {
    opacity: 0.5,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  cardTitleLocked: {
    color: '#64748B',
  },
  cardDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  legend: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 12,
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 9,
    color: '#94A3B8',
  },
});
