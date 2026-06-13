// 🧠 Graph Engine v3 - Persistent + SR-integrated + Dynamic patterns
import AsyncStorage from '@react-native-async-storage/async-storage';

const GRAPH_STORAGE_KEY = 'medtach_graph_engine';

export interface ErrorNode {
  questionId: string; concept: string; trapType: string;
  cognitiveLevel: string; timeSpent: number; confidence: number;
  timestamp: Date;
}

export interface AnswerNode {
  questionId: string; concept: string; isCorrect: boolean;
  timeSpent: number; confidence: number; timestamp: Date;
}

export interface LearningPath {
  title: string; rootCause: string; steps: string[];
  priority: number; urgency: 'high' | 'medium' | 'low';
  pattern: string; mastery: number; nextReview?: string;
}

interface ConceptState {
  correct: number; total: number; lastError?: string;
  mastery: number; nextReview?: string;
  srInterval: number;
}

const CONCEPT_GRAPH: Record<string, { related: string[]; prerequisites: string[]; difficulty: number }> = {
  'ecg_interpretation': {
    related: ['diagnosis', 'emergency_reasoning'],
    prerequisites: ['ecg_basics', 'cardiac_physiology'], difficulty: 4,
  },
  'diagnosis': {
    related: ['clinical_reasoning', 'imaging_interpretation', 'lab_interpretation'],
    prerequisites: ['history_taking', 'physical_examination'], difficulty: 3,
  },
  'management': {
    related: ['pharmacology', 'emergency_reasoning', 'diagnosis'],
    prerequisites: ['diagnosis', 'pharmacology_basics'], difficulty: 3,
  },
  'imaging_interpretation': {
    related: ['diagnosis', 'anatomy', 'pathology'],
    prerequisites: ['imaging_basics', 'anatomy'], difficulty: 4,
  },
  'emergency_reasoning': {
    related: ['diagnosis', 'management', 'ecg_interpretation'],
    prerequisites: ['clinical_reasoning', 'basic_life_support'], difficulty: 5,
  },
  'pharmacology': {
    related: ['management', 'physiology', 'biochemistry'],
    prerequisites: ['pharmacology_basics', 'physiology'], difficulty: 3,
  },
};

const SR_INTERVALS = [1, 3, 7, 14, 30, 60];

// ✅ Dynamic trap type detection from answer pattern
function detectTrapTypeFromAnswer(
  timeSpent: number, confidence: number, isCorrect: boolean, questionTrapType: string
): string {
  if (isCorrect) return 'none';
  
  if (timeSpent < 15 && confidence > 0.75) return 'careless';
  if (timeSpent > 45 && confidence < 0.5) return 'knowledge_gap';
  if (confidence > 0.8) return 'overconfident';
  
  return questionTrapType || 'diagnostic_confusion';
}

export class GraphEngine {
  private allAnswers: AnswerNode[] = [];
  private conceptStates: Record<string, ConceptState> = {};
  private trapTypeCounts: Record<string, number> = {};

  // ✅ Initialize concept state
  private getConceptState(concept: string): ConceptState {
    if (!this.conceptStates[concept]) {
      this.conceptStates[concept] = {
        correct: 0, total: 0, mastery: -1, srInterval: 1,
      };
    }
    return this.conceptStates[concept];
  }

  // 📝 Log answer (correct or wrong)
  logAnswer(answer: AnswerNode): void {
    this.allAnswers.push(answer);
    const state = this.getConceptState(answer.concept);
    state.total++;
    
    if (answer.isCorrect) {
      state.correct++;
      // Increase SR interval on success
      const idx = SR_INTERVALS.indexOf(state.srInterval);
      state.srInterval = SR_INTERVALS[Math.min(idx + 1, SR_INTERVALS.length - 1)];
    } else {
      state.lastError = answer.timestamp.toISOString();
      // Reset SR interval on failure
      state.srInterval = SR_INTERVALS[0];
      
      // ✅ Dynamic trap type
      const dynamicTrap = detectTrapTypeFromAnswer(
        answer.timeSpent, answer.confidence, false, 'diagnostic_confusion'
      );
      this.trapTypeCounts[dynamicTrap] = (this.trapTypeCounts[dynamicTrap] || 0) + 1;
    }
    
    // Calculate mastery
    state.mastery = this.calculateMastery(answer.concept);
    
    // Set next review based on mastery
    const now = new Date();
    if (state.mastery < 30) now.setDate(now.getDate() + 1);       // 1 day
    else if (state.mastery < 60) now.setDate(now.getDate() + 3);  // 3 days
    else if (state.mastery < 80) now.setDate(now.getDate() + 7);  // 1 week
    else now.setDate(now.getDate() + state.srInterval);           // SR interval
    state.nextReview = now.toISOString();
    
    this.saveState();
  }

  // ✅ Calculate mastery with recency bias
  calculateMastery(concept: string): number {
    const state = this.conceptStates[concept];
    if (!state || state.total === 0) return -1; // unevaluated
    
    // Base accuracy
    const baseScore = Math.round((state.correct / state.total) * 100);
    
    // Recent performance (last 5 answers for this concept)
    const recentAnswers = this.allAnswers
      .filter(a => a.concept === concept)
      .slice(-5);
    
    const recentCorrect = recentAnswers.filter(a => a.isCorrect).length;
    const recentScore = recentAnswers.length > 0
      ? Math.round((recentCorrect / recentAnswers.length) * 100)
      : baseScore;
    
    // Weighted: 60% recent + 40% overall
    const weightedScore = Math.round(recentScore * 0.6 + baseScore * 0.4);
    
    // Penalty for very recent errors
    if (state.lastError) {
      const hoursSinceError = (Date.now() - new Date(state.lastError).getTime()) / (1000 * 60 * 60);
      if (hoursSinceError < 1) return Math.max(0, weightedScore - 15);
      if (hoursSinceError < 6) return Math.max(0, weightedScore - 5);
    }
    
    return Math.min(100, Math.max(0, weightedScore));
  }

  // 🔍 Detect pattern from recent answers (correct + wrong)
  detectPattern(concept: string): string {
    const recent = this.allAnswers.filter(a => a.concept === concept).slice(-8);
    if (recent.length < 3) return 'insufficient_data';
    
    const wrongOnly = recent.filter(a => !a.isCorrect);
    if (wrongOnly.length === 0) return 'mastered';
    
    const avgTime = wrongOnly.reduce((s, a) => s + a.timeSpent, 0) / wrongOnly.length;
    const avgConf = wrongOnly.reduce((s, a) => s + a.confidence, 0) / wrongOnly.length;
    
    // Same concept repeated wrong
    if (wrongOnly.length >= 3) return 'persistent_gap';
    if (avgTime < 15 && avgConf > 0.75) return 'careless';
    if (avgTime > 45 && avgConf < 0.5) return 'knowledge_gap';
    if (avgConf > 0.8) return 'overconfident';
    
    return 'mixed';
  }

  // 🛤️ Generate Learning Path
  generatePath(concept: string): LearningPath {
    const mastery = this.calculateMastery(concept);
    const state = this.getConceptState(concept);
    const graph = CONCEPT_GRAPH[concept] || { related: [], prerequisites: [], difficulty: 3 };
    const pattern = this.detectPattern(concept);
    
    let priority = mastery === -1 ? 50 : Math.min(100, Math.round((100 - mastery) * 1.5));
    let urgency: 'high' | 'medium' | 'low' = 'medium';
    if (priority > 70 || pattern === 'persistent_gap') urgency = 'high';
    else if (priority < 30) urgency = 'low';
    
    const steps: string[] = [];
    
    if (mastery === -1) {
      steps.push(`🆕 New concept: ${concept.replace(/_/g, ' ')}`);
    } else if (mastery < 30) {
      steps.push(...graph.prerequisites.map(p => `📚 Review: ${p.replace(/_/g, ' ')}`));
    }
    
    steps.push(`🎯 Focus: ${concept.replace(/_/g, ' ')} (${mastery === -1 ? 'unevaluated' : mastery + '%'})`);
    
    if (mastery < 60 && mastery !== -1) {
      steps.push(...graph.related.slice(0, 2).map(r => `🔗 Connect: ${r.replace(/_/g, ' ')}`));
    }
    
    if (pattern === 'careless') steps.push('💡 Slow down. Double-check before answering.');
    else if (pattern === 'knowledge_gap') steps.push('📖 Review fundamentals of this topic.');
    else if (pattern === 'persistent_gap') steps.push('🔥 Priority review needed. Focus study session.');
    else if (pattern === 'overconfident') steps.push('🤔 Re-evaluate your understanding.');
    
    return {
      title: concept.replace(/_/g, ' '),
      rootCause: pattern,
      steps,
      priority,
      urgency,
      pattern,
      mastery: mastery === -1 ? 0 : mastery,
      nextReview: state.nextReview,
    };
  }

  // 🎯 Get weakest concepts
  getWeakestConcepts(limit: number = 5): LearningPath[] {
    const paths: LearningPath[] = [];
    for (const concept of Object.keys(this.conceptStates)) {
      const mastery = this.calculateMastery(concept);
      const total = this.conceptStates[concept]?.total || 0;
      if ((mastery < 80 || mastery === -1) && total >= 2) {
        paths.push(this.generatePath(concept));
      }
    }
    return paths.sort((a, b) => b.priority - a.priority).slice(0, limit);
  }

  // 📊 Stats
  getStats() {
    const concepts = Object.keys(this.conceptStates);
    const evaluated = concepts.filter(c => this.calculateMastery(c) !== -1);
    return {
      totalAnswers: this.allAnswers.length,
      totalConcepts: concepts.length,
      evaluatedConcepts: evaluated.length,
      averageMastery: evaluated.length > 0
        ? Math.round(evaluated.reduce((s, c) => s + Math.max(0, this.calculateMastery(c)), 0) / evaluated.length)
        : 0,
      weakestConcept: this.getWeakestConcepts(1)[0]?.title || 'N/A',
      topTrapType: Object.entries(this.trapTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A',
    };
  }

  // ✅ Persistence
  async saveState(): Promise<void> {
    try {
      const data = {
        allAnswers: this.allAnswers.slice(-200),
        conceptStates: this.conceptStates,
        trapTypeCounts: this.trapTypeCounts,
      };
      await AsyncStorage.setItem(GRAPH_STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }

  async loadState(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(GRAPH_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.allAnswers = parsed.allAnswers || [];
        this.conceptStates = parsed.conceptStates || {};
        this.trapTypeCounts = parsed.trapTypeCounts || {};
      }
    } catch {}
  }

  reset(): void {
    this.allAnswers = [];
    this.conceptStates = {};
    this.trapTypeCounts = {};
    AsyncStorage.removeItem(GRAPH_STORAGE_KEY);
  }
}
