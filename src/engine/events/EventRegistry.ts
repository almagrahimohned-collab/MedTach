// ============================================
// Event Registry — Typed Event Contracts
// ============================================

// ──── Event Types Enum ────
export enum EventType {
  // Lifecycle
  ENGINE_INITIALIZED = 'ENGINE_INITIALIZED',
  ENGINE_RESET = 'ENGINE_RESET',
  PLUGIN_REGISTERED = 'PLUGIN_REGISTERED',
  PLUGIN_UNREGISTERED = 'PLUGIN_UNREGISTERED',

  // Actions
  ACTION_SUBMITTED = 'ACTION_SUBMITTED',
  ACTION_COMPLETED = 'ACTION_COMPLETED',
  ACTION_REJECTED = 'ACTION_REJECTED',

  // State
  STATE_CHANGED = 'STATE_CHANGED',
  PHASE_CHANGED = 'PHASE_CHANGED',
  PATIENT_STATE_CHANGED = 'PATIENT_STATE_CHANGED',

  // Clinical
  HISTORY_RESPONSE = 'HISTORY_RESPONSE',
  EXAM_FINDING = 'EXAM_FINDING',
  INVESTIGATION_RESULT = 'INVESTIGATION_RESULT',
  CORRECT_DIAGNOSIS = 'CORRECT_DIAGNOSIS',
  INCORRECT_DIAGNOSIS = 'INCORRECT_DIAGNOSIS',
  PARTIAL_DIAGNOSIS = 'PARTIAL_DIAGNOSIS',
  TREATMENT_SUBMITTED = 'TREATMENT_SUBMITTED',

  // Scoring
  SCORE_CALCULATED = 'SCORE_CALCULATED',
  CASE_COMPLETED = 'CASE_COMPLETED',
}

// ──── Event Payloads ────
export interface EngineInitPayload { caseId: string; }
export interface ActionSubmittedPayload { action: { type: string; payload: string; }; }
export interface ActionCompletedPayload { action: { type: string; payload: string; }; result: { success: boolean; message: string; }; }
export interface StateChangedPayload { state: { phase: string; patientState: string; }; }
export interface PhaseChangedPayload { from: string; to: string; }
export interface PatientStateChangedPayload { from: string; to: string; }
export interface HistoryResponsePayload { key: string; query: string; }
export interface ExamFindingPayload { key: string; finding: string; }
export interface InvestigationResultPayload { key: string; result: string; isLab: boolean; }
export interface DiagnosisPayload { submitted: string; correct?: string; }
export interface TreatmentPayload { plan: string; }
export interface ScorePayload { score: number; grade: string; passed: boolean; }
export interface CaseCompletedPayload { score: number; grade: string; totalActions: number; }

// ──── Event Schema Map ────
export interface EventSchemas {
  [EventType.ENGINE_INITIALIZED]: EngineInitPayload;
  [EventType.ENGINE_RESET]: undefined;
  [EventType.PLUGIN_REGISTERED]: { plugin: string; };
  [EventType.PLUGIN_UNREGISTERED]: { plugin: string; };
  [EventType.ACTION_SUBMITTED]: ActionSubmittedPayload;
  [EventType.ACTION_COMPLETED]: ActionCompletedPayload;
  [EventType.ACTION_REJECTED]: { reason: string; };
  [EventType.STATE_CHANGED]: StateChangedPayload;
  [EventType.PHASE_CHANGED]: PhaseChangedPayload;
  [EventType.PATIENT_STATE_CHANGED]: PatientStateChangedPayload;
  [EventType.HISTORY_RESPONSE]: HistoryResponsePayload;
  [EventType.EXAM_FINDING]: ExamFindingPayload;
  [EventType.INVESTIGATION_RESULT]: InvestigationResultPayload;
  [EventType.CORRECT_DIAGNOSIS]: DiagnosisPayload;
  [EventType.INCORRECT_DIAGNOSIS]: DiagnosisPayload;
  [EventType.PARTIAL_DIAGNOSIS]: DiagnosisPayload;
  [EventType.TREATMENT_SUBMITTED]: TreatmentPayload;
  [EventType.SCORE_CALCULATED]: ScorePayload;
  [EventType.CASE_COMPLETED]: CaseCompletedPayload;
}

// ──── Event Registry ────
export const EVENT_SCHEMAS: EventSchemas = {} as EventSchemas;

export function isValidEventType(type: string): type is EventType {
  return Object.values(EventType).includes(type as EventType);
}
