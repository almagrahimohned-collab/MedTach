import { CaseData } from '../services/contentService';
import { getManagementHint } from './management';

export interface FeedbackResult {
  verdict: 'correct' | 'partially_correct' | 'incorrect';
  title: string;
  message: string;
  clinicalPearl: string;
  diagnosticFramework: string;
  learningObjective: string;
  managementHint: string;
  scoreBreakdown: string;
}

function compareDiagnoses(correct: string, user: string): {
  verdict: 'correct' | 'partially_correct' | 'incorrect';
  overlap: number;
} {
  const c = correct.toLowerCase().trim();
  const u = user.toLowerCase().trim();
  
  if (c === u) return { verdict: 'correct', overlap: 100 };
  
  const cWords = c.split(/\s+/);
  const uWords = u.split(/\s+/);
  const matched = cWords.filter(w => uWords.includes(w)).length;
  const ratio = matched / Math.max(cWords.length, uWords.length);
  
  if (ratio >= 0.5) return { verdict: 'partially_correct', overlap: ratio };
  return { verdict: 'incorrect', overlap: 0 };
}

const SPECIALTY_PEARLS: Record<string, string[]> = {
  cardiology: [
    "In acute chest pain, time is myocardium. Every 30-minute delay increases mortality by 7.5%.",
    "Always check posterior leads (V7-V9) if high suspicion for posterior MI with normal standard ECG.",
    "A normal troponin at presentation does NOT rule out ACS - repeat at 3-6 hours.",
    "Remember Wellens syndrome: deeply inverted T waves in V2-V3 indicate critical LAD stenosis.",
    "Pericarditis causes diffuse ST elevation - unlike STEMI, there are no reciprocal changes."
  ],
  pulmonology: [
    "Always calculate Wells criteria before ordering CT-PA for suspected PE.",
    "COPD exacerbation triggers: infection, non-compliance, cardiac, pneumothorax - remember mnemonic.",
    "Normal SpO2 doesn't rule out respiratory failure - always check ABG in dyspneic patients.",
    "Pleural effusion workup: always send for LDH, protein, glucose, cytology, and culture."
  ],
  neurology: [
    "Time is brain: 1.9 million neurons die every minute during large vessel occlusion.",
    "NIHSS score guides treatment - document before and after thrombolysis.",
    "Not all that is seizure is epilepsy - always check glucose, sodium, and calcium first."
  ],
  gastroenterology: [
    "RUQ pain differential: biliary, hepatic, pancreatic, renal, or referred pain.",
    "Always check lipase, not amylase - it's more specific for pancreatitis."
  ],
  general: [
    "Always start with a thorough history - 80% of diagnoses come from history alone.",
    "Don't order a test if the result won't change your management plan.",
    "The most common cause of a rare presentation is still a common disease."
  ]
};

const DIAGNOSTIC_FRAMEWORKS: Record<string, Record<string, string>> = {
  cardiology: {
    chest_pain: "Chest Pain Framework:\n1. ECG within 10 minutes\n2. Troponin at 0h and 3-6h\n3. Risk stratify (TIMI/GRACE)\n4. Consider: ACS, PE, Aortic dissection, Pericarditis, MSK",
    palpitations: "Palpitations Framework:\n1. ECG + Holter monitor\n2. Echo for structural disease\n3. TSH, electrolytes\n4. Consider: SVT, AF, VT, Anxiety"
  },
  pulmonology: {
    dyspnea: "Dyspnea Framework:\n1. Pulse oximetry + ABG\n2. CXR\n3. Consider: Pulmonary, Cardiac, Metabolic, Anemia"
  },
  general: {
    default: "Clinical Reasoning:\n1. Gather data (History + Exam)\n2. Generate differentials\n3. Targeted investigations\n4. Re-evaluate and narrow\n5. Treat and monitor response"
  }
};

export function generateFeedback(
  caseData: CaseData,
  userDiagnosis: string,
  score: number,
  testsCount: number,
  timeStr: string,
  orderedTestIds: string[]
): FeedbackResult {
  const comparison = compareDiagnoses(caseData.correct_diagnosis, userDiagnosis);
  const specialty = (caseData.specialty || 'general').toLowerCase();
  
  const pearls = SPECIALTY_PEARLS[specialty] || SPECIALTY_PEARLS.general;
  const randomPearl = pearls[Math.floor(Math.random() * pearls.length)];
  
  const frameworks = DIAGNOSTIC_FRAMEWORKS[specialty] || {};
  const cc = caseData.chief_complaint?.toLowerCase() || '';
  let framework = DIAGNOSTIC_FRAMEWORKS.general.default;
  
  for (const [key, value] of Object.entries(frameworks)) {
    if (cc.includes(key)) {
      framework = value;
      break;
    }
  }
  
  let title: string, message: string, learningObjective: string;
  
  if (comparison.verdict === 'correct') {
    title = '✅ EXCELLENT DIAGNOSIS!';
    message = `You correctly identified **${caseData.correct_diagnosis}**.\n\n` +
      `Your systematic approach correctly considered the key findings: "${caseData.chief_complaint}". ` +
      `This is a classic presentation that requires prompt recognition.\n\n` +
      `You ordered ${testsCount} investigation(s) which was appropriate for this case. ` +
      `Your diagnostic reasoning demonstrates strong clinical acumen.\n\n` +
      `**Why this matters:** ${caseData.key_learning_points[0] || 'Recognizing this pattern early is critical for patient outcomes.'}`;
    
    learningObjective = `Master the presentation of ${caseData.correct_diagnosis} - you've shown excellent clinical reasoning.`;
    
  } else if (comparison.verdict === 'partially_correct') {
    title = '⚠️ CLOSE - BUT NOT QUITE';
    message = `You diagnosed **${userDiagnosis}**, but the correct diagnosis is **${caseData.correct_diagnosis}**.\n\n` +
      `You were on the right track! The overlap between these conditions explains why the presentation is similar. ` +
      `However, the distinguishing factor here was the specific pattern of findings.\n\n` +
      `**Key differentiating features you may have missed:**\n` +
      `• The ${caseData.chief_complaint} with these specific characteristics\n` +
      `• The results of your investigations pointed toward ${caseData.correct_diagnosis}\n\n` +
      `This is a common pitfall - even experienced clinicians can confuse these presentations. ` +
      `The learning opportunity here is recognizing the subtle differences.\n\n` +
      `**Clinical Pearl:** ${randomPearl}`;
    
    learningObjective = `Learn to differentiate between ${userDiagnosis} and ${caseData.correct_diagnosis} based on careful history and targeted physical examination findings.`;
    
  } else {
    title = '❌ NEEDS IMPROVEMENT';
    message = `Your diagnosis was **${userDiagnosis}**, but the correct answer is **${caseData.correct_diagnosis}**.\n\n` +
      `Let's break down where the clinical reasoning diverged:\n\n` +
      `**1. Presentation Analysis:**\n` +
      `The patient presented with "${caseData.chief_complaint}". ` +
      `This symptom pattern is more consistent with ${caseData.correct_diagnosis} because of the characteristic features.\n\n` +
      `**2. Key Findings You May Have Overlooked:**\n` +
      `• The ${caseData.correct_diagnosis} typically presents with these specific clues\n` +
      `• Review the investigations you ordered - they actually support this diagnosis\n\n` +
      `**3. Why ${userDiagnosis} Was Less Likely:**\n` +
      `The typical presentation of ${userDiagnosis} usually includes different features that weren't present here.\n\n` +
      `**Don't be discouraged!** Diagnostic errors are part of the learning process. ` +
      `Every great clinician has missed diagnoses - the key is learning from each case.\n\n` +
      `**Clinical Pearl:** ${randomPearl}`;
    
    learningObjective = `Understand the classic presentation of ${caseData.correct_diagnosis} and how to distinguish it from mimics.`;
  }
  
  // Get management hint from library
  const managementHint = getManagementHint(caseData.correct_diagnosis);
  
  const scoreBreakdown = `**Score: ${score}/150**\n\n` +
    (score >= 120 ? '🌟 Excellent performance! Efficient clinical reasoning with appropriate resource utilization.' :
     score >= 80 ? '👍 Good effort! Focus on ordering only necessary investigations and reaching the diagnosis more efficiently.' :
     '📚 Learning opportunity: Review the diagnostic approach for this presentation and practice systematic clinical reasoning.');
  
  return {
    verdict: comparison.verdict,
    title,
    message,
    clinicalPearl: randomPearl,
    diagnosticFramework: framework,
    learningObjective,
    managementHint,
    scoreBreakdown
  };
}

export function generateCaseSummary(caseData: CaseData, userDiagnosis: string, verdict: string): string {
  return `**📋 Case Summary**\n\n` +
    `**Patient:** ${caseData.patient.age}${caseData.patient.gender === 'male' ? 'M' : 'F'} - ${caseData.patient.name}\n` +
    `**Presentation:** ${caseData.chief_complaint}\n` +
    `**Correct Diagnosis:** ${caseData.correct_diagnosis}\n` +
    `**Your Diagnosis:** ${userDiagnosis}\n` +
    `**Result:** ${verdict === 'correct' ? '✅ Correct' : verdict === 'partially_correct' ? '⚠️ Partially Correct' : '❌ Incorrect'}\n\n` +
    `**Key Takeaways:**\n` +
    (caseData.key_learning_points || []).map(p => `• ${p}`).join('\n') +
    `\n\n**Differential Diagnoses Considered:**\n` +
    (caseData.differential_diagnoses || []).map(d => `• ${d}`).join('\n');
}
