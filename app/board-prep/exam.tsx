import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Animated, Modal, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BoardQuestion, loadBoardQuestions, getMockBoardExam, getTotalLoadedQuestions } from '../flashcards/boardQuestions';
import { saveExamProgress, loadExamProgress, clearExamProgress, saveCompletedExam, formatTime, SavedExamState } from '../../src/utils/examStorage';

const ATTEMPT_COUNT_KEY = 'board_attempt_count';

const EXAM_CONFIGS: Record<string, { total: number; timePerBlock: number; blocks: number; label: string }> = {
  mock: { total: 40, timePerBlock: 48 * 60, blocks: 1, label: 'Mock Board' },
  half: { total: 200, timePerBlock: 60 * 60, blocks: 4, label: 'Half Board' },
  full: { total: 320, timePerBlock: 60 * 60, blocks: 8, label: 'Full Board' },
};

export default function BoardExamScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const { addPoints, recordActivity } = useStore();

  const config = EXAM_CONFIGS[mode || 'mock'] || EXAM_CONFIGS.mock;
  const questionsPerBlock = Math.floor(config.total / config.blocks);

  const [currentBlock, setCurrentBlock] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(config.timePerBlock);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [examQuestions, setExamQuestions] = useState<BoardQuestion[]>([]);
  const [blockQuestions, setBlockQuestions] = useState<BoardQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResuming, setIsResuming] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(0);
  const [actualTotal, setActualTotal] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      
      const savedState = await loadExamProgress();
      
      if (savedState && savedState.mode === mode && savedState.timeRemaining > 0) {
        setIsResuming(true);
        setExamQuestions(savedState.examQuestions);
        setAnswers(savedState.answers);
        setCurrentBlock(savedState.currentBlock);
        setCurrentQuestionIndex(savedState.currentQuestionIndex);
        setTimeRemaining(savedState.timeRemaining);
        setFlaggedQuestions(new Set(savedState.flaggedQuestions.map(Number)));
        setAttemptNumber(savedState.attemptNumber || 0);
        setActualTotal(savedState.examQuestions.length);
        
        const start = savedState.currentBlock * questionsPerBlock;
        const end = Math.min(start + questionsPerBlock, savedState.examQuestions.length);
        setBlockQuestions(savedState.examQuestions.slice(start, end));
        
        startTimeRef.current = Date.now() - (config.timePerBlock - savedState.timeRemaining) * 1000;
        setIsResuming(false);
        setIsLoading(false);
        return;
      }
      
      await loadBoardQuestions();
      const totalLoaded = getTotalLoadedQuestions();
      
      const stored = await AsyncStorage.getItem(ATTEMPT_COUNT_KEY);
      const currentAttempt = stored ? parseInt(stored) : 0;
      setAttemptNumber(currentAttempt);
      
      // 🆕 استخدم العدد الفعلي المتاح، مش العدد المكتوب
      const examSize = Math.min(config.total, totalLoaded);
      setActualTotal(examSize);
      
      const allQuestions = getMockBoardExam(examSize, currentAttempt);
      setExamQuestions(allQuestions);
      loadBlockQuestions(allQuestions, 0);
      
      await AsyncStorage.setItem(ATTEMPT_COUNT_KEY, (currentAttempt + 1).toString());
      startTimeRef.current = Date.now();
      setIsLoading(false);
    }
    init();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (examCompleted || isLoading || isResuming) return;
    saveTimerRef.current = setInterval(() => {
      saveExamProgress({
        mode: mode as any, boardType: 'internal_medicine',
        answers, currentBlock, currentQuestionIndex, timeRemaining,
        flaggedQuestions: Array.from(flaggedQuestions).map(String),
        examQuestions, startedAt: new Date(startTimeRef.current).toISOString(),
        lastSaved: new Date().toISOString(), totalBlocks: config.blocks,
        attemptNumber,
      });
    }, 30000);
    return () => { if (saveTimerRef.current) clearInterval(saveTimerRef.current); };
  }, [answers, currentBlock, currentQuestionIndex, timeRemaining, flaggedQuestions, examCompleted, isLoading]);

  useEffect(() => {
    if (examCompleted || isPaused || isLoading) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) { if (timerRef.current) clearInterval(timerRef.current); handleBlockTimeout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentBlock, isPaused, examCompleted, isLoading]);

  const loadBlockQuestions = (allQuestions: BoardQuestion[], block: number) => {
    const start = block * questionsPerBlock;
    const end = Math.min(start + questionsPerBlock, allQuestions.length);
    setBlockQuestions(allQuestions.slice(start, end));
    setCurrentQuestionIndex(0);
  };

  const handleBlockTimeout = () => {
    if (currentBlock < config.blocks - 1 && (currentBlock + 1) * questionsPerBlock < examQuestions.length) {
      goToNextBlock();
    } else {
      finishExam();
    }
  };

  const goToNextBlock = () => {
    const nextBlock = currentBlock + 1;
    setCurrentBlock(nextBlock);
    loadBlockQuestions(examQuestions, nextBlock);
    setTimeRemaining(config.timePerBlock);
  };

  const handleSelectAnswer = useCallback((questionId: string, optionId: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: optionId };
      saveExamProgress({
        mode: mode as any, boardType: 'internal_medicine',
        answers: newAnswers, currentBlock, currentQuestionIndex, timeRemaining,
        flaggedQuestions: Array.from(flaggedQuestions).map(String),
        examQuestions, startedAt: new Date(startTimeRef.current).toISOString(),
        lastSaved: new Date().toISOString(), totalBlocks: config.blocks,
        attemptNumber,
      });
      return newAnswers;
    });
  }, [currentBlock, currentQuestionIndex, timeRemaining, flaggedQuestions, examQuestions, mode, config.blocks, attemptNumber]);

  const toggleFlag = (questionIndex: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      newSet.has(questionIndex) ? newSet.delete(questionIndex) : newSet.add(questionIndex);
      return newSet;
    });
  };

  const getCurrentQuestion = () => blockQuestions[currentQuestionIndex] || null;
  const getAnsweredCount = () => blockQuestions.filter(q => answers[q.id]).length;

  const finishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    setExamCompleted(true);
    clearExamProgress();

    let correctCount = 0;
    const specialtyBreakdown: Record<string, { correct: number; total: number }> = {};
    examQuestions.forEach(q => {
      const userAnswer = answers[q.id];
      if (userAnswer === q.correctOptionId) correctCount++;
      if (!specialtyBreakdown[q.specialty]) specialtyBreakdown[q.specialty] = { correct: 0, total: 0 };
      specialtyBreakdown[q.specialty].total++;
      if (userAnswer === q.correctOptionId) specialtyBreakdown[q.specialty].correct++;
    });

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const score = Math.round((correctCount / examQuestions.length) * 100);

    addPoints(score >= 70 ? 200 : score >= 50 ? 100 : 50);
    recordActivity();
    if (score >= 90) useStore.getState().addBadge('🏅 Board Gold Medalist');
    else if (score >= 75) useStore.getState().addBadge('⭐ Board Top Scorer');
    else if (score >= 60) useStore.getState().addBadge('✅ Board Ready');

    saveCompletedExam({
      date: new Date().toISOString(), mode: mode || 'mock', boardType: 'internal_medicine',
      score, totalQuestions: examQuestions.length, timeSpent, correctCount,
      incorrectCount: examQuestions.length - correctCount - (examQuestions.length - Object.keys(answers).length),
      skippedCount: examQuestions.length - Object.keys(answers).length,
      specialtyBreakdown, flaggedQuestions: Array.from(flaggedQuestions).map(i => examQuestions[i]?.id).filter(Boolean),
      attemptNumber, answers,
    });
  };

  const handleSubmitBlock = () => setShowSubmitModal(true);
  const confirmSubmit = () => {
    setShowSubmitModal(false);
    if (currentBlock < config.blocks - 1 && (currentBlock + 1) * questionsPerBlock < examQuestions.length) {
      goToNextBlock();
    } else {
      finishExam();
    }
  };

  const currentQuestion = getCurrentQuestion();
  const globalQuestionNumber = currentBlock * questionsPerBlock + currentQuestionIndex + 1;
  const answeredCount = getAnsweredCount();
  const flaggedCount = flaggedQuestions.size;
  const unansweredCount = blockQuestions.length - answeredCount;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>{isResuming ? 'Resuming exam...' : 'Loading questions...'}</Text>
        </View>
      </View>
    );
  }

  if (examCompleted) {
    const correctCount = examQuestions.filter(q => answers[q.id] === q.correctOptionId).length;
    const scorePercent = Math.round((correctCount / examQuestions.length) * 100);
    const skippedCount = examQuestions.filter(q => !answers[q.id]).length;
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>{scorePercent >= 90 ? '🏆' : scorePercent >= 70 ? '🎉' : scorePercent >= 50 ? '📚' : '💪'}</Text>
          <Text style={styles.resultTitle}>Exam Complete!</Text>
          <Text style={styles.resultMode}>{config.label} • {examQuestions.length} questions</Text>
          <View style={styles.resultScoreCard}>
            <Text style={[styles.resultScore, { color: scorePercent >= 70 ? '#10B981' : scorePercent >= 50 ? '#F59E0B' : '#EF4444' }]}>{scorePercent}%</Text>
            <Text style={styles.resultFraction}>{correctCount} / {examQuestions.length} correct</Text>
          </View>
          <View style={styles.resultStats}>
            <View style={styles.resultStat}><Ionicons name="checkmark-circle" size={20} color="#10B981" /><Text style={styles.resultStatText}>Correct: {correctCount}</Text></View>
            <View style={styles.resultStat}><Ionicons name="close-circle" size={20} color="#EF4444" /><Text style={styles.resultStatText}>Incorrect: {examQuestions.length - correctCount - skippedCount}</Text></View>
            <View style={styles.resultStat}><Ionicons name="help-circle" size={20} color="#94A3B8" /><Text style={styles.resultStatText}>Skipped: {skippedCount}</Text></View>
            <View style={styles.resultStat}><Ionicons name="time" size={20} color="#F59E0B" /><Text style={styles.resultStatText}>Time: {formatTime(timeSpent)}</Text></View>
          </View>
          <View style={styles.resultActions}>
            <Pressable style={styles.reviewMistakesBtn} onPress={() => router.push('/board-prep/review')}>
              <Ionicons name="book" size={18} color="#FFF" /><Text style={styles.reviewMistakesBtnText}>Review Mistakes</Text>
            </Pressable>
            <Pressable style={styles.analyticsBtn} onPress={() => router.push('/board-prep/analytics')}>
              <Ionicons name="stats-chart" size={18} color="#38BDF8" /><Text style={styles.analyticsBtnText}>Analytics</Text>
            </Pressable>
            <Pressable style={styles.backToBoardBtn} onPress={() => router.back()}>
              <Ionicons name="home" size={18} color="#94A3B8" /><Text style={styles.backToBoardBtnText}>Board Prep Home</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No questions available</Text>
          <Pressable onPress={() => router.back()}><Text style={styles.backBtnText}>Go Back</Text></Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.examHeader}>
        <Pressable onPress={() => router.back()} style={styles.exitBtn}><Ionicons name="close" size={20} color="#94A3B8" /></Pressable>
        <View style={styles.examProgress}>
          <Text style={styles.examTitle}>{config.label} • Block {currentBlock + 1}/{config.blocks}</Text>
          <Text style={styles.examTimer}>⏱ {formatTime(timeRemaining)}</Text>
        </View>
        <Pressable onPress={() => setIsPaused(!isPaused)} style={styles.pauseBtn}>
          <Ionicons name={isPaused ? 'play' : 'pause'} size={20} color="#F59E0B" />
        </Pressable>
      </View>

      <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${(currentQuestionIndex / Math.max(blockQuestions.length, 1)) * 100}%` }]} /></View>

      <View style={styles.questionStats}>
        <Text style={styles.questionCounter}>Q{globalQuestionNumber}/{examQuestions.length}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.answeredStat}>✅ {answeredCount}</Text>
          <Text style={styles.flaggedStat}>🚩 {flaggedCount}</Text>
          <Text style={styles.unansweredStat}>❓ {unansweredCount}</Text>
        </View>
      </View>

      {isPaused && (
        <View style={styles.pausedOverlay}>
          <Text style={styles.pausedText}>⏸️ Exam Paused</Text>
          <Text style={styles.pausedSub}>Questions are hidden while paused</Text>
          <Pressable style={styles.resumeBtn} onPress={() => setIsPaused(false)}><Text style={styles.resumeBtnText}>Resume Exam</Text></Pressable>
        </View>
      )}

      {!isPaused && currentQuestion && (
        <ScrollView style={styles.questionScroll}>
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.topicBadge}><Text style={styles.topicText}>{currentQuestion.topic}</Text></View>
              <View style={[styles.diffBadge, { backgroundColor: currentQuestion.difficulty === 'hard' ? '#EF444420' : currentQuestion.difficulty === 'medium' ? '#F59E0B20' : '#10B98120' }]}>
                <Text style={[styles.diffText, { color: currentQuestion.difficulty === 'hard' ? '#EF4444' : currentQuestion.difficulty === 'medium' ? '#F59E0B' : '#10B981' }]}>{currentQuestion.difficulty}</Text>
              </View>
            </View>
            <Text style={styles.vignette}>{currentQuestion.vignette}</Text>
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option: any) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                return (
                  <Pressable key={option.id} style={[styles.optionCard, isSelected && styles.optionSelected]} onPress={() => handleSelectAnswer(currentQuestion.id, option.id)}>
                    <View style={[styles.optionCircle, isSelected && styles.optionCircleSelected]}><Text style={[styles.optionLetter, isSelected && styles.optionLetterSelected]}>{option.id}</Text></View>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option.text}</Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.questionActions}>
              <Pressable style={[styles.flagBtn, flaggedQuestions.has(currentQuestionIndex) && styles.flagBtnActive]} onPress={() => toggleFlag(currentQuestionIndex)}>
                <Ionicons name={flaggedQuestions.has(currentQuestionIndex) ? 'flag' : 'flag-outline'} size={18} color={flaggedQuestions.has(currentQuestionIndex) ? '#EF4444' : '#94A3B8'} />
                <Text style={[styles.flagText, flaggedQuestions.has(currentQuestionIndex) && styles.flagTextActive]}>{flaggedQuestions.has(currentQuestionIndex) ? 'Flagged' : 'Flag'}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}

      {!isPaused && (
        <View style={styles.bottomNav}>
          <Pressable style={[styles.navBtn, currentQuestionIndex === 0 && styles.navBtnDisabled]} onPress={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))} disabled={currentQuestionIndex === 0}>
            <Ionicons name="chevron-back" size={20} color={currentQuestionIndex === 0 ? '#64748B' : '#F8FAFC'} /><Text style={[styles.navBtnText, currentQuestionIndex === 0 && { color: '#64748B' }]}>Previous</Text>
          </Pressable>
          <Pressable style={styles.submitBlockBtn} onPress={handleSubmitBlock}><Text style={styles.submitBlockText}>{currentBlock < config.blocks - 1 ? 'End Block' : 'Finish Exam'}</Text></Pressable>
          <Pressable style={[styles.navBtn, currentQuestionIndex >= blockQuestions.length - 1 && styles.navBtnDisabled]} onPress={() => setCurrentQuestionIndex(prev => prev + 1)} disabled={currentQuestionIndex >= blockQuestions.length - 1}>
            <Text style={[styles.navBtnText, currentQuestionIndex >= blockQuestions.length - 1 && { color: '#64748B' }]}>Next</Text><Ionicons name="chevron-forward" size={20} color={currentQuestionIndex >= blockQuestions.length - 1 ? '#64748B' : '#F8FAFC'} />
          </Pressable>
        </View>
      )}

      <Modal visible={showSubmitModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>📋</Text>
            <Text style={styles.modalTitle}>{currentBlock < config.blocks - 1 ? 'End This Block?' : 'Finish Exam?'}</Text>
            <Text style={styles.modalText}>Answered: {answeredCount}/{blockQuestions.length}{'\n'}Flagged: {flaggedCount}{'\n'}Unanswered: {unansweredCount}</Text>
            {unansweredCount > 0 && <Text style={styles.modalWarning}>⚠️ You have {unansweredCount} unanswered questions!</Text>}
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancelBtn} onPress={() => setShowSubmitModal(false)}><Text style={styles.modalCancelText}>Go Back</Text></Pressable>
              <Pressable style={styles.modalConfirmBtn} onPress={confirmSubmit}><Text style={styles.modalConfirmText}>{currentBlock < config.blocks - 1 ? 'End Block' : 'Submit Exam'}</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { color: '#94A3B8', fontSize: 16 },
  backBtnText: { color: '#FFF', fontSize: 16 },
  examHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#1A1F2E', gap: 8 },
  exitBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  examProgress: { flex: 1 },
  examTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '700' },
  examTimer: { color: '#F59E0B', fontSize: 13, fontWeight: '600', marginTop: 2 },
  pauseBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  progressBar: { height: 3, backgroundColor: '#1E293B' },
  progressFill: { height: '100%', backgroundColor: '#38BDF8' },
  questionStats: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#0F172A' },
  questionCounter: { color: '#F8FAFC', fontSize: 14, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 12 },
  answeredStat: { color: '#10B981', fontSize: 12, fontWeight: '600' },
  flaggedStat: { color: '#EF4444', fontSize: 12, fontWeight: '600' },
  unansweredStat: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  pausedOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.9)', gap: 12 },
  pausedText: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  pausedSub: { color: '#94A3B8', fontSize: 14 },
  resumeBtn: { backgroundColor: '#38BDF8', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14, marginTop: 8 },
  resumeBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  questionScroll: { flex: 1, padding: 16 },
  questionCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  topicBadge: { backgroundColor: '#38BDF820', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  topicText: { color: '#38BDF8', fontSize: 11, fontWeight: '700' },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  diffText: { fontSize: 11, fontWeight: '700' },
  vignette: { color: '#E2E8F0', fontSize: 15, lineHeight: 24, marginBottom: 24 },
  optionsContainer: { gap: 10 },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#0F172A', padding: 16, borderRadius: 14, borderWidth: 2, borderColor: '#334155' },
  optionSelected: { borderColor: '#38BDF8', backgroundColor: '#38BDF810' },
  optionCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#64748B', justifyContent: 'center', alignItems: 'center' },
  optionCircleSelected: { borderColor: '#38BDF8', backgroundColor: '#38BDF8' },
  optionLetter: { color: '#94A3B8', fontSize: 14, fontWeight: '700' },
  optionLetterSelected: { color: '#FFF' },
  optionText: { color: '#CBD5E1', fontSize: 14, flex: 1, lineHeight: 22 },
  optionTextSelected: { color: '#F8FAFC' },
  questionActions: { marginTop: 16, flexDirection: 'row', justifyContent: 'center' },
  flagBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, borderRadius: 10, backgroundColor: '#0F172A' },
  flagBtnActive: { backgroundColor: '#EF444415' },
  flagText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  flagTextActive: { color: '#EF4444' },
  bottomNav: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#1A1F2E', borderTopWidth: 1, borderTopColor: '#1E293B', gap: 8 },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 10, borderRadius: 10, backgroundColor: '#1E293B', flex: 1, justifyContent: 'center' },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { color: '#F8FAFC', fontSize: 13, fontWeight: '600' },
  submitBlockBtn: { padding: 10, borderRadius: 10, backgroundColor: '#F59E0B', flex: 1, alignItems: 'center' },
  submitBlockText: { color: '#0F172A', fontSize: 13, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  modalCard: { backgroundColor: '#1E293B', padding: 24, borderRadius: 20, width: '100%', maxWidth: 340, alignItems: 'center' },
  modalEmoji: { fontSize: 40, marginBottom: 8 },
  modalTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  modalText: { color: '#94A3B8', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 8 },
  modalWarning: { color: '#EF4444', fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 16 },
  modalActions: { flexDirection: 'row', gap: 10, width: '100%' },
  modalCancelBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#334155', alignItems: 'center' },
  modalCancelText: { color: '#E2E8F0', fontWeight: '600' },
  modalConfirmBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#F59E0B', alignItems: 'center' },
  modalConfirmText: { color: '#0F172A', fontWeight: '700' },
  resultContainer: { flex: 1, padding: 20, alignItems: 'center', paddingTop: 40 },
  resultEmoji: { fontSize: 70, marginBottom: 8 },
  resultTitle: { color: '#F8FAFC', fontSize: 28, fontWeight: '900' },
  resultMode: { color: '#94A3B8', fontSize: 14, marginBottom: 20 },
  resultScoreCard: { alignItems: 'center', marginBottom: 20 },
  resultScore: { fontSize: 56, fontWeight: '900' },
  resultFraction: { color: '#94A3B8', fontSize: 16, marginTop: 4 },
  resultStats: { width: '100%', backgroundColor: '#1E293B', padding: 16, borderRadius: 14, gap: 10, marginBottom: 20 },
  resultStat: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultStatText: { color: '#E2E8F0', fontSize: 14 },
  resultActions: { width: '100%', gap: 8 },
  reviewMistakesBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#8B5CF6', padding: 16, borderRadius: 14 },
  reviewMistakesBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  analyticsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1E293B', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#334155' },
  analyticsBtnText: { color: '#38BDF8', fontSize: 16, fontWeight: '600' },
  backToBoardBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1E293B', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#334155' },
  backToBoardBtnText: { color: '#94A3B8', fontSize: 16, fontWeight: '600' },
});
