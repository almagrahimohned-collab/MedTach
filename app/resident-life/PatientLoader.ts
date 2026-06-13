/**
 * PatientLoader.ts
 * Loads patient cases and action data from medtach-content JSON files
 */

import { Patient, Action, ShiftState, ConsultRequest } from './ShiftManager';

// Types matching JSON structure
interface JSONAction {
  id: string;
  name: string;
  category: string;
  timeCost: number;
  resultTime: number;
  isEssential: boolean;
  result: {
    finding: string;
    interpretation: string;
    normalRange?: string;
    imageRef?: string;
  };
}

interface JSONPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  complaint: string;
  triageNote: string;
  correctTriage: number;
  correctDiagnosis: string;
  differentialDiagnoses: string[];
  possibleActions: JSONAction[];
  treatmentPathway: {
    correct: string[];
    acceptable: string[];
    wrongActions: string[];
    wrongActionsConsequence: string;
    criticalErrors: { action: string; consequence: string }[];
  };
  deteriorationPattern: {
    withoutTreatment: {
      timer: number;
      stages: { time: number; event: string }[];
    };
    withPartialTreatment?: {
      timer: number;
      stages: { time: number; event: string }[];
    };
    withCorrectTreatment: {
      timer: number;
      stages: { time: number; event: string }[];
    };
  };
  learningPoints: {
    missedDiagnosis: string;
    keyTeaching: string;
    guideline: string;
  };
  difficulty: string;
  xpReward: number;
  reputationImpact: {
    correctDiagnosis: number;
    correctTreatment: number;
    [key: string]: number;
  };
}

interface JSONCaseFile {
  module: string;
  category: string;
  version: string;
  description: string;
  patients: JSONPatient[];
}

interface JSONLabResult {
  finding: string;
  interpretation: string;
  normalRange?: string;
}

interface JSONLab {
  id: string;
  name: string;
  category: string;
  normalRange: any;
  unit: string;
  turnaroundTime: number;
  cost: string;
  interpretation: Record<string, string>;
}

// Content paths - adjust for your setup
const CONTENT_BASE = '../../medtach-content/resident-life';

// Cache loaded data
let cachedPatients: Patient[] = [];
let cachedLabs: Record<string, JSONLab> = {};

/**
 * Load all patient cases from JSON files
 */
export async function loadAllPatients(): Promise<Patient[]> {
  if (cachedPatients.length > 0) return cachedPatients;

  const caseFiles = ['cardiac', 'respiratory', 'sepsis', 'neuro'];
  const allPatients: Patient[] = [];

  for (const file of caseFiles) {
    try {
      const data = await loadJSONFile(`${CONTENT_BASE}/patients/${file}.json`);
      if (data && data.patients) {
        const converted = data.patients.map((p: JSONPatient) => convertJSONPatient(p));
        allPatients.push(...converted);
      }
    } catch (error) {
      console.warn(`Could not load ${file}.json, using defaults`);
    }
  }

  // Fallback: load default patients if JSON loading fails
  if (allPatients.length === 0) {
    return getDefaultPatients();
  }

  cachedPatients = allPatients;
  return allPatients;
}

/**
 * Convert JSON patient to internal Patient type
 */
function convertJSONPatient(json: JSONPatient): Patient {
  return {
    id: json.id,
    name: json.name,
    age: json.age,
    gender: json.gender,
    complaint: json.complaint,
    priority: determinePriority(json.correctTriage),
    requiredActions: json.possibleActions.map(convertJSONAction),
    deteriorationTimer: json.deteriorationPattern.withoutTreatment.timer,
    currentState: json.triageNote,
    completedActions: [],
    status: 'waiting',
    // Store additional data for decision making
    correctDiagnosis: json.correctDiagnosis,
    treatmentPathway: json.treatmentPathway,
    deteriorationPattern: json.deteriorationPattern,
    xpReward: json.xpReward,
    reputationImpact: json.reputationImpact,
  } as Patient & ExtendedPatientData;
}

function convertJSONAction(json: JSONAction): Action {
  return {
    id: json.id,
    name: json.name,
    timeCost: json.timeCost,
    resultTime: json.resultTime,
    ordered: false,
    completed: false,
    result: json.result.finding,
    isEssential: json.isEssential,
    category: json.category,
  } as Action & ExtendedActionData;
}

function determinePriority(triageLevel: number): 'critical' | 'urgent' | 'stable' {
  if (triageLevel === 1) return 'critical';
  if (triageLevel === 2) return 'urgent';
  return 'stable';
}

/**
 * Load lab results from JSON
 */
export async function getLabResult(labId: string, context?: string): Promise<string> {
  if (Object.keys(cachedLabs).length === 0) {
    await loadLabsData();
  }

  const lab = cachedLabs[labId];
  if (!lab) return 'Lab result unavailable';

  // Select appropriate interpretation based on context
  if (context && lab.interpretation[context]) {
    return `${lab.interpretation[context]} (Normal: ${JSON.stringify(lab.normalRange)})`;
  }

  return `${lab.name}: ${JSON.stringify(lab.normalRange)}`;
}

async function loadLabsData(): Promise<void> {
  try {
    const data = await loadJSONFile(`${CONTENT_BASE}/actions/labs.json`);
    if (data && data.labs) {
      for (const category of Object.values(data.labs) as any[]) {
        for (const lab of category) {
          cachedLabs[lab.id] = lab;
        }
      }
    }
  } catch (error) {
    console.warn('Could not load labs data');
  }
}

/**
 * Get real lab values based on patient condition
 */
export function getRealLabValue(patient: Patient, actionId: string): Action {
  const action = patient.requiredActions.find(a => a.id === actionId);
  if (!action) return action!;

  // Map of real lab results based on patient condition
  const labResults: Record<string, Record<string, { finding: string; interpretation: string }>> = {
    cardiac_001: { // STEMI
      troponin: { finding: 'hs-cTnI: 12.8 ng/mL', interpretation: 'Markedly elevated - confirms myocardial necrosis (Normal <0.04)' },
      ck_mb: { finding: 'CK-MB: 85 ng/mL', interpretation: 'Elevated - consistent with MI (Normal <5)' },
    },
    cardiac_002: { // Aortic Dissection
      troponin: { finding: 'hs-cTnI: 0.8 ng/mL', interpretation: 'Mild elevation - coronary ostia involvement possible' },
    },
    resp_001: { // COPD
      abg: { finding: 'pH 7.22, pCO2 82, pO2 48, HCO3 35', interpretation: 'Severe acute-on-chronic respiratory acidosis' },
    },
    sepsis_001: { // Urosepsis
      lactate: { finding: 'Lactate: 5.8 mmol/L', interpretation: 'Severely elevated - tissue hypoperfusion (Normal <2.0)' },
      cbc: { finding: 'WBC 19.8, Plt 85', interpretation: 'Leukocytosis with thrombocytopenia - sepsis with early DIC' },
    },
  };

  const patientLabs = labResults[patient.id];
  if (patientLabs && patientLabs[actionId]) {
    return {
      ...action,
      result: `${patientLabs[actionId].finding}\n${patientLabs[actionId].interpretation}`,
      completed: action.resultTime === 0,
    };
  }

  return {
    ...action,
    completed: action.resultTime === 0,
    result: action.result || `${action.name} completed. Results as expected.`,
  };
}

/**
 * Load a JSON file (works in Expo/React Native)
 */
async function loadJSONFile(path: string): Promise<any> {
  try {
    // In Expo, use require for static JSON files
    // For dynamic loading, use fetch or FileSystem
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.json();
  } catch (error) {
    console.warn(`Error loading ${path}:`, error);
    return null;
  }
}

/**
 * Get default patients if JSON loading fails
 */
function getDefaultPatients(): Patient[] {
  return [
    {
      id: 'p1', name: 'Mr. Ahmed', age: 55, gender: 'male',
      complaint: 'Chest pain radiating to left arm for 2 hours',
      priority: 'critical',
      requiredActions: [
        { id: 'ecg', name: 'ECG', timeCost: 10, resultTime: 0, ordered: false, completed: false, result: 'ST elevation V1-V4' },
        { id: 'troponin', name: 'Troponin', timeCost: 5, resultTime: 30, ordered: false, completed: false },
        { id: 'aspirin', name: 'Aspirin 300mg', timeCost: 3, resultTime: 0, ordered: false, completed: false },
      ],
      deteriorationTimer: 20, currentState: 'Waiting', completedActions: [], status: 'waiting',
    },
    {
      id: 'p2', name: 'Mrs. Fatima', age: 65, gender: 'female',
      complaint: 'Fever 39°C, productive cough for 5 days',
      priority: 'urgent',
      requiredActions: [
        { id: 'cxr', name: 'Chest X-Ray', timeCost: 15, resultTime: 20, ordered: false, completed: false },
        { id: 'cbc', name: 'CBC', timeCost: 5, resultTime: 30, ordered: false, completed: false },
      ],
      deteriorationTimer: 30, currentState: 'Waiting', completedActions: [], status: 'waiting',
    },
  ];
}

// Extended interfaces for JSON data
export interface ExtendedPatientData {
  correctDiagnosis?: string;
  treatmentPathway?: any;
  deteriorationPattern?: any;
  xpReward?: number;
  reputationImpact?: Record<string, number>;
}

export interface ExtendedActionData {
  isEssential?: boolean;
  category?: string;
}

