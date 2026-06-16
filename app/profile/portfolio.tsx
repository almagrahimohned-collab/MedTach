import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import { COMPETENCY_DISPLAY } from '../../src/engines/competencyEngine';

const MASTERY_COLORS: Record<string, string> = {
  mastered: '#10B981',
  proficient: '#38BDF8',
  practicing: '#F59E0B',
  learning: '#F97316',
  not_started: '#64748B',
};

const MASTERY_LABELS: Record<string, string> = {
  mastered: 'Mastered',
  proficient: 'Proficient',
  practicing: 'Practicing',
  learning: 'Learning',
  not_started: 'Not Started',
};

const MASTERY_ICONS: Record<string, string> = {
  mastered: 'trophy',
  proficient: 'star',
  practicing: 'trending-up',
  learning: 'school',
  not_started: 'ellipse-outline',
};

export default function PortfolioScreen() {
  const router = useRouter();
  const store = useStore();
  const profile = store.getCompetencyProfile();
  const competencyState = store.competencyState;
  const completedCases = store.completedCases;
  const badges = store.badges;
  const totalPoints = store.totalPoints;
  const level = store.getLevel();
  const levelTitle = store.getLevelTitle(level);
  const streak = store.streak;

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCases = completedCases.filter(c => c.date?.startsWith(today));
    const thisWeek = completedCases.filter(c => {
      const d = new Date(c.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return d >= weekAgo;
    });

    // Get unique specialties
    const specialties = new Set(completedCases.map(c => c.caseId?.split('_')[0]));
    
    return {
      totalCases: completedCases.length,
      todayCases: todayCases.length,
      weekCases: thisWeek.length,
      uniqueSpecialties: specialties.size,
      avgScore: completedCases.length > 0 
        ? Math.round(completedCases.reduce((s, c) => s + c.score, 0) / completedCases.length)
        : 0,
    };
  }, [completedCases]);

  const masteredCompetencies = useMemo(() => {
    return Object.entries(competencyState)
      .filter(([_, data]) => data.level === 'mastered' || data.level === 'proficient')
      .map(([id, data]) => ({
        id,
        ...data,
        display: COMPETENCY_DISPLAY[id] || { name: id, icon: 'star', category: 'General' },
      }))
      .sort((a, b) => b.score - a.score);
  }, [competencyState]);

  const recentActivity = useMemo(() => {
    return completedCases
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [completedCases]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#94A3B8" />
        </Pressable>
        <Text style={styles.title}>Your Portfolio</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color="#38BDF8" />
          </View>
          <Text style={styles.levelTitle}>{levelTitle}</Text>
          <Text style={styles.levelSub}>Level {level}</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${store.getLevelProgress().progress}%` }]} />
          </View>
          <Text style={styles.xpText}>{totalPoints} XP</Text>
          
          {/* Streak */}
          {streak.currentStreak > 0 && (
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={16} color="#F59E0B" />
              <Text style={styles.streakText}>{streak.currentStreak} Day Streak 🔥</Text>
            </View>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="document-text" size={24} color="#38BDF8" />
            <Text style={styles.statValue}>{stats.totalCases}</Text>
            <Text style={styles.statLabel}>Cases Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="today" size={24} color="#10B981" />
            <Text style={styles.statValue}>{stats.todayCases}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color="#8B5CF6" />
            <Text style={styles.statValue}>{stats.weekCases}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="fitness" size={24} color="#F59E0B" />
            <Text style={styles.statValue}>{stats.uniqueSpecialties}</Text>
            <Text style={styles.statLabel}>Specialties</Text>
          </View>
        </View>

        {/* Mastered Competencies */}
        {masteredCompetencies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Mastered Competencies</Text>
            {masteredCompetencies.slice(0, 5).map(comp => (
              <View key={comp.id} style={styles.competencyCard}>
                <Ionicons
                  name={MASTERY_ICONS[comp.level] as any}
                  size={20}
                  color={MASTERY_COLORS[comp.level]}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.competencyName}>{comp.display.name}</Text>
                  <Text style={styles.competencyCategory}>{comp.display.category}</Text>
                </View>
                <View style={[styles.levelBadge, { backgroundColor: MASTERY_COLORS[comp.level] + '20' }]}>
                  <Text style={[styles.levelText, { color: MASTERY_COLORS[comp.level] }]}>
                    {MASTERY_LABELS[comp.level]}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏅 Badges</Text>
            <View style={styles.badgesGrid}>
              {badges.slice(0, 8).map((badge, i) => (
                <View key={i} style={styles.badgeCard}>
                  <Text style={styles.badgeEmoji}>{badge.split(' ')[0]}</Text>
                  <Text style={styles.badgeName}>{badge.split(' ').slice(1).join(' ')}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Recent Activity</Text>
            {recentActivity.map((activity, i) => (
              <View key={i} style={styles.activityItem}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.activityCase}>{activity.caseId?.replace(/_/g, ' ')}</Text>
                  <Text style={styles.activityDate}>
                    {new Date(activity.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.activityScore}>+{activity.score} XP</Text>
              </View>
            ))}
          </View>
        )}

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 More</Text>
          <Pressable style={styles.linkCard} onPress={() => router.push('/profile/analytics')}>
            <Ionicons name="stats-chart" size={20} color="#38BDF8" />
            <Text style={styles.linkText}>Detailed Analytics</Text>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </Pressable>
          <Pressable style={styles.linkCard} onPress={() => router.push('/quests/daily-loop')}>
            <Ionicons name="flame" size={20} color="#F59E0B" />
            <Text style={styles.linkText}>Daily Learning Loop</Text>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </Pressable>
        </View>

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

  profileCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#38BDF820', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  levelTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '800' },
  levelSub: { color: '#94A3B8', fontSize: 13, marginTop: 2 },
  xpBar: { width: '100%', height: 6, backgroundColor: '#334155', borderRadius: 3, marginTop: 12 },
  xpFill: { height: '100%', backgroundColor: '#38BDF8', borderRadius: 3 },
  xpText: { color: '#38BDF8', fontSize: 14, fontWeight: '700', marginTop: 6 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, backgroundColor: '#F59E0B15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  streakText: { color: '#F59E0B', fontSize: 13, fontWeight: '600' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { width: '47%', backgroundColor: '#1E293B', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155', gap: 6 },
  statValue: { color: '#F8FAFC', fontSize: 28, fontWeight: '800' },
  statLabel: { color: '#94A3B8', fontSize: 11 },

  section: { marginBottom: 20 },
  sectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  
  competencyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  competencyName: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  competencyCategory: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  levelBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  levelText: { fontSize: 11, fontWeight: '600' },

  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badgeCard: { backgroundColor: '#1E293B', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155', width: '23%', gap: 4 },
  badgeEmoji: { fontSize: 24 },
  badgeName: { color: '#94A3B8', fontSize: 9, textAlign: 'center' },

  activityItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 12, borderRadius: 10, marginBottom: 6, borderWidth: 1, borderColor: '#334155' },
  activityCase: { color: '#E2E8F0', fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  activityDate: { color: '#64748B', fontSize: 11, marginTop: 2 },
  activityScore: { color: '#10B981', fontSize: 13, fontWeight: '700' },

  linkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#334155', gap: 10 },
  linkText: { color: '#E2E8F0', fontSize: 14, flex: 1 },
});
