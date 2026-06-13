import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, Pressable, ScrollView, Animated, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOARD_STORAGE_KEY = 'board_prep_data';

interface BoardAttempt {
  date: string;
  mode: 'mock' | 'half' | 'full';
  score: number;
  totalQuestions: number;
  timeSpent: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  specialtyBreakdown: Record<string, { correct: number; total: number }>;
  flaggedQuestions: string[];
}

const SPECIALTY_COLORS: Record<string, string> = {
  cardiology: '#EF4444',
  pulmonology: '#3B82F6',
  neurology: '#8B5CF6',
  endocrinology: '#F59E0B',
  gastroenterology: '#10B981',
  nephrology: '#06B6D4',
  hematology: '#DC2626',
  infectious: '#F97316',
  pharmacology: '#EC4899',
  quick_review: '#06B6D4',
  genetics: '#8B5CF6',
};

const SPECIALTY_EMOJIS: Record<string, string> = {
  cardiology: '🫀',
  pulmonology: '🫁',
  neurology: '🧠',
  endocrinology: '🔬',
  gastroenterology: '🍽️',
  nephrology: '🩻',
  hematology: '🩸',
  infectious: '🦠',
  pharmacology: '💊',
  quick_review: '⚡',
  genetics: '🧬',
};

export default function AnalyticsScreen() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<BoardAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    try {
      const stored = await AsyncStorage.getItem(BOARD_STORAGE_KEY);
      if (stored) {
        const allAttempts = JSON.parse(stored);
        setAttempts(allAttempts);
        if (allAttempts.length > 0) {
          setSelectedAttempt(allAttempts.length - 1);
        }
      }
    } catch { }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 75) return '#38BDF8';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${seconds % 60}s`;
  };

  const getTrendData = () => {
    if (attempts.length < 2) return null;
    const recent = attempts.slice(-5); // Last 5 attempts
    const scores = recent.map(a => (a.correctCount / a.totalQuestions) * 100);
    const trend = scores[scores.length - 1] - scores[0];
    return {
      scores,
      trend,
      direction: trend > 5 ? 'improving' : trend < -5 ? 'declining' : 'stable',
      labels: recent.map((_, i) => `#${attempts.length - recent.length + i + 1}`),
    };
  };

  const getWeakestSpecialties = () => {
    if (attempts.length === 0) return [];
    const last = attempts[attempts.length - 1];
    if (!last.specialtyBreakdown) return [];

    return Object.entries(last.specialtyBreakdown)
      .map(([specialty, data]) => ({
        specialty,
        score: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        correct: data.correct,
        total: data.total,
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  };

  const getStrongestSpecialties = () => {
    if (attempts.length === 0) return [];
    const last = attempts[attempts.length - 1];
    if (!last.specialtyBreakdown) return [];

    return Object.entries(last.specialtyBreakdown)
      .map(([specialty, data]) => ({
        specialty,
        score: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        correct: data.correct,
        total: data.total,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const getAverageTimePerQuestion = () => {
    if (attempts.length === 0) return 0;
    const last = attempts[attempts.length - 1];
    return Math.round(last.timeSpent / last.totalQuestions);
  };

  const getPredictedScore = () => {
    if (attempts.length < 2) return null;
    const trend = getTrendData();
    if (!trend || trend.direction === 'stable') return null;
    
    const recentScores = trend.scores;
    const avgImprovement = (recentScores[recentScores.length - 1] - recentScores[0]) / (recentScores.length - 1);
    return Math.min(100, Math.round(recentScores[recentScores.length - 1] + avgImprovement * 3));
  };

  const trend = getTrendData();
  const weakestSpecialties = getWeakestSpecialties();
  const strongestSpecialties = getStrongestSpecialties();
  const avgTimePerQ = getAverageTimePerQuestion();
  const predictedScore = getPredictedScore();

  if (attempts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
          </Pressable>
          <Text style={styles.headerTitle}>📊 Analytics</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="analytics-outline" size={80} color="#64748B" />
          <Text style={styles.emptyTitle}>No Data Yet</Text>
          <Text style={styles.emptySub}>Complete a board exam to see analytics</Text>
          <Pressable style={styles.takeExamBtn} onPress={() => router.push('/board-prep')}>
            <Text style={styles.takeExamText}>Take an Exam</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const lastAttempt = attempts[attempts.length - 1];
  const lastScore = (lastAttempt.correctCount / lastAttempt.totalQuestions) * 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
          </Pressable>
          <Text style={styles.headerTitle}>📊 Analytics</Text>
          <Text style={styles.headerSub}>{attempts.length} exams taken</Text>
        </View>

        {/* Overall Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreMain}>
            <Text style={[styles.scoreValue, { color: getScoreColor(lastScore) }]}>
              {Math.round(lastScore)}%
            </Text>
            <Text style={styles.scoreGrade}>{getScoreGrade(lastScore)}</Text>
          </View>
          <View style={styles.scoreDetails}>
            <Text style={styles.scoreLabel}>Last Exam: {lastAttempt.mode.toUpperCase()}</Text>
            <Text style={styles.scoreDate}>
              {new Date(lastAttempt.date).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric',
              })}
            </Text>
            <Text style={styles.scoreQuestions}>
              {lastAttempt.correctCount}/{lastAttempt.totalQuestions} correct
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Ionicons name="time" size={16} color="#F59E0B" />
            <Text style={styles.quickStatValue}>{avgTimePerQ}s</Text>
            <Text style={styles.quickStatLabel}>Avg/Q</Text>
          </View>
          <View style={styles.quickStat}>
            <Ionicons name="flag" size={16} color="#EF4444" />
            <Text style={styles.quickStatValue}>{lastAttempt.flaggedQuestions?.length || 0}</Text>
            <Text style={styles.quickStatLabel}>Flagged</Text>
          </View>
          <View style={styles.quickStat}>
            <Ionicons name="help-circle" size={16} color="#94A3B8" />
            <Text style={styles.quickStatValue}>{lastAttempt.skippedCount}</Text>
            <Text style={styles.quickStatLabel}>Skipped</Text>
          </View>
          <View style={styles.quickStat}>
            <Ionicons name="trending-up" size={16} color="#8B5CF6" />
            <Text style={styles.quickStatValue}>
              {predictedScore ? `${predictedScore}%` : '--'}
            </Text>
            <Text style={styles.quickStatLabel}>Predicted</Text>
          </View>
        </View>

        {/* Trend Chart */}
        {trend && (
          <View style={styles.trendCard}>
            <View style={styles.trendHeader}>
              <Text style={styles.trendTitle}>📈 Score Trend</Text>
              <View style={[
                styles.trendBadge,
                { backgroundColor: trend.direction === 'improving' ? '#10B98120' : trend.direction === 'declining' ? '#EF444420' : '#F59E0B20' }
              ]}>
                <Ionicons
                  name={trend.direction === 'improving' ? 'trending-up' : trend.direction === 'declining' ? 'trending-down' : 'remove'}
                  size={14}
                  color={trend.direction === 'improving' ? '#10B981' : trend.direction === 'declining' ? '#EF4444' : '#F59E0B'}
                />
                <Text style={[
                  styles.trendBadgeText,
                  { color: trend.direction === 'improving' ? '#10B981' : trend.direction === 'declining' ? '#EF4444' : '#F59E0B' }
                ]}>
                  {trend.direction === 'improving' ? 'Improving' : trend.direction === 'declining' ? 'Declining' : 'Stable'}
                </Text>
              </View>
            </View>

            {/* Simple Bar Chart */}
            <View style={styles.chartContainer}>
              {trend.scores.map((score, index) => (
                <View key={index} style={styles.barWrapper}>
                  <Text style={styles.barValue}>{Math.round(score)}%</Text>
                  <View style={styles.barBackground}>
                    <View style={[
                      styles.barFill,
                      {
                        height: `${score}%`,
                        backgroundColor: getScoreColor(score),
                      },
                    ]} />
                  </View>
                  <Text style={styles.barLabel}>{trend.labels[index]}</Text>
                </View>
              ))}
            </View>

            {predictedScore && (
              <View style={styles.predictionBox}>
                <Ionicons name="bulb" size={16} color="#F59E0B" />
                <Text style={styles.predictionText}>
                  Predicted next score: {predictedScore}% (based on current trend)
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Specialty Breakdown */}
        <View style={styles.specialtyCard}>
          <Text style={styles.sectionTitle}>📊 By Specialty</Text>
          {Object.entries(lastAttempt.specialtyBreakdown || {}).map(([specialty, data]) => {
            const score = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
            const emoji = SPECIALTY_EMOJIS[specialty] || '📚';
            const color = SPECIALTY_COLORS[specialty] || '#38BDF8';
            const barWidth = score;

            return (
              <View key={specialty} style={styles.specialtyRow}>
                <View style={styles.specialtyHeader}>
                  <Text style={styles.specialtyName}>
                    {emoji} {specialty.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </Text>
                  <Text style={[styles.specialtyScore, { color: getScoreColor(score) }]}>
                    {score}%
                  </Text>
                </View>
                <View style={styles.specialtyBar}>
                  <View style={[styles.specialtyBarFill, { width: `${barWidth}%`, backgroundColor: color }]} />
                </View>
                <Text style={styles.specialtyFraction}>
                  {data.correct}/{data.total} correct
                </Text>
              </View>
            );
          })}
        </View>

        {/* Weakest & Strongest */}
        <View style={styles.insightsRow}>
          {/* Weakest */}
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>⚠️ Needs Work</Text>
            {weakestSpecialties.map((item, i) => (
              <View key={i} style={styles.insightItem}>
                <Text style={styles.insightEmoji}>{SPECIALTY_EMOJIS[item.specialty] || '📚'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.insightName}>
                    {item.specialty.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </Text>
                  <Text style={[styles.insightScore, { color: '#EF4444' }]}>{item.score}%</Text>
                </View>
              </View>
            ))}
            {weakestSpecialties.length === 0 && (
              <Text style={styles.noData}>Complete an exam to see</Text>
            )}
          </View>

          {/* Strongest */}
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>💪 Strengths</Text>
            {strongestSpecialties.map((item, i) => (
              <View key={i} style={styles.insightItem}>
                <Text style={styles.insightEmoji}>{SPECIALTY_EMOJIS[item.specialty] || '📚'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.insightName}>
                    {item.specialty.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </Text>
                  <Text style={[styles.insightScore, { color: '#10B981' }]}>{item.score}%</Text>
                </View>
              </View>
            ))}
            {strongestSpecialties.length === 0 && (
              <Text style={styles.noData}>Complete an exam to see</Text>
            )}
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationCard}>
          <Text style={styles.sectionTitle}>📚 Recommended Actions</Text>
          {weakestSpecialties.length > 0 && (
            <View style={styles.recommendation}>
              <Ionicons name="flag" size={18} color="#EF4444" />
              <Text style={styles.recommendationText}>
                Focus on {weakestSpecialties[0].specialty.replace(/_/g, ' ')} ({weakestSpecialties[0].score}%)
                — review 10 questions daily
              </Text>
            </View>
          )}
          {trend && trend.direction === 'declining' && (
            <View style={styles.recommendation}>
              <Ionicons name="warning" size={18} color="#F59E0B" />
              <Text style={styles.recommendationText}>
                Your scores are declining. Consider reviewing flagged questions before the next exam.
              </Text>
            </View>
          )}
          {trend && trend.direction === 'improving' && (
            <View style={styles.recommendation}>
              <Ionicons name="trending-up" size={18} color="#10B981" />
              <Text style={styles.recommendationText}>
                Great progress! Keep up the momentum. Try a Half Board next.
              </Text>
            </View>
          )}
          <View style={styles.recommendation}>
            <Ionicons name="flash" size={18} color="#F59E0B" />
            <Text style={styles.recommendationText}>
              Convert your incorrect answers to flashcards for spaced repetition review.
            </Text>
          </View>
        </View>

        {/* History */}
        <Text style={styles.sectionTitle}>📋 Exam History</Text>
        {attempts.slice().reverse().map((attempt, index) => {
          const score = Math.round((attempt.correctCount / attempt.totalQuestions) * 100);
          return (
            <View key={index} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyMode}>
                    {attempt.mode === 'mock' ? 'Mock Board (40Q)' : attempt.mode === 'half' ? 'Half Board (200Q)' : 'Full Board (320Q)'}
                  </Text>
                  <Text style={styles.historyDate}>
                    {new Date(attempt.date).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.historyScore}>
                  <Text style={[styles.historyScoreValue, { color: getScoreColor(score) }]}>
                    {score}%
                  </Text>
                  <Text style={styles.historyGrade}>{getScoreGrade(score)}</Text>
                </View>
              </View>
              <View style={styles.historyStats}>
                <Text style={styles.historyStat}>✅ {attempt.correctCount}</Text>
                <Text style={styles.historyStat}>❌ {attempt.incorrectCount}</Text>
                <Text style={styles.historyStat}>⏭️ {attempt.skippedCount}</Text>
                <Text style={styles.historyStat}>⏱ {formatTime(attempt.timeSpent)}</Text>
              </View>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  content: { padding: 16 },
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#F8FAFC', fontSize: 24, fontWeight: '800', flex: 1 },
  headerSub: { color: '#94A3B8', fontSize: 13 },
  
  // Empty State
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 12 },
  emptyTitle: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  emptySub: { color: '#94A3B8', fontSize: 14 },
  takeExamBtn: { backgroundColor: '#8B5CF6', padding: 16, borderRadius: 14, marginTop: 8 },
  takeExamText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  
  // Score Card
  scoreCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#334155', flexDirection: 'row', alignItems: 'center', gap: 20 },
  scoreMain: { alignItems: 'center', borderRightWidth: 1, borderRightColor: '#334155', paddingRight: 20 },
  scoreValue: { fontSize: 48, fontWeight: '900' },
  scoreGrade: { color: '#F8FAFC', fontSize: 20, fontWeight: '800', marginTop: 4 },
  scoreDetails: { flex: 1 },
  scoreLabel: { color: '#F8FAFC', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  scoreDate: { color: '#94A3B8', fontSize: 12, marginBottom: 8 },
  scoreQuestions: { color: '#E2E8F0', fontSize: 13 },
  
  // Quick Stats
  quickStats: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  quickStat: { flex: 1, backgroundColor: '#1E293B', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  quickStatValue: { color: '#F8FAFC', fontSize: 16, fontWeight: '800' },
  quickStatLabel: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  
  // Trend Card
  trendCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  trendHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  trendTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  trendBadgeText: { fontSize: 11, fontWeight: '700' },
  
  // Chart
  chartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 150, marginBottom: 12 },
  barWrapper: { alignItems: 'center', gap: 4, flex: 1 },
  barValue: { color: '#94A3B8', fontSize: 10, fontWeight: '600' },
  barBackground: { width: 30, height: 100, backgroundColor: '#0F172A', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { color: '#64748B', fontSize: 9, fontWeight: '600' },
  
  predictionBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F59E0B10', padding: 10, borderRadius: 10 },
  predictionText: { color: '#F59E0B', fontSize: 12, flex: 1, lineHeight: 18 },
  
  // Specialty
  specialtyCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  sectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  specialtyRow: { marginBottom: 12 },
  specialtyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  specialtyName: { color: '#E2E8F0', fontSize: 13, fontWeight: '600' },
  specialtyScore: { fontSize: 13, fontWeight: '800' },
  specialtyBar: { height: 6, backgroundColor: '#0F172A', borderRadius: 3, marginBottom: 2 },
  specialtyBarFill: { height: '100%', borderRadius: 3 },
  specialtyFraction: { color: '#64748B', fontSize: 10 },
  
  // Insights
  insightsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  insightCard: { flex: 1, backgroundColor: '#1E293B', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#334155' },
  insightTitle: { color: '#F8FAFC', fontSize: 13, fontWeight: '700', marginBottom: 10 },
  insightItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  insightEmoji: { fontSize: 18 },
  insightName: { color: '#E2E8F0', fontSize: 11, fontWeight: '600' },
  insightScore: { fontSize: 13, fontWeight: '800' },
  noData: { color: '#64748B', fontSize: 11, fontStyle: 'italic' },
  
  // Recommendations
  recommendationCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  recommendation: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10 },
  recommendationText: { color: '#CBD5E1', fontSize: 13, flex: 1, lineHeight: 19 },
  
  // History
  historyCard: { backgroundColor: '#1E293B', borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  historyInfo: { flex: 1 },
  historyMode: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  historyDate: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  historyScore: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  historyScoreValue: { fontSize: 24, fontWeight: '800' },
  historyGrade: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' },
  historyStats: { flexDirection: 'row', gap: 12 },
  historyStat: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
});
