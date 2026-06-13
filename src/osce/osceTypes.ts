// osceTypes.ts - OSCE Module Type Definitions
// Created: 2026-06-11
// Updated: 2026-06-11 - Complete type system for OSCE 2.0

// ============================================================
// STATION TYPES
// ============================================================

export type StationType = 'history' | 'examination' | 'diagnosis' | 'communication' | 'procedure' | 'combined';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type Specialty = 'cardiology' | 'pulmonology' | 'gastroenterology' | 'neurology' | 'endocrinology' | 'nephrology' | 'hematology' | 'rheumatology' | 'infectious' | 'internal_medicine';

// ============================================================
// PATIENT
// ============================================================

export interface PatientData {
  name: string;
  age: number;
  gender: 'male' | 'female';
  occupation?: string;
  appearance?: string;
}

// ============================================================
// DOOR INSTRUCTIONS (Pre-Station)
// ============================================================

export interface DoorInstructions {
  setting: string;           // ED, Ward, Clinic, ICU
  scenario: string;          // Brief clinical scenario
  task: string;              // What student must do
  vitals_given?: string;     // Vitals provided on door
}

// ============================================================
// HISTORY TAKING
// ============================================================

export interface QuestionMapEntry {
  keywords: string[];        // Keywords to match student's question
  response: string;          // Patient's scripted response
}

export interface HistoryData {
  openingStatement: string;  // What patient says when student enters
  questionMap: Record<string, QuestionMapEntry>;
}

// ============================================================
// PHYSICAL EXAMINATION
// ============================================================

export interface ExaminationStep {
  inspection?: string;
  palpation?: string;
  percussion?: string;
  auscultation?: string;
  special?: string;
}

export interface ExaminationSystem extends ExaminationStep {
  required: boolean;
}

export interface ExaminationData {
  systems: Record<string, ExaminationSystem>;
  correctSequenceBonus?: string[];
  handHygieneBonus?: boolean;
  introductionBonus?: boolean;
}

// ============================================================
// INVESTIGATIONS
// ============================================================

export interface Investigation {
  name: string;
  category: 'cardiac' | 'imaging' | 'hematology' | 'chemistry' | 'microbiology' | 'other';
  finding: string;           // Result shown to student
  timeToResult: number;      // Minutes (0 = immediate)
}

export interface InvestigationsData {
  available: Record<string, Investigation>;
  critical_investigations: string[];     // Must order these
  useful_investigations: string[];       // Good to order
  unnecessary_investigations: string[];  // Points deduction?
  dangerous_investigations: string[];    // Critical error
}

// ============================================================
// DIAGNOSIS
// ============================================================

export interface DifferentialDiagnosis {
  diagnosis: string;
  priority: number;          // 1=primary, 2,3,4,5
  points: number;            // Points awarded if listed
}

export interface DiagnosisData {
  primary: string;
  acceptedAnswers: string[];
  differentials: DifferentialDiagnosis[];
}

// ============================================================
// MANAGEMENT
// ============================================================

export interface ManagementData {
  immediate: string[];       // Emergency management
  monitoring: string[];      // Monitoring plan
  longTerm: string[];        // Long-term management
}

// ============================================================
// CHECKLIST (OSCE Marking Scheme)
// ============================================================

export interface ChecklistItem {
  id: string;
  description: string;
  points: number;
  required: boolean;
  critical?: boolean;        // If missed = automatic fail?
}

export interface ChecklistDomain {
  weight: number;            // Percentage of total score
  items: ChecklistItem[];
}

export interface ChecklistData {
  history: ChecklistDomain;
  examination: ChecklistDomain;
  investigations: ChecklistDomain;
  diagnosis: ChecklistDomain;
  management: ChecklistDomain;
}

// ============================================================
// SCORING
// ============================================================

export interface ScoringConfig {
  passThreshold: number;       // Minimum % to pass
  goodThreshold: number;       // Minimum % for "good"
  excellentThreshold: number;  // Minimum % for "excellent"
  globalRating: {
    fail: string;
    borderline: string;
    pass: string;
    good: string;
    excellent: string;
  };
}

// ============================================================
// PROFESSIONAL BEHAVIOUR
// ============================================================

export interface ProfessionalBehaviour {
  bonusItems: string[];
  penaltyItems: string[];
}

// ============================================================
// COMPLETE STATION (matches JSON file)
// ============================================================

export interface OSCEStation {
  id: string;
  title: string;
  specialty: Specialty;
  difficulty: DifficultyLevel;
  type: StationType;
  timeLimit: number;         // Minutes for station
  readingTime: number;       // Minutes outside door
  
  doorInstructions: DoorInstructions;
  patient: PatientData;
  history: HistoryData;
  examination: ExaminationData;
  investigations: InvestigationsData;
  diagnosis: DiagnosisData;
  management: ManagementData;
  checklist: ChecklistData;
  scoring: ScoringConfig;
  professionalBehaviour: ProfessionalBehaviour;
}

// ============================================================
// STATION STATE (Runtime)
// ============================================================

export type StationPhase = 
  | 'door'           // Reading instructions outside
  | 'introduction'   // First entering, meeting patient
  | 'history'        // Taking history
  | 'examination'    // Performing exam
  | 'investigations' // Ordering/reviewing tests
  | 'diagnosis'      // Formulating diagnosis
  | 'management'     // Planning management
  | 'complete';      // Station finished

export interface AskedQuestion {
  question: string;
  answer: string;
  matchedKey?: string;
  timestamp: number;
}

export interface PerformedExamination {
  systemId: string;
  step: string;              // inspection, palpation, etc.
  finding: string;
  timestamp: number;
}

export interface OrderedInvestigation {
  testId: string;
  testName: string;
  finding: string;
  timestamp: number;
}

export interface StudentDiagnosis {
  primary: string;
  differentials: string[];
}

export interface StudentManagement {
  immediate: string[];
  monitoring: string[];
  longTerm: string[];
}

export interface StationState {
  stationId: string;
  phase: StationPhase;
  timeRemaining: number;
  questionsAsked: AskedQuestion[];
  examinationsPerformed: PerformedExamination[];
  investigationsOrdered: OrderedInvestigation[];
  diagnosis?: StudentDiagnosis;
  management?: StudentManagement;
  professionalBonuses: string[];
  professionalPenalties: string[];
  startedAt: number;
  completedAt?: number;
}

// ============================================================
// STATION RESULT (Scoring Output)
// ============================================================

export interface DomainScore {
  domain: string;
  earned: number;
  maximum: number;
  percentage: number;
  itemsCorrect: string[];
  itemsMissed: string[];
  itemsPartial?: string[];
  weight: number;
}

export interface StationResult {
  stationId: string;
  stationTitle: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  globalRating: 'fail' | 'borderline' | 'pass' | 'good' | 'excellent';
  domainScores: DomainScore[];
  bonuses: string[];
  penalties: string[];
  timeTaken: number;
  timeAllocated: number;
  criticalItemsMissed: string[];
  feedback: string;
  completedAt: number;
}

// ============================================================
// CIRCUIT (Multiple Stations)
// ============================================================

export interface CircuitConfig {
  id: string;
  name: string;
  description: string;
  specialty: Specialty;
  difficulty: DifficultyLevel;
  stations: string[];          // Station IDs
  restStationEvery: number;    // e.g., every 4th station is rest
  restStationDuration: number; // Minutes
  totalTime: number;           // Calculated
  passThreshold: number;
}

export interface CircuitState {
  circuitId: string;
  currentStationIndex: number;
  stationStates: StationState[];
  stationResults: StationResult[];
  isRestStation: boolean;
  restTimeRemaining: number;
  circuitStartedAt: number;
  circuitCompletedAt?: number;
}

export interface CircuitResult {
  circuitId: string;
  circuitName: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  globalRating: string;
  stationResults: StationResult[];
  completedAt: number;
  timeTaken: number;
}

// ============================================================
// OSCE INDEX (Master File)
// ============================================================

export interface OSCEIndexStation {
  id: string;
  title: string;
  specialty: Specialty;
  difficulty: DifficultyLevel;
  type: StationType;
  timeLimit: number;
  filename: string;
}

export interface OSCEIndex {
  version: string;
  last_updated: string;
  total_stations: number;
  stations: OSCEIndexStation[];
  circuits: CircuitConfig[];
}

// ============================================================
// ENUMS & CONSTANTS
// ============================================================

export const STATION_PHASES: StationPhase[] = [
  'door',
  'introduction', 
  'history',
  'examination',
  'investigations',
  'diagnosis',
  'management',
  'complete'
];

export const DOMAIN_NAMES = [
  'history',
  'examination', 
  'investigations',
  'diagnosis',
  'management'
] as const;

export type DomainName = typeof DOMAIN_NAMES[number];

export const GLOBAL_RATINGS = ['fail', 'borderline', 'pass', 'good', 'excellent'] as const;
export type GlobalRating = typeof GLOBAL_RATINGS[number];

export const EXAMINATION_SEQUENCE = [
  'inspection',
  'palpation', 
  'percussion', 
  'auscultation'
] as const;

export const EXAMINATION_SYSTEMS = [
  'general',
  'cardiovascular',
  'respiratory',
  'abdominal',
  'neurological',
  'extremities'
] as const;
