import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import { useQuestionEngine } from './hooks/useQuestionEngine';
import AddToFlashcardModal from '../../components/AddToFlashcardModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SPECIALTIES = [
  { id: 'internal_medicine', name: 'Internal Medicine', icon: 'heart-outline', color: '#3B82F6', desc: 'Adult diseases & chronic conditions' },
  { id: 'pediatrics', name: 'Pediatrics', icon: 'happy-outline', color: '#F59E0B', desc: 'Child healthcare & development' },
  { id: 'surgery', name: 'Surgery', icon: 'cut-outline', color: '#EF4444', desc: 'Operative procedures & trauma' },
  { id: 'obgyn', name: 'OB/GYN', icon: 'female-outline', color: '#8B5CF6', desc: 'Women health & pregnancy' },
];

const DIFFICULTIES = [
  { id: 'beginner' as const, label: 'Intern', color: '#10B981', points: 5 },
  { id: 'intermediate' as const, label: 'Resident', color: '#F59E0B', points: 10 },
  { id: 'advanced' as const, label: 'Specialist', color: '#EF4444', points: 15 },
];

const CONFIDENCE_LEVELS = [
  { id: '50', label: '50%', color: '#EF4444', multiplier: 0.5, icon: 'help-circle-outline' },
  { id: '75', label: '75%', color: '#F59E0B', multiplier: 0.75, icon: 'thumbs-up-outline' },
  { id: '100', label: '100%', color: '#10B981', multiplier: 1.0, icon: 'shield-checkmark-outline' },
];

const CONCEPT_FILTERS = [
  { id: 'all', label: 'All', icon: 'apps-outline' },
  { id: 'ecg_interpretation', label: 'ECG', icon: 'pulse-outline', color: '#EF4444' },
  { id: 'diagnosis', label: 'Diagnosis', icon: 'search-outline', color: '#3B82F6' },
  { id: 'management', label: 'Treatment', icon: 'medkit-outline', color: '#10B981' },
  { id: 'imaging_interpretation', label: 'Imaging', icon: 'image-outline', color: '#8B5CF6' },
  { id: 'emergency_reasoning', label: 'Emergency', icon: 'warning-outline', color: '#F97316' },
];

function formatExplanation(explanation: any): string {
  if (!explanation) return 'No explanation available';
  if (typeof explanation === 'string') return explanation;
  if (explanation.why_correct) return explanation.why_correct;
  if (explanation.text) return explanation.text;
  return 'No explanation available';
}

function getAllWhyWrong(explanation: any): { [key: string]: string } {
  if (!explanation || typeof explanation === 'string') return {};
  return explanation.why_wrong || {};
}

function formatClinicalPearl(explanation: any): string | null {
  if (!explanation || typeof explanation === 'string') return null;
  return explanation.clinical_pearl || explanation.pearls?.[0] || null;
}

export default function QuestionBank() {
  const router = useRouter();
  const addPoints = useStore(s => s.addPoints);
  const engine = useQuestionEngine();

  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSubspecialty, setSelectedSubspecialty] = useState('');
  const [subspecialties, setSubspecialties] = useState<{id: string; name: string; count: number}[]>([]);
  const [manualDifficulty, setManualDifficulty] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [phase, setPhase] = useState<'specialty' | 'subspecialty' | 'difficulty' | 'quiz' | 'done'>('specialty');
  const [selectedConcept, setSelectedConcept] = useState('all');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const questionStartTime = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);

  useEffect(() => { if (engine.autoDifficulty) setManualDifficulty(''); }, [engine.autoDifficulty]);
  useEffect(() => { engine.loadIndex(); }, [engine]);

  const displayQuestions = useMemo(() => {
    const source = quizQuestions.length > 0 ? quizQuestions : engine.questions;
    if (selectedConcept === 'all' || !source.length) return source;
    return source.filter(q => (q.concept?.toLowerCase() || '').includes(selectedConcept.toLowerCase()));
  }, [quizQuestions, engine.questions, selectedConcept]);

  const currentQuestion = displayQuestions[currentIndex];
  const currentDiffConfig = useMemo(() => DIFFICULTIES.find(d => d.id === engine.effectiveDifficulty), [engine.effectiveDifficulty]);

  const handleSpecialtySelect = (specId: string) => {
    setSelectedSpecialty(specId);
    if (engine.indexData?.subjects?.[specId]) {
      const data = engine.indexData.subjects[specId];
      const subs = Object.entries(data.subspecialties || {}).map(([id, info]) => ({
        id, name: id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        count: typeof info === "object" ? (info.count || 0) : (info || 0),
      }));
      setSubspecialties(subs);
    }
    setPhase('subspecialty');
  };

  const handleStartQuiz = () => {
    engine.loadQuestions(selectedSubspecialty, selectedSpecialty, manualDifficulty, selectedConcept);
    setCurrentIndex(0); setScore(0); setStreak(0);
    setSelectedAnswer(null); setShowExplanation(false); setConfidence(null);
    setPhase('quiz'); questionStartTime.current = Date.now();
  };

  const handleAnswer = (oid: string) => {
    if (selectedAnswer || !currentQuestion) return;
    if (!confidence) return;
    setSelectedAnswer(oid);
    const correct = currentQuestion.options.find(o => o.id === oid)?.isCorrect || false;
    const confMultiplier = CONFIDENCE_LEVELS.find(c => c.id === confidence)?.multiplier || 1;
    const bp = currentDiffConfig?.points || 10;
    const ts = Math.round((Date.now() - questionStartTime.current) / 1000);
    engine.logAnswer(currentQuestion, correct, ts, confMultiplier);
    const streakBonus = Math.min(Math.floor(streak / 3) * 5, 15);
    if (correct) { const ns = streak + 1; setStreak(ns); addPoints(Math.round((bp + streakBonus) * confMultiplier)); setScore(s => s + Math.round((bp + streakBonus) * confMultiplier)); }
    else { setStreak(0); }
    timerRef.current = setTimeout(() => setShowExplanation(true), 300);
  };

  const nextQuestion = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (currentIndex < displayQuestions.length - 1) {
      setCurrentIndex(i => i + 1); setSelectedAnswer(null); setShowExplanation(false); setConfidence(null);
      questionStartTime.current = Date.now();
    } else { engine.finalizeQuiz(); setPhase('done'); }
  };

  const resetAll = () => {
    engine.reset(); setSelectedSpecialty(''); setSelectedSubspecialty('');
    setManualDifficulty(''); setPhase('specialty'); setSelectedConcept('all'); setQuizQuestions([]);
  };

  const getFlashcardSuggestion = () => {
    if (!currentQuestion) return { front: '', back: '', deck: 'cardiology' as string };
    const correctOption = currentQuestion.options?.find((o: any) => o.isCorrect);
    const backText = correctOption 
      ? `${correctOption.id.toUpperCase()}. ${correctOption.text}`
      : 'See explanation for answer';
    const deckMap: Record<string, string> = {
      internal_medicine: 'cardiology',
      cardiology: 'cardiology',
      pulmonology: 'pulmonology',
      neurology: 'neurology',
      endocrinology: 'endocrinology',
      gastroenterology: 'gastroenterology',
      infectious_disease: 'infectious',
      pharmacology: 'pharmacology',
    };
    const deck = deckMap[selectedSpecialty] || deckMap[currentQuestion?.specialty] || 'quick_review';
    return { front: currentQuestion.question || '', back: backText, deck };
  };

  if (phase === 'specialty') {
    const specs = SPECIALTIES.map(s => ({ ...s, count: engine.indexData?.subjects?.[s.id]?.count || 0 }));
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}><Ionicons name="arrow-back" size={22} color="#F8FAFC" /></Pressable>
          <Text style={styles.title}>Question Bank</Text>
          <Pressable onPress={() => router.push("/question-bank/analytics")} style={styles.refreshBtn}><Ionicons name="stats-chart" size={20} color="#38BDF8" /></Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.selectContent}>
          <Text style={styles.sectionTitle}>Select Specialty</Text>
          <View style={styles.specGrid}>{specs.map(s => (
            <Pressable key={s.id} style={styles.specCard} onPress={() => handleSpecialtySelect(s.id)}>
              <View style={[styles.specIconBox, { backgroundColor: s.color + '20' }]}><Ionicons name={s.icon as any} size={32} color={s.color} /></View>
              <Text style={styles.specName}>{s.name}</Text>
              <Text style={styles.specDesc}>{s.desc}</Text>
              <View style={[styles.specCountBadge, { backgroundColor: s.color + '15' }]}><Text style={[styles.specCountText, { color: s.color }]}>{s.count} Qs</Text></View>
            </Pressable>
          ))}</View>
        </ScrollView>
      </View>
    );
  }

  if (phase === 'subspecialty') {
    return (
      <View style={styles.container}>
        <View style={styles.header}><Pressable onPress={() => setPhase('specialty')} style={styles.backBtn}><Ionicons name="arrow-back" size={22} color="#F8FAFC" /></Pressable><Text style={styles.title}>Subspecialty</Text></View>
        <ScrollView contentContainerStyle={styles.selectContent}>
          <Text style={styles.sectionTitle}>Select Subspecialty</Text>
          <View style={styles.subGrid}>{subspecialties.map(s => (
            <Pressable key={s.id} style={styles.subCard} onPress={() => { setSelectedSubspecialty(s.id); setPhase('difficulty'); }}>
              <Ionicons name="medical-outline" size={22} color="#38BDF8" /><Text style={styles.subName}>{s.name}</Text><Text style={styles.subCount}>{s.count} Qs</Text><Ionicons name="chevron-forward" size={18} color="#64748B" />
            </Pressable>
          ))}</View>
        </ScrollView>
      </View>
    );
  }

  if (phase === 'difficulty') {
    return (
      <View style={styles.container}>
        <View style={styles.header}><Pressable onPress={() => setPhase('subspecialty')} style={styles.backBtn}><Ionicons name="arrow-back" size={22} color="#F8FAFC" /></Pressable><Text style={styles.title}>Select Level</Text></View>
        <ScrollView contentContainerStyle={styles.selectContent}>
          <View style={styles.autoSwitch}>
            <Text style={styles.autoLabel}>Difficulty:</Text>
            <Pressable style={[styles.switchBtn, engine.autoDifficulty && styles.switchBtnActive]} onPress={engine.toggleAutoDifficulty}>
              <Ionicons name={engine.autoDifficulty ? 'hardware-chip-outline' : 'person-outline'} size={16} color={engine.autoDifficulty ? '#38BDF8' : '#94A3B8'} />
              <Text style={[styles.switchText, engine.autoDifficulty && styles.switchTextActive]}>{engine.autoDifficulty ? 'Auto' : 'Manual'}</Text>
            </Pressable>
          </View>
          {!engine.autoDifficulty && (
            <View style={styles.diffRow}>{DIFFICULTIES.map(d => (
              <Pressable key={d.id} style={[styles.diffCard, manualDifficulty === d.id && { borderColor: d.color, backgroundColor: d.color + '15' }]} onPress={() => setManualDifficulty(manualDifficulty === d.id ? '' : d.id)}>
                <Text style={[styles.diffLabel, manualDifficulty === d.id && { color: d.color }]}>{d.label}</Text><Text style={styles.diffPoints}>+{d.points}</Text>
              </Pressable>
            ))}</View>
          )}
          <Pressable style={styles.startBtn} onPress={handleStartQuiz}><Text style={styles.startBtnText}>Start Quiz</Text><Ionicons name="arrow-forward" size={20} color="#FFF" /></Pressable>
        </ScrollView>
      </View>
    );
  }

  if (engine.loading) return <View style={styles.container}><ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 100 }} /><Text style={styles.loadingText}>Loading...</Text></View>;
  if (!currentQuestion) return <View style={styles.container}><View style={styles.doneContent}><Ionicons name="search-outline" size={60} color="#64748B" /><Text style={styles.analyticsText}>No questions found</Text><Pressable style={styles.doneBtn} onPress={resetAll}><Text style={styles.doneBtnText}>Back</Text></Pressable></View></View>;

  if (phase === 'done') {
    const report = engine.analyticsSummary;
    const learningPaths = engine.learningPaths || [];
    return (
      <View style={styles.container}>
        <View style={styles.doneContent}>
          <Ionicons name="trophy" size={80} color="#F59E0B" /><Text style={styles.doneTitle}>Quiz Complete!</Text>
          <Text style={styles.doneScore}>Score: {score}</Text>
          {report && <View style={styles.analyticsSummary}><Text style={styles.analyticsTitle}>📊 Insights</Text>{(report.weakestConcepts ?? []).slice(0, 3).map(w => <Text key={w.concept} style={styles.analyticsText}>🎯 {w.concept}: {w.accuracy}%</Text>)}</View>}
          {learningPaths.length > 0 && <View style={styles.analyticsSummary}><Text style={styles.analyticsTitle}>🛤️ Learning Paths</Text>{learningPaths.map((lp, i) => <View key={i} style={{ marginBottom: 8 }}><Text style={styles.analyticsText}>🎯 {lp.title} ({lp.urgency})</Text>{lp.steps.slice(0, 3).map((step, j) => <Text key={j} style={[styles.analyticsText, { fontSize: 11, marginLeft: 8 }]}>{step}</Text>)}</View>)}</View>}
          <Pressable style={styles.doneBtn} onPress={resetAll}><Text style={styles.doneBtnText}>Back</Text></Pressable>
        </View>
      </View>
    );
  }

  const allWhyWrong = currentQuestion?.explanation ? getAllWhyWrong(currentQuestion.explanation) : {};
  const wrongOptions = currentQuestion?.options.filter(o => !o.isCorrect) || [];
  const flashcardSuggestion = getFlashcardSuggestion();

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${((currentIndex+1)/Math.max(displayQuestions.length, 1))*100}%` }]} /></View>
      <View style={styles.quizHeader}>
        <Pressable onPress={resetAll} style={styles.quitBtn}><Ionicons name="close" size={20} color="#94A3B8" /></Pressable>
        <Text style={styles.quizCounter}>{currentIndex+1}/{displayQuestions.length}</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>⭐ {score}</Text>{streak >= 3 && <Text style={styles.streakText}>🔥 {streak}</Text>}
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.quizContent}>
        <View style={styles.tagRow}>
          {currentQuestion?.subspecialty && <View style={styles.tag}><Text style={styles.tagText}>{currentQuestion.subspecialty}</Text></View>}
          {currentQuestion?.concept && <View style={[styles.tag, { backgroundColor: '#10B98120' }]}><Text style={[styles.tagText, { color: '#10B981' }]}>{currentQuestion.concept}</Text></View>}
          {currentQuestion?.difficulty && <View style={[styles.tag, { backgroundColor: '#F59E0B20' }]}><Text style={[styles.tagText, { color: '#F59E0B' }]}>{currentQuestion.difficulty}</Text></View>}
        </View>
        <Text style={styles.questionText}>{currentQuestion?.question}</Text>
        {!confidence ? (
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceTitle}>Select your confidence level</Text>
            <View style={styles.confidenceRow}>{CONFIDENCE_LEVELS.map(c => (
              <Pressable key={c.id} style={[styles.confidenceCard, confidence === c.id && { borderColor: c.color, backgroundColor: c.color+'15' }]} onPress={() => setConfidence(c.id)}>
                <Ionicons name={c.icon as any} size={28} color={c.color} /><Text style={[styles.confidenceLabel, { color: c.color }]}>{c.label}</Text>
              </Pressable>
            ))}</View>
          </View>
        ) : (
          <View style={styles.optionsContainer}>{currentQuestion?.options.map(o => {
            const isSel = selectedAnswer === o.id; const isOk = o.isCorrect;
            let os = styles.optionCard, ts = styles.optionText, ic: any = 'ellipse-outline';
            if (selectedAnswer) { if (isOk) { os = {...os, ...styles.optionCorrect}; ts = {...ts, ...styles.optionTextCorrect}; ic = 'checkmark-circle'; } else if (isSel && !isOk) { os = {...os, ...styles.optionWrong}; ts = {...ts, ...styles.optionTextWrong}; ic = 'close-circle'; } }
            else if (isSel) { os = {...os, ...styles.optionSelected}; ic = 'radio-button-on'; }
            return <Pressable key={o.id} style={os} onPress={() => handleAnswer(o.id)} disabled={!!selectedAnswer}><Ionicons name={ic} size={22} color={selectedAnswer ? (isOk ? '#10B981' : isSel ? '#EF4444' : '#64748B') : isSel ? '#38BDF8' : '#64748B'} /><Text style={ts}>{o.text}</Text></Pressable>;
          })}</View>
        )}
        {showExplanation && selectedAnswer && currentQuestion && (
          <View style={styles.explanationContainer}>
            <View style={styles.explanationHeader}>
              <Ionicons name={currentQuestion.options.find(o => o.id === selectedAnswer)?.isCorrect ? 'checkmark-circle' : 'close-circle'} size={24} color={currentQuestion.options.find(o => o.id === selectedAnswer)?.isCorrect ? '#10B981' : '#EF4444'} />
              <Text style={[styles.explanationTitle, { color: currentQuestion.options.find(o => o.id === selectedAnswer)?.isCorrect ? '#10B981' : '#EF4444' }]}>
                {currentQuestion.options.find(o => o.id === selectedAnswer)?.isCorrect ? 'Correct!' : 'Incorrect'}
              </Text>
            </View>
            <Text style={styles.explanationText}>{formatExplanation(currentQuestion.explanation)}</Text>
            {wrongOptions.length > 0 && (
              <View style={styles.allWrongContainer}>
                <Text style={styles.allWrongTitle}>Why the other options are incorrect:</Text>
                {wrongOptions.map(o => {
                  const reason = allWhyWrong[o.id];
                  if (!reason) return null;
                  return (
                    <View key={o.id} style={styles.whyWrongBox}>
                      <Ionicons name="close-circle" size={16} color="#EF4444" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.whyWrongOption}>{o.id.toUpperCase()}. {o.text?.substring(0, 50)}...</Text>
                        <Text style={styles.whyWrongText}>{reason}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            {formatClinicalPearl(currentQuestion.explanation) && (
              <View style={styles.pearlBox}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.pearlText}>💡 {formatClinicalPearl(currentQuestion.explanation)}</Text>
              </View>
            )}
            {currentQuestion.trap_type && (
              <View style={styles.trapInfo}>
                <Ionicons name="warning-outline" size={14} color="#F59E0B" />
                <Text style={styles.trapText}>⚠️ Trap: {currentQuestion.trap_type.replace(/_/g, ' ')}</Text>
              </View>
            )}
            {/* ✅ Add to Flashcards Button in Explanation */}
            <Pressable
              style={styles.addFlashcardBtn}
              onPress={() => setShowFlashcardModal(true)}
            >
              <Ionicons name="flash" size={16} color="#F59E0B" />
              <Text style={styles.addFlashcardText}>Add to Flashcards</Text>
            </Pressable>
          </View>
        )}
        {selectedAnswer && <Pressable style={styles.nextBtn} onPress={nextQuestion}><Text style={styles.nextBtnText}>{currentIndex < displayQuestions.length-1 ? 'Next' : 'Finish'}</Text><Ionicons name="arrow-forward" size={20} color="#FFF" /></Pressable>}
      </ScrollView>

      {/* ✅ Flashcard Modal */}
      <AddToFlashcardModal
        visible={showFlashcardModal}
        onClose={() => setShowFlashcardModal(false)}
        suggestedFront={flashcardSuggestion.front}
        suggestedBack={flashcardSuggestion.back}
        suggestedDeck={flashcardSuggestion.deck}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 20, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#F8FAFC', fontSize: 22, fontWeight: '800', flex: 1 },
  refreshBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  selectContent: { padding: 16 },
  sectionTitle: { color: '#94A3B8', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 16 },
  specGrid: { gap: 10 },
  specCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#334155', gap: 8 },
  specIconBox: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  specName: { color: '#F8FAFC', fontSize: 17, fontWeight: '700' },
  specDesc: { color: '#94A3B8', fontSize: 12 },
  specCountBadge: { position: 'absolute', top: 16, right: 16, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  specCountText: { fontSize: 12, fontWeight: '700' },
  subGrid: { gap: 6 },
  subCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1E293B', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  subName: { color: '#F8FAFC', fontSize: 14, fontWeight: '600', flex: 1 },
  subCount: { color: '#64748B', fontSize: 12, marginRight: 8 },
  autoSwitch: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1E293B', padding: 12, borderRadius: 12, marginBottom: 14, borderWidth: 1, borderColor: '#334155' },
  autoLabel: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  switchBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0F172A', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#334155' },
  switchBtnActive: { borderColor: '#38BDF8', backgroundColor: '#38BDF810' },
  switchText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  switchTextActive: { color: '#38BDF8' },
  diffRow: { flexDirection: 'row', gap: 8 },
  diffCard: { flex: 1, backgroundColor: '#1E293B', padding: 14, borderRadius: 12, borderWidth: 2, borderColor: '#334155', alignItems: 'center', gap: 4 },
  diffLabel: { color: '#F8FAFC', fontSize: 14, fontWeight: '700' },
  diffPoints: { color: '#64748B', fontSize: 11 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#38BDF8', padding: 16, borderRadius: 14, marginTop: 16 },
  startBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  loadingText: { color: '#94A3B8', fontSize: 14, textAlign: 'center', marginTop: 16 },
  progressBar: { height: 4, backgroundColor: '#1E293B' },
  progressFill: { height: '100%', backgroundColor: '#38BDF8' },
  quizHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 },
  quitBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  quizCounter: { color: '#94A3B8', fontSize: 14, fontWeight: '600', flex: 1, textAlign: 'center' },
  scoreBadge: { flexDirection: 'row', gap: 8 },
  scoreText: { color: '#F59E0B', fontSize: 14, fontWeight: '700' },
  streakText: { color: '#EF4444', fontSize: 14, fontWeight: '700' },
  quizContent: { padding: 16 },
  tagRow: { flexDirection: 'row', gap: 6, marginBottom: 12, flexWrap: 'wrap' },
  tag: { backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { color: '#94A3B8', fontSize: 10, fontWeight: '600' },
  questionText: { color: '#F8FAFC', fontSize: 17, fontWeight: '600', lineHeight: 26, marginBottom: 16 },
  confidenceContainer: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  confidenceTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  confidenceRow: { flexDirection: 'row', gap: 10 },
  confidenceCard: { flex: 1, backgroundColor: '#0F172A', padding: 14, borderRadius: 12, borderWidth: 2, borderColor: '#334155', alignItems: 'center', gap: 6 },
  confidenceLabel: { fontSize: 14, fontWeight: '700' },
  optionsContainer: { gap: 10, marginBottom: 16 },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1E293B', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#334155' },
  optionSelected: { borderColor: '#38BDF8', backgroundColor: '#38BDF810' },
  optionCorrect: { borderColor: '#10B981', backgroundColor: '#10B98110' },
  optionWrong: { borderColor: '#EF4444', backgroundColor: '#EF444410' },
  optionText: { color: '#E2E8F0', fontSize: 14, flex: 1 },
  optionTextCorrect: { color: '#10B981' },
  optionTextWrong: { color: '#EF4444' },
  explanationContainer: { backgroundColor: '#1E293B', padding: 18, borderRadius: 14, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  explanationTitle: { fontSize: 18, fontWeight: '800' },
  explanationText: { color: '#E2E8F0', fontSize: 14, lineHeight: 22, marginBottom: 12 },
  allWrongContainer: { marginBottom: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#334155' },
  allWrongTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '700', marginBottom: 8 },
  whyWrongBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#EF444415', padding: 12, borderRadius: 10, marginBottom: 8 },
  whyWrongOption: { color: '#EF4444', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  whyWrongText: { color: '#EF4444', fontSize: 13, lineHeight: 20 },
  pearlBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#F59E0B15', padding: 12, borderRadius: 10, marginBottom: 8 },
  pearlText: { color: '#F59E0B', fontSize: 13, flex: 1, lineHeight: 20 },
  trapInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#334155' },
  trapText: { color: '#F59E0B', fontSize: 12 },
  addFlashcardBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#F59E0B15', padding: 10, borderRadius: 10, marginTop: 12,
    borderWidth: 1, borderColor: '#F59E0B30',
  },
  addFlashcardText: { color: '#F59E0B', fontSize: 13, fontWeight: '600' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#38BDF8', padding: 16, borderRadius: 14 },
  nextBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  analyticsSummary: { backgroundColor: '#1E293B', padding: 16, borderRadius: 14, width: '100%', marginTop: 12, borderWidth: 1, borderColor: '#334155' },
  analyticsTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  analyticsText: { color: '#94A3B8', fontSize: 13, marginBottom: 4 },
  doneContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 12 },
  doneTitle: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  doneScore: { color: '#F59E0B', fontSize: 36, fontWeight: '900' },
  doneBtn: { backgroundColor: '#38BDF8', padding: 16, borderRadius: 14, marginTop: 20, width: '100%', alignItems: 'center' },
  doneBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
