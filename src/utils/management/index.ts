// 🏥 Management Hints - Master Index
// Evidence-Based: Tintinalli's Emergency Medicine, Medscape, Davidson's

import { CARDIOLOGY_HINTS } from './cardiology';
import { PULMONOLOGY_HINTS } from './pulmonology';
import { NEUROLOGY_HINTS } from './neurology';
import { ENDOCRINOLOGY_HINTS } from './endocrinology';
import { GASTROENTEROLOGY_HINTS } from './gastroenterology';
import { NEPHROLOGY_HINTS } from './nephrology';
import { INFECTIOUS_HINTS } from './infectious';
import { HEMATOLOGY_HINTS } from './hematology';
import { RHEUMATOLOGY_HINTS } from './rheumatology';
import { DERMATOLOGY_HINTS } from './dermatology';
import { PEDIATRICS_HINTS } from './pediatrics';
import { SURGERY_HINTS } from './surgery';
import { GYNECOLOGY_HINTS } from './gynecology';

export const MANAGEMENT_HINTS: Record<string, string> = {
  ...CARDIOLOGY_HINTS,
  ...PULMONOLOGY_HINTS,
  ...NEUROLOGY_HINTS,
  ...ENDOCRINOLOGY_HINTS,
  ...GASTROENTEROLOGY_HINTS,
  ...NEPHROLOGY_HINTS,
  ...INFECTIOUS_HINTS,
  ...HEMATOLOGY_HINTS,
  ...RHEUMATOLOGY_HINTS,
  ...DERMATOLOGY_HINTS,
  ...PEDIATRICS_HINTS,
  ...SURGERY_HINTS,
  ...GYNECOLOGY_HINTS,
};

// Helper: search hint by diagnosis keyword
export function getManagementHint(diagnosis: string): string {
  const key = Object.keys(MANAGEMENT_HINTS).find(k => 
    diagnosis.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(diagnosis.toLowerCase())
  );
  
  if (key) return MANAGEMENT_HINTS[key];
  
  // Fallback: general management advice
  return `**General Management Approach:**\n\n` +
    `1. Stabilize ABCs (Airway, Breathing, Circulation)\n` +
    `2. Obtain appropriate investigations based on clinical presentation\n` +
    `3. Initiate empiric treatment while awaiting confirmatory results\n` +
    `4. Consult relevant specialty services\n` +
    `5. Determine disposition: Outpatient vs Inpatient vs ICU\n\n` +
    `*Reference: Davidson's Principles & Practice of Medicine*`;
}
