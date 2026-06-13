import { useRef, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../../../src/store';
import { AdaptiveEngine, Difficulty } from '../../../src/engines/adaptiveEngine';
import { AnalyticsEngine } from '../../../src/engines/analyticsEngine';
import { GraphEngine } from '../../../src/engines/graphEngine';
import { fetchIndex, fetchQuestionsFile, filterQuestions, selectAdaptiveQuestions, Question, IndexData } from '../services/questionService';
import { analyzeErrors, AnalyticsSummary } from '../services/analyticsService';
import { syncSpacedRepetition, loadSpacedRepetition, saveQuizSession, logAnswer as logAnswerCloud, SRRecord } from '../services/syncService';

const SR_KEY = 'medtach_spaced_repetition';
const SR_INTERVALS = [1, 3, 7, 14, 30, 60];

export function useQuestionEngine() {
  const adaptive = useRef(new AdaptiveEngine()).current;
  const analytics = useRef(new AnalyticsEngine()).current;
  const graphEngine = useRef(new GraphEngine()).current;
  const user = useStore(s => s.user);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [indexData, setIndexData] = useState<IndexData | null>(null);
  const [answersLog, setAnswersLog] = useState<any[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [weakConcepts, setWeakConcepts] = useState<string[]>([]);
  const [weakTags, setWeakTags] = useState<string[]>([]);
  const [autoDifficulty, setAutoDifficulty] = useState(true);
  const [effectiveDifficulty, setEffectiveDifficulty] = useState<Difficulty>('beginner');
  const [srData, setSrData] = useState<any>({});
  const [dueForReview, setDueForReview] = useState(0);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);

  const loadSR = useCallback(async () => {
    if (user?.id) {
      const cloudData = await loadSpacedRepetition(user.id);
      if (cloudData && Object.keys(cloudData).length > 0) {
        const local: any = {};
        Object.entries(cloudData).forEach(([qid, d]) => { local[qid] = { ...d, lastReviewed: d.next_review }; });
        setSrData(local);
        await AsyncStorage.setItem(SR_KEY, JSON.stringify(local));
        const now = new Date();
        setDueForReview(Object.values(local).filter((d: any) => new Date(d.nextReview) <= now).length);
        return;
      }
    }
    try {
      const data = await AsyncStorage.getItem(SR_KEY);
      if (data) { const p = JSON.parse(data); setSrData(p); const now = new Date(); setDueForReview(Object.values(p).filter((d: any) => new Date(d.nextReview) <= now).length); }
    } catch {}
  }, [user]);

  const saveSR = async (data: any) => {
    try { await AsyncStorage.setItem(SR_KEY, JSON.stringify(data)); } catch {}
    if (user?.id) {
      const cloudFormat: Record<string, SRRecord> = {};
      Object.entries(data).forEach(([qid, d]: [string, any]) => {
        cloudFormat[qid] = { question_id: qid, interval: d.interval, next_review: d.nextReview, correct_count: d.correctCount, wrong_count: d.wrongCount };
      });
      await syncSpacedRepetition(user.id, cloudFormat);
    }
  };

  const updateSR = useCallback((qid: string, isCorrect: boolean) => {
    const now = new Date();
    setSrData((prev: any) => {
      const u = { ...prev };
      if (u[qid]) {
        const c = u[qid];
        const safeIdx = Math.max(SR_INTERVALS.indexOf(c.interval), 0);
        const nextIdx = isCorrect ? Math.min(safeIdx + 1, SR_INTERVALS.length - 1) : 0;
        const ni = SR_INTERVALS[nextIdx];
        const nr = new Date(now); nr.setDate(nr.getDate() + ni);
        u[qid] = { interval: ni, nextReview: nr.toISOString(), correctCount: c.correctCount + (isCorrect?1:0), wrongCount: c.wrongCount + (isCorrect?0:1), lastReviewed: now.toISOString() };
      } else {
        const nr = new Date(now); const iv = isCorrect ? SR_INTERVALS[1] : SR_INTERVALS[0]; nr.setDate(nr.getDate() + iv);
        u[qid] = { interval: iv, nextReview: nr.toISOString(), correctCount: isCorrect?1:0, wrongCount: isCorrect?0:1, lastReviewed: now.toISOString() };
      }
      saveSR(u); return u;
    });
  }, [user]);

  const loadIndex = useCallback(async () => {
    const data = await fetchIndex();
    if (data) setIndexData(data);
    await loadSR();
    await graphEngine.loadState();
  }, [loadSR, graphEngine]);

  const loadQuestions = useCallback(async (subspecialty: string, specialty: string, manualDifficulty?: string, concept?: string) => {
    if (!indexData) return;
    setLoading(true);
    const diff = autoDifficulty ? adaptive.getDifficulty() : (manualDifficulty as Difficulty || 'beginner');
    setEffectiveDifficulty(diff);
    const allQuestions = await fetchQuestionsFile(specialty, subspecialty, indexData);
    let selected: Question[];
    if (weakConcepts.length > 0 || weakTags.length > 0) {
      selected = selectAdaptiveQuestions(allQuestions, weakConcepts, weakTags, 10);
    } else {
      selected = filterQuestions(allQuestions, diff, concept, 10);
    }
    const now = new Date();
    const reviewFirst = selected.filter(q => { const d = srData[q.id]; return d && new Date(d.nextReview) <= now; });
    const others = selected.filter(q => !reviewFirst.some(r => r.id === q.id));
    const final = [...reviewFirst.sort(() => Math.random() - 0.5).slice(0, 6), ...others.sort(() => Math.random() - 0.5).slice(0, 4)].sort(() => Math.random() - 0.5);
    setQuestions(final.length > 0 ? final : selected.slice(0, 10));
    setAnswersLog([]); setAnalyticsSummary(null); setLearningPaths([]);
    setLoading(false);
  }, [indexData, autoDifficulty, weakConcepts, weakTags, srData, adaptive]);

  const logAnswer = useCallback((question: Question, isCorrect: boolean, timeSpent: number, confidence: number) => {
    adaptive.updatePerformance(isCorrect, question.cognitive_level);
    if (question.cognitive_level === 'emergency_reasoning' && !isCorrect) adaptive.applyCognitivePenalty();
    analytics.logAnswer(question.subspecialty || 'general', isCorrect, timeSpent, confidence, effectiveDifficulty);
    updateSR(question.id, isCorrect);
    
    // ✅ Graph Engine
    graphEngine.logAnswer({
      questionId: question.id, concept: question.concept,
      isCorrect, timeSpent, confidence, timestamp: new Date(),
    });
    
    if (user?.id) logAnswerCloud(user.id, question.id, isCorrect, timeSpent, confidence, question.cognitive_level, question.trap_type, question.tags);
    setAnswersLog((prev: any) => [...prev, { questionId: question.id, isCorrect, timeSpent, confidence, concept: question.concept }]);
    setEffectiveDifficulty(adaptive.getDifficulty());
  }, [adaptive, analytics, effectiveDifficulty, updateSR, graphEngine, user]);

  const finalizeQuiz = useCallback(() => {
    const summary = analyzeErrors(answersLog);
    setAnalyticsSummary(summary);
    setWeakConcepts((summary.weakestConcepts ?? []).slice(0, 3).map((w: any) => w.concept));
    
    // ✅ Generate Learning Paths
    const paths = graphEngine.getWeakestConcepts(3);
    setLearningPaths(paths);
    
    loadSR();
  }, [answersLog, loadSR, graphEngine]);

  const reset = useCallback(() => {
    adaptive.reset(); analytics.reset();
    setQuestions([]); setAnswersLog([]); setAnalyticsSummary(null); setLearningPaths([]);
  }, [adaptive, analytics]);

  const toggleAutoDifficulty = useCallback(() => {
    setAutoDifficulty(prev => !prev);
    if (!autoDifficulty) setEffectiveDifficulty(adaptive.getDifficulty());
  }, [autoDifficulty, adaptive]);

  return {
    questions, loading, indexData, loadIndex, loadQuestions,
    logAnswer, finalizeQuiz, reset,
    autoDifficulty, toggleAutoDifficulty, effectiveDifficulty,
    analyticsSummary, answersLog, learningPaths,
    adaptiveEngine: adaptive, analyticsEngine: analytics, graphEngine,
    srData, dueForReview,
  };
}
