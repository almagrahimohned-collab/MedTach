import { useState, useRef, useEffect } from 'react';
import { Animated, Alert } from 'react-native';
import { useStore } from '../../../src/store';
import { chatWithCase, evaluateDiagnosis } from '../../../src/services/aiService';
import { checkBadges } from '../../../src/utils/badges';
import { calculateCaseScore, getScoreGrade, getTimeString } from '../../../src/utils/scoring';
import { contentService, CaseData } from '../../../src/services/contentService';
import { caseRepository } from '../../../src/services/CaseRepository';
import { labLibrary } from '../../../src/services/LabLibrary';
import { findTest, isNonMedical, rejectionMessages } from '../../../src/utils/medicalDictionary';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/almagrahimohned-collab/medtach-content/main';

const defaultHints = [
  { id: 'h1', text: 'Start with a complete history - ask about onset, duration, and character of symptoms.', cost: 5 },
  { id: 'h2', text: 'Check vital signs and perform a focused physical examination.', cost: 5 },
  { id: 'h3', text: 'Order basic labs: CBC, CMP, and relevant cardiac markers.', cost: 10 },
  { id: 'h4', text: 'Consider imaging: CXR or CT if clinically indicated.', cost: 10 },
  { id: 'h5', text: 'Create a differential diagnosis list and narrow it down systematically.', cost: 15 },
];

export function useDiagnosticRoom() {
  const store = useStore();
  const {
    addPoints, saveCaseResult, addBadge, completedCases,
    getAccuracy, getUniqueSpecialties, dailyChallenge,
    completeDailyChallenge, deductPoints,
  } = store;

  const [interactions, setInteractions] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [diagnosisModalVisible, setDiagnosisModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [hintsModalVisible, setHintsModalVisible] = useState(false);
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [testsCount, setTestsCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [currentCase, setCurrentCase] = useState<CaseData | null>(null);
  const [caseLoaded, setCaseLoaded] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const subCategory = useStore((s) => s.subCategory);
  const difficulty = useStore((s) => s.difficulty);

  useEffect(() => { loadCase(); }, [subCategory, difficulty]);

  const loadCase = async () => {
    try {
      // ========== NEW: Try unified case first ==========
      const unifiedCases = await contentService.getCasesForMode('clinical');
      if (unifiedCases.length > 0) {
        const randomUnified = unifiedCases[Math.floor(Math.random() * unifiedCases.length)];
        const unifiedCase = await contentService.getUnifiedCase(randomUnified.id);
        if (unifiedCase) {
          const legacyCase = contentService.unifiedToLegacy(unifiedCase);
          // Store unified data for later use
          (legacyCase as any)._unified = unifiedCase;
          setCurrentCase(legacyCase);
          setConversationHistory([]);
          setInteractions([]);
          setTestsCount(0);
          setHintsUsed(0);
          setCaseLoaded(true);
          return;
        }
      }

      // ========== OLD: Fallback to GitHub ==========
      const index = await contentService.getIndex();
      const spec = (subCategory || 'cardiology').toLowerCase();
      const level = (difficulty || 'beginner').toLowerCase();
      const entry = index.cases.find(c => c.specialty.toLowerCase() === spec && c.difficulty.toLowerCase() === level);
      if (entry) {
        const data = await contentService.getCase(entry.path);
        setCurrentCase(data);
      } else {
        setCurrentCase(null);
      }
    } catch (e) {
      setCurrentCase(null);
    } finally {
      setConversationHistory([]);
      setInteractions([]);
      setTestsCount(0);
      setHintsUsed(0);
      setCaseLoaded(true);
    }
  };

  const isDailyChallengeCase = dailyChallenge?.caseId === currentCase?.id && !dailyChallenge?.completed;

  const getCaseContext = () => {
    if (!currentCase) return null;
    return {
      patientInfo: `${currentCase.patient.age}${currentCase.patient.gender === 'male' ? 'M' : 'F'}, ${currentCase.patient.name}`,
      chiefComplaint: currentCase.chief_complaint,
      hiddenData: currentCase.hidden_data || {},
      patientResponses: currentCase.patient_responses || {},
      correctDiagnosis: currentCase.correct_diagnosis,
      patientPersona: currentCase.patient.persona || 'neutral',
    };
  };

  const handleSendRequest = async (text: string) => {
    if (!text.trim() || isLoading) return;

    if (isNonMedical(text)) {
      setInteractions(prev => [...prev, {
        id: Date.now().toString(), type: 'response',
        text: `⚠️ ${rejectionMessages.non_medical}`, role: 'system', timestamp: new Date(),
      }]);
      setInputText('');
      return;
    }

    const matched = findTest(text);

    // ========== NEW: Check unified case first ==========
    const unifiedData = (currentCase as any)?._unified;
    
    if (matched) {
      let result: string | null = null;
      let imgUrl = '';

      // Check unified case data
      if (unifiedData) {
        result = extractFromUnifiedCase(unifiedData, matched.id);
        if (matched.id === 'ecg' && unifiedData.imaging?.ecg) {
          imgUrl = unifiedData.imaging.ecg.file;
        } else if (matched.id === 'cxr' && unifiedData.imaging?.cxr) {
          imgUrl = unifiedData.imaging.cxr.file;
        }
      }

      // Fallback to old hidden_data
      if (!result && currentCase?.hidden_data) {
        result = currentCase.hidden_data[matched.id];
      }

      // If still no result, get normal from lab library
      if (!result) {
        result = labLibrary.generateNormalResult(matched.id);
        if (!result) result = 'Normal';
      }

      setTestsCount(prev => prev + 1);
      const msgs: any[] = [
        { id: Date.now().toString(), type: 'request', text, timestamp: new Date(), menuType: matched.category },
        { id: (Date.now() + 1).toString(), type: 'response', text: `📋 **${matched.name}:**\n${result}`, role: 'technician', timestamp: new Date() },
      ];
      if (imgUrl) {
        msgs.push({
          id: (Date.now() + 2).toString(), type: 'image', text: `🖼️ ${matched.name}`, imageUrl: imgUrl, role: 'technician', timestamp: new Date(),
        });
      }
      setInteractions(prev => [...prev, ...msgs]);
      setInputText('');
      setActiveMenu(null);
      return;
    }

    if (activeMenu) {
      setTestsCount(prev => prev + 1);
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }

    setIsLoading(true);
    const req = { id: Date.now().toString(), type: 'request', text, timestamp: new Date(), menuType: activeMenu };
    setInteractions(prev => [...prev, req]);
    setInputText('');
    setActiveMenu(null);

    try {
      const ctx = getCaseContext();
      if (!ctx) throw new Error('No context');
      const res = await chatWithCase(text, 'general', ctx, conversationHistory);
      let role = 'supervisor';
      if (/you|your|when did|how long|do you|have you|are you/i.test(text)) role = 'patient';
      setInteractions(prev => [...prev, {
        id: (Date.now() + 1).toString(), type: 'response', text: res, role, timestamp: new Date(),
      }]);
      setConversationHistory(prev => [...prev.slice(-6), { role: 'user', content: text }, { role: 'assistant', content: res }]);
    } catch (e) {
      setInteractions(prev => [...prev, {
        id: (Date.now() + 1).toString(), type: 'response',
        text: 'I apologize, Doctor. I am unable to respond at this moment.',
        role: 'system', timestamp: new Date(),
      }]);
    } finally { setIsLoading(false); }
  };

  // ========== Helper: Extract data from unified case ==========
  const extractFromUnifiedCase = (unified: any, testId: string): string | null => {
    switch (testId) {
      case 'cbc':
        return unified.labs?.cbc ? `WBC: ${unified.labs.cbc.wbc}, Hb: ${unified.labs.cbc.hb}, PLT: ${unified.labs.cbc.plt}` : null;
      case 'crp':
        return unified.labs?.crp !== undefined ? `CRP: ${unified.labs.crp} mg/L` : null;
      case 'abg':
        return unified.labs?.abg ? `pH: ${unified.labs.abg.ph}, PaO2: ${unified.labs.abg.pao2}, PaCO2: ${unified.labs.abg.paco2}, HCO3: ${unified.labs.abg.hco3}, Lactate: ${unified.labs.abg.lactate}` : null;
      case 'cxr':
        return unified.imaging?.cxr?.findings || null;
      case 'ecg':
        return unified.imaging?.ecg?.findings || null;
      default:
        return null;
    }
  };

  const handleUseHint = (hint: any) => {
    if (!hint) return;
    setHintsUsed(prev => prev + 1);
    deductPoints(hint.cost);
    setHintsModalVisible(false);
    setInteractions(prev => [...prev, {
      id: Date.now().toString(), type: 'response',
      text: `💡 **Hint:** ${hint.text}\n(-${hint.cost} pts)`,
      role: 'supervisor', timestamp: new Date(), isHint: true,
    }]);
  };

  const handleSubmitDiagnosis = async () => {
    if (!finalDiagnosis.trim() || !currentCase) return;
    setIsEvaluating(true);
    setDiagnosisModalVisible(false);
    const timeTaken = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);

    try {
      const isCorrect = finalDiagnosis.toLowerCase().includes(currentCase.correct_diagnosis.toLowerCase());
      const verdict = isCorrect ? 'correct' : 'incorrect';
      const { score, breakdown } = calculateCaseScore(isCorrect, testsCount, timeTaken, isDailyChallengeCase, difficulty || 'Beginner');
      addPoints(score);
      saveCaseResult(currentCase.id, score);
      if (isDailyChallengeCase) completeDailyChallenge(dailyChallenge?.bonusPoints || 0);

      const grade = getScoreGrade(score);
      const timeStr = getTimeString(timeTaken);
      let fm = `${grade.emoji} **${grade.grade}**\n\n`;
      fm += `**Verdict:** ${verdict === 'correct' ? '✅ Correct' : '❌ Incorrect'}\n\n`;
      fm += `📊 Score: ${score} pts | ⏱ ${timeStr} | 🧪 ${testsCount} tests | 💡 ${hintsUsed} hints`;
      setFeedbackText(fm);
      setIsEvaluating(false);
      setFeedbackModalVisible(true);
      checkBadges(completedCases, addBadge, store.totalPoints, getAccuracy(), getUniqueSpecialties(), timeTaken);
    } catch (e) {
      setIsEvaluating(false);
      Alert.alert('Error', 'Could not evaluate diagnosis. Please try again.');
    }
  };

  return {
    interactions, inputText, setInputText, activeMenu, setActiveMenu,
    diagnosisModalVisible, setDiagnosisModalVisible,
    feedbackModalVisible, setFeedbackModalVisible,
    hintsModalVisible, setHintsModalVisible,
    finalDiagnosis, setFinalDiagnosis,
    isEvaluating, feedbackText, testsCount, hintsUsed,
    isLoading, currentCase, caseLoaded, pulseAnim,
    isDailyChallengeCase, availableHints: defaultHints, dailyChallenge,
    loadCase, handleSendRequest, handleUseHint, handleSubmitDiagnosis,
  };
}

export const handleUseDiagnosisHint = () => {};
