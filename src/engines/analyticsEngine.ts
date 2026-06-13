// 📊 Analytics Engine - Subject stats + Confidence tracking + Time patterns + Trends

export interface AnswerLog {
  subject: string;
  isCorrect: boolean;
  timeSpent: number;
  confidence: number;
  difficulty: string;
  timestamp: Date;
}

export interface SubjectStats {
  correct: number;
  total: number;
  avgTime: number;
  avgConfidence: number;
  confidenceAccuracy: number;
  fastWrong: number;
  slowWrong: number;
  fastCorrect: number;
}

export interface AnalyticsReport {
  weakestSubject: string | null;
  strongestSubject: string | null;
  overallAccuracy: number;
  avgTime: number;
  overconfidenceScore: number;
  cognitivePattern: string;
  subjectStats: Record<string, SubjectStats>;
  trend: 'improving' | 'declining' | 'stable';
}

export class AnalyticsEngine {
  private history: AnswerLog[] = [];
  private subjectStats: Record<string, { correct: number; total: number; totalTime: number; totalConfidence: number; confidenceHits: number; fastWrong: number; slowWrong: number; fastCorrect: number }> = {};

  // ⏱️ Time thresholds (seconds)
  private FAST_THRESHOLD = 10;
  private SLOW_THRESHOLD = 45;

  logAnswer(subject: string, isCorrect: boolean, timeSpent: number, confidence: number, difficulty: string) {
    // Initialize subject
    if (!this.subjectStats[subject]) {
      this.subjectStats[subject] = {
        correct: 0, total: 0, totalTime: 0, totalConfidence: 0,
        confidenceHits: 0, fastWrong: 0, slowWrong: 0, fastCorrect: 0
      };
    }

    const s = this.subjectStats[subject];
    s.total++;
    if (isCorrect) s.correct++;
    s.totalTime += timeSpent;
    s.totalConfidence += confidence;

    // Confidence accuracy: هل الـ confidence مطابق للـ correctness؟
    // Hit = high confidence + correct OR low confidence + wrong
    if ((confidence >= 0.75 && isCorrect) || (confidence <= 0.5 && !isCorrect)) {
      s.confidenceHits++;
    }

    // Time patterns
    if (timeSpent < this.FAST_THRESHOLD) {
      if (!isCorrect) s.fastWrong++;  // Careless
      else s.fastCorrect++;            // Mastery
    } else if (timeSpent > this.SLOW_THRESHOLD && !isCorrect) {
      s.slowWrong++;                   // Knowledge gap
    }

    // History for trends
    this.history.push({ subject, isCorrect, timeSpent, confidence, difficulty, timestamp: new Date() });
    
    // Keep last 50 for trend
    if (this.history.length > 50) this.history.shift();
  }

  getWeakestSubject(): string | null {
    let weakest = null;
    let lowest = 1;
    for (const [subject, s] of Object.entries(this.subjectStats)) {
      if (s.total < 3) continue; // Need minimum data
      const accuracy = s.correct / s.total;
      if (accuracy < lowest) { lowest = accuracy; weakest = subject; }
    }
    return weakest;
  }

  getStrongestSubject(): string | null {
    let strongest = null;
    let highest = 0;
    for (const [subject, s] of Object.entries(this.subjectStats)) {
      if (s.total < 3) continue;
      const accuracy = s.correct / s.total;
      if (accuracy > highest) { highest = accuracy; strongest = subject; }
    }
    return strongest;
  }

  getOverconfidenceScore(): number {
    // Overconfidence = high confidence + wrong answers
    let overconfident = 0;
    let totalHighConfidence = 0;
    for (const log of this.history) {
      if (log.confidence >= 0.75) {
        totalHighConfidence++;
        if (!log.isCorrect) overconfident++;
      }
    }
    return totalHighConfidence === 0 ? 0 : Math.round((overconfident / totalHighConfidence) * 100);
  }

  getCognitivePattern(): string {
    const total = this.history.length;
    if (total < 5) return 'insufficient data';
    
    let fastWrong = 0, slowWrong = 0;
    for (const log of this.history.slice(-20)) {
      if (!log.isCorrect) {
        if (log.timeSpent < this.FAST_THRESHOLD) fastWrong++;
        else if (log.timeSpent > this.SLOW_THRESHOLD) slowWrong++;
      }
    }
    
    if (fastWrong > slowWrong) return 'careless (fast errors)';
    if (slowWrong > fastWrong) return 'knowledge gap (slow errors)';
    return 'balanced';
  }

  getTrend(): 'improving' | 'declining' | 'stable' {
    if (this.history.length < 10) return 'stable';
    const recent = this.history.slice(-10);
    const older = this.history.slice(-20, -10);
    
    const recentAcc = recent.filter(h => h.isCorrect).length / recent.length;
    const olderAcc = older.filter(h => h.isCorrect).length / older.length;
    
    const diff = recentAcc - olderAcc;
    if (diff > 0.15) return 'improving';
    if (diff < -0.15) return 'declining';
    return 'stable';
  }

  getReport(): AnalyticsReport {
    const totalQuestions = this.history.length;
    const totalCorrect = this.history.filter(h => h.isCorrect).length;
    const totalTime = this.history.reduce((sum, h) => sum + h.timeSpent, 0);
    
    const subjectStats: Record<string, SubjectStats> = {};
    for (const [subject, s] of Object.entries(this.subjectStats)) {
      if (s.total === 0) continue;
      subjectStats[subject] = {
        correct: s.correct, total: s.total,
        avgTime: Math.round(s.totalTime / s.total),
        avgConfidence: Math.round((s.totalConfidence / s.total) * 100),
        confidenceAccuracy: s.total > 0 ? Math.round((s.confidenceHits / s.total) * 100) : 0,
        fastWrong: s.fastWrong, slowWrong: s.slowWrong, fastCorrect: s.fastCorrect,
      };
    }
    
    return {
      weakestSubject: this.getWeakestSubject(),
      strongestSubject: this.getStrongestSubject(),
      overallAccuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      avgTime: totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0,
      overconfidenceScore: this.getOverconfidenceScore(),
      cognitivePattern: this.getCognitivePattern(),
      subjectStats,
      trend: this.getTrend(),
    };
  }

  reset() {
    this.history = [];
    this.subjectStats = {};
  }
}
