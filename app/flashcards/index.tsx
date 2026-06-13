import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet, Text, View, Pressable, ScrollView, Modal, TextInput, Animated, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore, BOSS_DECKS } from '../../src/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Flashcard, reviewCard, getDueCards, getNewCards, getCardStats, DEFAULT_DECKS, createCard, BossCard } from './spacedRepetition';
import { getDefaultCards } from './defaultCards';
import { ECG_BOSS_CARDS } from './bossDecks';

const STORAGE_KEY = 'flashcards_data';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BOSS_CARDS_MAP: Record<string, BossCard[]> = {
  ecg_boss: ECG_BOSS_CARDS,
};

// 🎨 Helper: Get deck config
function getDeckConfig(deckId: string) {
  return DEFAULT_DECKS.find(d => d.id === deckId) || DEFAULT_DECKS[0];
}

// 🎨 Difficulty Badge Component
function DifficultyBadge({ difficulty }: { difficulty?: string }) {
  if (!difficulty) return null;
  const config = {
    easy: { label: 'Easy', color: '#10B981', bg: '#10B98120' },
    medium: { label: 'Medium', color: '#F59E0B', bg: '#F59E0B20' },
    hard: { label: 'Hard', color: '#EF4444', bg: '#EF444420' },
    expert: { label: 'Expert', color: '#8B5CF6', bg: '#8B5CF620' },
  };
  const c = config[difficulty as keyof typeof config] || config.medium;
  return (
    <View style={[badgeStyles.badge, { backgroundColor: c.bg, borderColor: c.color + '40' }]}>
      <Text style={[badgeStyles.text, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, borderWidth: 1, alignSelf: 'flex-start' },
  text: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
});

// 🎮 Boss Fight Modal Component
function BossFightModal({ bossId, visible, onClose }: { bossId: string | null; visible: boolean; onClose: () => void }) {
  const { defeatBoss, recordActivity, addPoints } = useStore();
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

  const currentBossDeck = bossId ? BOSS_DECKS.find(d => d.id === bossId) : null;
  const currentCards = bossId ? BOSS_CARDS_MAP[bossId] : null;
  const currentQuestion = currentCards?.[currentQuestionIndex];
  const isCorrectAnswer = currentQuestion && selectedAnswer === currentQuestion.correctOptionId;

  useEffect(() => {
    if (visible) {
      setFightPhase('intro');
      setCurrentQuestionIndex(0);
      setHp(100);
      setScore(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setFightResult(null);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [visible, bossId]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(currentBossDeck?.timePerQuestion || 45);
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
    if (selectedAnswer || !currentQuestion) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedAnswer(optionId);

    const isCorrect = optionId === currentQuestion.correctOptionId;
    const hpLoss = currentBossDeck?.hpLossPerWrong || 7;

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
    if (!currentCards) return;
    if (currentQuestionIndex < currentCards.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      startTimer();
    } else {
      endFight();
    }
  };

  const endFight = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!currentBossDeck || !bossId) return;

    const passed = score >= currentBossDeck.passingScore;
    const flawless = score === currentBossDeck.totalQuestions && hp === 100;
    setFightResult({ won: passed, score, total: currentBossDeck.totalQuestions, flawless });
    setFightPhase('result');
    defeatBoss(bossId, score, currentBossDeck.totalQuestions, flawless);
    recordActivity();
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

  if (!visible || !bossId) return null;

  if (fightPhase === 'intro') {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={bossStyles.overlay}>
          <View style={bossStyles.introModal}>
            <Pressable onPress={onClose} style={bossStyles.closeBtn}>
              <Ionicons name="close" size={22} color="#94A3B8" />
            </Pressable>
            <Text style={bossStyles.introEmoji}>{currentBossDeck?.emoji}</Text>
            <Text style={bossStyles.introTitle}>{currentBossDeck?.name}</Text>
            <Text style={bossStyles.introDesc}>{currentBossDeck?.description}</Text>
            <View style={bossStyles.introStats}>
              <View style={bossStyles.introStat}>
                <Ionicons name="help-circle" size={18} color="#38BDF8" />
                <Text style={bossStyles.introStatText}>{currentBossDeck?.totalQuestions} Questions</Text>
              </View>
              <View style={bossStyles.introStat}>
                <Ionicons name="time" size={18} color="#F59E0B" />
                <Text style={bossStyles.introStatText}>{currentBossDeck?.timePerQuestion}s per Q</Text>
              </View>
              <View style={bossStyles.introStat}>
                <Ionicons name="trophy" size={18} color="#10B981" />
                <Text style={bossStyles.introStatText}>Pass: {currentBossDeck?.passingScore}/{currentBossDeck?.totalQuestions}</Text>
              </View>
            </View>
            <Pressable style={[bossStyles.fightBtn, { backgroundColor: currentBossDeck?.color }]} onPress={startFight}>
              <Text style={bossStyles.fightBtnText}>⚔️ FIGHT!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  if (fightPhase === 'result' && fightResult) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={bossStyles.overlay}>
          <View style={bossStyles.resultModal}>
            <Text style={bossStyles.resultEmoji}>{fightResult.won ? '🎉' : '💀'}</Text>
            <Text style={[bossStyles.resultTitle, { color: fightResult.won ? '#10B981' : '#EF4444' }]}>
              {fightResult.won ? 'BOSS DEFEATED!' : 'DEFEATED BY BOSS'}
            </Text>
            <Text style={bossStyles.resultScore}>Score: {fightResult.score}/{fightResult.total}</Text>
            <Text style={bossStyles.resultHp}>HP Remaining: {hp}%</Text>
            {fightResult.flawless && (
              <View style={bossStyles.flawlessBanner}>
                <Text style={bossStyles.flawlessText}>⭐ FLAWLESS VICTORY! ⭐</Text>
              </View>
            )}
            <View style={bossStyles.resultActions}>
              <Pressable style={bossStyles.retryBtn} onPress={startFight}>
                <Text style={bossStyles.retryBtnText}>🔄 Retry</Text>
              </Pressable>
              <Pressable style={bossStyles.backBtn2} onPress={onClose}>
                <Text style={bossStyles.backBtnText}>Back to Bosses</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={bossStyles.fightContainer}>
        <View style={bossStyles.fightHeader}>
          <Pressable onPress={onClose} style={bossStyles.quitFightBtn}>
            <Ionicons name="close" size={22} color="#94A3B8" />
          </Pressable>
          <View style={bossStyles.hpContainer}>
            <Text style={bossStyles.hpLabel}>{currentBossDeck?.emoji} Boss HP</Text>
            <View style={bossStyles.hpBar}>
              <Animated.View style={[bossStyles.hpFill, { width: hpAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }), backgroundColor: hp > 50 ? '#10B981' : hp > 25 ? '#F59E0B' : '#EF4444' }]} />
            </View>
            <Text style={bossStyles.hpText}>{hp}%</Text>
          </View>
          <View style={bossStyles.scoreBadge}>
            <Text style={bossStyles.scoreText}>{score}</Text>
          </View>
        </View>

        <View style={bossStyles.timerContainer}>
          <Ionicons name="time" size={16} color={timeLeft <= 10 ? '#EF4444' : '#F59E0B'} />
          <Text style={[bossStyles.timerText, timeLeft <= 10 && { color: '#EF4444' }]}>{timeLeft}s</Text>
        </View>

        <Animated.View style={[bossStyles.fightContent, { transform: [{ translateX: shakeAnim }] }]}>
          <View style={bossStyles.questionCard}>
            <View style={bossStyles.questionHeader}>
              <Text style={bossStyles.questionCounter}>Q{currentQuestionIndex + 1}/{currentBossDeck?.totalQuestions}</Text>
              <View style={bossStyles.difficultyBadge}>
                <Text style={bossStyles.difficultyText}>{currentQuestion?.difficulty === 'expert' ? '💀 Expert' : '🔥 Hard'}</Text>
              </View>
            </View>

            <ScrollView style={bossStyles.questionScroll} showsVerticalScrollIndicator={false}>
              <Text style={bossStyles.questionText}>{currentQuestion?.question}</Text>

              <View style={bossStyles.optionsContainer}>
                {currentQuestion?.options.map(option => {
                  const isSelected = selectedAnswer === option.id;
                  const isCorrectOption = option.id === currentQuestion.correctOptionId;
                  let optionStyle = bossStyles.optionCard;
                  let optionTextStyle = bossStyles.optionText;
                  let iconName: any = 'ellipse-outline';
                  let iconColor = '#64748B';

                  if (selectedAnswer) {
                    if (isCorrectOption) {
                      optionStyle = { ...optionStyle, ...bossStyles.optionCorrect };
                      optionTextStyle = { ...optionTextStyle, ...bossStyles.optionTextCorrect };
                      iconName = 'checkmark-circle';
                      iconColor = '#10B981';
                    } else if (isSelected && !isCorrectOption) {
                      optionStyle = { ...optionStyle, ...bossStyles.optionWrong };
                      optionTextStyle = { ...optionTextStyle, ...bossStyles.optionTextWrong };
                      iconName = 'close-circle';
                      iconColor = '#EF4444';
                    }
                  } else if (isSelected) {
                    optionStyle = { ...optionStyle, ...bossStyles.optionSelected };
                    iconName = 'radio-button-on';
                    iconColor = '#38BDF8';
                  }

                  return (
                    <Pressable key={option.id} style={optionStyle} onPress={() => handleAnswerSelect(option.id)} disabled={!!selectedAnswer}>
                      <Ionicons name={iconName} size={20} color={iconColor} />
                      <Text style={optionTextStyle}>{option.id}) {option.text}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {showExplanation && (
                <View style={bossStyles.explanationCard}>
                  <View style={bossStyles.explanationHeader}>
                    <Ionicons name={isCorrectAnswer ? 'checkmark-circle' : 'close-circle'} size={22} color={isCorrectAnswer ? '#10B981' : '#EF4444'} />
                    <Text style={[bossStyles.explanationTitle, { color: isCorrectAnswer ? '#10B981' : '#EF4444' }]}>
                      {isCorrectAnswer ? 'Correct!' : 'Incorrect!'}
                    </Text>
                  </View>
                  <Text style={bossStyles.explanationText}>{currentQuestion?.explanation}</Text>
                  <Pressable style={bossStyles.nextBtn} onPress={nextQuestion}>
                    <Text style={bossStyles.nextBtnText}>
                      {currentQuestionIndex < (currentCards?.length || 0) - 1 ? 'Next →' : 'Finish Fight'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// 🎨 Main Flashcards Screen
export default function FlashcardsScreen() {
  const router = useRouter();
  const { addPoints, recordActivity, getLevel, isBossUnlocked, getBossProgress, bossProgress } = useStore();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showBack, setShowBack] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showAddDeck, setShowAddDeck] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [selectedDeck, setSelectedDeck] = useState('your_cards');
  const [activeTab, setActiveTab] = useState<'review' | 'decks' | 'stats' | 'boss'>('review');
  const [selectedReviewDeck, setSelectedReviewDeck] = useState<string | null>(null);
  const [activeBossFight, setActiveBossFight] = useState<string | null>(null);

  // 🎨 Flip animation
  const flipAnim = useRef(new Animated.Value(0)).current;
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [0, 0, 1],
  });

  const level = getLevel();

  useEffect(() => { loadCards(); }, []);

  const loadCards = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCards(JSON.parse(stored));
      } else {
        const defaults = getDefaultCards();
        setCards(defaults);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      }
    } catch { }
  };

  const saveCards = async (updatedCards: Flashcard[]) => {
    setCards(updatedCards);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
  };

  const startReview = useCallback(() => {
    const due = selectedReviewDeck
      ? getDueCards(cards).filter(c => c.deck === selectedReviewDeck)
      : getDueCards(cards);
    if (due.length === 0) {
      setCurrentCard(null);
      return;
    }
    setCurrentCard(due[0]);
    setShowBack(false);
    setReviewMode(true);
    flipAnim.setValue(0);
  }, [cards, selectedReviewDeck]);

  // 🎨 Flip card
  const flipCard = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setShowBack(true);
    Animated.spring(flipAnim, {
      toValue: 180,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start(() => setIsFlipping(false));
  };

  const handleRate = useCallback(async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!currentCard) return;
    recordActivity();
    const updated = reviewCard(currentCard, quality);
    const updatedCards = cards.map(c => c.id === updated.id ? updated : c);
    await saveCards(updatedCards);
    addPoints(2);

    const due = selectedReviewDeck
      ? getDueCards(updatedCards).filter(c => c.deck === selectedReviewDeck)
      : getDueCards(updatedCards);
    if (due.length > 0) {
      setCurrentCard(due[0]);
      setShowBack(false);
      flipAnim.setValue(0);
    } else {
      setCurrentCard(null);
      setReviewMode(false);
      setSelectedReviewDeck(null);
    }
  }, [currentCard, cards, addPoints, selectedReviewDeck, recordActivity]);

  const addNewCard = async () => {
    if (!newFront.trim() || !newBack.trim()) return;
    const card = createCard(selectedDeck, newFront.trim(), newBack.trim(), 'basic', ['manual'], undefined, undefined, undefined, undefined, undefined, 'manual');
    const updated = [...cards, card];
    await saveCards(updated);
    setNewFront('');
    setNewBack('');
    setShowAddDeck(false);
  };

  const startDeckReview = (deckId: string) => {
    setSelectedReviewDeck(deckId);
    setActiveTab('review');
    const due = getDueCards(cards).filter(c => c.deck === deckId);
    if (due.length > 0) {
      setCurrentCard(due[0]);
      setShowBack(false);
      setReviewMode(true);
      flipAnim.setValue(0);
    }
  };

  // 🆕 Delete user card
  const deleteCard = async (cardId: string) => {
    const updated = cards.filter(c => c.id !== cardId);
    await saveCards(updated);
    if (currentCard?.id === cardId) {
      const due = selectedReviewDeck
        ? getDueCards(updated).filter(c => c.deck === selectedReviewDeck)
        : getDueCards(updated);
      if (due.length > 0) {
        setCurrentCard(due[0]);
        flipAnim.setValue(0);
      } else {
        setCurrentCard(null);
        setReviewMode(false);
      }
    }
  };

  const stats = getCardStats(cards);
  const dueCards = selectedReviewDeck
    ? getDueCards(cards).filter(c => c.deck === selectedReviewDeck)
    : getDueCards(cards);
  
  // 🆕 Separate user cards from default decks
  const userCardsDeck = DEFAULT_DECKS.find(d => d.id === 'your_cards');
  const defaultDecksList = DEFAULT_DECKS.filter(d => d.id !== 'your_cards');
  
  const deckStats = defaultDecksList.map(deck => ({
    ...deck,
    total: cards.filter(c => c.deck === deck.id).length,
    due: cards.filter(c => c.deck === deck.id && c.nextReview <= Date.now()).length,
  }));

  // 🆕 Your Cards stats
  const userCardsStats = {
    ...(userCardsDeck || { id: 'your_cards', name: 'Your Cards', emoji: '📚', color: '#38BDF8' }),
    total: cards.filter(c => c.deck === 'your_cards').length,
    due: cards.filter(c => c.deck === 'your_cards' && c.nextReview <= Date.now()).length,
  };

  const currentDeckConfig = currentCard ? getDeckConfig(currentCard.deck) : null;
  const currentCardIndex = currentCard ? dueCards.findIndex(c => c.id === currentCard.id) : -1;
  const progressPercent = dueCards.length > 0 && currentCardIndex >= 0
    ? ((currentCardIndex + 1) / dueCards.length) * 100
    : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color="#94A3B8" /></Pressable>
        <Text style={styles.headerTitle}>Flashcards</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>Lv.{level}</Text>
        </View>
        <Pressable onPress={() => setShowAddDeck(true)}>
          <Ionicons name="add-circle" size={26} color="#38BDF8" />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { id: 'review', name: `Review (${dueCards.length})` },
          { id: 'decks', name: 'Decks' },
          { id: 'stats', name: 'Stats' },
          { id: 'boss', name: '🎮 Boss' },
        ].map(tab => (
          <Pressable key={tab.id} style={[styles.tab, activeTab === tab.id && styles.tabActive]} onPress={() => setActiveTab(tab.id as any)}>
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.name}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Review Tab */}
        {activeTab === 'review' && (
          <View style={styles.section}>
            {selectedReviewDeck && (
              <View style={styles.reviewDeckBanner}>
                <Text style={styles.reviewDeckBannerText}>
                  {getDeckConfig(selectedReviewDeck).emoji} {getDeckConfig(selectedReviewDeck).name}
                </Text>
                <Pressable onPress={() => { setSelectedReviewDeck(null); setReviewMode(false); setCurrentCard(null); }}>
                  <Ionicons name="close-circle" size={20} color="#94A3B8" />
                </Pressable>
              </View>
            )}

            {reviewMode && currentCard ? (
              <View style={styles.cardWrapper}>
                {/* 🎨 Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: currentDeckConfig?.color || '#38BDF8' }]} />
                  </View>
                  <Text style={styles.progressText}>
                    {currentCardIndex + 1} / {dueCards.length}
                  </Text>
                </View>

                {/* 🆕 Delete button for user cards */}
                {currentCard.deck === 'your_cards' && (
                  <Pressable style={styles.deleteCardBtn} onPress={() => deleteCard(currentCard.id)}>
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                    <Text style={styles.deleteCardText}>Remove Card</Text>
                  </Pressable>
                )}

                {/* 🎨 Flip Card Container */}
                <View style={styles.flipContainer}>
                  {/* Front Face */}
                  <Animated.View style={[
                    styles.cardFace,
                    styles.cardFront,
                    {
                      transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
                      opacity: frontOpacity,
                      borderColor: (currentDeckConfig?.color || '#334155') + '60',
                      shadowColor: currentDeckConfig?.color || '#38BDF8',
                    },
                  ]}>
                    {/* Difficulty Badge */}
                    <View style={styles.cardTopBar}>
                      <DifficultyBadge difficulty={currentCard.difficulty} />
                      <Text style={[styles.cardDeckLabel, { color: currentDeckConfig?.color || '#94A3B8' }]}>
                        {currentDeckConfig?.emoji} {currentDeckConfig?.name}
                      </Text>
                    </View>

                    {/* Medical Title */}
                    {currentCard.medicalTitle && (
                      <Text style={[styles.medicalTitle, { color: currentDeckConfig?.color || '#38BDF8' }]}>
                        {currentCard.medicalTitle}
                      </Text>
                    )}

                    {/* Question */}
                    <View style={styles.questionContainer}>
                      <Text style={styles.cardFront}>{currentCard.front}</Text>
                    </View>

                    {/* 🆕 Source tag */}
                    {currentCard.source && (
                      <View style={styles.sourceTag}>
                        <Text style={styles.sourceTagText}>
                          {currentCard.source === 'case' ? '🏥 From Case' : currentCard.source === 'question' ? '❓ From QBank' : '✍️ Manual'}
                        </Text>
                      </View>
                    )}

                    {/* Tap to Reveal */}
                    <Pressable style={[styles.revealBtn, { backgroundColor: (currentDeckConfig?.color || '#38BDF8') + '20', borderColor: (currentDeckConfig?.color || '#38BDF8') + '40' }]} onPress={flipCard}>
                      <Ionicons name="sync" size={16} color={currentDeckConfig?.color || '#38BDF8'} />
                      <Text style={[styles.revealBtnText, { color: currentDeckConfig?.color || '#38BDF8' }]}>Tap to Reveal Answer</Text>
                    </Pressable>
                  </Animated.View>

                  {/* Back Face */}
                  <Animated.View style={[
                    styles.cardFace,
                    styles.cardBack,
                    {
                      transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
                      opacity: backOpacity,
                      borderColor: (currentDeckConfig?.color || '#334155') + '60',
                      shadowColor: currentDeckConfig?.color || '#38BDF8',
                    },
                  ]}>
                    {/* Header */}
                    <View style={styles.cardTopBar}>
                      <Text style={[styles.cardDeckLabel, { color: currentDeckConfig?.color || '#94A3B8' }]}>
                        {currentDeckConfig?.emoji} {currentDeckConfig?.name}
                      </Text>
                    </View>

                    {/* Medical Title */}
                    {currentCard.medicalTitle && (
                      <Text style={[styles.medicalTitle, { color: currentDeckConfig?.color || '#38BDF8' }]}>
                        {currentCard.medicalTitle}
                      </Text>
                    )}

                    {/* Answer */}
                    <View style={styles.answerContainer}>
                      <Text style={styles.cardBack}>{currentCard.back}</Text>
                    </View>

                    {/* 🎨 Stats Row */}
                    {currentCard.repetitions > 0 && (
                      <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                          <Ionicons name="time" size={10} color="#64748B" />
                          <Text style={styles.statText}>{currentCard.interval}d</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="trending-up" size={10} color="#64748B" />
                          <Text style={styles.statText}>{currentCard.easeFactor.toFixed(1)}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="refresh" size={10} color="#64748B" />
                          <Text style={styles.statText}>{currentCard.repetitions}x</Text>
                        </View>
                      </View>
                    )}

                    {/* Rating Buttons */}
                    <View style={styles.ratingRow}>
                      <Pressable style={[styles.rateBtn, { backgroundColor: '#EF444420' }]} onPress={() => handleRate(0)}>
                        <Text style={styles.rateEmoji}>😴</Text>
                        <Text style={styles.rateText}>Forgot</Text>
                      </Pressable>
                      <Pressable style={[styles.rateBtn, { backgroundColor: '#F59E0B20' }]} onPress={() => handleRate(2)}>
                        <Text style={styles.rateEmoji}>😊</Text>
                        <Text style={styles.rateText}>Hard</Text>
                      </Pressable>
                      <Pressable style={[styles.rateBtn, { backgroundColor: '#38BDF820' }]} onPress={() => handleRate(4)}>
                        <Text style={styles.rateEmoji}>🤔</Text>
                        <Text style={styles.rateText}>Good</Text>
                      </Pressable>
                      <Pressable style={[styles.rateBtn, { backgroundColor: '#10B98120' }]} onPress={() => handleRate(5)}>
                        <Text style={styles.rateEmoji}>🎯</Text>
                        <Text style={styles.rateText}>Easy</Text>
                      </Pressable>
                    </View>
                  </Animated.View>
                </View>
              </View>
            ) : (
              <View style={styles.emptyReview}>
                <Ionicons name="checkmark-circle" size={60} color="#10B981" />
                <Text style={styles.emptyTitle}>
                  {dueCards.length === 0 ? 'All caught up! 🎉' : `${dueCards.length} cards due`}
                </Text>
                <Text style={styles.emptySub}>
                  {dueCards.length === 0 ? 'Come back later for more reviews' : 'Ready to start your review session?'}
                </Text>
                {dueCards.length > 0 && (
                  <Pressable style={styles.startBtn} onPress={startReview}>
                    <Text style={styles.startBtnText}>Start Review</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}

        {/* Decks Tab */}
        {activeTab === 'decks' && (
          <View style={styles.section}>
            {/* 🆕 Your Cards - Always on top */}
            {userCardsStats.total > 0 && (
              <Pressable
                style={[styles.deckItem, styles.userDeckItem, { borderColor: '#38BDF840' }]}
                onPress={() => userCardsStats.due > 0 && startDeckReview('your_cards')}
              >
                <View style={[styles.deckIcon, { backgroundColor: '#38BDF820' }]}>
                  <Text style={styles.deckEmoji}>📚</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.deckNameRow}>
                    <Text style={styles.deckName}>Your Cards</Text>
                    <Ionicons name="star" size={14} color="#38BDF8" />
                  </View>
                  <Text style={styles.deckInfo}>{userCardsStats.total} cards • {userCardsStats.due} due</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#64748B" />
              </Pressable>
            )}

            {/* Default Decks */}
            {deckStats.map(deck => (
              <Pressable
                key={deck.id}
                style={[styles.deckItem, { borderLeftColor: deck.color, borderLeftWidth: deck.total > 0 ? 3 : 0 }]}
                onPress={() => deck.due > 0 && startDeckReview(deck.id)}
              >
                <View style={[styles.deckIcon, { backgroundColor: deck.color + '20' }]}>
                  <Text style={styles.deckEmoji}>{deck.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deckName}>{deck.name}</Text>
                  <Text style={styles.deckInfo}>{deck.total} cards • {deck.due} due</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#64748B" />
              </Pressable>
            ))}
          </View>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <View style={styles.section}>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total Cards</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.mastered}</Text>
                <Text style={styles.statLabel}>Mastered</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>{stats.learning}</Text>
                <Text style={styles.statLabel}>Learning</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#38BDF8' }]}>{stats.due}</Text>
                <Text style={styles.statLabel}>Due Today</Text>
              </View>
            </View>
            
            {/* 🆕 Your Cards Stats */}
            {userCardsStats.total > 0 && (
              <View style={styles.userStatsSection}>
                <Text style={styles.userStatsTitle}>📚 Your Cards</Text>
                <View style={styles.userStatsRow}>
                  <Text style={styles.userStatsText}>Total: {userCardsStats.total}</Text>
                  <Text style={styles.userStatsText}>Due: {userCardsStats.due}</Text>
                  <Text style={styles.userStatsText}>
                    Sources: {[
                      cards.filter(c => c.deck === 'your_cards' && c.source === 'case').length > 0 ? '🏥' : '',
                      cards.filter(c => c.deck === 'your_cards' && c.source === 'question').length > 0 ? '❓' : '',
                      cards.filter(c => c.deck === 'your_cards' && c.source === 'manual').length > 0 ? '✍️' : '',
                    ].filter(Boolean).join(' ')}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* 🎮 Boss Tab */}
        {activeTab === 'boss' && (
          <View style={styles.section}>
            <Text style={styles.bossSectionTitle}>🎮 Boss Decks</Text>
            <Text style={styles.bossSectionSub}>Defeat bosses to earn epic rewards!</Text>

            {BOSS_DECKS.map(boss => {
              const unlocked = isBossUnlocked(boss.id);
              const progress = getBossProgress(boss.id);
              return (
                <Pressable
                  key={boss.id}
                  style={[styles.bossCard, !unlocked && styles.bossLocked]}
                  onPress={() => unlocked && setActiveBossFight(boss.id)}
                >
                  <View style={styles.bossCardHeader}>
                    <Text style={styles.bossEmoji}>{boss.emoji}</Text>
                    <View style={styles.bossInfo}>
                      <Text style={styles.bossName}>{boss.name}</Text>
                      <Text style={styles.bossDesc}>{boss.description}</Text>
                    </View>
                    {unlocked ? (
                      <View style={[styles.fightBadge, { backgroundColor: boss.color }]}>
                        <Text style={styles.fightBadgeText}>FIGHT</Text>
                      </View>
                    ) : (
                      <View style={styles.lockBadge}>
                        <Ionicons name="lock-closed" size={16} color="#94A3B8" />
                        <Text style={styles.lockText}>Lv.{boss.requiredLevel}</Text>
                      </View>
                    )}
                  </View>

                  {unlocked && progress && (
                    <View style={styles.bossProgress}>
                      <Text style={styles.bossProgressText}>
                        Best: {progress.bestScore}/{boss.totalQuestions} | Attempts: {progress.attempts}
                      </Text>
                      {progress.defeated && <Text style={styles.defeatedBadge}>🗡️ Defeated</Text>}
                      {progress.flawless && <Text style={styles.flawlessBadge}>⭐ Flawless</Text>}
                    </View>
                  )}

                  {!unlocked && (
                    <Text style={styles.lockedHint}>Reach Level {boss.requiredLevel} to unlock</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Add Card Modal */}
      <Modal visible={showAddDeck} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✍️ New Flashcard</Text>
            <Text style={styles.label}>Deck</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deckSelectorScroll}>
              {[...DEFAULT_DECKS.filter(d => d.isUserDeck), ...DEFAULT_DECKS.filter(d => !d.isUserDeck)].map(deck => (
                <Pressable
                  key={deck.id}
                  style={[
                    styles.deckChip,
                    deck.isUserDeck && styles.userDeckChip,
                    selectedDeck === deck.id && { backgroundColor: deck.color + '30', borderColor: deck.color },
                  ]}
                  onPress={() => setSelectedDeck(deck.id)}
                >
                  <Text style={styles.deckChipEmoji}>{deck.emoji}</Text>
                  <Text style={[styles.deckChipText, selectedDeck === deck.id && { color: deck.color }]}>{deck.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Text style={styles.label}>Front (Question)</Text>
            <TextInput style={styles.input} value={newFront} onChangeText={setNewFront} placeholder="Enter question..." placeholderTextColor="#64748B" multiline />
            <Text style={styles.label}>Back (Answer)</Text>
            <TextInput style={[styles.input, { minHeight: 80 }]} value={newBack} onChangeText={setNewBack} placeholder="Enter answer..." placeholderTextColor="#64748B" multiline />
            <View style={styles.modalBtns}>
              <Pressable style={styles.cancelBtn} onPress={() => setShowAddDeck(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={addNewCard}>
                <Text style={styles.saveText}>Save to {DEFAULT_DECKS.find(d => d.id === selectedDeck)?.name}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🎮 Boss Fight Modal */}
      <BossFightModal
        bossId={activeBossFight}
        visible={!!activeBossFight}
        onClose={() => setActiveBossFight(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 20, backgroundColor: '#1A1F2E', borderBottomWidth: 1, borderBottomColor: '#1E293B', gap: 8 },
  headerTitle: { flex: 1, color: '#F8FAFC', fontSize: 20, fontWeight: '700' },
  levelBadge: { backgroundColor: '#F59E0B20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  levelBadgeText: { color: '#F59E0B', fontSize: 11, fontWeight: '700' },
  tabs: { flexDirection: 'row', backgroundColor: '#1A1F2E', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#38BDF8' },
  tabText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: '#38BDF8' },
  content: { flex: 1, padding: 16 },
  section: { flex: 1 },

  // 🎨 Progress Bar
  progressContainer: { marginBottom: 16, gap: 6 },
  progressBar: { height: 4, backgroundColor: '#1E293B', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressText: { color: '#94A3B8', fontSize: 11, fontWeight: '600', textAlign: 'center' },

  // 🆕 Delete button
  deleteCardBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8, paddingVertical: 6 },
  deleteCardText: { color: '#EF4444', fontSize: 11, fontWeight: '600' },

  // 🎨 Flip Card Container
  cardWrapper: { flex: 1, justifyContent: 'center' },
  flipContainer: { minHeight: 380, position: 'relative' },
  cardFace: {
    position: 'absolute',
    width: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minHeight: 380,
  },
  cardFront: {},
  cardBack: {},

  // Card Top Bar
  cardTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardDeckLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },

  // Medical Title
  medicalTitle: { fontSize: 14, fontWeight: '800', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },

  // Question
  questionContainer: { flex: 1, justifyContent: 'center' },
  cardFront: { color: '#F8FAFC', fontSize: 18, fontWeight: '600', lineHeight: 28, textAlign: 'center' },

  // 🆕 Source tag
  sourceTag: { alignSelf: 'center', backgroundColor: '#38BDF810', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  sourceTagText: { color: '#38BDF8', fontSize: 10, fontWeight: '600' },

  // Answer
  answerContainer: { flex: 1, justifyContent: 'center' },
  cardBack: { color: '#E2E8F0', fontSize: 15, lineHeight: 24, textAlign: 'center' },

  // 🎨 Stats Row
  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#334155', borderBottomWidth: 1, borderBottomColor: '#334155', marginBottom: 16 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { color: '#64748B', fontSize: 10, fontWeight: '600' },

  // Reveal Button
  revealBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, borderWidth: 1, marginTop: 20 },
  revealBtnText: { fontSize: 14, fontWeight: '700' },

  // Rating Row
  ratingRow: { flexDirection: 'row', gap: 8 },
  rateBtn: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', gap: 4 },
  rateEmoji: { fontSize: 22 },
  rateText: { color: '#E2E8F0', fontSize: 10, fontWeight: '600' },

  // Empty State
  reviewDeckBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1E293B', padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  reviewDeckBannerText: { color: '#38BDF8', fontSize: 14, fontWeight: '600' },
  emptyReview: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '700' },
  emptySub: { color: '#94A3B8', fontSize: 14 },
  startBtn: { backgroundColor: '#38BDF8', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14, marginTop: 8 },
  startBtnText: { color: '#0F172A', fontSize: 15, fontWeight: '700' },

  // Deck Items
  deckItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 16, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: '#334155', gap: 12 },
  userDeckItem: { backgroundColor: '#38BDF808', borderWidth: 1.5 },
  deckIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  deckEmoji: { fontSize: 22 },
  deckNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deckName: { color: '#F8FAFC', fontSize: 15, fontWeight: '600' },
  deckInfo: { color: '#94A3B8', fontSize: 12, marginTop: 2 },

  // 🆕 User Stats Section
  userStatsSection: { backgroundColor: '#38BDF808', padding: 16, borderRadius: 14, marginTop: 12, borderWidth: 1, borderColor: '#38BDF820' },
  userStatsTitle: { color: '#38BDF8', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  userStatsRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  userStatsText: { color: '#E2E8F0', fontSize: 12 },

  // Stats Grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: '2%' },
  statCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 14, width: '48%', alignItems: 'center', borderWidth: 1, borderColor: '#334155', marginBottom: 10 },
  statValue: { color: '#F8FAFC', fontSize: 28, fontWeight: '800' },
  statLabel: { color: '#94A3B8', fontSize: 11, marginTop: 4 },

  // Boss Tab
  bossSectionTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  bossSectionSub: { color: '#94A3B8', fontSize: 12, marginBottom: 16 },
  bossCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  bossLocked: { opacity: 0.7 },
  bossCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bossEmoji: { fontSize: 36 },
  bossInfo: { flex: 1 },
  bossName: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  bossDesc: { color: '#94A3B8', fontSize: 10, lineHeight: 14 },
  fightBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  fightBadgeText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  lockBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#334155', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  lockText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  bossProgress: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#334155' },
  bossProgressText: { color: '#94A3B8', fontSize: 11, marginBottom: 4 },
  defeatedBadge: { color: '#10B981', fontSize: 12, fontWeight: '700' },
  flawlessBadge: { color: '#F59E0B', fontSize: 12, fontWeight: '700' },
  lockedHint: { color: '#EF4444', fontSize: 11, fontWeight: '600', marginTop: 8, textAlign: 'center' },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1E293B', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  modalTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  label: { color: '#94A3B8', fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#0F172A', color: '#FFF', padding: 12, borderRadius: 10, fontSize: 14, borderWidth: 1, borderColor: '#334155' },
  deckSelectorScroll: { maxHeight: 44, marginBottom: 4 },
  deckChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#334155', marginRight: 6 },
  userDeckChip: { borderColor: '#38BDF840', backgroundColor: '#38BDF810' },
  deckChipEmoji: { fontSize: 14 },
  deckChipText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#334155', alignItems: 'center' },
  cancelText: { color: '#E2E8F0', fontWeight: '600' },
  saveBtn: { flex: 2, backgroundColor: '#38BDF8', padding: 14, borderRadius: 12, alignItems: 'center' },
  saveText: { color: '#0F172A', fontWeight: '700' },
});

// Boss Fight Styles
const bossStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  introModal: { backgroundColor: '#1E293B', padding: 24, borderRadius: 24, alignItems: 'center', gap: 14 },
  closeBtn: { position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  introEmoji: { fontSize: 70 },
  introTitle: { color: '#F8FAFC', fontSize: 28, fontWeight: '900' },
  introDesc: { color: '#94A3B8', fontSize: 13, textAlign: 'center', lineHeight: 18 },
  introStats: { gap: 6, width: '100%', backgroundColor: '#0F172A', padding: 14, borderRadius: 12 },
  introStat: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  introStatText: { color: '#E2E8F0', fontSize: 13 },
  fightBtn: { paddingHorizontal: 40, paddingVertical: 14, borderRadius: 14, marginTop: 4 },
  fightBtnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  resultModal: { backgroundColor: '#1E293B', padding: 24, borderRadius: 24, alignItems: 'center', gap: 10 },
  resultEmoji: { fontSize: 70 },
  resultTitle: { fontSize: 26, fontWeight: '900' },
  resultScore: { color: '#E2E8F0', fontSize: 17, fontWeight: '600' },
  resultHp: { color: '#94A3B8', fontSize: 13 },
  flawlessBanner: { backgroundColor: '#F59E0B15', padding: 12, borderRadius: 12, width: '100%', alignItems: 'center' },
  flawlessText: { color: '#F59E0B', fontSize: 16, fontWeight: '800' },
  resultActions: { flexDirection: 'row', gap: 10, marginTop: 6 },
  retryBtn: { backgroundColor: '#EF4444', padding: 12, borderRadius: 12, flex: 1, alignItems: 'center' },
  retryBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  backBtn2: { backgroundColor: '#1E293B', padding: 12, borderRadius: 12, flex: 1, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  backBtnText: { color: '#38BDF8', fontSize: 14, fontWeight: '600' },
  fightContainer: { flex: 1, backgroundColor: '#0A0E1A' },
  fightHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#1A1F2E', gap: 8 },
  quitFightBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  hpContainer: { flex: 1 },
  hpLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '600', marginBottom: 4 },
  hpBar: { height: 8, backgroundColor: '#0F172A', borderRadius: 4, overflow: 'hidden' },
  hpFill: { height: '100%', borderRadius: 4 },
  hpText: { color: '#E2E8F0', fontSize: 11, fontWeight: '700', marginTop: 2 },
  scoreBadge: { backgroundColor: '#F59E0B20', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F59E0B40' },
  scoreText: { color: '#F59E0B', fontSize: 16, fontWeight: '800' },
  timerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 8, backgroundColor: '#1E293B' },
  timerText: { color: '#F59E0B', fontSize: 16, fontWeight: '700' },
  fightContent: { flex: 1, padding: 16 },
  questionCard: { flex: 1 },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  questionCounter: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  difficultyBadge: { backgroundColor: '#EF444420', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  difficultyText: { color: '#EF4444', fontSize: 10, fontWeight: '700' },
  questionScroll: { flex: 1 },
  questionText: { color: '#F8FAFC', fontSize: 15, fontWeight: '600', lineHeight: 23, marginBottom: 18 },
  optionsContainer: { gap: 8 },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#1E293B', padding: 14, borderRadius: 12, borderWidth: 2, borderColor: '#334155' },
  optionSelected: { borderColor: '#38BDF8', backgroundColor: '#38BDF810' },
  optionCorrect: { borderColor: '#10B981', backgroundColor: '#10B98110' },
  optionWrong: { borderColor: '#EF4444', backgroundColor: '#EF444410' },
  optionText: { color: '#E2E8F0', fontSize: 13, flex: 1, lineHeight: 19 },
  optionTextCorrect: { color: '#10B981' },
  optionTextWrong: { color: '#EF4444' },
  explanationCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 14, marginTop: 16, borderWidth: 1, borderColor: '#334155' },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  explanationTitle: { fontSize: 17, fontWeight: '800' },
  explanationText: { color: '#E2E8F0', fontSize: 13, lineHeight: 19, marginBottom: 14 },
  nextBtn: { backgroundColor: '#38BDF8', padding: 12, borderRadius: 12, alignItems: 'center' },
  nextBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
