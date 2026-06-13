// ==================== CORE TYPES ====================

export type Gender = 'male' | 'female';
export type PatientPriority = 'critical' | 'urgent' | 'stable';
export type PatientStatus = 'waiting' | 'in-progress' | 'stable' | 'deteriorated' | 'transferred' | 'died';
export type PatientLocation = 'ER' | 'ICU' | 'Ward' | 'Observation' | 'CathLab' | 'CT' | 'Morgue';
export type Disposition = 'home' | 'observation' | 'ward' | 'icu' | 'cathlab' | 'morgue' | 'transfer' | 'pending';
export type ShiftType = 'morning' | 'night' | 'weekend';
export type GameLevel = 'intern' | 'junior' | 'senior' | 'chief';
export type ActionCategory = 'clinical' | 'investigation' | 'lab' | 'imaging' | 'treatment' | 'consult' | 'diagnosis';
export type ActionStatus = 'available' | 'ordered' | 'pending' | 'completed' | 'failed';
export type InterruptionType = 'nurse' | 'lab' | 'family' | 'equipment' | 'consult' | 'code_blue';
export type InterruptionUrgency = 'high' | 'medium' | 'low';
export type SeverityLevel = 1 | 2 | 3 | 4 | 5;

// ==================== VITAL SIGNS ====================

export interface VitalSigns {
  hr: number;
  sbp: number;
  dbp: number;
  rr: number;
  spo2: number;
  temp: number;
  gcs: number;
}

// ==================== ACTION ====================

export interface Action {
  id: string;
  name: string;
  timeCost: number;
  resultTime: number;
  result?: string;
  status: ActionStatus;
  resultAt?: number;
  isEssential?: boolean;
  category?: ActionCategory;
  resourceRequired?: string;
  resourceTime?: number;
}

// ==================== PATIENT OUTCOME ====================

export interface PatientOutcomeCriteria {
  requiredForSurvival: string[];
  requiredForStability: string[];
  timeExtensionActions: string[];
}

// ==================== PATIENT ====================

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  complaint: string;
  priority: PatientPriority;
  severity: SeverityLevel;
  requiredActions: Action[];
  vitals: VitalSigns;
  deteriorationTimer: number;
  deteriorationRate: number;
  location: PatientLocation;
  bedNumber: number;
  status: PatientStatus;
  disposition: Disposition;
  correctDiagnosis: string;
  differentialDiagnoses: string[];
  outcomeCriteria: PatientOutcomeCriteria;
  xpReward: number;
  diagnosisAttempted: boolean;
  diagnosisCorrect: boolean;
  arrivalTime?: number;
  diagnosisTime?: number;
}

// ==================== INTERRUPTION ====================

export interface Interruption {
  id: string;
  type: InterruptionType;
  message: string;
  urgency: InterruptionUrgency;
  requiresResponse: boolean;
  timeCost: number;
  resolved: boolean;
  timeTrigger: number;
}

// ==================== CONSULT ====================

export interface ConsultRequest {
  id: string;
  from: string;
  patient: string;
  description: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeCost: number;
  repReward: number;
  accepted: boolean;
  completed: boolean;
  answerGiven: number | null;
}

// ==================== FATIGUE ====================

export interface FatigueState {
  mental: number;
  physical: number;
  total: number;
}

// ==================== RESOURCE STATE ====================

export interface ResourceQueueItem {
  patientId: string;
  patientName: string;
  procedureName: string;
  timeRemaining: number;
  totalTime: number;
  priority: 'stat' | 'urgent' | 'routine';
}

export interface HospitalResource {
  id: string;
  name: string;
  total: number;
  available: number;
  queue: ResourceQueueItem[];
}

export interface ResourceState {
  ctScanner: HospitalResource;
  icuBeds: HospitalResource;
  monitoredBeds: HospitalResource;
  ventilators: HospitalResource;
  labProcessing: number;
  bloodBank: number;
}

// ==================== ACHIEVEMENT ====================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  xpReward: number;
  category: 'clinical' | 'performance' | 'milestone' | 'special';
  hidden: boolean;
}

export interface AchievementState {
  achievements: Achievement[];
  totalUnlocked: number;
  totalXP: number;
}

export interface AchievementEvent {
  type: string;
  data?: any;
}

// ==================== CAREER ====================

export interface CareerStats {
  totalSTEMITreated: number;
  totalStrokesThrombolysed: number;
  totalSepsisTreated: number;
  totalPEThrombolysed: number;
  totalDissectionsDiagnosed: number;
  fastestDiagnosis: number;
  longestStreakNoDeaths: number;
  currentStreakNoDeaths: number;
  patientsSaved: number;
}

export interface CareerState {
  level: GameLevel;
  xp: number;
  xpToNextLevel: number;
  totalShifts: number;
  totalPatients: number;
  totalDeaths: number;
  mortalityRate: number;
  bestAccuracy: number;
  totalCorrectDiagnoses: number;
  diagnosticAccuracy: number;
  shiftsByType: { morning: number; night: number; weekend: number };
  stats: CareerStats;
}

export interface LevelInfo {
  level: string;
  title: string;
  xpRequired: number;
  patientLimit: number;
  description: string;
  unlocks: string[];
}

// ==================== HANDOVER ====================

export interface HandoverItem {
  patientId: string;
  patientName: string;
  diagnosis: string;
  pendingActions: string[];
  pendingResults: string[];
  status: PatientStatus;
  disposition: Disposition;
  bedNumber: number;
}

export interface HandoverState {
  items: HandoverItem[];
  quality: number;
  penalty: number;
}

// ==================== SHIFT STATE ====================

export interface ShiftState {
  timeElapsed: number;
  focus: number;
  fatigue: FatigueState;
  reputation: number;
  xp: number;
  patients: Patient[];
  consults: ConsultRequest[];
  interruptions: Interruption[];
  events: string[];
  level: GameLevel;
  shiftsCompleted: number;
  totalPatientsTreated: number;
  totalDeaths: number;
  correctDiagnoses: number;
  patientQueue: Patient[];
  shiftType: ShiftType;
  resources: ResourceState;
  achievements: AchievementState;
  career: CareerState;
  achievementEvents: AchievementEvent[];
  handover: HandoverState;
  shiftStartTime: number;
  paused: boolean;
  gameSpeed: 1 | 2;
}

// ==================== SHIFT RESULT ====================

export interface ShiftResult {
  survived: number;
  died: number;
  consultsAnswered: number;
  consultsCorrect: number;
  xpEarned: number;
  accuracy: number;
  diagnosticAccuracy: number;
  avgDiagnosisTime: number;
  achievementsUnlocked: string[];
  levelUp: boolean;
  newLevel: string | null;
  careerProgress: number;
  interruptionsHandled: number;
  handoverQuality: number;
  handoverPenalty: number;
}
