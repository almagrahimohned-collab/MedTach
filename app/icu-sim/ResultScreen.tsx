import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PerformanceHeatmap from './PerformanceHeatmap';
import MMConference from './MMConference';
import { ScoreBreakdown } from './scoringEngine';
import { Achievement, checkAchievements } from './achievements';
import { TeachingPoint, generateTeachingPoints, recommendNextChallenge } from './aiFeedback';
import { SCENARIOS_META } from './scenarios';
import { saveICUScore, unlockScenario, saveAchievement } from '../../src/services/icuProgressService';

interface ResultScreenProps {
  score: ScoreBreakdown;
  vitals: any;
  state: any;
  scenarioId: string;
  onRetry: () => void;
}

export default function ResultScreen({ score, vitals, state, scenarioId, onRetry }: ResultScreenProps) {
  const router = useRouter();
  const [showMM, setShowMM] = useState(false);
  const [saved, setSaved] = useState(false);
  const isDead = state?.status === 'dead';

  const gradeColor: Record<string, string> = {
    'S': '#FFD700', 'A': '#10B981', 'B': '#38BDF8',
    'C': '#F59E0B', 'D': '#F97316', 'F': '#EF4444',
  };

  const achievements = useMemo(() => {
    try { return checkAchievements(state, { goalsMet: score.goalsMet, complication: score.complication }); }
    catch { return []; }
  }, [state, score]);

  const teachingPoints = useMemo(() => {
    try { return generateTeachingPoints(state, scenarioId); }
    catch { return []; }
  }, [state, scenarioId]);

  const nextChallenge = useMemo(() => {
    try { return recommendNextChallenge(state, scenarioId, SCENARIOS_META); }
    catch { return null; }
  }, [state, scenarioId]);

  const nextScenarioMeta = SCENARIOS_META.find(s => s.id === nextChallenge);

  // ===== AUTO-SAVE TO SUPABASE =====
  useEffect(() => {
    if (saved) return;
    
    const save = async () => {
      // Save score
      await saveICUScore({
        scenario_id: scenarioId,
        score: score.total,
        grade: score.grade,
        goals_met: score.goalsMet,
        total_goals: score.totalGoals,
        time_bonus: score.timeBonus,
        complications: score.complication,
        patient_died: isDead,
        achievements: achievements.map(a => a.id),
      });

      // Save achievements
      for (const a of achievements) {
        await saveAchievement(a.id);
      }

      // Unlock next scenario if won
      if (!isDead && score.grade !== 'F' && nextChallenge) {
        await unlockScenario(nextChallenge);
      }

      setSaved(true);
    };

    save();
  }, []);

  const mmEvents = useMemo(() => {
    if (!state?.events) return [];
    return state.events.map((e: string) => {
      const timeMatch = e.match(/\[(\d+)m\]/);
      const time = timeMatch ? parseInt(timeMatch[1]) : 0;
      let type: 'critical' | 'action' | 'warning' | 'death' = 'action';
      if (e.includes('💀') || e.includes('expired')) type = 'death';
      else if (e.includes('⚠️') || e.includes('delayed')) type = 'warning';
      else if (e.includes('🚨')) type = 'critical';
      return { time, type, event: e };
    });
  }, [state?.events]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Save indicator */}
      {saved && (
        <View style={styles.savedBanner}>
          <Ionicons name="cloud-done" size={14} color="#10B981" />
          <Text style={styles.savedText}>Progress saved</Text>
        </View>
      )}

      <Text style={styles.emoji}>{isDead ? '💀' : '🎉'}</Text>
      <Text style={styles.title}>{isDead ? 'Patient Expired' : 'Scenario Complete'}</Text>
      
      <View style={[styles.gradeCircle, { borderColor: gradeColor[score.grade] || '#64748B' }]}>
        <Text style={[styles.gradeText, { color: gradeColor[score.grade] || '#64748B' }]}>{score.grade}</Text>
      </View>
      
      <Text style={styles.scoreNumber}>{score.total}</Text>
      <Text style={styles.scoreLabel}>points</Text>
      <Text style={styles.message}>{score.message}</Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(score.goalsMet / Math.max(score.totalGoals, 1)) * 100}%`, backgroundColor: gradeColor[score.grade] }]} />
      </View>
      <Text style={styles.goalText}>{score.goalsMet}/{score.totalGoals} treatment goals achieved</Text>

      {achievements.length > 0 && (
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>🏆 Achievements Unlocked</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((a: Achievement, i: number) => (
              <View key={i} style={styles.achievementCard}>
                <Text style={styles.achievementEmoji}>{a.emoji}</Text>
                <Text style={styles.achievementTitle}>{a.title}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <PerformanceHeatmap metrics={[
        { label: 'MAP', score: vitals.map > 65 ? 90 : Math.max(0, Math.round((vitals.map / 65) * 100)), icon: '❤️' },
        { label: 'Oxygen', score: vitals.spo2 > 92 ? 95 : Math.max(0, Math.round((vitals.spo2 / 92) * 100)), icon: '🫁' },
        { label: 'Lactate', score: vitals.lactate < 2 ? 100 : Math.max(0, Math.round((1 - vitals.lactate / 10) * 100)), icon: '🧪' },
        { label: 'Urine', score: vitals.urineOutput > 30 ? 100 : Math.round((vitals.urineOutput / 30) * 100), icon: '💧' },
      ]} />

      <View style={styles.breakdown}>
        <Text style={styles.sectionTitle}>📊 Score Breakdown</Text>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Goals Met</Text>
          <Text style={styles.breakdownValue}>+{score.goalsMet * 200}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Time Bonus</Text>
          <Text style={styles.breakdownValue}>+{score.timeBonus}</Text>
        </View>
        {score.complication < 0 && (
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Complications</Text>
            <Text style={[styles.breakdownValue, { color: '#EF4444' }]}>{score.complication}</Text>
          </View>
        )}
      </View>

      {teachingPoints.length > 0 && (
        <View style={styles.aiSection}>
          <Text style={styles.sectionTitle}>🧠 AI Attending Feedback</Text>
          {teachingPoints.map((point: TeachingPoint, i: number) => (
            <View key={i} style={[styles.teachingCard, { borderLeftColor: point.type === 'positive' ? '#10B981' : point.type === 'warning' ? '#F59E0B' : '#38BDF8' }]}>
              <Text style={styles.teachingEmoji}>{point.emoji}</Text>
              <Text style={styles.teachingText}>{point.message}</Text>
            </View>
          ))}
        </View>
      )}

      {nextScenarioMeta && !isDead && (
        <View style={styles.nextSection}>
          <Text style={styles.sectionTitle}>🎯 Recommended Next</Text>
          <Pressable style={styles.nextCard} onPress={() => router.push(`/icu-sim/play?scenario=${nextScenarioMeta.id}` as any)}>
            <View style={[styles.nextIcon, { backgroundColor: nextScenarioMeta.color + '20' }]}>
              <Ionicons name={nextScenarioMeta.icon as any} size={24} color={nextScenarioMeta.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextTitle}>{nextScenarioMeta.title}</Text>
              <Text style={styles.nextDesc}>{nextScenarioMeta.description}</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#64748B" />
          </Pressable>
        </View>
      )}

      {isDead && (
        <Pressable style={styles.mmBtn} onPress={() => setShowMM(true)}>
          <Ionicons name="search" size={20} color="#FFF" />
          <Text style={styles.mmBtnText}>Review Case (M&M Conference)</Text>
        </Pressable>
      )}

      <View style={styles.actions}>
        <Pressable style={styles.retryBtn} onPress={onRetry}>
          <Ionicons name="refresh" size={20} color="#FFF" />
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
        <Pressable style={styles.backBtn} onPress={() => router.push('/icu-sim' as any)}>
          <Ionicons name="arrow-back" size={20} color="#38BDF8" />
          <Text style={styles.backText}>Scenarios</Text>
        </Pressable>
      </View>

      <Modal visible={showMM} animationType="slide">
        <MMConference events={mmEvents} scenarioTitle="Case Review" onClose={() => setShowMM(false)} />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  contentContainer: { alignItems: 'center', padding: 24, paddingTop: 60, gap: 8, paddingBottom: 40 },
  savedBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#10B98115', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 8 },
  savedText: { fontSize: 12, color: '#10B981', fontWeight: '600' },
  emoji: { fontSize: 48 },
  title: { fontSize: 22, fontWeight: '800', color: '#F8FAFC' },
  gradeCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 4, alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  gradeText: { fontSize: 32, fontWeight: '900' },
  scoreNumber: { fontSize: 48, fontWeight: '800', color: '#F59E0B' },
  scoreLabel: { fontSize: 14, color: '#94A3B8' },
  message: { fontSize: 13, color: '#CBD5E1', textAlign: 'center' },
  progressBar: { width: '80%', height: 6, backgroundColor: '#334155', borderRadius: 3, overflow: 'hidden', marginTop: 8 },
  progressFill: { height: '100%', borderRadius: 3 },
  goalText: { fontSize: 12, color: '#64748B' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#F8FAFC', marginBottom: 8, alignSelf: 'flex-start' },
  achievementsSection: { width: '100%', marginTop: 12 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  achievementCard: { backgroundColor: '#1E293B', borderRadius: 10, padding: 10, width: '48%', alignItems: 'center', gap: 2 },
  achievementEmoji: { fontSize: 28 },
  achievementTitle: { fontSize: 11, fontWeight: '700', color: '#F8FAFC', textAlign: 'center' },
  breakdown: { width: '100%', backgroundColor: '#1E293B', borderRadius: 12, padding: 14, marginTop: 12, gap: 6 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  breakdownLabel: { fontSize: 13, color: '#94A3B8' },
  breakdownValue: { fontSize: 13, fontWeight: '600', color: '#10B981' },
  aiSection: { width: '100%', marginTop: 12, gap: 6 },
  teachingCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#1E293B', padding: 10, borderRadius: 8, borderLeftWidth: 3 },
  teachingEmoji: { fontSize: 16, marginTop: 1 },
  teachingText: { flex: 1, fontSize: 12, color: '#CBD5E1', lineHeight: 18 },
  nextSection: { width: '100%', marginTop: 12 },
  nextCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 12, borderRadius: 12, gap: 12 },
  nextIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  nextTitle: { fontSize: 14, fontWeight: '700', color: '#F8FAFC' },
  nextDesc: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  mmBtn: { flexDirection: 'row', backgroundColor: '#8B5CF6', padding: 14, borderRadius: 12, alignItems: 'center', gap: 8, marginTop: 8 },
  mmBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  retryBtn: { flexDirection: 'row', backgroundColor: '#38BDF8', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, alignItems: 'center', gap: 6 },
  retryText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  backBtn: { flexDirection: 'row', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#334155' },
  backText: { color: '#38BDF8', fontSize: 15, fontWeight: '700' },
});
