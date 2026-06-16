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

const MASTERY_ICONS: Record<string, string> = {
  mastered: 'trophy',
  proficient: 'star',
  practicing: 'trending-up',
  learning: 'school',
  not_started: 'ellipse-outline',
};

export default function AnalyticsScreen() {
  const router = useRouter();
  const profile = useStore(s => s.getCompetencyProfile());
  const competencyState = useStore(s => s.competencyState);

  const competencies = useMemo(() => {
    return Object.entries(competencyState)
      .sort((a, b) => b[1].score - a[1].score)
      .map(([id, data]) => ({
        id,
        ...data,
        display: COMPETENCY_DISPLAY[id] || { name: id, icon: 'help-circle', category: 'General' },
      }));
  }, [competencyState]);

  const categories = useMemo(() => {
    const cats: Record<string, typeof competencies> = {};
    for (const comp of competencies) {
      const cat = comp.display.category;
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(comp);
    }
    return cats;
  }, [competencies]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#94A3B8" />
        </Pressable>
        <Text style={styles.title}>Your Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Competency Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.averageScore}%</Text>
              <Text style={styles.statLabel}>Average</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: '#10B981' }]}>{profile.masteredCount}</Text>
              <Text style={styles.statLabel}>Mastered</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: '#EF4444' }]}>{profile.needsImprovement.length}</Text>
              <Text style={styles.statLabel}>Need Work</Text>
            </View>
          </View>
        </View>

        {/* Strengths */}
        {profile.strengths.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ Strengths</Text>
            {profile.strengths.map(id => {
              const display = COMPETENCY_DISPLAY[id] || { name: id, icon: 'star', category: '' };
              return (
                <View key={id} style={styles.strengthItem}>
                  <Ionicons name={display.icon as any} size={18} color="#10B981" />
                  <Text style={styles.strengthText}>{display.name}</Text>
                  <Text style={styles.scoreText}>{competencyState[id]?.score || 0}%</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Needs Improvement */}
        {profile.needsImprovement.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔴 Needs Improvement</Text>
            {profile.needsImprovement.map(id => {
              const display = COMPETENCY_DISPLAY[id] || { name: id, icon: 'alert-circle', category: '' };
              return (
                <View key={id} style={styles.weakItem}>
                  <Ionicons name={display.icon as any} size={18} color="#EF4444" />
                  <Text style={styles.weakText}>{display.name}</Text>
                  <Text style={[styles.scoreText, { color: '#EF4444' }]}>{competencyState[id]?.score || 0}%</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* All Competencies by Category */}
        {Object.entries(categories).map(([category, items]) => (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>
            {items.map(comp => (
              <View key={comp.id} style={styles.competencyItem}>
                <Ionicons
                  name={MASTERY_ICONS[comp.level] as any}
                  size={16}
                  color={MASTERY_COLORS[comp.level]}
                />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.competencyName}>{comp.display.name}</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${comp.score}%`, backgroundColor: MASTERY_COLORS[comp.level] }]} />
                  </View>
                </View>
                <Text style={[styles.competencyScore, { color: MASTERY_COLORS[comp.level] }]}>
                  {comp.level.replace('_', ' ')}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {competencies.length === 0 && (
          <View style={styles.emptyCard}>
            <Ionicons name="analytics" size={60} color="#334155" />
            <Text style={styles.emptyTitle}>No data yet</Text>
            <Text style={styles.emptySub}>Complete cases to see your competency breakdown</Text>
          </View>
        )}

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
  overviewCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  overviewTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: '#F8FAFC', fontSize: 28, fontWeight: '800' },
  statLabel: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: '#334155' },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  strengthItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B98110', padding: 12, borderRadius: 10, marginBottom: 6, gap: 8 },
  strengthText: { color: '#10B981', fontSize: 14, fontWeight: '600', flex: 1 },
  scoreText: { color: '#F8FAFC', fontSize: 14, fontWeight: '700' },
  weakItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EF444410', padding: 12, borderRadius: 10, marginBottom: 6, gap: 8 },
  weakText: { color: '#EF4444', fontSize: 14, fontWeight: '600', flex: 1 },
  competencyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 12, borderRadius: 10, marginBottom: 6, gap: 8 },
  competencyName: { color: '#E2E8F0', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  progressBar: { height: 4, backgroundColor: '#334155', borderRadius: 2 },
  progressFill: { height: '100%', borderRadius: 2 },
  competencyScore: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  emptyCard: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700' },
  emptySub: { color: '#94A3B8', fontSize: 14, textAlign: 'center' },
});
