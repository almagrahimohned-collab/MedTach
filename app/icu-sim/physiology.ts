import { checkWinConditions, checkLoseConditions } from './scenarios/types';

export interface VitalSigns {
  hr: number; bp: { systolic: number; diastolic: number }; map: number;
  spo2: number; rr: number; temp: number; cvp: number;
  urineOutput: number; lactate: number; gcs: number; etco2: number;
  ph: number; pao2: number; paco2: number; hco3: number; baseExcess: number;
  anionGap?: number; ketones?: number; glucose?: number; potassium?: number;
}

export interface PatientState {
  vitals: VitalSigns;
  simTime: number;
  status: 'critical' | 'improving' | 'deteriorating' | 'dead' | 'survived';
  events: string[];
  activeOrders: ActiveOrder[];
  labResults: LabResult[];
  procedures: Procedure[];
  goals?: string[];
  winConditions?: { description: string; check: (state: PatientState) => boolean } | null;
  loseConditions?: { description: string; check: (state: PatientState) => boolean } | null;
}

export interface ActiveOrder {
  id: string;
  name: string;
  category: string;
  dose: string;
  startSimTime: number;
  type: 'bolus' | 'infusion' | 'intermittent' | 'procedure';
  running: boolean;
}

export interface LabResult {
  id: string;
  name: string;
  value: string;
  simTime: number;
}

export interface Procedure {
  id: string;
  name: string;
  category: string;
  simTime: number;
  effect: string;
}

export function calculateMAP(sys: number, dia: number): number {
  return Math.round(dia + (sys - dia) / 3);
}

export function getInitialVitals(): VitalSigns {
  return {
    hr: 120, bp: { systolic: 85, diastolic: 50 }, map: 62,
    spo2: 89, rr: 28, temp: 39.2, cvp: 3,
    urineOutput: 10, lactate: 5.8, gcs: 14, etco2: 28,
    ph: 7.22, pao2: 68, paco2: 32, hco3: 14, baseExcess: -8,
  };
}

export function getInitialState(): PatientState {
  return {
    vitals: getInitialVitals(),
    simTime: 0,
    status: 'critical',
    events: ['Patient admitted to ICU with septic shock.'],
    activeOrders: [],
    labResults: [],
    procedures: [],
  };
}

export function getInitialStateFromScenario(scenarioData?: any): PatientState {
  if (!scenarioData || !scenarioData.initialVitals) {
    return getInitialState();
  }
  const v = scenarioData.initialVitals;
  return {
    vitals: {
      hr: v.hr ?? 80,
      bp: { systolic: v.bp?.systolic ?? 120, diastolic: v.bp?.diastolic ?? 80 },
      map: v.bp ? calculateMAP(v.bp.systolic, v.bp.diastolic) : 93,
      spo2: v.spo2 ?? 98, rr: v.rr ?? 16, temp: v.temp ?? 37,
      cvp: v.cvp ?? 5, urineOutput: v.urineOutput ?? 30,
      lactate: v.lactate ?? 1.5, gcs: v.gcs ?? 15, etco2: v.etco2 ?? 35,
      ph: v.ph ?? 7.4, pao2: v.pao2 ?? 95, paco2: v.paco2 ?? 40,
      hco3: v.hco3 ?? 24, baseExcess: v.baseExcess ?? 0,
      anionGap: v.anionGap, ketones: v.ketones, glucose: v.glucose, potassium: v.potassium,
    },
    simTime: 0,
    status: scenarioData.initialStatus ?? 'critical',
    events: [scenarioData.description || 'Patient admitted to ICU.'],
    activeOrders: [], labResults: [], procedures: [],
    goals: scenarioData.goals || [],
    winConditions: scenarioData.winConditions ? {
      description: 'Patient stabilized',
      check: (state: PatientState) => checkWinConditions(scenarioData.winConditions, state)
    } : null,
    loseConditions: scenarioData.loseConditions ? {
      description: 'Patient expired',
      check: (state: PatientState) => checkLoseConditions(scenarioData.loseConditions, state)
    } : null,
  };
}

import { getEngineForScenario } from './scenarios/engines/engineRegistry';

export function updatePhysiology(state: PatientState): PatientState {
  const scenarioId = (state as any)._scenarioId || 'default';
  const engine = getEngineForScenario(scenarioId);
  return engine.update({ state, scenario: (state as any)._scenario, simTime: state.simTime });
}
