// osceScoring.ts - OSCE Scoring Engine
// Created: 2026-06-11
// Calculates scores based on checklist, student performance, and professional behaviour

import {
  OSCEStation,
  StationState,
  StationResult,
  DomainScore,
  ChecklistItem,
  ChecklistDomain,
  GlobalRating,
} from './osceTypes';

// ============================================================
// SCORING ENGINE CLASS
// ============================================================

export class OSCEScoringEngine {
  private station: OSCEStation;
  private state: StationState;

  constructor(station: OSCEStation, state: StationState) {
    this.station = station;
    this.state = state;
  }

  /**
   * Calculate complete station result
   */
  calculateResult(): StationResult {
    const domainScores = this.calculateAllDomains();
    const totalEarned = domainScores.reduce((sum, d) => sum + d.earned, 0);
    const totalMax = domainScores.reduce((sum, d) => sum + d.maximum, 0);
    const percentage = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;
    
    // Bonuses and penalties
    const bonuses = this.state.professionalBonuses;
    const penalties = this.state.professionalPenalties;
    
    // Bonus points (max 5 extra)
    const bonusPoints = Math.min(bonuses.length, 5);
    
    // Penalty deductions (max 5 deductions)
    const penaltyPoints = Math.min(penalties.length, 5);
    
    const finalScore = Math.max(0, totalEarned + bonusPoints - penaltyPoints);
    const finalMax = totalMax + 5; // Including possible bonuses
    
    const globalRating = this.calculateGlobalRating(percentage);
    const criticalItemsMissed = this.getCriticalItemsMissed(domainScores);
    const feedback = this.generateFeedback(domainScores, globalRating);
    
    const timeTaken = this.state.completedAt 
      ? Math.round((this.state.completedAt - this.state.startedAt) / 1000)
      : this.station.timeLimit * 60;
    
    return {
      stationId: this.station.id,
      stationTitle: this.station.title,
      totalScore: finalScore,
      maxScore: finalMax,
      percentage,
      globalRating,
      domainScores,
      bonuses,
      penalties,
      timeTaken,
      timeAllocated: this.station.timeLimit * 60,
      criticalItemsMissed,
      feedback,
      completedAt: this.state.completedAt || Date.now(),
    };
  }

  /**
   * Calculate scores for all domains
   */
  private calculateAllDomains(): DomainScore[] {
    const domains: DomainScore[] = [];
    const checklist = this.station.checklist;

    // History Domain
    if (checklist.history) {
      domains.push(this.calculateHistoryScore(checklist.history));
    }

    // Examination Domain
    if (checklist.examination) {
      domains.push(this.calculateExaminationScore(checklist.examination));
    }

    // Investigations Domain
    if (checklist.investigations) {
      domains.push(this.calculateInvestigationsScore(checklist.investigations));
    }

    // Diagnosis Domain
    if (checklist.diagnosis) {
      domains.push(this.calculateDiagnosisScore(checklist.diagnosis));
    }

    // Management Domain
    if (checklist.management) {
      domains.push(this.calculateManagementScore(checklist.management));
    }

    return domains;
  }

  /**
   * Score History Taking
   */
  private calculateHistoryScore(domain: ChecklistDomain): DomainScore {
    const itemsCorrect: string[] = [];
    const itemsMissed: string[] = [];
    
    for (const item of domain.items) {
      const wasAsked = this.state.questionsAsked.some(q => q.matchedKey === item.id);
      
      if (wasAsked) {
        itemsCorrect.push(item.description);
      } else {
        itemsMissed.push(item.description);
      }
    }
    
    const earned = itemsCorrect.reduce((sum, _, i) => {
      return sum + domain.items[i].points;
    }, 0);
    
    const maximum = domain.items.reduce((sum, item) => sum + item.points, 0);
    
    return {
      domain: 'History Taking',
      earned,
      maximum,
      percentage: maximum > 0 ? Math.round((earned / maximum) * 100) : 0,
      itemsCorrect,
      itemsMissed,
      weight: domain.weight,
    };
  }

  /**
   * Score Physical Examination
   */
  private calculateExaminationScore(domain: ChecklistDomain): DomainScore {
    const itemsCorrect: string[] = [];
    const itemsMissed: string[] = [];
    
    for (const item of domain.items) {
      // Check if student performed relevant examination
      let performed = false;
      
      // Map checklist item to examination actions
      const examActions = this.mapChecklistToExamActions(item.id);
      
      for (const action of examActions) {
        const found = this.state.examinationsPerformed.some(
          e => e.systemId === action.systemId && e.step === action.step
        );
        if (found) {
          performed = true;
          break;
        }
      }
      
      if (performed) {
        itemsCorrect.push(item.description);
      } else {
        itemsMissed.push(item.description);
      }
    }
    
    const earned = itemsCorrect.reduce((sum, _, i) => {
      return sum + domain.items[i].points;
    }, 0);
    
    const maximum = domain.items.reduce((sum, item) => sum + item.points, 0);
    
    return {
      domain: 'Physical Examination',
      earned,
      maximum,
      percentage: maximum > 0 ? Math.round((earned / maximum) * 100) : 0,
      itemsCorrect,
      itemsMissed,
      weight: domain.weight,
    };
  }

  /**
   * Map checklist item ID to examination actions
   */
  private mapChecklistToExamActions(itemId: string): { systemId: string; step: string }[] {
    const mapping: Record<string, { systemId: string; step: string }[]> = {
      'exam_general': [{ systemId: 'general', step: 'inspection' }],
      'exam_hands': [{ systemId: 'extremities', step: 'inspection' }],
      'exam_cvs_inspection': [{ systemId: 'cardiovascular', step: 'inspection' }],
      'exam_cvs_palpation': [{ systemId: 'cardiovascular', step: 'palpation' }],
      'exam_cvs_auscultation': [{ systemId: 'cardiovascular', step: 'auscultation' }],
      'exam_jvp': [{ systemId: 'cardiovascular', step: 'special' }],
      'exam_respiratory': [
        { systemId: 'respiratory', step: 'inspection' },
        { systemId: 'respiratory', step: 'auscultation' },
      ],
      'exam_extremities': [{ systemId: 'extremities', step: 'palpation' }],
      'exam_hand_hygiene': [],
      'exam_introduction': [],
    };
    
    return mapping[itemId] || [];
  }

  /**
   * Score Investigations
   */
  private calculateInvestigationsScore(domain: ChecklistDomain): DomainScore {
    const itemsCorrect: string[] = [];
    const itemsMissed: string[] = [];
    
    for (const item of domain.items) {
      // Map checklist item to investigation ID
      const invId = this.mapChecklistToInvestigation(item.id);
      
      const wasOrdered = invId && this.state.investigationsOrdered.some(
        i => i.testId === invId
      );
      
      if (wasOrdered) {
        itemsCorrect.push(item.description);
      } else {
        itemsMissed.push(item.description);
      }
    }
    
    const earned = itemsCorrect.reduce((sum, _, i) => {
      return sum + domain.items[i].points;
    }, 0);
    
    const maximum = domain.items.reduce((sum, item) => sum + item.points, 0);
    
    return {
      domain: 'Investigations',
      earned,
      maximum,
      percentage: maximum > 0 ? Math.round((earned / maximum) * 100) : 0,
      itemsCorrect,
      itemsMissed,
      weight: domain.weight,
    };
  }

  /**
   * Map checklist item to investigation ID
   */
  private mapChecklistToInvestigation(itemId: string): string | null {
    const mapping: Record<string, string> = {
      'inv_ecg': 'ecg',
      'inv_troponin': 'troponin',
      'inv_cxr': 'chest_xray',
      'inv_cbc': 'cbc',
      'inv_bmp': 'bmp',
    };
    return mapping[itemId] || null;
  }

  /**
   * Score Diagnosis
   */
  private calculateDiagnosisScore(domain: ChecklistDomain): DomainScore {
    const itemsCorrect: string[] = [];
    const itemsMissed: string[] = [];
    
    if (!this.state.diagnosis) {
      // No diagnosis submitted
      for (const item of domain.items) {
        itemsMissed.push(item.description);
      }
    } else {
      for (const item of domain.items) {
        let correct = false;
        
        if (item.id === 'dx_primary') {
          // Check if primary diagnosis matches accepted answers
          const studentDx = this.state.diagnosis.primary.toLowerCase();
          correct = this.station.diagnosis.acceptedAnswers.some(
            accepted => studentDx.includes(accepted.toLowerCase())
          );
        } else if (item.id.includes('differential')) {
          // Check differentials
          const differentials = this.station.diagnosis.differentials;
          const studentDiffs = this.state.diagnosis.differentials.map(d => d.toLowerCase());
          
          for (const diff of differentials) {
            if (studentDiffs.some(sd => sd.includes(diff.diagnosis.toLowerCase()))) {
              correct = true;
              break;
            }
          }
        }
        
        if (correct) {
          itemsCorrect.push(item.description);
        } else {
          itemsMissed.push(item.description);
        }
      }
    }
    
    const earned = itemsCorrect.reduce((sum, _, i) => {
      return sum + domain.items[i].points;
    }, 0);
    
    const maximum = domain.items.reduce((sum, item) => sum + item.points, 0);
    
    return {
      domain: 'Diagnosis',
      earned,
      maximum,
      percentage: maximum > 0 ? Math.round((earned / maximum) * 100) : 0,
      itemsCorrect,
      itemsMissed,
      weight: domain.weight,
    };
  }

  /**
   * Score Management
   */
  private calculateManagementScore(domain: ChecklistDomain): DomainScore {
    const itemsCorrect: string[] = [];
    const itemsMissed: string[] = [];
    
    // Simplified management scoring - checks keywords in student's plan
    if (this.state.management) {
      const allPlanText = [
        ...this.state.management.immediate,
        ...this.state.management.monitoring,
        ...this.state.management.longTerm,
      ].join(' ').toLowerCase();
      
      for (const item of domain.items) {
        const keywords = this.getManagementKeywords(item.id);
        const matched = keywords.some(kw => allPlanText.includes(kw));
        
        if (matched) {
          itemsCorrect.push(item.description);
        } else {
          itemsMissed.push(item.description);
        }
      }
    } else {
      for (const item of domain.items) {
        itemsMissed.push(item.description);
      }
    }
    
    const earned = itemsCorrect.reduce((sum, _, i) => {
      return sum + domain.items[i].points;
    }, 0);
    
    const maximum = domain.items.reduce((sum, item) => sum + item.points, 0);
    
    return {
      domain: 'Management',
      earned,
      maximum,
      percentage: maximum > 0 ? Math.round((earned / maximum) * 100) : 0,
      itemsCorrect,
      itemsMissed,
      weight: domain.weight,
    };
  }

  /**
   * Get keywords for management checklist items
   */
  private getManagementKeywords(itemId: string): string[] {
    const mapping: Record<string, string[]> = {
      'mgmt_aspirin': ['aspirin', 'asa'],
      'mgmt_antiplatelet': ['ticagrelor', 'clopidogrel', 'antiplatelet'],
      'mgmt_pci': ['pci', 'cath lab', 'catheterization', 'angioplasty', 'reperfusion'],
      'mgmt_pain': ['morphine', 'nitroglycerin', 'ntg', 'analgesia', 'pain'],
      'mgmt_monitoring': ['monitor', 'telemetry', 'observation', 'vital'],
      'mgmt_longterm': ['statin', 'beta blocker', 'ace inhibitor', 'cardiac rehab', 'rehabilitation', 'smoking cessation', 'lifestyle'],
    };
    return mapping[itemId] || [];
  }

  /**
   * Calculate global rating based on percentage
   */
  private calculateGlobalRating(percentage: number): GlobalRating {
    const thresholds = this.station.scoring;
    
    if (percentage >= thresholds.excellentThreshold) return 'excellent';
    if (percentage >= thresholds.goodThreshold) return 'good';
    if (percentage >= thresholds.passThreshold) return 'pass';
    if (percentage >= thresholds.passThreshold - 15) return 'borderline';
    return 'fail';
  }

  /**
   * Get critical items that were missed (could cause automatic fail)
   */
  private getCriticalItemsMissed(domainScores: DomainScore[]): string[] {
    const critical: string[] = [];
    
    for (const domain of domainScores) {
      for (const item of domain.itemsMissed) {
        // Check if this was a critical item
        const isCritical = this.isItemCritical(item);
        if (isCritical) {
          critical.push(`${domain.domain}: ${item}`);
        }
      }
    }
    
    return critical;
  }

  /**
   * Check if an item is critical (required for safe practice)
   */
  private isItemCritical(description: string): boolean {
    const criticalPatterns = [
      'ecg',
      'troponin',
      'aspirin',
      'pci',
      'primary diagnosis',
      'hand hygiene',
      'introduc',
    ];
    
    return criticalPatterns.some(pattern => 
      description.toLowerCase().includes(pattern)
    );
  }

  /**
   * Generate constructive feedback
   */
  private generateFeedback(domainScores: DomainScore[], rating: GlobalRating): string {
    const feedbackLines: string[] = [];
    
    // Overall assessment
    const ratingMessages: Record<GlobalRating, string> = {
      'fail': '⚠️ This performance was below the expected standard. Review the missed items carefully.',
      'borderline': '⚠️ Borderline performance. Several important items were missed. Additional practice recommended.',
      'pass': '✅ Adequate performance. Essential items were covered. Continue practicing to improve further.',
      'good': '👍 Good performance! Most key items were addressed correctly.',
      'excellent': '🌟 Excellent performance! Comprehensive and professional approach.',
    };
    
    feedbackLines.push(ratingMessages[rating]);
    
    // Domain-specific feedback
    for (const domain of domainScores) {
      if (domain.percentage < 60) {
        feedbackLines.push(`\n📌 ${domain.domain} needs improvement (${domain.percentage}%)`);
        if (domain.itemsMissed.length > 0) {
          feedbackLines.push(`   Missed: ${domain.itemsMissed.slice(0, 3).join(', ')}`);
        }
      } else if (domain.percentage >= 90) {
        feedbackLines.push(`\n⭐ ${domain.domain}: Excellent (${domain.percentage}%)`);
      }
    }
    
    // Professional behaviour
    if (this.state.professionalBonuses.length > 0) {
      feedbackLines.push(`\n✅ Professional strengths: ${this.state.professionalBonuses.join(', ')}`);
    }
    
    if (this.state.professionalPenalties.length > 0) {
      feedbackLines.push(`\n⚠️ Areas to improve: ${this.state.professionalPenalties.join(', ')}`);
    }
    
    return feedbackLines.join('\n');
  }

  /**
   * Get detailed breakdown for feedback display
   */
  getDetailedBreakdown(): {
    historyQuestions: { asked: number; total: number };
    examinations: { performed: number; total: number };
    investigations: { ordered: number; critical: number; total: number };
    timeUsed: { seconds: number; allocated: number };
  } {
    const checklist = this.station.checklist;
    
    return {
      historyQuestions: {
        asked: this.state.questionsAsked.filter(q => q.matchedKey).length,
        total: checklist.history?.items.length || 0,
      },
      examinations: {
        performed: this.state.examinationsPerformed.length,
        total: checklist.examination?.items.length || 0,
      },
      investigations: {
        ordered: this.state.investigationsOrdered.length,
        critical: this.station.investigations.critical_investigations.filter(
          id => this.state.investigationsOrdered.some(i => i.testId === id)
        ).length,
        total: checklist.investigations?.items.length || 0,
      },
      timeUsed: {
        seconds: this.state.completedAt 
          ? Math.round((this.state.completedAt - this.state.startedAt) / 1000)
          : this.station.timeLimit * 60,
        allocated: this.station.timeLimit * 60,
      },
    };
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculate weighted total from domain scores
 */
export function calculateWeightedTotal(domainScores: DomainScore[]): number {
  if (domainScores.length === 0) return 0;
  
  const totalWeight = domainScores.reduce((sum, d) => sum + d.weight, 0);
  if (totalWeight === 0) return 0;
  
  const weightedSum = domainScores.reduce((sum, d) => {
    return sum + (d.percentage * d.weight / 100);
  }, 0);
  
  return Math.round((weightedSum / totalWeight) * 100);
}

/**
 * Determine pass/fail status
 */
export function determinePassFail(percentage: number, passThreshold: number): boolean {
  return percentage >= passThreshold;
}

/**
 * Format score for display
 */
export function formatScore(earned: number, maximum: number): string {
  return `${earned}/${maximum} (${Math.round((earned / maximum) * 100)}%)`;
}

/**
 * Get color for global rating
 */
export function getRatingColor(rating: GlobalRating): string {
  const colors: Record<GlobalRating, string> = {
    'fail': '#EF4444',        // Red
    'borderline': '#F59E0B',  // Amber
    'pass': '#10B981',        // Green
    'good': '#38BDF8',        // Blue
    'excellent': '#8B5CF6',   // Purple
  };
  return colors[rating];
}

export default OSCEScoringEngine;
