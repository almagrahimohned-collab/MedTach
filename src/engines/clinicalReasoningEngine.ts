// ========== Clinical Reasoning Tracker Engine ==========

export type ReasoningStep = 'hypothesis' | 'investigation' | 'interpretation' | 'diagnosis' | 'management';

export interface ReasoningEvent {
  step: ReasoningStep;
  action: string;
  timestamp: string;
  isCorrect?: boolean;
  details?: string;
}

export interface CaseReasoning {
  caseId: string;
  events: ReasoningEvent[];
  startedAt: string;
  completedAt?: string;
  finalDiagnosis?: string;
  isCorrect?: boolean;
  score?: number;
}

export interface ReasoningAnalytics {
  totalCases: number;
  avgHypothesesGenerated: number;
  avgInvestigationsOrdered: number;
  avgInterpretationAccuracy: number;
  diagnosticAccuracy: number;
  managementAccuracy: number;
  strengths: string[];
  weaknesses: string[];
  reasoningEfficiency: number; // 0-100
}

class ClinicalReasoningEngine {
  private currentCase: CaseReasoning | null = null;
  private history: CaseReasoning[] = [];

  // ========== Start new case ==========
  startCase(caseId: string): void {
    this.currentCase = {
      caseId,
      events: [],
      startedAt: new Date().toISOString(),
    };
  }

  // ========== Record a reasoning event ==========
  recordEvent(step: ReasoningStep, action: string, isCorrect?: boolean, details?: string): void {
    if (!this.currentCase) return;

    this.currentCase.events.push({
      step,
      action,
      timestamp: new Date().toISOString(),
      isCorrect,
      details,
    });
  }

  // ========== Record hypothesis ==========
  recordHypothesis(hypothesis: string): void {
    this.recordEvent('hypothesis', hypothesis);
  }

  // ========== Record investigation ==========
  recordInvestigation(testName: string, isAppropriate?: boolean): void {
    this.recordEvent('investigation', testName, isAppropriate);
  }

  // ========== Record interpretation ==========
  recordInterpretation(testName: string, interpretation: string, isCorrect?: boolean): void {
    this.recordEvent('interpretation', `${testName}: ${interpretation}`, isCorrect, interpretation);
  }

  // ========== Record final diagnosis ==========
  recordDiagnosis(diagnosis: string, isCorrect: boolean): void {
    if (!this.currentCase) return;
    this.currentCase.finalDiagnosis = diagnosis;
    this.currentCase.isCorrect = isCorrect;
    this.recordEvent('diagnosis', diagnosis, isCorrect);
  }

  // ========== Record management plan ==========
  recordManagement(plan: string, isCorrect?: boolean): void {
    this.recordEvent('management', plan, isCorrect);
  }

  // ========== Complete case ==========
  completeCase(score?: number): CaseReasoning | null {
    if (!this.currentCase) return null;

    this.currentCase.completedAt = new Date().toISOString();
    this.currentCase.score = score;
    this.history.push({ ...this.currentCase });
    
    const completed = this.currentCase;
    this.currentCase = null;
    return completed;
  }

  // ========== Get analytics ==========
  getAnalytics(): ReasoningAnalytics {
    const total = this.history.length;
    if (total === 0) {
      return {
        totalCases: 0,
        avgHypothesesGenerated: 0,
        avgInvestigationsOrdered: 0,
        avgInterpretationAccuracy: 0,
        diagnosticAccuracy: 0,
        managementAccuracy: 0,
        strengths: [],
        weaknesses: [],
        reasoningEfficiency: 0,
      };
    }

    // Calculate averages
    const totalHypotheses = this.history.reduce((s, c) => 
      s + c.events.filter(e => e.step === 'hypothesis').length, 0);
    
    const totalInvestigations = this.history.reduce((s, c) => 
      s + c.events.filter(e => e.step === 'investigation').length, 0);
    
    const totalInterpretations = this.history.reduce((s, c) => 
      s + c.events.filter(e => e.step === 'interpretation').length, 0);
    
    const correctInterpretations = this.history.reduce((s, c) => 
      s + c.events.filter(e => e.step === 'interpretation' && e.isCorrect).length, 0);
    
    const correctDiagnoses = this.history.filter(c => c.isCorrect).length;
    const correctManagement = this.history.reduce((s, c) => 
      s + c.events.filter(e => e.step === 'management' && e.isCorrect).length, 0);
    const totalManagement = this.history.reduce((s, c) => 
      s + c.events.filter(e => e.step === 'management').length, 0);

    // Calculate strengths and weaknesses
    const avgInvestigations = totalInvestigations / total;
    const diagAccuracy = (correctDiagnoses / total) * 100;
    const reasoningEff = Math.min(100, Math.round(
      (diagAccuracy * 0.5) + 
      (avgInvestigations <= 5 ? 25 : avgInvestigations <= 8 ? 15 : 5) +
      (totalHypotheses / total >= 2 ? 25 : 10)
    ));

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (diagAccuracy >= 80) strengths.push('Diagnostic accuracy');
    else weaknesses.push('Diagnostic accuracy');

    if (avgInvestigations <= 5) strengths.push('Efficient test ordering');
    else if (avgInvestigations > 8) weaknesses.push('Orders too many tests');

    if (totalHypotheses / total >= 3) strengths.push('Good differential generation');
    else if (totalHypotheses / total < 2) weaknesses.push('Narrow differential thinking');

    return {
      totalCases: total,
      avgHypothesesGenerated: Math.round((totalHypotheses / total) * 10) / 10,
      avgInvestigationsOrdered: Math.round((totalInvestigations / total) * 10) / 10,
      avgInterpretationAccuracy: totalInterpretations > 0 
        ? Math.round((correctInterpretations / totalInterpretations) * 100) 
        : 0,
      diagnosticAccuracy: Math.round(diagAccuracy),
      managementAccuracy: totalManagement > 0 
        ? Math.round((correctManagement / totalManagement) * 100) 
        : 0,
      strengths,
      weaknesses,
      reasoningEfficiency: reasoningEff,
    };
  }

  // ========== Get recent cases ==========
  getRecentCases(limit: number = 5): CaseReasoning[] {
    return this.history.slice(-limit).reverse();
  }

  // ========== Get state ==========
  getState() {
    return {
      currentCase: this.currentCase,
      history: this.history,
    };
  }

  // ========== Load state ==========
  loadState(state: { currentCase: CaseReasoning | null; history: CaseReasoning[] }): void {
    this.currentCase = state.currentCase;
    this.history = state.history || [];
  }

  // ========== Reset ==========
  reset(): void {
    this.currentCase = null;
    this.history = [];
  }
}

export const clinicalReasoningEngine = new ClinicalReasoningEngine();
