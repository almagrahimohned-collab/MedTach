// ============================================
// Clinical Reasoning Engine — Bayesian Inference
// ============================================

import { Hypothesis, HypothesisTracker } from './HypothesisTracker';

export interface EvidenceItem {
  finding: string;
  lrPositive: number;  // Likelihood ratio for positive finding
  lrNegative: number;  // Likelihood ratio for negative finding
  matchesHypotheses: string[]; // Which hypotheses this evidence affects
}

// Pre-defined likelihood ratios for common findings
export const EVIDENCE_LIBRARY: Record<string, EvidenceItem> = {
  'st_elevation_ecg': {
    finding: 'ST elevation on ECG',
    lrPositive: 8.0,   // Strong evidence for MI
    lrNegative: 0.3,
    matchesHypotheses: ['myocardial infarction', 'pericarditis']
  },
  'elevated_troponin': {
    finding: 'Elevated Troponin',
    lrPositive: 5.0,
    lrNegative: 0.2,
    matchesHypotheses: ['myocardial infarction', 'heart failure']
  },
  'pleuritic_chest_pain': {
    finding: 'Pleuritic chest pain',
    lrPositive: 3.0,
    lrNegative: 0.5,
    matchesHypotheses: ['pulmonary embolism', 'pneumothorax', 'pericarditis']
  },
  'clear_lungs': {
    finding: 'Clear lung fields',
    lrPositive: 0.5,
    lrNegative: 2.0,
    matchesHypotheses: ['pneumothorax']
  },
  'fever': {
    finding: 'Fever > 38°C',
    lrPositive: 2.5,
    lrNegative: 0.6,
    matchesHypotheses: ['pneumonia', 'pericarditis']
  },
};

export class ClinicalReasoningEngine {
  private tracker: HypothesisTracker;

  constructor() {
    this.tracker = new HypothesisTracker();
  }

  initialize(differentials: string[]): void {
    this.tracker.initialize(differentials);
  }

  // Apply evidence using likelihood ratios
  applyEvidence(findingKey: string): void {
    const evidence = EVIDENCE_LIBRARY[findingKey];
    if (!evidence) return;

    this.tracker.updateEvidence(
      evidence.finding,
      evidence.matchesHypotheses,
      evidence.lrPositive,
      evidence.lrNegative
    );
  }

  // Apply generic finding (for cases without pre-defined evidence)
  applyGenericFinding(finding: string, matchesHypotheses: string[]): void {
    this.tracker.updateEvidence(finding, matchesHypotheses, 2.0, 0.5);
  }

  // Get current diagnostic probabilities
  getDifferential(): Hypothesis[] {
    return this.tracker.getDifferential();
  }

  getMostProbable(): Hypothesis | null {
    return this.tracker.getMostProbable();
  }

  getConfidence(): number {
    return this.tracker.getConfidence();
  }

  // Check if submitted diagnosis matches reasoning
  isConsistentWith(submitted: string): boolean {
    return this.tracker.isConsistentWith(submitted);
  }

  reset(): void {
    this.tracker.reset();
  }
}

export default ClinicalReasoningEngine;
