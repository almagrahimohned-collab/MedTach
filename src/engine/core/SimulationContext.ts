// ============================================
// SimulationContext — Unified Read-Only Context
// ============================================

import { MedicalCase, LabReference, ImageMetadata } from '../../content/ContentRepository';

export type PatientState = 'INITIAL' | 'STABLE' | 'IMPROVING' | 'DETERIORATING' | 'CRITICAL' | 'DISCHARGED' | 'DECEASED';
export type CasePhase = 'history' | 'examination' | 'investigations' | 'diagnosis' | 'treatment' | 'complete';

export interface VitalSigns {
  bp: string;
  hr: number;
  rr: number;
  spo2: number;
  temp: number;
}

export interface Hypothesis {
  id: string;
  name: string;
  probability: number;
  supporting: string[];
  refuting: string[];
}

// Context slices — prevents "god context"
export interface PatientSlice {
  vitals: VitalSigns;
  state: PatientState;
  phase: CasePhase;
  age: number;
  sex: string;
  name?: string;
}

export interface RevealedSlice {
  history: string[];
  exam: string[];
  labs: string[];
  imaging: string[];
  all: string[];
}

export interface TimelineSlice {
  elapsed: number;
  actionCount: number;
  lastAction?: {
    type: string;
    payload: string;
    timestamp: number;
  };
}

export interface ReasoningSlice {
  hypotheses: Hypothesis[];
  topDiagnosis: string | null;
  confidence: number;
  differentialCount: number;
}

export interface ReferencesSlice {
  case: MedicalCase;
  availableLabs: string[];
  availableImaging: string[];
  labReference: LabReference[];
  imageMetadata: ImageMetadata[];
}

export interface SimulationContext {
  readonly patient: PatientSlice;
  readonly revealed: RevealedSlice;
  readonly timeline: TimelineSlice;
  readonly reasoning: ReasoningSlice;
  readonly references: ReferencesSlice;
  readonly config: {
    mode: string;
    allowHints: boolean;
    timeLimit?: number;
  };
}

export function createSimulationContext(
  caseData: MedicalCase,
  state: any,
  hypotheses: Hypothesis[] = []
): SimulationContext {
  return {
    patient: {
      vitals: state.vitals || { bp: '120/80', hr: 72, rr: 16, spo2: 98, temp: 37.0 },
      state: state.patientState || 'INITIAL',
      phase: state.phase || 'history',
      age: caseData.patient.age,
      sex: caseData.patient.gender,
      name: caseData.patient.name
    },
    revealed: {
      history: ((state.revealedData || []) as string[]).filter((k: string) => 
        Object.keys(caseData.patient_responses || {}).includes(k)
      ),
      exam: ((state.revealedData || []) as string[]).filter((k: string) => 
        Object.keys(caseData.physical_exam || {}).includes(k)
      ),
      labs: ((state.revealedData || []) as string[]).filter((k: string) => 
        !Object.keys(caseData.patient_responses || {}).includes(k) &&
        !Object.keys(caseData.physical_exam || {}).includes(k) &&
        !k.includes('xray') && !k.includes('ct') && !k.includes('mri') && 
        !k.includes('us') && !k.includes('echo') && !k.includes('ecg')
      ),
      imaging: ((state.revealedData || []) as string[]).filter((k: string) => 
        k.includes('xray') || k.includes('ct') || k.includes('mri') || 
        k.includes('us') || k.includes('echo') || k.includes('ecg')
      ),
      all: ((state.revealedData || []) as string[])
    },
    timeline: {
      elapsed: state.timeElapsed || 0,
      actionCount: (state.actions || []).length,
      lastAction: state.actions?.length > 0 ? state.actions[state.actions.length - 1] : undefined
    },
    reasoning: {
      hypotheses,
      topDiagnosis: hypotheses.length > 0 ? 
        hypotheses.sort((a: Hypothesis, b: Hypothesis) => b.probability - a.probability)[0]?.name : null,
      confidence: hypotheses.length > 0 ? 
        Math.max(...hypotheses.map((h: Hypothesis) => h.probability)) : 0,
      differentialCount: hypotheses.length
    },
    references: {
      case: caseData,
      availableLabs: Object.keys(caseData.hidden_data || {}).filter(k => 
        !k.includes('xray') && !k.includes('ct') && !k.includes('mri') && 
        !k.includes('us') && !k.includes('echo') && !k.includes('ecg')
      ),
      availableImaging: Object.keys(caseData.hidden_data || {}).filter(k => 
        k.includes('xray') || k.includes('ct') || k.includes('mri') || 
        k.includes('us') || k.includes('echo') || k.includes('ecg')
      ),
      labReference: [],
      imageMetadata: []
    },
    config: {
      mode: 'clinical',
      allowHints: true,
      timeLimit: 600
    }
  };
}
