import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store';
import { Ionicons } from '@expo/vector-icons';
import { getDailyChallenge } from '../../src/utils/dailyChallenge';

export default function Dashboard() {
  const router = useRouter();
  const { completedCases, totalPoints, badges, getAccuracy, getTodayCases, dailyChallenge, setDailyChallenge, setCategory } = useStore();
  const [timeLeft, setTimeLeft] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!dailyChallenge || dailyChallenge.date !== today) {
      const challenge = getDailyChallenge();
      setDailyChallenge({
        date: challenge.date, specialty: challenge.specialty,
        level: challenge.level, caseId: challenge.case.id,
        completed: false, bonusPoints: challenge.bonusPoints,
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const avgScore = getAccuracy();
  const todayCases = getTodayCases();
  const bestScore = completedCases.length > 0 ? Math.max(...completedCases.map(c => c.score)) : 0;

  const handleStartCase = () => {
    router.push('/specialties');
  };

  const handleDailyChallenge = () => {
    if (dailyChallenge && !dailyChallenge.completed) {
      setCategory(dailyChallenge.specialty, dailyChallenge.specialty, dailyChallenge.level);
      router.push('/cases');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        <View style={styles.headerSection}>
          <Text style={styles.greeting}>Good Day, Doctor</Text>
          <Text style={styles.subtitle}>Ready to sharpen your diagnostic skills?</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: '#38BDF8' }]}>
            <Ionicons name="trophy" size={22} color="#38BDF8" />
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
            <Ionicons name="checkmark-circle" size={22} color="#10B981" />
            <Text style={styles.statValue}>{completedCases.length}</Text>
            <Text style={styles.statLabel}>Cases Solved</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
            <Ionicons name="analytics" size={22} color="#F59E0B" />
            <Text style={styles.statValue}>{avgScore}%</Text>
            <Text style={styles.statLabel}>Avg Accuracy</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#8B5CF6' }]}>
            <Ionicons name="star" size={22} color="#8B5CF6" />
            <Text style={styles.statValue}>{bestScore}</Text>
            <Text style={styles.statLabel}>Best Score</Text>
          </View>
        </View>

        <Pressable style={styles.startCaseBtn} onPress={handleStartCase}>
          <View style={styles.startCaseIcon}>
            <Ionicons name="add-circle" size={28} color="#0F172A" />
          </View>
          <View style={styles.startCaseInfo}>
            <Text style={styles.startCaseTitle}>Start New Case</Text>
            <Text style={styles.startCaseDesc}>Choose a specialty and begin diagnosing</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#0F172A" />
        </Pressable>

        <View style={[styles.challengeCard, dailyChallenge?.completed && styles.challengeCompleted]}>
          <View style={styles.challengeHeader}>
            <View>
              <Text style={styles.challengeTitle}>
                {dailyChallenge?.completed ? '✅ Daily Challenge Done!' : '🔥 Daily Challenge'}
              </Text>
              <Text style={styles.challengeDesc}>
                {dailyChallenge?.completed
                  ? 'Great work! Come back tomorrow.'
                  : `${dailyChallenge?.specialty || ''} • ${dailyChallenge?.level || ''} • +${dailyChallenge?.bonusPoints || 0} pts`}
              </Text>
            </View>
            <View style={styles.timerBox}>
              <Ionicons name="time" size={14} color="#F59E0B" />
              <Text style={styles.timerText}>{timeLeft}</Text>
            </View>
          </View>
          <Pressable 
            style={[styles.challengeBtn, dailyChallenge?.completed && styles.challengeBtnDone]} 
            onPress={handleDailyChallenge}
          >
            <Text style={styles.challengeBtnText}>
              {dailyChallenge?.completed ? 'Completed' : 'Start Challenge'}
            </Text>
          </Pressable>
        </View>

        {badges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🏆 Latest Badges</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
              {badges.slice(-5).reverse().map((badge, index) => (
                <View key={index} style={styles.badgeItem}>
                  <Text style={styles.badgeEmoji}>{badge.split(' ')[0]}</Text>
                  <Text style={styles.badgeName}>{badge.split(' ').slice(1).join(' ')}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        <View style={{ height: 40 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  content: { padding: 20, paddingTop: 20 },
  headerSection: { marginBottom: 24, marginTop: 10 },
  greeting: { color: '#F8FAFC', fontSize: 30, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#94A3B8', fontSize: 15 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: {
    backgroundColor: '#1E293B', padding: 16, borderRadius: 16,
    width: '47%', borderLeftWidth: 3, gap: 8,
  },
  statValue: { color: '#F8FAFC', fontSize: 26, fontWeight: '800' },
  statLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '500' },
  sectionTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 14, marginTop: 6 },
  
  startCaseBtn: {
    backgroundColor: '#38BDF8', padding: 20, borderRadius: 20,
    flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24,
  },
  startCaseIcon: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#FFFFFF20', justifyContent: 'center', alignItems: 'center',
  },
  startCaseInfo: { flex: 1 },
  startCaseTitle: { color: '#0F172A', fontSize: 18, fontWeight: '800', marginBottom: 2 },
  startCaseDesc: { color: '#0F172A80', fontSize: 12, fontWeight: '500' },
  
  challengeCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F59E0B30' },
  challengeCompleted: { borderColor: '#10B98130' },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  challengeTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '700' },
  challengeDesc: { color: '#94A3B8', marginTop: 4, fontSize: 13 },
  timerBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  timerText: { color: '#F59E0B', fontWeight: '700', fontSize: 13 },
  challengeBtn: { backgroundColor: '#F59E0B', padding: 14, borderRadius: 14, alignItems: 'center' },
  challengeBtnDone: { backgroundColor: '#10B98115', borderWidth: 1, borderColor: '#10B98130' },
  challengeBtnText: { color: '#0F172A', fontWeight: '700', fontSize: 15 },
  
  badgeScroll: { marginBottom: 8 },
  badgeItem: {
    backgroundColor: '#1E293B', padding: 16, borderRadius: 14,
    marginRight: 10, alignItems: 'center', borderWidth: 1, borderColor: '#38BDF830', minWidth: 100,
  },
  badgeEmoji: { fontSize: 28, marginBottom: 6 },
  badgeName: { color: '#E2E8F0', fontSize: 11, fontWeight: '600', textAlign: 'center' },
});
