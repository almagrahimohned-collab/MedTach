export interface ScoreComponent {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  feedback: string;
}

export interface ScoringConfig {
  mode: string;
  components: Record<string, number>;
  timeLimit?: number;
  passingScore?: number;
}

const DEFAULT_CONFIGS: Record<string, ScoringConfig> = {
  clinical: {
    mode: 'clinical',
    components: { diagnosis: 40, treatment: 30, time: 15, efficiency: 15, communication: 0, knowledge: 0 },
    timeLimit: 600,
    passingScore: 70
  },
  resident: {
    mode: 'resident',
    components: { diagnosis: 25, treatment: 25, time: 20, efficiency: 30, communication: 0, knowledge: 0 },
    timeLimit: 900,
    passingScore: 65
  },
  icu: {
    mode: 'icu',
    components: { diagnosis: 20, treatment: 30, time: 30, efficiency: 20, communication: 0, knowledge: 0 },
    timeLimit: 300,
    passingScore: 75
  },
  osce: {
    mode: 'osce',
    components: { diagnosis: 20, treatment: 20, time: 15, efficiency: 10, communication: 35, knowledge: 0 },
    timeLimit: 480,
    passingScore: 70
  },
  board: {
    mode: 'board',
    components: { diagnosis: 0, treatment: 0, time: 10, efficiency: 0, communication: 0, knowledge: 90 },
    timeLimit: 3600,
    passingScore: 65
  }
};

export class ScoringEngine {
  private config: ScoringConfig;
  private scores: ScoreComponent[] = [];
  private startTime: number;
  private actionCount: number = 0;
  private optimalActionCount: number;

  constructor(mode: string, optimalActions: number = 10) {
    this.config = DEFAULT_CONFIGS[mode] || DEFAULT_CONFIGS.clinical;
    this.startTime = Date.now();
    this.optimalActionCount = optimalActions;
  }

  recordDiagnosis(isCorrect: boolean, differentialCount: number): void {
    const maxScore = this.config.components.diagnosis;
    let score: number, feedback: string;
    if (isCorrect && differentialCount <= 3) { score = maxScore; feedback = 'Excellent diagnosis!'; }
    else if (isCorrect && differentialCount <= 5) { score = maxScore * 0.8; feedback = 'Correct, narrow your differential.'; }
    else if (isCorrect) { score = maxScore * 0.6; feedback = 'Correct but differential too broad.'; }
    else { score = maxScore * 0.2; feedback = 'Incorrect diagnosis.'; }
    this.scores.push({ name: 'Diagnosis', score, maxScore, weight: this.config.components.diagnosis, feedback });
  }

  recordTreatment(isAppropriate: boolean, completeness: number): void {
    const maxScore = this.config.components.treatment;
    const score = isAppropriate ? maxScore * completeness : maxScore * 0.1;
    const feedback = isAppropriate ? 'Treatment appropriate.' : 'Treatment needs revision.';
    this.scores.push({ name: 'Treatment', score, maxScore, weight: this.config.components.treatment, feedback });
  }

  recordTime(): { score: number; timeSpent: number } {
    const timeSpent = (Date.now() - this.startTime) / 1000;
    const timeLimit = this.config.timeLimit || 600;
    const maxScore = this.config.components.time;
    let score: number;
    if (timeSpent <= timeLimit * 0.5) score = maxScore;
    else if (timeSpent <= timeLimit * 0.8) score = maxScore * 0.8;
    else if (timeSpent <= timeLimit) score = maxScore * 0.6;
    else score = Math.max(0, maxScore * (1 - (timeSpent - timeLimit) / timeLimit));
    const feedback = timeSpent <= timeLimit ? `Completed in ${Math.round(timeSpent)}s.` : 'Exceeded time limit.';
    this.scores.push({ name: 'Time', score, maxScore, weight: this.config.components.time, feedback });
    return { score, timeSpent };
  }

  recordEfficiency(): void {
    const maxScore = this.config.components.efficiency;
    const efficiency = Math.min(1, this.optimalActionCount / Math.max(1, this.actionCount));
    const score = maxScore * efficiency;
    this.scores.push({ name: 'Efficiency', score, maxScore, weight: this.config.components.efficiency, feedback: efficiency >= 0.8 ? 'Efficient.' : 'Too many actions.' });
  }

  recordAction(): void { this.actionCount++; }

  calculateTotal(): { totalScore: number; maxPossible: number; percentage: number; passed: boolean; components: ScoreComponent[]; grade: string } {
    this.recordTime();
    this.recordEfficiency();
    const totalWeight = Object.values(this.config.components).reduce((a, b) => a + b, 0);
    let weightedScore = 0;
    for (const c of this.scores) { weightedScore += (c.score / c.maxScore) * c.weight; }
    const percentage = (weightedScore / totalWeight) * 100;
    const passed = percentage >= (this.config.passingScore || 70);
    let grade: string;
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else grade = 'F';
    return { totalScore: Math.round(percentage), maxPossible: 100, percentage, passed, components: this.scores, grade };
  }

  getCurrentProgress(): number {
    const totalWeight = Object.values(this.config.components).reduce((a, b) => a + b, 0);
    let weightedScore = 0, completedWeight = 0;
    for (const c of this.scores) { weightedScore += (c.score / c.maxScore) * c.weight; completedWeight += c.weight; }
    if (completedWeight === 0) return 0;
    return (weightedScore / completedWeight) * 100;
  }
}

export default ScoringEngine;
