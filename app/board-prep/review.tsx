import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BoardQuestion, loadBoardQuestions, getMockBoardExam } from '../flashcards/boardQuestions';

const BOARD_STORAGE_KEY = 'board_prep_data';

type FilterType = 'all' | 'incorrect' | 'skipped' | 'flagged';

export default function ReviewScreen() {
  const router = useRouter();
  const [questions, setQuestions] = useState<BoardQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedList, setFlaggedList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<FilterType>('incorrect');
  const [filteredQuestions, setFilteredQuestions] = useState<BoardQuestion[]>([]);
  const [showNote, setShowNote] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [understood, setUnderstood] = useState<Set<string>>(new Set());

  useEffect(() => {
    initReview();
  }, []);

  const initReview = async () => {
    setLoading(true);
    
    // Load questions from GitHub
    await loadBoardQuestions();
    
    // Load last attempt data
    const stored = await AsyncStorage.getItem(BOARD_STORAGE_KEY);
    if (stored) {
      const attempts = JSON.parse(stored);
      const lastAttempt = attempts[attempts.length - 1];
      
      if (lastAttempt) {
        // Get the exam questions from the last attempt
        const allQuestions = getMockBoardExam(lastAttempt.totalQuestions, lastAttempt.attemptNumber || 0);
        setQuestions(allQuestions);
        setAnswers(lastAttempt.answers || {});
        setFlaggedList(lastAttempt.flaggedQuestions || []);
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    applyFilter();
  }, [filter, questions, answers, flaggedList, understood]);

  const applyFilter = () => {
    let filtered = [...questions];
    
    if (filter === 'incorrect') {
      filtered = filtered.filter(q => {
        const userAnswer = answers[q.id];
        return userAnswer && userAnswer !== q.correctOptionId;
      });
    } else if (filter === 'skipped') {
      filtered = filtered.filter(q => !answers[q.id]);
    } else if (filter === 'flagged') {
      filtered = filtered.filter(q => flaggedList.includes(q.id));
    }
    
    setFilteredQuestions(filtered);
    setCurrentIndex(0);
  };

  const handleUnderstood = (questionId: string) => {
    setUnderstood(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) newSet.delete(questionId);
      else newSet.add(questionId);
      return newSet;
    });
  };

  const handleAddNote = (questionId: string, note: string) => {
    setNotes(prev => ({ ...prev, [questionId]: note }));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8B5CF6" style={{ marginTop: 100 }} />
        <Text style={styles.loadingText}>Loading review...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
          </Pressable>
          <Text style={styles.headerTitle}>📚 Review</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={80} color="#64748B" />
          <Text style={styles.emptyTitle}>No Data Yet</Text>
          <Text style={styles.emptySub}>Complete an exam to review your answers</Text>
          <Pressable style={styles.takeExamBtn} onPress={() => router.push('/board-prep')}>
            <Text style={styles.takeExamBtnText}>Take an Exam</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
          </Pressable>
          <Text style={styles.headerTitle}>📚 Review</Text>
        </View>
        
        <View style={styles.filterRow}>
          {(['all', 'incorrect', 'skipped', 'flagged'] as FilterType[]).map(f => (
            <Pressable
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? '📋 All' : f === 'incorrect' ? '❌ Incorrect' : f === 'skipped' ? '⏭️ Skipped' : '🚩 Flagged'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle" size={80} color="#10B981" />
          <Text style={styles.emptyTitle}>All Clear! 🎉</Text>
          <Text style={styles.emptySub}>No questions match this filter</Text>
        </View>
      </View>
    );
  }

  const currentQuestion = filteredQuestions[currentIndex];
  const userAnswer = answers[currentQuestion.id];
  const isCorrect = userAnswer === currentQuestion.correctOptionId;
  const correctOption = currentQuestion.options.find(o => o.id === currentQuestion.correctOptionId);
  const userOption = currentQuestion.options.find(o => o.id === userAnswer);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>📚 Review</Text>
          <Text style={styles.headerSub}>{filteredQuestions.length} questions</Text>
        </View>
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        {(['all', 'incorrect', 'skipped', 'flagged'] as FilterType[]).map(f => (
          <Pressable
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? '📋 All' : f === 'incorrect' ? '❌ Incorrect' : f === 'skipped' ? '⏭️ Skipped' : '🚩 Flagged'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Question Header */}
        <View style={styles.questionHeader}>
          <View style={styles.topicBadge}>
            <Text style={styles.topicText}>{currentQuestion.topic}</Text>
          </View>
          <View style={styles.specialtyBadge}>
            <Text style={styles.specialtyText}>{currentQuestion.specialty}</Text>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: currentQuestion.difficulty === 'hard' ? '#EF444420' : currentQuestion.difficulty === 'medium' ? '#F59E0B20' : '#10B98120' }]}>
            <Text style={[styles.diffText, { color: currentQuestion.difficulty === 'hard' ? '#EF4444' : currentQuestion.difficulty === 'medium' ? '#F59E0B' : '#10B981' }]}>
              {currentQuestion.difficulty}
            </Text>
          </View>
        </View>

        {/* Vignette */}
        <Text style={styles.vignette}>{currentQuestion.vignette}</Text>

        {/* User's Answer */}
        <View style={[styles.answerBox, isCorrect ? styles.correctBox : styles.incorrectBox]}>
          <View style={styles.answerHeader}>
            <Ionicons name={isCorrect ? 'checkmark-circle' : userAnswer ? 'close-circle' : 'help-circle'} size={20} color={isCorrect ? '#10B981' : userAnswer ? '#EF4444' : '#F59E0B'} />
            <Text style={[styles.answerTitle, { color: isCorrect ? '#10B981' : userAnswer ? '#EF4444' : '#F59E0B' }]}>
              {isCorrect ? 'Correct!' : userAnswer ? 'Incorrect' : 'Skipped'}
            </Text>
          </View>
          {userOption && (
            <Text style={styles.answerText}>Your answer: {userOption.id}) {userOption.text}</Text>
          )}
          {!isCorrect && correctOption && (
            <Text style={styles.correctAnswer}>Correct: {correctOption.id}) {correctOption.text}</Text>
          )}
        </View>

        {/* Explanation */}
        <View style={styles.explanationCard}>
          {/* Why Correct */}
          <View style={styles.whySection}>
            <Text style={styles.whyLabel}>✅ Why This is Correct</Text>
            <Text style={styles.whyText}>{currentQuestion.explanation.whyCorrect}</Text>
          </View>

          {/* Why Wrong */}
          {currentQuestion.explanation.whyWrong && Object.keys(currentQuestion.explanation.whyWrong).length > 0 && (
            <View style={styles.whySection}>
              <Text style={styles.whyLabel}>❌ Why Other Options Are Wrong</Text>
              {Object.entries(currentQuestion.explanation.whyWrong).map(([key, reason]: [string, any]) => (
                <View key={key} style={styles.wrongItem}>
                  <Text style={styles.wrongKey}>{key}.</Text>
                  <Text style={styles.wrongText}>{reason}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Clinical Pearl */}
          {currentQuestion.explanation.clinicalPearl && (
            <View style={styles.pearlBox}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <View style={{ flex: 1 }}>
                <Text style={styles.pearlLabel}>💡 Clinical Pearl</Text>
                <Text style={styles.pearlText}>{currentQuestion.explanation.clinicalPearl}</Text>
              </View>
            </View>
          )}

          {/* References */}
          {currentQuestion.references && currentQuestion.references.length > 0 && (
            <View style={styles.refBox}>
              <Text style={styles.refLabel}>📖 References</Text>
              {currentQuestion.references.map((ref, i) => (
                <Text key={i} style={styles.refText}>• {ref}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Note Input */}
        {showNote && (
          <View style={styles.noteCard}>
            <TextInput
              style={styles.noteInput}
              value={notes[currentQuestion.id] || ''}
              onChangeText={(text) => handleAddNote(currentQuestion.id, text)}
              placeholder="Write your notes here..."
              placeholderTextColor="#64748B"
              multiline
            />
            <Pressable style={styles.saveNoteBtn} onPress={() => setShowNote(false)}>
              <Text style={styles.saveNoteText}>Save Note</Text>
            </Pressable>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Pressable style={styles.actionBtn} onPress={() => setShowNote(!showNote)}>
            <Ionicons name="pencil" size={16} color="#38BDF8" />
            <Text style={styles.actionText}>Note</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, understood.has(currentQuestion.id) && styles.actionBtnActive]}
            onPress={() => handleUnderstood(currentQuestion.id)}
          >
            <Ionicons name={understood.has(currentQuestion.id) ? 'checkmark-circle' : 'checkmark-circle-outline'} size={16} color={understood.has(currentQuestion.id) ? '#10B981' : '#94A3B8'} />
            <Text style={[styles.actionText, understood.has(currentQuestion.id) && { color: '#10B981' }]}>Got It</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color={currentIndex === 0 ? '#64748B' : '#F8FAFC'} />
          <Text style={[styles.navBtnText, currentIndex === 0 && { color: '#64748B' }]}>Previous</Text>
        </Pressable>

        <Text style={styles.counter}>{currentIndex + 1} / {filteredQuestions.length}</Text>

        <Pressable
          style={[styles.navBtn, currentIndex >= filteredQuestions.length - 1 && styles.navBtnDisabled]}
          onPress={() => setCurrentIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1))}
          disabled={currentIndex >= filteredQuestions.length - 1}
        >
          <Text style={[styles.navBtnText, currentIndex >= filteredQuestions.length - 1 && { color: '#64748B' }]}>Next</Text>
          <Ionicons name="chevron-forward" size={20} color={currentIndex >= filteredQuestions.length - 1 ? '#64748B' : '#F8FAFC'} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  loadingText: { color: '#94A3B8', textAlign: 'center', marginTop: 20 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#1A1F2E', gap: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1 },
  headerTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '800' },
  headerSub: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  filterRow: { flexDirection: 'row', gap: 6, padding: 10, backgroundColor: '#1A1F2E' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  filterChipActive: { backgroundColor: '#8B5CF620', borderColor: '#8B5CF6' },
  filterText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  filterTextActive: { color: '#8B5CF6' },
  progressBar: { height: 3, backgroundColor: '#1E293B' },
  progressFill: { height: '100%', backgroundColor: '#8B5CF6' },
  content: { flex: 1, padding: 16 },
  questionHeader: { flexDirection: 'row', gap: 6, marginBottom: 16, flexWrap: 'wrap' },
  topicBadge: { backgroundColor: '#8B5CF620', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  topicText: { color: '#8B5CF6', fontSize: 11, fontWeight: '700' },
  specialtyBadge: { backgroundColor: '#38BDF820', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  specialtyText: { color: '#38BDF8', fontSize: 11 },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  diffText: { fontSize: 11, fontWeight: '700' },
  vignette: { color: '#E2E8F0', fontSize: 14, lineHeight: 22, marginBottom: 16 },
  answerBox: { padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1 },
  correctBox: { backgroundColor: '#10B98110', borderColor: '#10B98140' },
  incorrectBox: { backgroundColor: '#EF444410', borderColor: '#EF444440' },
  answerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  answerTitle: { fontSize: 16, fontWeight: '800' },
  answerText: { color: '#E2E8F0', fontSize: 13, marginBottom: 4 },
  correctAnswer: { color: '#10B981', fontSize: 13, fontWeight: '600' },
  explanationCard: { backgroundColor: '#1E293B', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  whySection: { marginBottom: 14 },
  whyLabel: { color: '#F8FAFC', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  whyText: { color: '#CBD5E1', fontSize: 13, lineHeight: 20 },
  wrongItem: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  wrongKey: { color: '#EF4444', fontSize: 13, fontWeight: '700', width: 20 },
  wrongText: { color: '#EF4444', fontSize: 12, flex: 1, lineHeight: 18 },
  pearlBox: { flexDirection: 'row', gap: 10, backgroundColor: '#F59E0B10', padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#F59E0B30' },
  pearlLabel: { color: '#F59E0B', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  pearlText: { color: '#F59E0B', fontSize: 12, lineHeight: 18 },
  refBox: { backgroundColor: '#0F172A', padding: 10, borderRadius: 8 },
  refLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '700', marginBottom: 4 },
  refText: { color: '#64748B', fontSize: 10, lineHeight: 16 },
  noteCard: { backgroundColor: '#1E293B', padding: 12, borderRadius: 12, marginBottom: 12 },
  noteInput: { backgroundColor: '#0F172A', color: '#F8FAFC', padding: 10, borderRadius: 8, fontSize: 13, minHeight: 60, textAlignVertical: 'top' },
  saveNoteBtn: { backgroundColor: '#8B5CF6', padding: 10, borderRadius: 8, marginTop: 8, alignItems: 'center' },
  saveNoteText: { color: '#FFF', fontWeight: '600', fontSize: 12 },
  actionRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1E293B', padding: 10, borderRadius: 10, flex: 1, justifyContent: 'center' },
  actionBtnActive: { backgroundColor: '#10B98110', borderColor: '#10B98140', borderWidth: 1 },
  actionText: { color: '#E2E8F0', fontSize: 12, fontWeight: '600' },
  bottomNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#1A1F2E', borderTopWidth: 1, borderTopColor: '#1E293B' },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 10 },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { color: '#F8FAFC', fontSize: 13, fontWeight: '600' },
  counter: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 12 },
  emptyTitle: { color: '#F8FAFC', fontSize: 22, fontWeight: '800' },
  emptySub: { color: '#94A3B8', fontSize: 14, textAlign: 'center' },
  takeExamBtn: { backgroundColor: '#8B5CF6', padding: 16, borderRadius: 14, marginTop: 8 },
  takeExamBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
