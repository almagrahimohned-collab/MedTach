import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../../src/store';
import { getScoreGrade, getTimeString } from '../../../src/utils/scoring';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CaseReview() {
  const { caseId } = useLocalSearchParams();
  const router = useRouter();
  const { completedCases, totalPoints } = useStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const caseResult = completedCases.find(c => c.caseId === caseId);
  
  if (!caseResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Case not found</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const grade = getScoreGrade(caseResult.score);
  const caseNumber = completedCases.findIndex(c => c.caseId === caseId) + 1;
  const percentileScore = Math.round((caseResult.score / 150) * 100);

  const strengths = [];
  const improvements = [];

  if (caseResult.score >= 100) {
    strengths.push('Excellent diagnostic accuracy');
    strengths.push('Efficient use of investigations');
  } else if (caseResult.score >= 70) {
    strengths.push('Good clinical reasoning');
    improvements.push('Consider ordering fewer investigations');
  } else {
    improvements.push('Review the diagnostic process');
    improvements.push('Order only necessary tests');
    improvements.push('Focus on key clinical findings');
  }

  if (caseResult.score >= 80) {
    strengths.push('Strong time management');
  } else {
    improvements.push('Work on speed without sacrificing accuracy');
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        <View style={styles.header}>
          <View style={[styles.gradeCircle, { borderColor: grade.color }]}>
            <Text style={styles.gradeEmoji}>{grade.emoji}</Text>
            <Text style={[styles.gradeText, { color: grade.color }]}>{grade.grade}</Text>
          </View>
          <Text style={styles.caseTitle}>Case #{caseNumber} Review</Text>
          <Text style={styles.caseDate}>
            {new Date(caseResult.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.scoreMain}>
            <Text style={styles.scoreValue}>{caseResult.score}</Text>
            <Text style={styles.scoreUnit}>pts</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreDetails}>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Percentile</Text>
              <Text style={styles.scoreNumber}>{percentileScore}%</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Total Points</Text>
              <Text style={styles.scoreNumber}>{totalPoints.toLocaleString()}</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Cases Solved</Text>
              <Text style={styles.scoreNumber}>{completedCases.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Strengths</Text>
          {strengths.map((item, index) => (
            <View key={index} style={styles.feedbackItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text style={styles.feedbackText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Areas for Improvement</Text>
          {improvements.map((item, index) => (
            <View key={index} style={styles.feedbackItem}>
              <Ionicons name="trending-up" size={18} color="#F59E0B" />
              <Text style={styles.feedbackText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={20} color="#F59E0B" />
            <Text style={styles.tipText}>
              Start with focused history and physical exam before ordering expensive tests.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="speedometer" size={20} color="#38BDF8" />
            <Text style={styles.tipText}>
              Balance speed with accuracy. Every minute counts in clinical practice.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="git-network" size={20} color="#8B5CF6" />
            <Text style={styles.tipText}>
              Create differential diagnoses early and use tests to rule them out systematically.
            </Text>
          </View>
        </View>

        <View style={styles.actionSection}>
          <Pressable style={styles.retryBtn} onPress={() => router.push('/cases')}>
            <Ionicons name="refresh" size={18} color="#FFF" />
            <Text style={styles.retryBtnText}>Try Another Case</Text>
          </Pressable>

          <Pressable style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
            <Ionicons name="home" size={18} color="#38BDF8" />
            <Text style={styles.homeBtnText}>Back to Dashboard</Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  content: { padding: 20 },
  errorText: { color: '#EF4444', fontSize: 16, textAlign: 'center', marginTop: 40 },
  backBtn: { backgroundColor: '#1E293B', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 20, marginHorizontal: 40 },
  backBtnText: { color: '#38BDF8', fontWeight: '600' },

  header: { alignItems: 'center', marginBottom: 28, marginTop: 10 },
  gradeCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    marginBottom: 16,
  },
  gradeEmoji: { fontSize: 36 },
  gradeText: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  caseTitle: { color: '#F8FAFC', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  caseDate: { color: '#94A3B8', fontSize: 13 },

  scoreCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  scoreMain: { alignItems: 'center', justifyContent: 'center', paddingRight: 20 },
  scoreValue: { color: '#38BDF8', fontSize: 40, fontWeight: '800' },
  scoreUnit: { color: '#94A3B8', fontSize: 14, marginTop: -4 },
  scoreDivider: { width: 1, backgroundColor: '#334155' },
  scoreDetails: { flex: 1, paddingLeft: 20, gap: 10, justifyContent: 'center' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between' },
  scoreLabel: { color: '#94A3B8', fontSize: 12 },
  scoreNumber: { color: '#E2E8F0', fontSize: 14, fontWeight: '600' },

  section: { marginBottom: 24 },
  sectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  feedbackItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  feedbackText: { color: '#E2E8F0', fontSize: 14, flex: 1, lineHeight: 20 },

  tipsSection: { marginBottom: 24 },
  tipsTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tipText: { color: '#CBD5E1', fontSize: 13, flex: 1, lineHeight: 19 },

  actionSection: { gap: 10 },
  retryBtn: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  homeBtn: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  homeBtnText: { color: '#38BDF8', fontSize: 16, fontWeight: '600' },
});
