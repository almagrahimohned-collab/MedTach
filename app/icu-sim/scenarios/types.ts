// ========== تعريف موحد للعلامات الحيوية الأولية ==========
export interface InitialVitals {
  hr: number;
  bp: { systolic: number; diastolic: number };
  spo2: number;
  rr: number;
  temp: number;
  cvp?: number;
  lactate: number;
  urineOutput: number;
  gcs?: number;
  etco2?: number;
  // ABG parameters
  ph?: number;
  pao2?: number;
  paco2?: number;
  hco3?: number;
  baseExcess?: number;
}

// ========== شروط الفوز ==========
export interface WinConditions {
  mapAbove?: number;
  lactateBelow?: number;
  spo2Above?: number;
  urineOutputAbove?: number;
  heartRateBelow?: number;
  heartRateAbove?: number;
  tempBelow?: number;
  phAbove?: number;
  phBelow?: number;
  potassiumBelow?: number;
  potassiumAbove?: number;
  glucoseBelow?: number;
  // شرط مخصص
  customCheck?: (state: any) => boolean;
}

// ========== شروط الخسارة ==========
export interface LoseConditions {
  mapBelow?: number;
  spo2Below?: number;
  lactateAbove?: number;
  heartRateBelow?: number;
  heartRateAbove?: number;
  phBelow?: number;
  potassiumAbove?: number;
  glucoseAbove?: number;
  // شرط مخصص
  customCheck?: (state: any) => boolean;
}

// ========== السيناريو الكامل ==========
export interface Scenario {
  id: string;
  title: string;
  patient: {
    name: string;
    age: number;
    gender: 'male' | 'female';
    weight: number;
    bed?: string;
  };
  diagnosis: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  durationMinutes: number; // مدة المحاكاة الافتراضية
  initialStatus: 'critical' | 'deteriorating';
  
  initialVitals: InitialVitals;

  goals: string[];

  winConditions: WinConditions;
  loseConditions: LoseConditions;

  hiddenLabs?: Record<string, string>;
  
  // أدوية مسموحة (إذا فارغ = الكل مسموح)
  allowedMedications?: string[];
  
  // أدوية ممنوعة
  restrictedMedications?: string[];

  // أحداث خاصة بالسيناريو
  timedEvents?: {
    simTime: number;
    event: string;
    vitalsChange?: Partial<InitialVitals>;
  }[];

  // تلميحات تعليمية
  hints?: {
    simTime: number;
    text: string;
  }[];
}

// ========== دالة مساعدة: فحص شروط الفوز ==========
export function checkWinConditions(conditions: WinConditions, state: any): boolean {
  const v = state.vitals;
  
  const checks: boolean[] = [];
  
  if (conditions.mapAbove !== undefined) checks.push(v.map > conditions.mapAbove);
  if (conditions.lactateBelow !== undefined) checks.push(v.lactate < conditions.lactateBelow);
  if (conditions.spo2Above !== undefined) checks.push(v.spo2 > conditions.spo2Above);
  if (conditions.urineOutputAbove !== undefined) checks.push(v.urineOutput > conditions.urineOutputAbove);
  if (conditions.heartRateBelow !== undefined) checks.push(v.hr < conditions.heartRateBelow);
  if (conditions.heartRateAbove !== undefined) checks.push(v.hr > conditions.heartRateAbove);
  if (conditions.tempBelow !== undefined) checks.push(v.temp < conditions.tempBelow);
  if (conditions.phAbove !== undefined) checks.push(v.ph > conditions.phAbove);
  if (conditions.phBelow !== undefined) checks.push(v.ph < conditions.phBelow);
  if (conditions.potassiumBelow !== undefined) checks.push(false); // يحتاج lab results
  if (conditions.glucoseBelow !== undefined) checks.push(false); // يحتاج lab results
  if (conditions.customCheck) checks.push(conditions.customCheck(state));
  
  return checks.length > 0 && checks.every(c => c === true);
}

// ========== دالة مساعدة: فحص شروط الخسارة ==========
export function checkLoseConditions(conditions: LoseConditions, state: any): boolean {
  const v = state.vitals;
  
  if (conditions.mapBelow !== undefined && v.map < conditions.mapBelow) return true;
  if (conditions.spo2Below !== undefined && v.spo2 < conditions.spo2Below) return true;
  if (conditions.lactateAbove !== undefined && v.lactate > conditions.lactateAbove) return true;
  if (conditions.heartRateBelow !== undefined && v.hr < conditions.heartRateBelow) return true;
  if (conditions.heartRateAbove !== undefined && v.hr > conditions.heartRateAbove) return true;
  if (conditions.phBelow !== undefined && v.ph < conditions.phBelow) return true;
  if (conditions.potassiumAbove !== undefined) return false; // يحتاج lab
  if (conditions.glucoseAbove !== undefined) return false; // يحتاج lab
  if (conditions.customCheck) return conditions.customCheck(state);
  
  return false;
}
