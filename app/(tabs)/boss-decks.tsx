import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet, Text, View, Pressable, ScrollView, Animated, Dimensions, Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore, BOSS_DECKS } from '../../src/store';
import { BossCard } from '../flashcards/spacedRepetition';
import { ECG_BOSS_CARDS } from '../flashcards/bossDecks';
import DailyStreak from '../../components/DailyStreak';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BOSS_CARDS_MAP: Record<string, BossCard[]> = {
  ecg_boss: ECG_BOSS_CARDS,
  // Future bosses will be added here
};

export default function BossDecksScreen() {
  const router = useRouter();
  const {
    getLevel, getLevelProgress, isBossUnlocked, getBossProgress,
    defeatBoss, recordActivity, addPoints, bossProgress, totalPoints,
  } = useStore();

  const [selectedBoss, setSelectedBoss] = useState<string | null>(null);
  const [fightPhase, setFightPhase] = useState<'intro' | 'fighting' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hp, setHp] = useState(100);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [showExplanation, setShowExplanation] = useState(false);
  const [fightResult, setFightResult] = useState<{ won: boolean; score: number; total: number; flawless: boolean } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hpAnim = useRef(new Animated.Value(100)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const level = getLevel();
  const levelProgress = getLevelProgress();

  const handleBossSelect = (bossId: string) => {
    if (!isBossUnlocked(bossId)) return;
    setSelectedBoss(bossId);
    setFightPhase('intro');
  };

  const startFight = () => {
    setCurrentQuestionIndex(0);
    setHp(100);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setFightResult(null);
    setFightPhase('fighting');
    recordActivity();
    startTimer();
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const deck = BOSS_DECKS.find(d => d.id === selectedBoss);
    setTimeLeft(deck?.timePerQuestion || 45);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeout = () => {
    if (selectedAnswer) return;
    // Time's up - count as wrong
    handleAnswerSelect('TIMEOUT');
  };

  const shakeScreen = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleAnswerSelect = (optionId: string) => {
    if (selectedAnswer || !selectedBoss) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(optionId);
    const currentCards = BOSS_CARDS_MAP[selectedBoss];
    const question = currentCards?.[currentQuestionIndex];
    if (!question) return;

    const isCorrect = optionId === question.correctOptionId;
    const deck = BOSS_DECKS.find(d => d.id === selectedBoss);
    const hpLoss = deck?.hpLossPerWrong || 7;

    if (isCorrect) {
      setScore(prev => prev + 1);
      addPoints(10);
    } else {
      const newHp = Math.max(0, hp - hpLoss);
      setHp(newHp);
      Animated.timing(hpAnim, { toValue: newHp, duration: 300, useNativeDriver: false }).start();
      shakeScreen();
    }

    setTimeout(() => setShowExplanation(true), 500);
  };

  const nextQuestion = () => {
    if (!selectedBoss) return;
    const currentCards = BOSS_CARDS_MAP[selectedBoss];
    if (!currentCards) return;

    if (currentQuestionIndex < currentCards.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      startTimer();
    } else {
      // Fight over
      endFight();
    }
  };

  const endFight = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const deck = BOSS_DECKS.find(d => d.id === selectedBoss);
    if (!deck) return;

    const totalQuestions = deck.totalQuestions;
    const passed = score >= deck.passingScore;
    const flawless = score === totalQuestions && hp === 100;

    setFightResult({ won: passed, score, total: totalQuestions, flawless });
    setFightPhase('result');

    // Save boss progress
    defeatBoss(selectedBoss!, score, totalQuestions, flawless);

    // Record activity for streak
    recordActivity();
  };

  const resetFight = () => {
    setSelectedBoss(null);
    setFightPhase('intro');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setHp(100);
    setScore(0);
    setShowExplanation(false);
    setFightResult(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentBossDeck = selectedBoss ? BOSS_DECKS.find(d => d.id === selectedBoss) : null;
  const currentCards = selectedBoss ? BOSS_CARDS_MAP[selectedBoss] : null;
  const currentQuestion = currentCards?.[currentQuestionIndex];
  const isCorrectAnswer = currentQuestion && selectedAnswer === currentQuestion.correctOptionId;

  if (!selectedBoss) {
    // Boss Selection Screen
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
            </Pressable>
            <Text style={styles.headerTitle}>🎮 Boss Decks</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Lv.{level}</Text>
            </View>
          </View>

          {/* Level Progress */}
          <View style={styles.levelCard}>
            <View style={styles.levelRow}>
              <Text style={styles.levelTitle}>{levelProgress.title}</Text>
              <Text style={styles.levelXp}>Level {level} → {level + 1}</Text>
            </View>
            <View style={styles.xpBar}>
              <View style={[styles.xpFill, { width: `${levelProgress.progress}%` }]} />
            </View>
            <Text style={styles.xpText}>{Math.round(levelProgress.progress)}% to next level</Text>
          </View>

          <Text style={styles.subtitle}>Defeat bosses to earn epic rewards!</Text>

          {/* Boss Cards */}
          {BOSS_DECKS.map(boss => {
            const unlocked = isBossUnlocked(boss.id);
            const progress = getBossProgress(boss.id);
            return (
              <Pressable
                key={boss.id}
                style={[styles.bossCard, !unlocked && styles.bossLocked]}
                onPress={() => handleBossSelect(boss.id)}
              >
                <View style={styles.bossHeader}>
                  <Text style={styles.bossEmoji}>{boss.emoji}</Text>
                  <View style={styles.bossInfo}>
                    <Text style={styles.bossName}>{boss.name}</Text>
                    <Text style={styles.bossDesc}>{boss.description}</Text>
                  </View>
                  {unlocked ? (
                    <Ionicons name="play-circle" size={32} color={boss.color} />
                  ) : (
                    <View style={styles.lockBadge}>
                      <Ionicons name="lock-closed" size={18} color="#94A3B8" />
                      <Text style={styles.lockText}>Lv.{boss.requiredLevel}</Text>
                    </View>
                  )}
                </View>

                {/* Progress bar for unlocked bosses */}
                {unlocked && progress && (
                  <View style={styles.bossProgressBar}>
                    <View style={styles.bossProgressRow}>
                      <Text style={styles.bossProgressText}>
                        Best: {progress.bestScore}/{boss.totalQuestions}
                      </Text>
                      <Text style={styles.bossProgressText}>
                        Attempts: {progress.attempts}
                      </Text>
                    </View>
                    {progress.defeated && (
                      <Text style={styles.defeatedBadge}>🗡️ Defeated {progress.attempts}x</Text>
                    )}
                    {progress.flawless && (
                      <Text style={styles.flawlessBadge}>⭐ Flawless Victory!</Text>
                    )}
                  </View>
                )}

                {!unlocked && (
                  <View style={styles.lockedOverlay}>
                    <Text style={styles.lockedText}>
                      Reach Level {boss.requiredLevel} to unlock
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    );
  }

  // Intro Screen
  if (fightPhase === 'intro') {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Pressable onPress={resetFight} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#94A3B8" />
          </Pressable>

          <Text style={styles.introEmoji}>{currentBossDeck?.emoji}</Text>
          <Text style={styles.introTitle}>{currentBossDeck?.name}</Text>
          <Text style={styles.introDesc}>{currentBossDeck?.description}</Text>

          <View style={styles.introStats}>
            <View style={styles.introStat}>
              <Ionicons name="help-circle" size={20} color="#38BDF8" />
              <Text style={styles.introStatText}>{currentBossDeck?.totalQuestions} Questions</Text>
            </View>
            <View style={styles.introStat}>
              <Ionicons name="time" size={20} color="#F59E0B" />
              <Text style={styles.introStatText}>{currentBossDeck?.timePerQuestion}s per Q</Text>
            </View>
            <View style={styles.introStat}>
              <Ionicons name="trophy" size={20} color="#10B981" />
              <Text style={styles.introStatText}>Pass: {currentBossDeck?.passingScore}/{currentBossDeck?.totalQuestions}</Text>
            </View>
          </View>

          <View style={styles.introRewards}>
            <Text style={styles.introRewardTitle}>Rewards:</Text>
            <Text style={styles.introReward}>🗡️ +200 XP for defeating boss</Text>
            <Text style={styles.introReward}>⭐ +300 XP for flawless victory</Text>
            <Text style={styles.introReward}>🏆 Special Boss Badge</Text>
          </View>

          <Pressable style={[styles.fightBtn, { backgroundColor: currentBossDeck?.color }]} onPress={startFight}>
            <Text style={styles.fightBtnText}>⚔️ FIGHT!</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Fight Result Screen
  if (fightPhase === 'result' && fightResult) {
    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>
            {fightResult.won ? '🎉' : '💀'}
          </Text>
          <Text style={[styles.resultTitle, { color: fightResult.won ? '#10B981' : '#EF4444' }]}>
            {fightResult.won ? 'BOSS DEFEATED!' : 'DEFEATED BY BOSS'}
          </Text>
          <Text style={styles.resultScore}>
            Score: {fightResult.score}/{fightResult.total}
          </Text>
          <Text style={styles.resultHp}>
            HP Remaining: {hp}%
          </Text>

          {fightResult.flawless && (
            <View style={styles.flawlessBanner}>
              <Text style={styles.flawlessText}>⭐ FLAWLESS VICTORY! ⭐</Text>
              <Text style={styles.flawlessBonus}>+500 XP Bonus!</Text>
            </View>
          )}

          <View style={styles.resultActions}>
            <Pressable style={styles.retryBtn} onPress={startFight}>
              <Ionicons name="refresh" size={18} color="#FFF" />
              <Text style={styles.retryBtnText}>Retry Boss</Text>
            </Pressable>
            <Pressable style={styles.backToBossesBtn} onPress={resetFight}>
              <Ionicons name="list" size={18} color="#38BDF8" />
              <Text style={styles.backToBossesText}>Boss List</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // Fighting Screen
  return (
    <View style={styles.container}>
      {/* HP Bar */}
      <View style={styles.fightHeader}>
        <Pressable onPress={resetFight} style={styles.quitFightBtn}>
          <Ionicons name="close" size={22} color="#94A3B8" />
        </Pressable>

        <View style={styles.hpContainer}>
          <Text style={styles.hpLabel}>{currentBossDeck?.emoji} Boss HP</Text>
          <View style={styles.hpBar}>
            <Animated.View style={[styles.hpFill, { width: hpAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }), backgroundColor: hp > 50 ? '#10B981' : hp > 25 ? '#F59E0B' : '#EF4444' }]} />
          </View>
          <Text style={styles.hpText}>{hp}%</Text>
        </View>

        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Ionicons name="time" size={16} color={timeLeft <= 10 ? '#EF4444' : '#F59E0B'} />
        <Text style={[styles.timerText, timeLeft <= 10 && { color: '#EF4444' }]}>
          {timeLeft}s
        </Text>
      </View>

      {/* Question */}
      <Animated.View style={[styles.fightContent, { transform: [{ translateX: shakeAnim }] }]}>
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionCounter}>
              Q{currentQuestionIndex + 1}/{currentBossDeck?.totalQuestions}
            </Text>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>
                {currentQuestion?.difficulty === 'expert' ? '💀 Expert' : '🔥 Hard'}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.questionScroll}>
            <Text style={styles.questionText}>{currentQuestion?.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion?.options.map(option => {
                const isSelected = selectedAnswer === option.id;
                const isCorrectOption = option.id === currentQuestion.correctOptionId;
                let optionStyle = styles.optionCard;
                let optionTextStyle = styles.optionText;
                let iconName: any = 'ellipse-outline';
                let iconColor = '#64748B';

                if (selectedAnswer) {
                  if (isCorrectOption) {
                    optionStyle = { ...optionStyle, ...styles.optionCorrect };
                    optionTextStyle = { ...optionTextStyle, ...styles.optionTextCorrect };
                    iconName = 'checkmark-circle';
                    iconColor = '#10B981';
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = { ...optionStyle, ...styles.optionWrong };
                    optionTextStyle = { ...optionTextStyle, ...styles.optionTextWrong };
                    iconName = 'close-circle';
                    iconColor = '#EF4444';
                  }
                } else if (isSelected) {
                  optionStyle = { ...optionStyle, ...styles.optionSelected };
                  iconName = 'radio-button-on';
                  iconColor = '#38BDF8';
                }

                return (
                  <Pressable
                    key={option.id}
                    style={optionStyle}
                    onPress={() => handleAnswerSelect(option.id)}
                    disabled={!!selectedAnswer}
                  >
                    <Ionicons name={iconName} size={22} color={iconColor} />
                    <Text style={optionTextStyle}>
                      {option.id}) {option.text}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Explanation */}
            {showExplanation && (
              <View style={styles.explanationCard}>
                <View style={styles.explanationHeader}>
                  <Ionicons
                    name={isCorrectAnswer ? 'checkmark-circle' : 'close-circle'}
                    size={24}
                    color={isCorrectAnswer ? '#10B981' : '#EF4444'}
                  />
                  <Text style={[styles.explanationTitle, { color: isCorrectAnswer ? '#10B981' : '#EF4444' }]}>
                    {isCorrectAnswer ? 'Correct!' : 'Incorrect!'}
                  </Text>
                </View>
                <Text style={styles.explanationText}>{currentQuestion?.explanation}</Text>

                <Pressable style={styles.nextBtn} onPress={nextQuestion}>
                  <Text style={styles.nextBtnText}>
                    {currentQuestionIndex < (currentCards?.length || 0) - 1 ? 'Next Question →' : 'Finish Fight'}
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  content: { padding: 16 },
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#F8FAFC', fontSize: 24, fontWeight: '800', flex: 1 },
  levelBadge: { backgroundColor: '#F59E0B20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#F59E0B40' },
  levelBadgeText: { color: '#F59E0B', fontSize: 14, fontWeight: '700' },
  
  // Level Card
  levelCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  levelTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' },
  levelXp: { color: '#94A3B8', fontSize: 12 },
  xpBar: { height: 6, backgroundColor: '#0F172A', borderRadius: 3, marginBottom: 4 },
  xpFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 3 },
  xpText: { color: '#64748B', fontSize: 10 },
  
  subtitle: { color: '#94A3B8', fontSize: 13, marginBottom: 16 },
  
  // Boss Cards
  bossCard: {
    backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#334155',
  },
  bossLocked: { opacity: 0.7 },
  bossHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bossEmoji: { fontSize: 40 },
  bossInfo: { flex: 1 },
  bossName: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  bossDesc: { color: '#94A3B8', fontSize: 11, lineHeight: 16 },
  lockBadge: { alignItems: 'center', gap: 2 },
  lockText: { color: '#94A3B8', fontSize: 10, fontWeight: '600' },
  bossProgressBar: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#334155' },
  bossProgressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bossProgressText: { color: '#94A3B8', fontSize: 11 },
  defeatedBadge: { color: '#10B981', fontSize: 12, fontWeight: '700', marginTop: 4 },
  flawlessBadge: { color: '#F59E0B', fontSize: 12, fontWeight: '700' },
  lockedOverlay: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#334155' },
  lockedText: { color: '#EF4444', fontSize: 11, fontWeight: '600', textAlign: 'center' },
  
  // Intro Screen
  introContainer: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', gap: 16 },
  introEmoji: { fontSize: 80 },
  introTitle: { color: '#F8FAFC', fontSize: 32, fontWeight: '900' },
  introDesc: { color: '#94A3B8', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  introStats: { gap: 8, width: '100%', backgroundColor: '#1E293B', padding: 16, borderRadius: 14 },
  introStat: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  introStatText: { color: '#E2E8F0', fontSize: 14 },
  introRewards: { width: '100%', backgroundColor: '#1E293B', padding: 16, borderRadius: 14 },
  introRewardTitle: { color: '#F59E0B', fontSize: 14, fontWeight: '700', marginBottom: 6 },
  introReward: { color: '#E2E8F0', fontSize: 12, marginBottom: 2 },
  fightBtn: { paddingHorizontal: 40, paddingVertical: 16, borderRadius: 16, marginTop: 8 },
  fightBtnText: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  
  // Fight Header
  fightHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#1A1F2E', gap: 8 },
  quitFightBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  hpContainer: { flex: 1 },
  hpLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '600', marginBottom: 4 },
  hpBar: { height: 8, backgroundColor: '#0F172A', borderRadius: 4, overflow: 'hidden' },
  hpFill: { height: '100%', borderRadius: 4 },
  hpText: { color: '#E2E8F0', fontSize: 11, fontWeight: '700', marginTop: 2 },
  scoreBadge: { backgroundColor: '#F59E0B20', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F59E0B40' },
  scoreText: { color: '#F59E0B', fontSize: 16, fontWeight: '800' },
  
  // Timer
  timerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 8, backgroundColor: '#1E293B' },
  timerText: { color: '#F59E0B', fontSize: 16, fontWeight: '700' },
  
  // Fight Content
  fightContent: { flex: 1, padding: 16 },
  questionCard: { flex: 1 },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  questionCounter: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  difficultyBadge: { backgroundColor: '#EF444420', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  difficultyText: { color: '#EF4444', fontSize: 10, fontWeight: '700' },
  questionScroll: { flex: 1 },
  questionText: { color: '#F8FAFC', fontSize: 16, fontWeight: '600', lineHeight: 24, marginBottom: 20 },
  
  // Options
  optionsContainer: { gap: 10 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1E293B', padding: 16, borderRadius: 14,
    borderWidth: 2, borderColor: '#334155',
  },
  optionSelected: { borderColor: '#38BDF8', backgroundColor: '#38BDF810' },
  optionCorrect: { borderColor: '#10B981', backgroundColor: '#10B98110' },
  optionWrong: { borderColor: '#EF4444', backgroundColor: '#EF444410' },
  optionText: { color: '#E2E8F0', fontSize: 14, flex: 1, lineHeight: 20 },
  optionTextCorrect: { color: '#10B981' },
  optionTextWrong: { color: '#EF4444' },
  
  // Explanation
  explanationCard: { backgroundColor: '#1E293B', padding: 18, borderRadius: 14, marginTop: 20, borderWidth: 1, borderColor: '#334155' },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  explanationTitle: { fontSize: 18, fontWeight: '800' },
  explanationText: { color: '#E2E8F0', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  nextBtn: { backgroundColor: '#38BDF8', padding: 14, borderRadius: 12, alignItems: 'center' },
  nextBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  
  // Result Screen
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, gap: 12 },
  resultEmoji: { fontSize: 80 },
  resultTitle: { fontSize: 28, fontWeight: '900' },
  resultScore: { color: '#E2E8F0', fontSize: 18, fontWeight: '600' },
  resultHp: { color: '#94A3B8', fontSize: 14 },
  flawlessBanner: { backgroundColor: '#F59E0B15', padding: 16, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#F59E0B40', width: '100%' },
  flawlessText: { color: '#F59E0B', fontSize: 18, fontWeight: '800' },
  flawlessBonus: { color: '#FFD700', fontSize: 14, fontWeight: '700', marginTop: 4 },
  resultActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EF4444', padding: 14, borderRadius: 12, flex: 1, justifyContent: 'center' },
  retryBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  backToBossesBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1E293B', padding: 14, borderRadius: 12, flex: 1, justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  backToBossesText: { color: '#38BDF8', fontSize: 14, fontWeight: '600' },
});
