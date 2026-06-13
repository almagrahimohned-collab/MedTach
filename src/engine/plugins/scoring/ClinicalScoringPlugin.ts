// ============================================
// Clinical Scoring Plugin
// ============================================

import { Action, ActionResult } from '../../core/types';
import { EventType } from '../../events/EventRegistry';
import { SimulationContext } from '../../core/SimulationContext';
import { PluginContract } from '../../core/PluginRuntime';

export interface ScoreBreakdown {
  diagnosis: { score: number; max: number; feedback: string };
  treatment: { score: number; max: number; feedback: string };
  efficiency: { score: number; max: number; feedback: string };
  time: { score: number; max: number; feedback: string };
  total: number;
  grade: string;
  passed: boolean;
}

export class ClinicalScoringPlugin implements PluginContract {
  name = 'ClinicalScoringPlugin';
  version = '1.0.0';
  
  metadata = {
    name: 'ClinicalScoringPlugin',
    version: '1.0.0',
    description: 'Calculates clinical case scores'
  };

  private startTime: number = Date.now();
  private diagnosisCorrect: boolean = false;
  private treatmentSubmitted: boolean = false;
  private actionCount: number = 0;

  canHandle(action: Action): boolean {
    return action.type === 'command' || 
           action.payload.startsWith('/score') ||
           action.payload.startsWith('/result');
  }

  async handle(action: Action, context: SimulationContext): Promise<ActionResult> {
    if (action.payload.startsWith('/reset_timer')) {
      this.startTime = Date.now();
      return { success: true, message: 'Timer reset' };
    }

    const score = this.calculateScore(context);
    
    return {
      success: true,
      message: this.formatScoreMessage(score),
      stateChanges: {
        score: score.total,
        phase: 'complete',
        messages: [
          { role: 'system', content: this.formatScoreMessage(score) }
        ]
      },
      events: [
        { type: 'SCORE_CALCULATED', payload: score, timestamp: Date.now() },
        { type: 'CASE_COMPLETED', payload: { score: score.total, grade: score.grade }, timestamp: Date.now() }
      ]
    };
  }

  recordDiagnosis(correct: boolean): void {
    this.diagnosisCorrect = correct;
  }

  recordTreatment(): void {
    this.treatmentSubmitted = true;
  }

  recordAction(): void {
    this.actionCount++;
  }

  private calculateScore(context: SimulationContext): ScoreBreakdown {
    const timeSpent = (Date.now() - this.startTime) / 1000;
    const timeLimit = context.config.timeLimit || 600;

    // Diagnosis score (40%)
    const diagScore = this.diagnosisCorrect ? 40 : 
      context.reasoning.topDiagnosis === context.references.case.correct_diagnosis ? 20 : 5;
    const diagFeedback = this.diagnosisCorrect ? 'Excellent diagnosis!' :
      diagScore >= 20 ? 'Close, but not exact.' : 'Incorrect diagnosis.';

    // Treatment score (30%)
    const treatScore = this.treatmentSubmitted ? 30 : 0;
    const treatFeedback = this.treatmentSubmitted ? 'Treatment plan submitted.' : 'No treatment plan.';

    // Efficiency score (15%)
    const optimalActions = (Object.keys(context.references.case.hidden_data || {}).length || 5) + 5;
    const efficiency = Math.min(1, optimalActions / Math.max(1, this.actionCount));
    const effScore = Math.round(15 * efficiency);
    const effFeedback = efficiency >= 0.8 ? 'Efficient approach.' : 
      efficiency >= 0.5 ? 'Some unnecessary steps.' : 'Too many unnecessary actions.';

    // Time score (15%)
    const timeRatio = timeSpent / timeLimit;
    const timeScore = timeRatio <= 0.5 ? 15 :
      timeRatio <= 0.8 ? 12 :
      timeRatio <= 1.0 ? 8 :
      timeRatio <= 1.5 ? 4 : 0;
    const timeFeedback = timeRatio <= 0.5 ? 'Excellent time management!' :
      timeRatio <= 1.0 ? 'Good pace.' :
      timeRatio <= 1.5 ? 'A bit slow.' : 'Too slow.';

    const total = diagScore + treatScore + effScore + timeScore;
    
    let grade: string;
    if (total >= 90) grade = 'A+';
    else if (total >= 80) grade = 'A';
    else if (total >= 70) grade = 'B';
    else if (total >= 60) grade = 'C';
    else if (total >= 50) grade = 'D';
    else grade = 'F';

    return {
      diagnosis: { score: diagScore, max: 40, feedback: diagFeedback },
      treatment: { score: treatScore, max: 30, feedback: treatFeedback },
      efficiency: { score: effScore, max: 15, feedback: effFeedback },
      time: { score: timeScore, max: 15, feedback: timeFeedback },
      total,
      grade,
      passed: total >= 60
    };
  }

  private formatScoreMessage(score: ScoreBreakdown): string {
    const emoji = score.passed ? '🎉' : '📚';
    return [
      `${emoji} Case Complete! Score: ${score.total}/100 (${score.grade})`,
      '',
      `📊 Breakdown:`,
      `  • Diagnosis: ${score.diagnosis.score}/${score.diagnosis.max} — ${score.diagnosis.feedback}`,
      `  • Treatment: ${score.treatment.score}/${score.treatment.max} — ${score.treatment.feedback}`,
      `  • Efficiency: ${score.efficiency.score}/${score.efficiency.max} — ${score.efficiency.feedback}`,
      `  • Time: ${score.time.score}/${score.time.max} — ${score.time.feedback}`,
      '',
      score.passed ? '✅ Passed! Great work!' : '📚 Keep practicing! Review the key learning points.'
    ].join('\n');
  }

  reset(): void {
    this.startTime = Date.now();
    this.diagnosisCorrect = false;
    this.treatmentSubmitted = false;
    this.actionCount = 0;
  }
}

export default ClinicalScoringPlugin;
