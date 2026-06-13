// 📊 Analytics Service v2 - Weighted Error Taxonomy

export interface ErrorTaxonomy {
  type: 'knowledge_gap' | 'misread' | 'careless' | 'emergency_failure';
  count: number;
  percentage: number;
}

export interface WeakArea {
  concept: string;
  accuracy: number;
  total: number;
  severityWeight: number;
  cognitiveWeight: number;
}

export interface AnalyticsSummary {
  weakestConcepts: WeakArea[];
  errorTaxonomy: ErrorTaxonomy[];
  overconfidenceScore: number;
  cognitivePattern: string;
  recommendedFocus: string[];
}

interface AnswerLog {
  isCorrect: boolean; timeSpent: number; confidence: number;
  trapType?: string; concept?: string; tags?: string[]; cognitiveLevel?: string;
}

export function analyzeErrors(answers: AnswerLog[]): AnalyticsSummary {
  const wrongAnswers = answers.filter(a => !a.isCorrect);
  const total = answers.length;
  if (total === 0) return { weakestConcepts: [], errorTaxonomy: [], overconfidenceScore: 0, cognitivePattern: 'insufficient data', recommendedFocus: [] };
  
  // ✅ Error Taxonomy with cognitive level weighting
  let knowledgeGap = 0, misread = 0, careless = 0, emergencyFailure = 0;
  
  for (const a of wrongAnswers) {
    // ✅ cognitiveLevel weighting
    const isEmergency = a.cognitiveLevel === 'emergency_reasoning';
    const isInterpretation = a.cognitiveLevel === 'interpretation';
    
    if (a.timeSpent > 45) {
      knowledgeGap++;
      if (isEmergency) knowledgeGap += 1; // Extra weight
    } else if (a.confidence >= 0.75) {
      careless++;
      if (isEmergency) emergencyFailure += 2; // High-stakes failure
    } else {
      misread++;
      if (isInterpretation) misread += 1; // Interpretation errors weighted
    }
  }
  
  const wrongTotal = Math.max(wrongAnswers.length, 1);
  const errorTaxonomy: ErrorTaxonomy[] = [
    { type: 'knowledge_gap', count: knowledgeGap, percentage: Math.round((knowledgeGap / wrongTotal) * 100) },
    { type: 'misread', count: misread, percentage: Math.round((misread / wrongTotal) * 100) },
    { type: 'careless', count: careless, percentage: Math.round((careless / wrongTotal) * 100) },
    { type: 'emergency_failure', count: emergencyFailure, percentage: Math.round((emergencyFailure / wrongTotal) * 100) },
  ];
  
  // ✅ Weak Concepts with severity + cognitive weighting
  const conceptMap: Record<string, { correct: number; total: number; emergencyWrong: number; timeAvg: number }> = {};
  for (const a of answers) {
    const c = a.concept || 'general';
    if (!conceptMap[c]) conceptMap[c] = { correct: 0, total: 0, emergencyWrong: 0, timeAvg: 0 };
    conceptMap[c].total++;
    if (a.isCorrect) conceptMap[c].correct++;
    else if (a.cognitiveLevel === 'emergency_reasoning') conceptMap[c].emergencyWrong++;
    conceptMap[c].timeAvg += a.timeSpent;
  }
  
  const weakestConcepts: WeakArea[] = Object.entries(conceptMap)
    .map(([concept, stats]) => {
      const accuracy = Math.round((stats.correct / Math.max(stats.total, 1)) * 100);
      // ✅ Weight: lower accuracy + emergency failures = higher severity
      const severityWeight = (100 - accuracy) + (stats.emergencyWrong * 15);
      const cognitiveWeight = stats.cognitiveLevel === 'emergency_reasoning' ? 2 : 
                              stats.cognitiveLevel === 'interpretation' ? 1.5 : 1;
      return { concept, accuracy, total: stats.total, severityWeight, cognitiveWeight };
    })
    .sort((a, b) => b.severityWeight - a.severityWeight)
    .slice(0, 5);
  
  // Overconfidence
  const highConfWrong = wrongAnswers.filter(a => a.confidence >= 0.75).length;
  const overconfidenceScore = Math.round((highConfWrong / wrongTotal) * 100);
  
  // Cognitive Pattern
  const maxTaxonomy = errorTaxonomy.reduce((max, e) => e.count > max.count ? e : max, errorTaxonomy[0]);
  let cognitivePattern = 'balanced';
  if (maxTaxonomy.type === 'knowledge_gap') cognitivePattern = 'knowledge gap (study needed)';
  else if (maxTaxonomy.type === 'careless') cognitivePattern = 'careless errors (slow down, double-check)';
  else if (maxTaxonomy.type === 'misread') cognitivePattern = 'misread patterns (imaging/ECG/lab interpretation)';
  else if (maxTaxonomy.type === 'emergency_failure') cognitivePattern = 'emergency decision-making needs work';
  
  // ✅ Recommended Focus with priorities
  const recommendedFocus: string[] = weakestConcepts.slice(0, 3).map(w => 
    `${w.concept} (${w.accuracy}%, priority: ${w.severityWeight > 50 ? 'HIGH' : 'MEDIUM'})`
  );
  if (overconfidenceScore > 40) recommendedFocus.push('⚠️ confidence calibration needed');
  if (errorTaxonomy.find(e => e.type === 'misread' && e.percentage > 30)) recommendedFocus.push('🖼️ image interpretation practice');
  if (errorTaxonomy.find(e => e.type === 'emergency_failure' && e.count > 0)) recommendedFocus.push('🚨 emergency protocols review');
  
  return { weakestConcepts, errorTaxonomy, overconfidenceScore, cognitivePattern, recommendedFocus };
}
