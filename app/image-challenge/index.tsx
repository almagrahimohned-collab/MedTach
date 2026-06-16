import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, Pressable, ScrollView, Animated, Image, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AnnotatedImage, { ANNOTATION_SETS } from '../../components/AnnotatedImage';
import { useStore } from '../../src/store';
import { competencyEngine } from '../../src/engines/competencyEngine';
import { fetchQuestions, ImageQuestion } from './data';

export default function ImageChallenge() {
  const router = useRouter();
  const { addPoints } = useStore();
  const [phase, setPhase] = useState<'menu' | 'loading' | 'playing' | 'answer' | 'done'>('menu');
  const [allQuestions, setAllQuestions] = useState<ImageQuestion[]>([]);
  const [questions, setQuestions] = useState<ImageQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAnnotation, setShowAnnotation] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchQuestions().then(qs => setAllQuestions(qs));
  }, []);

  const startGame = () => {
    if (allQuestions.length === 0) return;
    let pool = allQuestions;
    if (category) pool = pool.filter(q => q.category === category);
    if (pool.length === 0) pool = allQuestions;
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    if (shuffled.length === 0) return;
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(15);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setImageLoaded(false);
    setImageError(false);
    setShowAnnotation(false);
      setPhase('playing');
  };

  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { handleTimeUp(); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [phase, currentIndex]);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentIndex]);

  const handleTimeUp = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (selectedAnswer === null) {
      setSelectedAnswer(-1);
      setPhase('answer');
      setStreak(0);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    if (!showAnnotation) setShowAnnotation(true);
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedAnswer(index);
    setPhase('answer');
    const q = questions[currentIndex];
    if (!q) return;
    const isCorrect = index === q.correctIndex;
    const timeBonus = timeLeft > 10 ? 30 : timeLeft > 5 ? 20 : 10;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setCorrectCount(prev => prev + 1);
      let pts = 50 + timeBonus;
      if (newStreak >= 10) pts += 100;
      else if (newStreak >= 5) pts += 30;
      else if (newStreak >= 3) pts += 15;
      setScore(prev => prev + pts);
      addPoints(pts);
        // Track competency
        if (q.category) {
          const compMap: Record<string, string> = {
            'pneumonia': 'chest_xray_interpretation',
            'pneumothorax': 'chest_xray_interpretation',
            'cardiomegaly': 'chest_xray_interpretation',
            'pleural_effusion': 'chest_xray_interpretation',
            'atelectasis': 'chest_xray_interpretation',
            'normal_chest': 'chest_xray_interpretation',
          };
          const comp = compMap[q.category] || 'chest_xray_interpretation';
          competencyEngine.recordAttempt([comp], true, q.id, 'image', pts);
        }
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(15);
      setImageLoaded(false);
      setImageError(false);
      setShowAnnotation(false);
      setPhase('playing');
    } else {
      setPhase('done');
    }
  };

  const formatTime = (s: number) => `${s}s`;

  if (phase === 'menu') {
    return (
      <View style={styles.container}>
        <View style={styles.menuCard}>
          <Ionicons name="image" size={60} color="#38BDF8" />
          <Text style={styles.menuTitle}>Image Challenge</Text>
          <Text style={styles.menuSub}>Diagnose real medical images in 15 seconds</Text>
          <Text style={styles.menuSub}>{allQuestions.length} images loaded</Text>
          <Pressable style={styles.startBtn} onPress={startGame}>
            <Text style={styles.startBtnText}>Start Challenge</Text>
          </Pressable>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (phase === 'done') {
    return (
      <View style={styles.container}>
        <View style={styles.endCard}>
          <Ionicons name="trophy" size={60} color="#F59E0B" />
          <Text style={styles.endTitle}>Challenge Complete!</Text>
          <Text style={styles.endScore}>{score} Points</Text>
          <Text style={styles.endSub}>{correctCount}/{questions.length} correct</Text>
          <Text style={styles.endSub}>Best Streak: {bestStreak} 🔥</Text>
          <Pressable style={styles.endBtn} onPress={startGame}>
            <Text style={styles.endBtnText}>Play Again</Text>
          </Pressable>
          <Pressable style={[styles.endBtn, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' }]} onPress={() => setPhase('menu')}>
            <Text style={[styles.endBtnText, { color: '#38BDF8' }]}>Menu</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const q = questions[currentIndex];
  if (!q) {
    return (
      <View style={styles.container}>
        <Text style={{color:'white',textAlign:'center',marginTop:100}}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase('menu'); }}>
          <Ionicons name="close" size={22} color="#94A3B8" />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{q.category?.toUpperCase() || 'UNKNOWN'}</Text>
          <Text style={styles.headerSub}>Q {currentIndex + 1}/{questions.length}</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{score} pts</Text>
        </View>
        {streak >= 3 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥{streak}</Text>
          </View>
        )}
      </View>

      <View style={styles.timerBar}>
        <View style={[styles.timerFill, { width: `${(timeLeft / 15) * 100}%`, backgroundColor: timeLeft < 5 ? '#EF4444' : timeLeft < 10 ? '#F59E0B' : '#38BDF8' }]} />
      </View>
      <Text style={styles.timerLabel}>{formatTime(timeLeft)}</Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.imageCard, { opacity: fadeAnim }]}>
          <Text style={styles.categoryTag}>{q.category?.toUpperCase() || 'XRAY'}</Text>
          {!imageLoaded && !imageError && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#38BDF8" />
              <Text style={styles.loadingText}>Loading image...</Text>
            </View>
          )}
          {imageError && (
            <View style={styles.loadingBox}>
              <Ionicons name="alert-circle" size={40} color="#F59E0B" />
              <Text style={styles.loadingText}>Image unavailable</Text>
            </View>
          )}
          {phase === 'answer' && showAnnotation ? (
            <AnnotatedImage
              imageUrl={q.imageUrl}
              annotations={ANNOTATION_SETS[q.category] || []}
              showAnnotations={true}
            />
          ) : (
            <Image
              source={{ uri: q.imageUrl }}
              style={[styles.challengeImage, imageLoaded ? {} : { width: 0, height: 0 }]}
              resizeMode="contain"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
          <Text style={styles.descText}>{q.description}</Text>
        </Animated.View>

        <Text style={styles.questionText}>{q.question}</Text>

        <View style={styles.optionsContainer}>
          {q.options.map((opt, i) => {
            let bg = '#1E293B', border = '#334155', txt = '#E2E8F0';
            if (selectedAnswer !== null) {
              if (i === q.correctIndex) { bg = '#10B98115'; border = '#10B981'; txt = '#10B981'; }
              else if (i === selectedAnswer && selectedAnswer !== q.correctIndex) { bg = '#EF444415'; border = '#EF4444'; txt = '#EF4444'; }
            }
            return (
              <Pressable key={i} style={[styles.optionBtn, { backgroundColor: bg, borderColor: border }]} onPress={() => handleAnswer(i)} disabled={selectedAnswer !== null}>
                <Text style={[styles.optionLetter, { color: txt }]}>{['A', 'B', 'C', 'D'][i]}</Text>
                <Text style={[styles.optionText, { color: txt }]}>{opt}</Text>
                {selectedAnswer !== null && i === q.correctIndex && <Ionicons name="checkmark-circle" size={20} color="#10B981" />}
                {selectedAnswer !== null && i === selectedAnswer && i !== q.correctIndex && <Ionicons name="close-circle" size={20} color="#EF4444" />}
              </Pressable>
            );
          })}
        </View>

        {phase === 'answer' && (
          <Animated.View style={[styles.explanationCard, { opacity: fadeAnim }]}>
            <Text style={[styles.explanationTitle, { color: selectedAnswer === q.correctIndex ? '#10B981' : '#EF4444' }]}>
              {selectedAnswer === q.correctIndex ? '✅ Correct!' : selectedAnswer === -1 ? '⏰ Time Up!' : '❌ Incorrect'}
            </Text>
            <Text style={styles.explanationText}>{q.explanation}</Text>
            <Pressable style={styles.nextBtn} onPress={nextQuestion}>
              <Text style={styles.nextBtnText}>{currentIndex < questions.length - 1 ? 'Next →' : 'See Results'}</Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  menuCard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, gap: 16 },
  menuTitle: { color: '#F8FAFC', fontSize: 28, fontWeight: '800' },
  menuSub: { color: '#94A3B8', fontSize: 14, textAlign: 'center' },
  startBtn: { backgroundColor: '#38BDF8', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 16 },
  startBtnText: { color: '#0F172A', fontSize: 17, fontWeight: '700' },
  backBtn: { marginTop: 4 },
  backBtnText: { color: '#94A3B8', fontSize: 14 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingTop: 20, backgroundColor: '#1A1F2E', borderBottomWidth: 1, borderBottomColor: '#1E293B', gap: 8 },
  headerInfo: { flex: 1 },
  headerTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '700' },
  headerSub: { color: '#94A3B8', fontSize: 11 },
  scoreBadge: { backgroundColor: '#38BDF820', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  scoreText: { color: '#38BDF8', fontSize: 12, fontWeight: '700' },
  streakBadge: { backgroundColor: '#EF444420', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  streakText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
  timerBar: { height: 4, backgroundColor: '#1E293B' },
  timerFill: { height: '100%' },
  timerLabel: { color: '#94A3B8', fontSize: 13, textAlign: 'center', paddingVertical: 6, fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  imageCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 16, alignItems: 'center', minHeight: 200 },
  categoryTag: { color: '#38BDF8', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  challengeImage: { width: '100%', height: 250, borderRadius: 8, marginBottom: 8 },
  loadingBox: { height: 200, justifyContent: 'center', alignItems: 'center', gap: 10 },
  loadingText: { color: '#94A3B8', fontSize: 13 },
  descText: { color: '#94A3B8', fontSize: 12, textAlign: 'center', marginTop: 4 },
  questionText: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  optionsContainer: { gap: 10, marginBottom: 16 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1.5, gap: 10 },
  optionLetter: { fontSize: 15, fontWeight: '700', width: 22 },
  optionText: { flex: 1, fontSize: 14 },
  explanationCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#334155', gap: 12 },
  explanationTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  explanationText: { color: '#E2E8F0', fontSize: 14, lineHeight: 22 },
  nextBtn: { backgroundColor: '#38BDF8', padding: 14, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  nextBtnText: { color: '#0F172A', fontSize: 15, fontWeight: '700' },
  endCard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 14 },
  endTitle: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  endScore: { color: '#F59E0B', fontSize: 48, fontWeight: '800' },
  endSub: { color: '#94A3B8', fontSize: 14 },
  endBtn: { backgroundColor: '#38BDF8', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 4 },
  endBtnText: { color: '#0F172A', fontSize: 15, fontWeight: '700' },
});
