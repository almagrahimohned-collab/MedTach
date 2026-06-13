// ============================================
// Diagnostic Path — Track Clinical Decisions
// ============================================

export interface DiagnosticStep {
  sequence: number;
  action: string;
  actionType: string;
  timestamp: number;
  hypotheses: Array<{ name: string; probability: number }>;
  newFindings: string[];
}

export class DiagnosticPath {
  private steps: DiagnosticStep[] = [];
  private sequence: number = 0;

  addStep(action: string, actionType: string, hypotheses: Array<{ name: string; probability: number }>, newFindings: string[] = []): void {
    this.sequence++;
    this.steps.push({
      sequence: this.sequence,
      action,
      actionType,
      timestamp: Date.now(),
      hypotheses: hypotheses.map(h => ({ ...h, probability: Math.round(h.probability * 100) / 100 })),
      newFindings
    });
  }

  getAllSteps(): DiagnosticStep[] {
    return [...this.steps];
  }

  getKeyDecisions(): DiagnosticStep[] {
    return this.steps.filter(s => 
      s.actionType === 'diagnosis' || 
      s.actionType === 'treatment' ||
      s.newFindings.length > 0
    );
  }

  getHypothesisEvolution(): Array<{ step: number; hypotheses: Array<{ name: string; probability: number }> }> {
    return this.steps.map(s => ({
      step: s.sequence,
      hypotheses: s.hypotheses
    }));
  }

  getSummary(): string {
    const totalSteps = this.steps.length;
    const diagnoses = this.steps.filter(s => s.actionType === 'diagnosis');
    const investigations = this.steps.filter(s => s.actionType === 'lab' || s.actionType === 'imaging');
    
    return [
      `Total steps: ${totalSteps}`,
      `History questions: ${this.steps.filter(s => s.actionType === 'history').length}`,
      `Examinations: ${this.steps.filter(s => s.actionType === 'exam').length}`,
      `Investigations: ${investigations.length}`,
      `Diagnosis attempts: ${diagnoses.length}`,
    ].join('\n');
  }

  reset(): void {
    this.steps = [];
    this.sequence = 0;
  }
}

export default DiagnosticPath;
