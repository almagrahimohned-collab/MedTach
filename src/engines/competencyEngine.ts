// ========== Competency Engine — Tracks user mastery across all modes ==========

export interface CompetencyState {
  [competencyId: string]: {
    score: number;           // 0-100
    attempts: number;
    correct: number;
    lastAttempted: string;   // ISO date
    level: MasteryLevel;
    history: CompetencyHistory[];
  };
}

export type MasteryLevel = 'not_started' | 'learning' | 'practicing' | 'proficient' | 'mastered';

export interface CompetencyHistory {
  caseId: string;
  mode: string;
  isCorrect: boolean;
  timestamp: string;
  score: number;
}

export interface UserCompetencyProfile {
  strengths: string[];        // competency IDs with score >= 80
  needsImprovement: string[]; // competency IDs with score < 50
  averageScore: number;
  totalCompetencies: number;
  masteredCount: number;
}

const MASTERY_THRESHOLDS: Record<MasteryLevel, number> = {
  not_started: -1,
  learning: 0,
  practicing: 30,
  proficient: 70,
  mastered: 90,
};

class CompetencyEngine {
  private state: CompetencyState = {};

  // ========== 1. Record an attempt ==========
  recordAttempt(
    competencyIds: string[],
    isCorrect: boolean,
    caseId: string,
    mode: string,
    score: number
  ): void {
    for (const compId of competencyIds) {
      if (!this.state[compId]) {
        this.state[compId] = {
          score: 50, // Start at neutral
          attempts: 0,
          correct: 0,
          lastAttempted: new Date().toISOString(),
          level: 'not_started',
          history: [],
        };
      }

      const comp = this.state[compId];
      comp.attempts++;
      if (isCorrect) comp.correct++;
      comp.lastAttempted = new Date().toISOString();
      comp.history.push({
        caseId,
        mode,
        isCorrect,
        timestamp: new Date().toISOString(),
        score,
      });

      // Update score based on performance
      const adjustment = isCorrect ? 5 : -3;
      comp.score = Math.max(0, Math.min(100, comp.score + adjustment));

      // Update mastery level
      comp.level = this.calculateLevel(comp.score);
    }
  }

  // ========== 2. Calculate mastery level from score ==========
  private calculateLevel(score: number): MasteryLevel {
    if (score >= MASTERY_THRESHOLDS.mastered) return 'mastered';
    if (score >= MASTERY_THRESHOLDS.proficient) return 'proficient';
    if (score >= MASTERY_THRESHOLDS.practicing) return 'practicing';
    if (score >= MASTERY_THRESHOLDS.learning) return 'learning';
    return 'not_started';
  }

  // ========== 3. Get user profile (strengths & weaknesses) ==========
  getProfile(): UserCompetencyProfile {
    const entries = Object.entries(this.state);
    
    const strengths = entries
      .filter(([_, data]) => data.score >= 80)
      .map(([id]) => id);

    const needsImprovement = entries
      .filter(([_, data]) => data.score < 50)
      .map(([id]) => id);

    const totalScore = entries.reduce((sum, [_, data]) => sum + data.score, 0);
    const averageScore = entries.length > 0 ? Math.round(totalScore / entries.length) : 0;
    const masteredCount = entries.filter(([_, data]) => data.level === 'mastered').length;

    return {
      strengths,
      needsImprovement,
      averageScore,
      totalCompetencies: entries.length,
      masteredCount,
    };
  }

  // ========== 4. Get weak competencies (for adaptive recommendations) ==========
  getWeakCompetencies(limit: number = 3): string[] {
    const entries = Object.entries(this.state)
      .sort((a, b) => a[1].score - b[1].score) // Lowest first
      .slice(0, limit)
      .map(([id]) => id);

    return entries;
  }

  // ========== 5. Get competency score ==========
  getScore(competencyId: string): number {
    return this.state[competencyId]?.score ?? 0;
  }

  // ========== 6. Get competency level ==========
  getLevel(competencyId: string): MasteryLevel {
    return this.state[competencyId]?.level ?? 'not_started';
  }

  // ========== 7. Get all competencies ==========
  getAllCompetencies(): CompetencyState {
    return { ...this.state };
  }

  // ========== 8. Load state (from AsyncStorage) ==========
  loadState(savedState: CompetencyState): void {
    this.state = savedState || {};
  }

  // ========== 9. Get state for saving ==========
  getState(): CompetencyState {
    return this.state;
  }

  // ========== 10. Reset ==========
  reset(): void {
    this.state = {};
  }
}

export const competencyEngine = new CompetencyEngine();

// ========== Helper: Get competency display info ==========
export const COMPETENCY_DISPLAY: Record<string, { name: string; icon: string; category: string }> = {
  chest_xray_interpretation: { name: 'Chest X-Ray Interpretation', icon: 'image', category: 'Imaging' },
  ecg_interpretation: { name: 'ECG Interpretation', icon: 'pulse', category: 'Imaging' },
  ct_interpretation: { name: 'CT Interpretation', icon: 'image', category: 'Imaging' },
  antibiotic_selection: { name: 'Antibiotic Selection', icon: 'medkit', category: 'Management' },
  severity_assessment: { name: 'Severity Assessment', icon: 'speedometer', category: 'Diagnosis' },
  shock_management: { name: 'Shock Management', icon: 'heart', category: 'Management' },
  abg_interpretation: { name: 'ABG Interpretation', icon: 'flask', category: 'Diagnosis' },
  fluid_resuscitation: { name: 'Fluid Resuscitation', icon: 'water', category: 'Management' },
  ventilator_management: { name: 'Ventilator Management', icon: 'leaf', category: 'Management' },
  sepsis_recognition: { name: 'Sepsis Recognition', icon: 'bug', category: 'Diagnosis' },
  dka_management: { name: 'DKA Management', icon: 'water', category: 'Management' },
  arrythmia_recognition: { name: 'Arrhythmia Recognition', icon: 'pulse', category: 'Diagnosis' },
};
