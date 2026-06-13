export interface Hypothesis {
  id: string; name: string; probability: number;
  supporting: string[]; refuting: string[];
}

export class HypothesisTracker {
  private hypotheses: Hypothesis[] = [];
  private history: Array<{ action: string; probabilities: number[] }> = [];

  initialize(differentials: string[]): void {
    const base = 1 / Math.max(differentials.length, 1);
    this.hypotheses = differentials.map((d, i) => ({
      id: `H${i + 1}`, name: d, probability: base, supporting: [], refuting: []
    }));
  }

  // Bayesian update with likelihood ratios
  updateEvidence(finding: string, matchesHypotheses: string[], lrPlus: number = 2.0, lrMinus: number = 0.5): void {
    for (const h of this.hypotheses) {
      const isMatch = matchesHypotheses.some(m => 
        h.name.toLowerCase().includes(m.toLowerCase())
      );
      
      if (isMatch) {
        h.supporting.push(finding);
        h.probability = this.bayes(h.probability, lrPlus);
      } else {
        h.refuting.push(finding);
        h.probability = this.bayes(h.probability, lrMinus);
      }
    }
    this.normalize();
  }

  updateProbabilities(revealed: string[]): void {
    // More evidence = slight boost to leading hypothesis
    if (this.hypotheses.length === 0) return;
    const best = this.hypotheses.reduce((a, b) => a.probability > b.probability ? a : b);
    best.probability = Math.min(0.99, best.probability + revealed.length * 0.01);
    this.normalize();
  }

  private bayes(prior: number, lr: number): number {
    const odds = prior / (1 - prior);
    const posterior = (odds * lr) / (1 + odds * lr);
    return Math.min(0.99, Math.max(0.01, posterior));
  }

  private normalize(): void {
    const total = this.hypotheses.reduce((s, h) => s + h.probability, 0);
    if (total > 0) this.hypotheses.forEach(h => h.probability /= total);
  }

  getDifferential(): Hypothesis[] {
    return [...this.hypotheses].sort((a, b) => b.probability - a.probability);
  }

  getMostProbable(): Hypothesis | null {
    return this.getDifferential()[0] || null;
  }

  getConfidence(): number {
    return this.getMostProbable()?.probability || 0;
  }

  reset(): void { this.hypotheses = []; this.history = []; }
}

export default HypothesisTracker;
