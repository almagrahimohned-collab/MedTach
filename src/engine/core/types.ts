// ============================================
// FROZEN CORE CONTRACT v1.0
// DO NOT MODIFY — All modules depend on this
// ============================================

export type PatientSex = 'M' | 'F';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type CasePhase = 'history' | 'examination' | 'investigations' | 'diagnosis' | 'treatment' | 'complete';

export interface VitalSigns {
  bp: string; hr: number; rr: number; spo2: number; temp: number;
}

export interface Patient {
  age: number; sex: PatientSex; name?: string; persona?: string;
}

export interface Action {
  id: string;
  type: 'history' | 'exam' | 'lab' | 'imaging' | 'diagnosis' | 'treatment' | 'command';
  payload: string;
  timestamp: number;
}

export interface ActionResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  stateChanges?: Partial<EngineState>;
  events?: EngineEvent[];
}

export interface EngineState {
  phase: CasePhase;
  patientState: string;
  vitals: VitalSigns;
  revealedData: string[];
  actions: Action[];
  messages: Array<{ role: string; content: string }>;
  score: number;
  timeElapsed: number;
}

export interface EngineEvent {
  type: string;
  payload?: unknown;
  timestamp: number;
}

export interface EnginePlugin {
  name: string;
  version: string;
  metadata: { name: string; version: string; description?: string };
  canHandle(action: Action): boolean;
  handle(action: Action, context: any): Promise<ActionResult>;
  onRegister?(): void;
  onUnregister?(): void;
  onReset?(): void;
}

// Helper: Convert revealedData Array to Set for O(1) lookup
export function getRevealedSet(state: EngineState): Set<string> {
  return new Set(state.revealedData || []);
}

// Helper: Add item to revealedData (immutable)
export function addRevealed(state: EngineState, item: string): string[] {
  if (state.revealedData.includes(item)) return state.revealedData;
  return [...state.revealedData, item];
}
