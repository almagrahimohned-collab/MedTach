// ============================================
// Content Contract Validator
// ============================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CaseContract {
  id: string;
  specialty: string;
  difficulty: string;
  title: string;
  patient: { age: number; gender: string; name?: string };
  chief_complaint: string;
  vitals?: Record<string, string>;
  physical_exam?: Record<string, string>;
  hidden_data?: Record<string, string>;
  correct_diagnosis: string;
  differential_diagnoses: string[];
  key_learning_points: string[];
  patient_responses: Record<string, string>;
  hints: Record<string, string>;
}

const REQUIRED_FIELDS = [
  'id', 'specialty', 'difficulty', 'title',
  'patient', 'chief_complaint', 'correct_diagnosis',
  'differential_diagnoses', 'key_learning_points',
  'patient_responses', 'hints'
];

const VALID_SPECIALTIES = [
  'cardiology', 'pulmonology', 'neurology', 'endocrinology',
  'gastroenterology', 'nephrology', 'hematology', 'infectious',
  'dermatology', 'gynecology', 'pediatrics', 'surgery',
  'rheumatology', 'psychiatry'
];

const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

export function validateCase(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Data is not an object'], warnings: [] };
  }

  const caseData = data as Record<string, unknown>;

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in caseData)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate specialty
  if (caseData.specialty && !VALID_SPECIALTIES.includes(caseData.specialty as string)) {
    errors.push(`Invalid specialty: ${caseData.specialty}`);
  }

  // Validate difficulty
  if (caseData.difficulty && !VALID_DIFFICULTIES.includes(caseData.difficulty as string)) {
    errors.push(`Invalid difficulty: ${caseData.difficulty}`);
  }

  // Validate patient
  if (caseData.patient && typeof caseData.patient === 'object') {
    const patient = caseData.patient as Record<string, unknown>;
    if (!patient.age || (patient.age as number) < 0 || (patient.age as number) > 120) {
      errors.push('Patient age must be between 0-120');
    }
    if (!patient.gender || !['M', 'F', 'male', 'female'].includes(patient.gender as string)) {
      errors.push('Patient gender must be M or F');
    }
  }

  // Validate differential has at least 2 items
  if (Array.isArray(caseData.differential_diagnoses) && 
      caseData.differential_diagnoses.length < 2) {
    warnings.push('Differential should have at least 2 items');
  }

  // Validate key learning points
  if (Array.isArray(caseData.key_learning_points) && 
      caseData.key_learning_points.length === 0) {
    warnings.push('No key learning points provided');
  }

  // Check vitals ranges
  if (caseData.vitals && typeof caseData.vitals === 'object') {
    const vitals = caseData.vitals as Record<string, unknown>;
    // HR range check
    if (vitals.HR && (vitals.HR as number) < 20) warnings.push('HR seems too low');
    if (vitals.HR && (vitals.HR as number) > 250) warnings.push('HR seems too high');
    // SpO2 range check
    if (vitals.SpO2 && (vitals.SpO2 as number) < 50) errors.push('SpO2 impossibly low');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateCaseFile(path: string): ValidationResult {
  try {
    const fs = require('fs');
    const content = fs.readFileSync(path, 'utf8');
    const data = JSON.parse(content);
    return validateCase(data);
  } catch (err: any) {
    return {
      valid: false,
      errors: [`Failed to parse file: ${err.message}`],
      warnings: []
    };
  }
}

export default validateCase;
