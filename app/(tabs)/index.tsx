import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Animated, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store';
import { Ionicons } from '@expo/vector-icons';
import { getDailyChallenge } from '../../src/utils/dailyChallenge';
import DailyStreak from '../../components/DailyStreak';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BOARD_STORAGE_KEY = 'board_prep_data';

export default function Dashboard() {
  const router = useRouter();
  const { completedCases, totalPoints, badges, getAccuracy, dailyChallenge, setDailyChallenge, setCategory, streak, recordActivity } = useStore();
  const [timeLeft, setTimeLeft] = useState('');
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [streakPopupData, setStreakPopupData] = useState<{ bonus: number; badge?: string } | null>(null);
  const [boardStats, setBoardStats] = useState<{ attempts: number; bestScore: number | null; lastScore: number | null }>({ attempts: 0, bestScore: null, lastScore: null });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const popupAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!dailyChallenge || dailyChallenge.date !== today) {
      const c = getDailyChallenge();
      setDailyChallenge({ date: c.date, specialty: c.specialty, level: c.level, caseId: c.case.id, completed: false, bonusPoints: c.bonusPoints });
    }
    loadBoardStats();
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date(); const mid = new Date(); mid.setHours(24,0,0,0);
      const d = mid.getTime() - now.getTime();
      setTimeLeft(`${Math.floor(d/3600000)}h ${Math.floor((d%3600000)/60000)}m`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (streak.lastActiveDate !== today) {
      const result = recordActivity();
      if (result.isNewDay && result.streakBonus > 0) {
        setStreakPopupData({ bonus: result.streakBonus, badge: result.badge });
        setShowStreakPopup(true);
        Animated.spring(popupAnim, { toValue: 1, useNativeDriver: true }).start();
        setTimeout(() => {
          Animated.timing(popupAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
            setShowStreakPopup(false);
          });
        }, 2500);
      }
    }
  }, []);

  const loadBoardStats = async () => {
    try {
      const stored = await AsyncStorage.getItem(BOARD_STORAGE_KEY);
      if (stored) {
        const attempts = JSON.parse(stored);
        if (attempts.length > 0) {
          const scores = attempts.map((a: any) => (a.correctCount / a.totalQuestions) * 100);
          setBoardStats({
            attempts: attempts.length,
            bestScore: Math.max(...scores),
            lastScore: scores[scores.length - 1],
          });
        }
      }
    } catch { }
  };

  const avg = getAccuracy();
  const best = completedCases.length > 0 ? Math.max(...completedCases.map(c => c.score)) : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

        <Text style={styles.greeting}>Good Day, Doctor</Text>
        <Text style={styles.subtitle}>Ready to sharpen your skills?</Text>

        {/* 🔥 Daily Streak */}
        <DailyStreak />

        <View style={styles.statsRow}>
          <View style={[styles.statItem, { borderLeftColor: '#38BDF8' }]}><Text style={styles.statVal}>{totalPoints}</Text><Text style={styles.statLbl}>Points</Text></View>
          <View style={[styles.statItem, { borderLeftColor: '#10B981' }]}><Text style={styles.statVal}>{completedCases.length}</Text><Text style={styles.statLbl}>Cases</Text></View>
          <View style={[styles.statItem, { borderLeftColor: '#F59E0B' }]}><Text style={styles.statVal}>{avg}%</Text><Text style={styles.statLbl}>Accuracy</Text></View>
          <View style={[styles.statItem, { borderLeftColor: '#8B5CF6' }]}><Text style={styles.statVal}>{best}</Text><Text style={styles.statLbl}>Best</Text></View>
        </View>

        <View style={[styles.dailyCard, dailyChallenge?.completed && styles.dailyDone]}>
          <View style={styles.dailyHeader}>
            <View>
              <Text style={styles.dailyTitle}>{dailyChallenge?.completed ? '✅ Done!' : '🔥 Daily Challenge'}</Text>
              <Text style={styles.dailyDesc}>{dailyChallenge?.completed ? 'Come back tomorrow!' : `${dailyChallenge?.specialty || ''} • +${dailyChallenge?.bonusPoints || 0} pts`}</Text>
            </View>
            <View style={styles.dailyTimer}><Ionicons name="time" size={14} color="#F59E0B" /><Text style={styles.dailyTimerText}>{timeLeft}</Text></View>
          </View>
          <Pressable style={[styles.dailyBtn, dailyChallenge?.completed && styles.dailyBtnDone]} onPress={() => { if (dailyChallenge && !dailyChallenge.completed) { setCategory(dailyChallenge.specialty, dailyChallenge.specialty, dailyChallenge.level); router.push('/cases'); } }}>
            <Text style={styles.dailyBtnText}>{dailyChallenge?.completed ? 'Completed' : 'Start Challenge →'}</Text>
          </Pressable>
        </View>

        {/* 🎓 Board Prep Card */}
        <View style={styles.boardCard}>
          <View style={styles.boardHeader}>
            <View style={[styles.boardIcon, { backgroundColor: '#8B5CF620' }]}>
              <Ionicons name="school" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.boardInfo}>
              <Text style={styles.boardTitle}>🎓 Board Prep</Text>
              <Text style={styles.boardDesc}>USMLE-style exam simulation</Text>
            </View>
            {boardStats.attempts > 0 && boardStats.lastScore && (
              <View style={[styles.boardScoreBadge, { backgroundColor: boardStats.lastScore >= 70 ? '#10B98120' : '#F59E0B20' }]}>
                <Text style={[styles.boardScoreText, { color: boardStats.lastScore >= 70 ? '#10B981' : '#F59E0B' }]}>
                  {Math.round(boardStats.lastScore)}%
                </Text>
              </View>
            )}
          </View>
          
          {boardStats.attempts > 0 ? (
            <View style={styles.boardStats}>
              <View style={styles.boardStat}>
                <Text style={styles.boardStatValue}>{boardStats.attempts}</Text>
                <Text style={styles.boardStatLabel}>Attempts</Text>
              </View>
              <View style={styles.boardStatDivider} />
              <View style={styles.boardStat}>
                <Text style={[styles.boardStatValue, { color: boardStats.bestScore && boardStats.bestScore >= 70 ? '#10B981' : '#F59E0B' }]}>
                  {boardStats.bestScore ? `${Math.round(boardStats.bestScore)}%` : '--'}
                </Text>
                <Text style={styles.boardStatLabel}>Best</Text>
              </View>
              <View style={styles.boardStatDivider} />
              <View style={styles.boardStat}>
                <Text style={styles.boardStatValue}>
                  {boardStats.lastScore ? `${Math.round(boardStats.lastScore)}%` : '--'}
                </Text>
                <Text style={styles.boardStatLabel}>Latest</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.boardNewText}>Take your first board exam and track your progress!</Text>
          )}
          
          <Pressable style={styles.boardBtn} onPress={() => router.push('/board-prep')}>
            <Text style={styles.boardBtnText}>
              {boardStats.attempts > 0 ? 'Continue Prep →' : 'Start Board Prep →'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>📚 Education</Text>
        <Pressable style={styles.card} onPress={() => router.push('/cases-tab')}>
          <View style={[styles.cardIcon, { backgroundColor: '#3B82F620' }]}><Ionicons name="medkit" size={22} color="#3B82F6" /></View>
          <View style={styles.cardInfo}><Text style={styles.cardTitle}>Clinical Cases</Text><Text style={styles.cardDesc}>AI-powered diagnostic simulations</Text></View>
          <Ionicons name="chevron-forward" size={16} color="#64748B" />
        </Pressable>
        <Pressable style={styles.card} onPress={() => router.push('/question-bank')}>
          <View style={[styles.cardIcon, { backgroundColor: '#8B5CF620' }]}><Ionicons name="help-circle" size={22} color="#8B5CF6" /></View>
          <View style={styles.cardInfo}><Text style={styles.cardTitle}>Question Bank</Text><Text style={styles.cardDesc}>UWorld-style MCQs with explanations</Text></View>
          <Ionicons name="chevron-forward" size={16} color="#64748B" />
        </Pressable>
        <Pressable style={styles.card} onPress={() => router.push('/flashcards')}>
          <View style={[styles.cardIcon, { backgroundColor: '#F59E0B20' }]}><Ionicons name="copy" size={22} color="#F59E0B" /></View>
          <View style={styles.cardInfo}><Text style={styles.cardTitle}>Flashcards</Text><Text style={styles.cardDesc}>Spaced repetition memory system</Text></View>
          <Ionicons name="chevron-forward" size={16} color="#64748B" />
        </Pressable>
        <Pressable style={styles.card} onPress={() => router.push('/image-challenge')}>
          <View style={[styles.cardIcon, { backgroundColor: '#EC489920' }]}><Ionicons name="image" size={22} color="#EC4899" /></View>
          <View style={styles.cardInfo}><Text style={styles.cardTitle}>Image Challenge</Text><Text style={styles.cardDesc}>Diagnose from medical images</Text></View>
          <Ionicons name="chevron-forward" size={16} color="#64748B" />
        </Pressable>

        <Text style={styles.sectionTitle}>🎮 Simulation</Text>
        <Pressable style={styles.card} onPress={() => router.push('/icu-sim' as any)}>
          <View style={[styles.cardIcon, { backgroundColor: '#EF444420' }]}><Ionicons name="pulse" size={22} color="#EF4444" /></View>
          <View style={styles.cardInfo}><Text style={styles.cardTitle}>ICU Simulator</Text><Text style={styles.cardDesc}>Manage critically ill patients</Text></View>
          <Ionicons name="chevron-forward" size={16} color="#64748B" />
        </Pressable>
        <Pressable style={styles.card} onPress={() => router.push('/osce-sim')}>
          <View style={[styles.cardIcon, { backgroundColor: '#06B6D420' }]}><Ionicons name="school" size={22} color="#06B6D4" /></View>
          <View style={styles.cardInfo}><Text style={styles.cardTitle}>OSCE Simulator</Text><Text style={styles.cardDesc}>Clinical exam stations</Text></View>
          <Ionicons name="chevron-forward" size={16} color="#64748B" />
        </Pressable>
        <Pressable style={styles.card} onPress={() => router.push('/resident-life')}>
          <View style={[styles.cardIcon, { backgroundColor: '#EF444420' }]}><Ionicons name="fitness" size={22} color="#EF4444" /></View>
          <View style={styles.cardInfo}><Text style={styles.cardTitle}>Resident Life</Text><Text style={styles.cardDesc}>Live a full ER shift</Text></View>
          <Ionicons name="chevron-forward" size={16} color="#64748B" />
        </Pressable>

        <Text style={styles.sectionTitle}>🌐 Social</Text>
        <Pressable style={styles.card} onPress={() => router.push('/community')}>
          <View style={[styles.cardIcon, { backgroundColor: '#10B98120' }]}><Ionicons name="people" size={22} color="#10B981" /></View>
          <View style={styles.cardInfo}><Text style={styles.cardTitle}>Community</Text><Text style={styles.cardDesc}>Connect with other doctors</Text></View>
          <Ionicons name="chevron-forward" size={16} color="#64748B" />
        </Pressable>

        {badges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🏆 Badges</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {badges.slice(-5).reverse().map((b, i) => (
                <View key={i} style={styles.badge}><Text style={styles.badgeEmoji}>{b.split(' ')[0]}</Text><Text style={styles.badgeName}>{b.split(' ').slice(1).join(' ')}</Text></View>
              ))}
            </ScrollView>
          </>
        )}

        <View style={{ height: 50 }} />
      </Animated.View>

      {/* 🔥 Streak Popup */}
      {showStreakPopup && streakPopupData && (
        <Modal transparent animationType="fade" visible={showStreakPopup}>
          <View style={styles.popupOverlay}>
            <Animated.View style={[styles.popupCard, { transform: [{ scale: popupAnim }] }]}>
              <Text style={styles.popupEmoji}>🔥</Text>
              <Text style={styles.popupTitle}>Daily Streak!</Text>
              <Text style={styles.popupSubtitle}>
                {streak.currentStreak} Day{streak.currentStreak > 1 ? 's' : ''} Strong!
              </Text>
              {streakPopupData.bonus > 0 && (
                <View style={styles.popupBonus}>
                  <Ionicons name="star" size={18} color="#F59E0B" />
                  <Text style={styles.popupBonusText}>+{streakPopupData.bonus} XP Bonus!</Text>
                </View>
              )}
              {streakPopupData.badge && (
                <Text style={styles.popupBadge}>{streakPopupData.badge}</Text>
              )}
            </Animated.View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  content: { padding: 16 },
  greeting: { color: '#F8FAFC', fontSize: 28, fontWeight: '800', marginTop: 6, marginBottom: 2 },
  subtitle: { color: '#94A3B8', fontSize: 14, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  statItem: { flex: 1, backgroundColor: '#1E293B', padding: 12, borderRadius: 12, borderLeftWidth: 3, alignItems: 'center' },
  statVal: { color: '#F8FAFC', fontSize: 18, fontWeight: '800' },
  statLbl: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  
  // Daily Challenge
  dailyCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F59E0B40' },
  dailyDone: { borderColor: '#10B98140' },
  dailyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  dailyTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' },
  dailyDesc: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  dailyTimer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  dailyTimerText: { color: '#F59E0B', fontSize: 11, fontWeight: '700' },
  dailyBtn: { backgroundColor: '#F59E0B', padding: 12, borderRadius: 12, alignItems: 'center' },
  dailyBtnDone: { backgroundColor: '#10B98115', borderWidth: 1, borderColor: '#10B98130' },
  dailyBtnText: { color: '#0F172A', fontSize: 13, fontWeight: '700' },

  // 🎓 Board Prep Card
  boardCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1.5, borderColor: '#8B5CF640' },
  boardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  boardIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  boardInfo: { flex: 1 },
  boardTitle: { color: '#F8FAFC', fontSize: 17, fontWeight: '700' },
  boardDesc: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  boardScoreBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  boardScoreText: { fontSize: 15, fontWeight: '800' },
  boardStats: { flexDirection: 'row', marginBottom: 12, backgroundColor: '#0F172A', borderRadius: 10, padding: 10 },
  boardStat: { flex: 1, alignItems: 'center' },
  boardStatValue: { color: '#F8FAFC', fontSize: 16, fontWeight: '800' },
  boardStatLabel: { color: '#64748B', fontSize: 9, marginTop: 2 },
  boardStatDivider: { width: 1, backgroundColor: '#334155' },
  boardNewText: { color: '#94A3B8', fontSize: 12, textAlign: 'center', marginBottom: 12, fontStyle: 'italic' },
  boardBtn: { backgroundColor: '#8B5CF6', padding: 12, borderRadius: 12, alignItems: 'center' },
  boardBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  // Sections
  sectionTitle: { color: '#94A3B8', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 12 },
  card: { backgroundColor: '#1E293B', padding: 12, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 5, borderWidth: 1, borderColor: '#334155' },
  cardIcon: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { color: '#F8FAFC', fontSize: 13, fontWeight: '700', marginBottom: 1 },
  cardDesc: { color: '#94A3B8', fontSize: 10 },
  
  // Badges
  badge: { backgroundColor: '#1E293B', padding: 10, borderRadius: 12, marginRight: 6, alignItems: 'center', borderWidth: 1, borderColor: '#38BDF830', minWidth: 70 },
  badgeEmoji: { fontSize: 20, marginBottom: 2 },
  badgeName: { color: '#E2E8F0', fontSize: 9, fontWeight: '600', textAlign: 'center' },

  // Popup
  popupOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 40 },
  popupCard: { backgroundColor: '#1E293B', padding: 30, borderRadius: 24, alignItems: 'center', borderWidth: 2, borderColor: '#F59E0B40', width: '100%', maxWidth: 300 },
  popupEmoji: { fontSize: 48, marginBottom: 8 },
  popupTitle: { color: '#F8FAFC', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  popupSubtitle: { color: '#94A3B8', fontSize: 14, marginBottom: 12 },
  popupBonus: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F59E0B15', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginBottom: 8 },
  popupBonusText: { color: '#F59E0B', fontSize: 16, fontWeight: '700' },
  popupBadge: { color: '#FFD700', fontSize: 18, fontWeight: '700', marginTop: 4 },
});
