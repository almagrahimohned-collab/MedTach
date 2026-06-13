// 🔵 Adaptive Difficulty Engine v2
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const DIFFICULTY_ORDER: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

export class AdaptiveEngine {
  correctStreak = 0;
  wrongStreak = 0;
  currentDifficulty: Difficulty = 'beginner';
  history: { difficulty: Difficulty; isCorrect: boolean; cognitiveLevel?: string; timestamp: Date }[] = [];

  updatePerformance(isCorrect: boolean, cognitiveLevel?: string) {
    this.history.push({ difficulty: this.currentDifficulty, isCorrect, cognitiveLevel, timestamp: new Date() });
    
    if (isCorrect) {
      this.correctStreak++;
      this.wrongStreak = 0;
    } else {
      this.wrongStreak++;
      this.correctStreak = 0;
    }
    this.adjustDifficulty();
  }

  // ✅ NEW: Apply penalty for high-stakes questions
  applyCognitivePenalty() {
    this.wrongStreak += 1;
    this.adjustDifficulty();
  }

  // ✅ Make private method accessible for emergency_reasoning penalty
  adjustDifficulty() {
    if (this.correctStreak >= 3) {
      this.increaseDifficulty();
      this.correctStreak = 0;
    }
    if (this.wrongStreak >= 3) {
      this.decreaseDifficulty();
      this.wrongStreak = 0;
    }
  }

  private increaseDifficulty() {
    const idx = DIFFICULTY_ORDER.indexOf(this.currentDifficulty);
    if (idx < DIFFICULTY_ORDER.length - 1) {
      this.currentDifficulty = DIFFICULTY_ORDER[idx + 1];
    }
  }

  private decreaseDifficulty() {
    const idx = DIFFICULTY_ORDER.indexOf(this.currentDifficulty);
    if (idx > 0) {
      this.currentDifficulty = DIFFICULTY_ORDER[idx - 1];
    }
  }

  getDifficulty(): Difficulty {
    return this.currentDifficulty;
  }

  getStats() {
    const total = this.history.length;
    if (total === 0) return { accuracy: 0, total: 0, byDifficulty: {} as Record<string, { correct: number; total: number }> };
    const correct = this.history.filter(h => h.isCorrect).length;
    const byDifficulty: Record<string, { correct: number; total: number }> = {};
    for (const h of this.history) {
      if (!byDifficulty[h.difficulty]) byDifficulty[h.difficulty] = { correct: 0, total: 0 };
      byDifficulty[h.difficulty].total++;
      if (h.isCorrect) byDifficulty[h.difficulty].correct++;
    }
    return { accuracy: Math.round((correct / total) * 100), total, byDifficulty };
  }

  reset() {
    this.correctStreak = 0;
    this.wrongStreak = 0;
    this.currentDifficulty = 'beginner';
    this.history = [];
  }
}
