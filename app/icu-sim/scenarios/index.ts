import { Scenario } from './types';
import { septicShockScenario } from './septicShock';
import { dkaScenario } from './dka';

// ========== جميع السيناريوهات ==========
export const ALL_SCENARIOS: Scenario[] = [
  septicShockScenario,
  dkaScenario,
];

// ========== وصف السيناريو للـ UI ==========
export interface ScenarioMeta {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  description: string;
  color: string;
  xpReward: number;
  coinsReward: number;
  learningObjectives: string[];
  locked?: boolean;
  requiredScenario?: string;
}

// ========== بيانات العرض للسيناريوهات ==========

export const SCENARIOS_META: ScenarioMeta[] = [
  {
    id: 'septic_shock',
    title: 'Septic Shock',
    subtitle: 'Pneumonia → Sepsis',
    icon: 'bug',
    difficulty: 'Medium',
    duration: '6h virtual',
    description: '65M with CAP, hypotensive, febrile. Stabilize within 6 hours.',
    color: '#EF4444',
    xpReward: 500,
    coinsReward: 100,
    learningObjectives: [
      'Early antibiotic administration',
      'Fluid resuscitation 30mL/kg',
      'Vasopressor initiation',
      'Lactate clearance monitoring',
    ],
    locked: false,
  },
  {
    id: 'dka',
    title: 'DKA',
    subtitle: 'Diabetic Ketoacidosis',
    icon: 'water',
    difficulty: 'Medium',
    duration: '6h virtual',
    description: '22F with DM1, vomiting, Kussmaul breathing. Close the anion gap.',
    color: '#8B5CF6',
    xpReward: 600,
    coinsReward: 150,
    learningObjectives: [
      'Fluid resuscitation protocol',
      'Insulin infusion management',
      'Potassium monitoring',
      'Anion gap calculation',
    ],
    locked: true,
    requiredScenario: 'septic_shock',
  },
  {
    id: 'cardiogenic_shock',
    title: 'Cardiogenic Shock',
    subtitle: 'Anterior STEMI',
    icon: 'heart',
    difficulty: 'Hard',
    duration: '6h virtual',
    description: '58M post-PCI, hypotensive, cold extremities. Manage cardiogenic shock.',
    color: '#F59E0B',
    xpReward: 800,
    coinsReward: 200,
    learningObjectives: [
      'Inotrope management',
      'Fluid balance in cardiogenic shock',
      'Afterload reduction',
      'Mechanical support consideration',
    ],
    locked: true,
    requiredScenario: 'septic_shock',
  },
  {
    id: 'anaphylaxis',
    title: 'Anaphylactic Shock',
    subtitle: 'Antibiotic Reaction',
    icon: 'flash',
    difficulty: 'Easy',
    duration: '4h virtual',
    description: '45F post-ceftriaxone, stridor, urticaria. Rapid recognition needed.',
    color: '#EC4899',
    xpReward: 400,
    coinsReward: 80,
    learningObjectives: [
      'IM Epinephrine first-line',
      'Airway management',
      'Fluid resuscitation',
      'Adjunctive therapies',
    ],
    locked: false,
  },
  {
    id: 'hyperkalemia',
    title: 'Hyperkalemia',
    subtitle: 'Cardiac Arrest Risk',
    icon: 'pulse',
    difficulty: 'Medium',
    duration: '4h virtual',
    description: '70M CKD5, missed dialysis, peaked T-waves. Stabilize potassium.',
    color: '#F97316',
    xpReward: 600,
    coinsReward: 150,
    learningObjectives: [
      'ECG recognition of hyperkalemia',
      'Calcium gluconate stabilization',
      'Potassium shifting strategies',
      'Definitive elimination',
    ],
    locked: true,
    requiredScenario: 'septic_shock',
  },
];

// ========== دوال المساعدة ==========
export function getScenarioById(id: string): Scenario | undefined {
  return ALL_SCENARIOS.find(s => s.id === id);
}

export function getScenarioMeta(id: string): ScenarioMeta | undefined {
  return SCENARIOS_META.find(s => s.id === id);
}

// ========== تصدير للاستخدام في ICUSimulator ==========
export interface ScenarioData {
  meta: ScenarioMeta;
  scenario: Scenario;
}

export function getScenarioData(id: string): ScenarioData | undefined {
  const meta = getScenarioMeta(id);
  const scenario = getScenarioById(id);
  if (!meta || !scenario) return undefined;
  return { meta, scenario };
}

// Backward compatibility alias
export const SCENARIOS = SCENARIOS_META;

// ========== Cardiogenic Shock Meta ==========
export const cardiogenicShockMeta: ScenarioMeta = {
  id: 'cardiogenic_shock',
  title: 'Cardiogenic Shock',
  subtitle: 'Anterior STEMI',
  icon: 'heart',
  difficulty: 'Hard',
  duration: '6h virtual',
  description: '58M post-PCI, hypotensive, cold extremities. Manage cardiogenic shock.',
  color: '#F59E0B',
  xpReward: 800,
  coinsReward: 200,
  learningObjectives: [
    'Inotrope management',
    'Fluid balance in cardiogenic shock',
    'Afterload reduction',
    'Mechanical support consideration',
  ],
  locked: true,
  requiredScenario: 'septic_shock',
};
