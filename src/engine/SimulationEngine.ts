import ContentRepository, { MedicalCase } from '../content/ContentRepository';
import { StateMachine, PatientState, StateEvent } from './StateMachine';
import { ScoringEngine } from './ScoringEngine';

export type SimulationMode = 'clinical' | 'resident' | 'icu' | 'osce' | 'board';

export interface SimulationConfig {
  mode: SimulationMode;
  caseId: string;
  timeLimit?: number;
  allowHints?: boolean;
  showLabs?: boolean;
  showImaging?: boolean;
}

export interface SimulationState {
  caseData: MedicalCase | null;
  patientState: PatientState;
  vitals: Record<string, any>;
  revealedData: Set<string>;
  actions: string[];
  messages: Array<{ role: 'user' | 'system' | 'patient'; content: string }>;
  phase: 'history' | 'examination' | 'investigations' | 'diagnosis' | 'treatment' | 'complete';
}

export interface ActionResult {
  success: boolean;
  message: string;
  stateChange?: PatientState;
  score?: number;
  feedback?: string;
}

export class SimulationEngine {
  private repository: ContentRepository;
  private stateMachine: StateMachine;
  private scoringEngine: ScoringEngine | null = null;
  private config: SimulationConfig;
  private state: SimulationState;
  private listeners: Array<(state: SimulationState) => void> = [];

  constructor(config: SimulationConfig) {
    this.repository = ContentRepository.getInstance();
    this.config = config;
    this.stateMachine = new StateMachine();
    this.state = { caseData: null, patientState: PatientState.INITIAL, vitals: {}, revealedData: new Set(), actions: [], messages: [], phase: 'history' };
  }

  subscribe(listener: (state: SimulationState) => void): () => void {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private notify(): void { for (const listener of this.listeners) listener({ ...this.state }); }

  async initialize(): Promise<void> {
    const caseData = await this.repository.getCase(this.config.caseId);
    this.state.caseData = caseData;
    if (caseData.vitals) this.state.vitals = { ...caseData.vitals };
    this.scoringEngine = new ScoringEngine(this.config.mode, 10);
    this.addMessage('system', `Welcome! ${caseData.patient.age}-year-old ${caseData.patient.gender} presents with: ${caseData.chief_complaint}`);
    this.notify();
  }

  async submitAction(action: string): Promise<ActionResult> {
    this.state.actions.push(action);
    this.scoringEngine?.recordAction();
    const lower = action.toLowerCase();

    if (lower.startsWith('/hint')) return this.handleHint();
    if (lower.startsWith('/diagnosis')) return this.handleDiagnosisInput(action);
    if (lower.startsWith('/treatment')) return this.handleTreatmentInput(action);

    switch (this.state.phase) {
      case 'history': return this.handleHistory(action);
      case 'examination': return this.handleExamination(action);
      case 'investigations': return this.handleInvestigation(action);
      case 'diagnosis': return this.handleDiagnosisPhase(action);
      case 'treatment': return this.handleTreatmentPhase(action);
      default: return { success: false, message: 'Case complete.' };
    }
  }

  private handleHistory(action: string): ActionResult {
    const responses = this.state.caseData?.patient_responses;
    if (!responses) return { success: false, message: 'No responses.' };
    for (const [key, response] of Object.entries(responses)) {
      if (action.toLowerCase().includes(key.replace('_', ' '))) {
        this.addMessage('patient', response);
        this.state.revealedData.add(key);
        return { success: true, message: response };
      }
    }
    return { success: false, message: 'Ask about: ' + Object.keys(responses).map(k => k.replace('_', ' ')).join(', ') };
  }

  private handleExamination(action: string): ActionResult {
    const exam = this.state.caseData?.physical_exam;
    if (!exam) return { success: false, message: 'No exam data.' };
    for (const [key, finding] of Object.entries(exam)) {
      if (action.toLowerCase().includes(key.replace('_', ' '))) {
        this.addMessage('system', '🔍 ' + finding);
        this.state.revealedData.add(key);
        return { success: true, message: finding };
      }
    }
    return { success: false, message: 'Specify what to examine.' };
  }

  private handleInvestigation(action: string): ActionResult {
    const hidden = this.state.caseData?.hidden_data;
    if (!hidden) return { success: false, message: 'No tests available.' };
    for (const [key, result] of Object.entries(hidden)) {
      if (action.toLowerCase().includes(key.replace('_', ' '))) {
        this.addMessage('system', `🧪 ${key}: ${result}`);
        this.state.revealedData.add(key);
        if (this.state.revealedData.size >= Object.keys(hidden).length * 0.7) {
          this.state.phase = 'diagnosis';
          this.addMessage('system', 'You have enough information. What is your diagnosis?');
        }
        return { success: true, message: result };
      }
    }
    return { success: false, message: 'Test not available.' };
  }

  private handleDiagnosisPhase(action: string): ActionResult {
    const correct = this.state.caseData?.correct_diagnosis?.toLowerCase();
    if (!correct) return { success: false, message: 'No diagnosis defined.' };
    if (action.toLowerCase().includes(correct)) {
      this.stateMachine.transition(StateEvent.CORRECT_DIAGNOSIS);
      this.state.phase = 'treatment';
      this.scoringEngine?.recordDiagnosis(true, 3);
      this.addMessage('system', '✅ Correct diagnosis! What is your treatment plan?');
      this.notify();
      return { success: true, message: 'Correct!', stateChange: PatientState.STABLE };
    }
    this.stateMachine.transition(StateEvent.MISSED_DIAGNOSIS);
    this.addMessage('system', 'Incorrect. The patient is deteriorating...');
    this.notify();
    return { success: false, message: 'Incorrect.', stateChange: PatientState.DETERIORATING };
  }

  private handleTreatmentPhase(action: string): ActionResult {
    this.scoringEngine?.recordTreatment(true, 0.8);
    this.stateMachine.transition(StateEvent.CORRECT_TREATMENT);
    this.state.phase = 'complete';
    const result = this.scoringEngine?.calculateTotal();
    this.addMessage('system', `Case complete! Score: ${result?.totalScore}/100 (${result?.grade})`);
    this.notify();
    return { success: true, message: 'Complete!', stateChange: PatientState.DISCHARGED, score: result?.totalScore };
  }

  private handleHint(): ActionResult {
    const hints = this.state.caseData?.hints;
    if (!hints) return { success: false, message: 'No hints.' };
    const unused = Object.entries(hints).filter(([key]) => !this.state.revealedData.has(key));
    if (unused.length === 0) return { success: false, message: 'No more hints.' };
    const [key, hint] = unused[0];
    this.addMessage('system', `💡 Hint: ${hint}`);
    return { success: true, message: hint };
  }

  private handleDiagnosisInput(action: string): ActionResult {
    this.state.phase = 'diagnosis';
    return this.handleDiagnosisPhase(action.replace('/diagnosis ', ''));
  }

  private handleTreatmentInput(action: string): ActionResult {
    this.state.phase = 'treatment';
    return this.handleTreatmentPhase(action.replace('/treatment ', ''));
  }

  private addMessage(role: 'user' | 'system' | 'patient', content: string): void {
    this.state.messages.push({ role, content });
  }

  getState(): SimulationState { return { ...this.state }; }
  getPatientState(): PatientState { return this.stateMachine.getCurrentState(); }
  isComplete(): boolean { return this.state.phase === 'complete' || this.stateMachine.isTerminal(); }
  reset(): void { this.stateMachine.reset(); this.state = { caseData: null, patientState: PatientState.INITIAL, vitals: {}, revealedData: new Set(), actions: [], messages: [], phase: 'history' }; this.notify(); }
}

export default SimulationEngine;
