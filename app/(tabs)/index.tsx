import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  const router = useRouter();
  const { completedCases, totalPoints, badges, getAccuracy } = useStore();
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
  const today = new Date().toISOString().split('T')[0];
  const todayCases = completedCases.filter((c) => c.date?.startsWith(today));
  const bestScore = completedCases.length > 0
    ? Math.max(...completedCases.map(c => c.score))
    : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        <View style={styles.headerSection}>
          <Text style={styles.greeting}>Good Day, Doctor</Text>
          <Text style={styles.subtitle}>Ready to sharpen your diagnostic skills?</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: '#38BDF8' }]}>
            <View style={styles.statIconBox}>
              <Ionicons name="trophy" size={22} color="#38BDF8" />
            </View>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
            <View style={styles.statIconBox}>
              <Ionicons name="checkmark-circle" size={22} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{completedCases.length}</Text>
            <Text style={styles.statLabel}>Cases Solved</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
            <View style={styles.statIconBox}>
              <Ionicons name="analytics" size={22} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{avgScore}%</Text>
            <Text style={styles.statLabel}>Avg Accuracy</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: '#8B5CF6' }]}>
            <View style={styles.statIconBox}>
              <Ionicons name="star" size={22} color="#8B5CF6" />
            </View>
            <Text style={styles.statValue}>{bestScore}</Text>
            <Text style={styles.statLabel}>Best Score</Text>
          </View>
        </View>

        <View style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <View>
              <Text style={styles.challengeTitle}>🔥 Daily Challenge</Text>
              <Text style={styles.challengeDesc}>
                {todayCases.length > 0 
                  ? `You solved ${todayCases.length} case(s) today!` 
                  : 'No cases solved today yet'}
              </Text>
            </View>
            <View style={styles.timerBox}>
              <Ionicons name="time" size={16} color="#F59E0B" />
              <Text style={styles.timerText}>{timeLeft}</Text>
            </View>
          </View>
          <Pressable style={styles.challengeBtn} onPress={() => router.push('/cases')}>
            <Text style={styles.challengeBtnText}>
              {todayCases.length > 0 ? 'Continue Solving' : 'Start Today\'s Challenge'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#0F172A" />
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionGrid}>
          <Pressable style={styles.actionCard} onPress={() => router.push('/specialties')}>
            <View style={[styles.actionIcon, { backgroundColor: '#38BDF820' }]}>
              <Ionicons name="medkit" size={28} color="#38BDF8" />
            </View>
            <Text style={styles.actionTitle}>Cases Library</Text>
            <Text style={styles.actionDesc}>Browse specialties</Text>
          </Pressable>

          <Pressable style={styles.actionCard} onPress={() => router.push('/profile/history')}>
            <View style={[styles.actionIcon, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="bar-chart" size={28} color="#10B981" />
            </View>
            <Text style={styles.actionTitle}>Analytics</Text>
            <Text style={styles.actionDesc}>View your progress</Text>
          </Pressable>

          <Pressable style={styles.actionCard} onPress={() => router.push('/leaderboard')}>
            <View style={[styles.actionIcon, { backgroundColor: '#F59E0B20' }]}>
              <Ionicons name="podium" size={28} color="#F59E0B" />
            </View>
            <Text style={styles.actionTitle}>Leaderboard</Text>
            <Text style={styles.actionDesc}>Global rankings</Text>
          </Pressable>

          <Pressable style={styles.actionCard} onPress={() => router.push('/profile')}>
            <View style={[styles.actionIcon, { backgroundColor: '#8B5CF620' }]}>
              <Ionicons name="person" size={28} color="#8B5CF6" />
            </View>
            <Text style={styles.actionTitle}>Profile</Text>
            <Text style={styles.actionDesc}>Badges & stats</Text>
          </Pressable>
        </View>
<Pressable style={styles.actionCard} onPress={() => router.push('/quests')}>
   <View style={[styles.actionIcon, { backgroundColor: '#10B98120' }]}>
     <Ionicons name="checkbox" size={28} color="#10B981" />
   </View>
   <Text style={styles.actionTitle}>Quests</Text>
   <Text style={styles.actionDesc}>Earn rewards</Text>
 </Pressable>

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
  content: { padding: 20 },
  headerSection: { marginBottom: 24 },
  greeting: { color: '#F8FAFC', fontSize: 30, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#94A3B8', fontSize: 15 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    width: '47%',
    borderLeftWidth: 3,
  },
  statIconBox: { marginBottom: 10 },
  statValue: { color: '#F8FAFC', fontSize: 26, fontWeight: '800', marginBottom: 2 },
  statLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '500' },

  challengeCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F59E0B30' },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  challengeTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '700' },
  challengeDesc: { color: '#94A3B8', marginTop: 4, fontSize: 13 },
  timerBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  timerText: { color: '#F59E0B', fontWeight: '700', fontSize: 13 },
  challengeBtn: { backgroundColor: '#F59E0B', padding: 16, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  challengeBtnText: { color: '#0F172A', fontWeight: '700', fontSize: 15 },

  sectionTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 14, marginTop: 6 },

  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  actionCard: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    width: '47%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  actionDesc: { color: '#64748B', fontSize: 11 },

  badgeScroll: { marginBottom: 8 },
  badgeItem: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38BDF830',
    minWidth: 100,
  },
  badgeEmoji: { fontSize: 28, marginBottom: 6 },
  badgeName: { color: '#E2E8F0', fontSize: 11, fontWeight: '600', textAlign: 'center' },
});
