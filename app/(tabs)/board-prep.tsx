import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTotalLoadedQuestions, loadBoardQuestions } from '../flashcards/boardQuestions';
import { getUnfinishedExamSummary, clearExamProgress, formatTime, formatRelativeTime } from '../../src/utils/examStorage';

const BOARD_STORAGE_KEY = 'board_prep_data';

const BOARD_TYPES = [
  { id: 'internal_medicine', name: 'Internal Medicine', emoji: '🫀', color: '#3B82F6', description: 'Adult diseases & chronic conditions', specialties: 11, status: 'active', comingSoon: false },
  { id: 'pediatrics', name: 'Pediatrics', emoji: '👶', color: '#10B981', description: 'Child healthcare & development', specialties: 1, status: 'active', comingSoon: false },
  { id: 'obgyn', name: 'OB/GYN', emoji: '👩‍⚕️', color: '#EC4899', description: 'Women health & pregnancy', specialties: 0, status: 'coming_soon', comingSoon: true },
  { id: 'psychiatry', name: 'Psychiatry', emoji: '🧠', color: '#8B5CF6', description: 'Mental health & disorders', specialties: 0, status: 'coming_soon', comingSoon: true },
  { id: 'surgery', name: 'Surgery', emoji: '💀', color: '#EF4444', description: 'Operative procedures & trauma', specialties: 0, status: 'coming_soon', comingSoon: true },
  { id: 'emergency_medicine', name: 'Emergency Medicine', emoji: '🚑', color: '#F97316', description: 'Acute care & resuscitation', specialties: 0, status: 'coming_soon', comingSoon: true },
];

const REQUIRED_QUESTIONS = {
  mock: 40,
  half: 200,
  full: 320,
};

export default function BoardPrepScreen() {
  const router = useRouter();
  const { getLevel, getLevelTitle } = useStore();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [selectedBoard, setSelectedBoard] = useState('internal_medicine');
  const [unfinishedExam, setUnfinishedExam] = useState<any>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const level = getLevel();
  const levelTitle = getLevelTitle(level);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    loadAttempts();
    checkForUnfinishedExam();
    loadQuestionCount();
  }, []);

  const loadQuestionCount = async () => {
    await loadBoardQuestions();
    setTotalQuestions(getTotalLoadedQuestions());
  };

  const loadAttempts = async () => {
    try {
      const stored = await AsyncStorage.getItem(BOARD_STORAGE_KEY);
      if (stored) setAttempts(JSON.parse(stored));
    } catch {}
  };

  const checkForUnfinishedExam = async () => {
    const summary = await getUnfinishedExamSummary();
    setUnfinishedExam(summary);
  };

  const getBoardAttempts = (boardId: string) => {
    return attempts.filter(a => a.boardType === boardId || (boardId === 'internal_medicine' && !a.boardType));
  };

  const getBestScore = (boardId: string) => {
    const ba = getBoardAttempts(boardId);
    if (ba.length === 0) return null;
    return Math.max(...ba.map(a => (a.correctCount / a.totalQuestions) * 100));
  };

  const handleBoardSelect = (boardId: string) => {
    const board = BOARD_TYPES.find(b => b.id === boardId);
    if (board?.comingSoon) return;
    setSelectedBoard(boardId);
  };

  const handleStartExam = (mode: string) => {
    router.push(`/board-prep/exam?mode=${mode}`);
  };

  const isUnlocked = (mode: string) => {
    return totalQuestions >= REQUIRED_QUESTIONS[mode as keyof typeof REQUIRED_QUESTIONS];
  };

  const currentBoard = BOARD_TYPES.find(b => b.id === selectedBoard);
  const boardAttempts = getBoardAttempts(selectedBoard);
  const bestScore = getBestScore(selectedBoard);
  const uniqueExams = totalQuestions > 0 ? Math.floor(totalQuestions / 40) : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>🎓 Board Prep</Text>
            <Text style={styles.headerSub}>{levelTitle} • Level {level}</Text>
          </View>
        </View>

        {unfinishedExam && (
          <View style={styles.resumeCard}>
            <View style={styles.resumeHeader}>
              <Ionicons name="warning" size={24} color="#F59E0B" />
              <View style={styles.resumeInfo}>
                <Text style={styles.resumeTitle}>⚠️ Unfinished Exam Found</Text>
                <Text style={styles.resumeSubtitle}>🫀 Internal Medicine • {unfinishedExam.mode === 'mock' ? 'Mock' : unfinishedExam.mode === 'half' ? 'Half' : 'Full'} Board</Text>
              </View>
            </View>
            <View style={styles.resumeStats}>
              <View style={styles.resumeStat}><Ionicons name="checkmark-circle" size={16} color="#10B981" /><Text style={styles.resumeStatText}>{unfinishedExam.answeredCount}/{unfinishedExam.totalQuestions}</Text></View>
              <View style={styles.resumeStat}><Ionicons name="time" size={16} color="#F59E0B" /><Text style={styles.resumeStatText}>{formatTime(unfinishedExam.timeRemaining)}</Text></View>
            </View>
            <View style={styles.resumeProgressBar}><View style={[styles.resumeProgressFill, { width: `${unfinishedExam.progress}%` }]} /></View>
            <Text style={styles.resumeTime}>Started {formatRelativeTime(unfinishedExam.startedAt)}</Text>
            <View style={styles.resumeActions}>
              <Pressable style={styles.resumeBtn} onPress={() => router.push(`/board-prep/exam?mode=${unfinishedExam.mode}`)}>
                <Ionicons name="play" size={18} color="#FFF" /><Text style={styles.resumeBtnText}>Continue</Text>
              </Pressable>
              <Pressable style={styles.discardBtn} onPress={async () => { await clearExamProgress(); setUnfinishedExam(null); }}>
                <Ionicons name="trash-outline" size={18} color="#EF4444" /><Text style={styles.discardBtnText}>Discard</Text>
              </Pressable>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Select Board</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.boardSelector}>
          {BOARD_TYPES.map(board => (
            <Pressable key={board.id} style={[styles.boardChip, selectedBoard === board.id && { backgroundColor: board.color + '20', borderColor: board.color }, board.comingSoon && styles.boardChipComingSoon]} onPress={() => handleBoardSelect(board.id)}>
              <Text style={styles.boardChipEmoji}>{board.emoji}</Text>
              <Text style={[styles.boardChipName, selectedBoard === board.id && { color: board.color }]}>{board.name}</Text>
              {board.comingSoon && <View style={styles.comingSoonBadge}><Text style={styles.comingSoonText}>Soon</Text></View>}
            </Pressable>
          ))}
        </ScrollView>

        {currentBoard && !currentBoard.comingSoon && (
          <>
            <View style={[styles.boardInfoCard, { borderColor: currentBoard.color + '40' }]}>
              <View style={styles.boardInfoHeader}>
                <Text style={styles.boardInfoEmoji}>{currentBoard.emoji}</Text>
                <View style={styles.boardInfoText}>
                  <Text style={styles.boardInfoName}>{currentBoard.name}</Text>
                  <Text style={styles.boardInfoDesc}>{currentBoard.description}</Text>
                </View>
              </View>
              <View style={styles.boardStats}>
                <View style={styles.boardStat}><Text style={styles.boardStatValue}>{totalQuestions}</Text><Text style={styles.boardStatLabel}>Questions</Text></View>
                <View style={styles.boardStatDivider} />
                <View style={styles.boardStat}><Text style={styles.boardStatValue}>{uniqueExams}</Text><Text style={styles.boardStatLabel}>Mock Exams</Text></View>
                <View style={styles.boardStatDivider} />
                <View style={styles.boardStat}><Text style={styles.boardStatValue}>{currentBoard.specialties}</Text><Text style={styles.boardStatLabel}>Specialties</Text></View>
              </View>
            </View>

            {boardAttempts.length > 0 && (
              <View style={styles.statsCard}>
                <Text style={styles.statsTitle}>Your Progress</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}><Text style={styles.statValue}>{boardAttempts.length}</Text><Text style={styles.statLabel}>Attempts</Text></View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}><Text style={[styles.statValue, { color: bestScore && bestScore >= 70 ? '#10B981' : '#F59E0B' }]}>{bestScore ? `${Math.round(bestScore)}%` : '--'}</Text><Text style={styles.statLabel}>Best</Text></View>
                </View>
              </View>
            )}

            <Text style={styles.sectionTitle}>Select Exam Mode</Text>
            
            <Pressable style={styles.examCard} onPress={() => handleStartExam('mock')}>
              <View style={styles.examHeader}>
                <View style={[styles.examIcon, { backgroundColor: '#10B98120' }]}><Ionicons name="school" size={28} color="#10B981" /></View>
                <View style={styles.examInfo}><Text style={styles.examTitle}>Mock Board</Text><Text style={styles.examDesc}>40 questions • 48 minutes</Text></View>
                <Ionicons name="play-circle" size={32} color="#10B981" />
              </View>
            </Pressable>

            <Pressable style={[styles.examCard, !isUnlocked('half') && styles.examDisabled]} onPress={() => isUnlocked('half') && handleStartExam('half')}>
              <View style={styles.examHeader}>
                <View style={[styles.examIcon, { backgroundColor: isUnlocked('half') ? '#F59E0B20' : '#334155' }]}><Ionicons name="ribbon" size={28} color={isUnlocked('half') ? '#F59E0B' : '#64748B'} /></View>
                <View style={styles.examInfo}><Text style={styles.examTitle}>Half Board</Text><Text style={styles.examDesc}>200 questions • 4 hours</Text></View>
                {isUnlocked('half') ? <Ionicons name="play-circle" size={32} color="#F59E0B" /> : 
                  <View style={styles.lockBadge}><Ionicons name="lock-closed" size={16} color="#64748B" /><Text style={styles.lockText}>{totalQuestions}/200</Text></View>}
              </View>
            </Pressable>

            <Pressable style={[styles.examCard, !isUnlocked('full') && styles.examDisabled]} onPress={() => isUnlocked('full') && handleStartExam('full')}>
              <View style={styles.examHeader}>
                <View style={[styles.examIcon, { backgroundColor: isUnlocked('full') ? '#EF444420' : '#334155' }]}><Ionicons name="trophy" size={28} color={isUnlocked('full') ? '#EF4444' : '#64748B'} /></View>
                <View style={styles.examInfo}><Text style={styles.examTitle}>Full Board</Text><Text style={styles.examDesc}>320 questions • 8 hours</Text></View>
                {isUnlocked('full') ? <Ionicons name="play-circle" size={32} color="#EF4444" /> : 
                  <View style={styles.lockBadge}><Ionicons name="lock-closed" size={16} color="#64748B" /><Text style={styles.lockText}>{totalQuestions}/320</Text></View>}
              </View>
            </Pressable>
          </>
        )}

        {currentBoard?.comingSoon && (
          <View style={styles.comingSoonContainer}>
            <Ionicons name="time" size={60} color="#64748B" />
            <Text style={styles.comingSoonTitle}>Coming Soon</Text>
            <Text style={styles.comingSoonDesc}>We're working on creating high-quality questions for this board.</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  content: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1 },
  headerTitle: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  headerSub: { color: '#94A3B8', fontSize: 13, marginTop: 2 },
  sectionTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 8 },
  boardSelector: { marginBottom: 16 },
  boardChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5, borderColor: '#334155', marginRight: 10, backgroundColor: '#1E293B' },
  boardChipComingSoon: { opacity: 0.6 },
  boardChipEmoji: { fontSize: 20 },
  boardChipName: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  comingSoonBadge: { backgroundColor: '#F59E0B20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#F59E0B40' },
  comingSoonText: { color: '#F59E0B', fontSize: 10, fontWeight: '700' },
  boardInfoCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1.5 },
  boardInfoHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  boardInfoEmoji: { fontSize: 40 },
  boardInfoText: { flex: 1 },
  boardInfoName: { color: '#F8FAFC', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  boardInfoDesc: { color: '#94A3B8', fontSize: 13 },
  boardStats: { flexDirection: 'row', backgroundColor: '#0F172A', borderRadius: 10, padding: 10 },
  boardStat: { flex: 1, alignItems: 'center' },
  boardStatValue: { color: '#F8FAFC', fontSize: 18, fontWeight: '800' },
  boardStatLabel: { color: '#64748B', fontSize: 10, marginTop: 2 },
  boardStatDivider: { width: 1, backgroundColor: '#334155' },
  statsCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  statsTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  statLabel: { color: '#94A3B8', fontSize: 11, marginTop: 4 },
  statDivider: { width: 1, height: 40, backgroundColor: '#334155' },
  examCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  examDisabled: { opacity: 0.4 },
  examHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  examIcon: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  examInfo: { flex: 1 },
  examTitle: { color: '#F8FAFC', fontSize: 17, fontWeight: '700', marginBottom: 2 },
  examDesc: { color: '#94A3B8', fontSize: 12 },
  lockBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  lockText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  resumeCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1.5, borderColor: '#F59E0B40' },
  resumeHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  resumeInfo: { flex: 1 },
  resumeTitle: { color: '#F59E0B', fontSize: 16, fontWeight: '700' },
  resumeSubtitle: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  resumeStats: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  resumeStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resumeStatText: { color: '#E2E8F0', fontSize: 12 },
  resumeProgressBar: { height: 4, backgroundColor: '#0F172A', borderRadius: 2, marginBottom: 8 },
  resumeProgressFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 2 },
  resumeTime: { color: '#64748B', fontSize: 11, marginBottom: 12 },
  resumeActions: { flexDirection: 'row', gap: 8 },
  resumeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F59E0B', padding: 12, borderRadius: 12 },
  resumeBtnText: { color: '#0F172A', fontSize: 14, fontWeight: '700' },
  discardBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#EF444420', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#EF444440' },
  discardBtnText: { color: '#EF4444', fontSize: 14, fontWeight: '600' },
  comingSoonContainer: { alignItems: 'center', padding: 40, gap: 12 },
  comingSoonTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '700' },
  comingSoonDesc: { color: '#94A3B8', fontSize: 14, textAlign: 'center' },
});
