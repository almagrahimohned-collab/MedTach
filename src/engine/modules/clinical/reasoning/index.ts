// ============================================
// Clinical Reasoning — Public API
// ============================================

export { HypothesisTracker } from './HypothesisTracker';
export { ClinicalOntology, matchDiagnosis, diagnosesMatch } from './ClinicalOntology';
export { ClinicalReasoningEngine, EVIDENCE_LIBRARY } from './ClinicalReasoningEngine';
export { DiagnosticPath } from './DiagnosticPath';

export type { Hypothesis } from './HypothesisTracker';
export type { EvidenceItem } from './ClinicalReasoningEngine';
export type { DiagnosticStep } from './DiagnosticPath';
