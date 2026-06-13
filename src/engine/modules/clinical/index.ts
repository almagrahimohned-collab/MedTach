// ============================================
// Clinical Cases Module — Public API
// ============================================

export { registerClinicalModule } from './ClinicalModule';

// Plugins
export { HistoryPlugin } from './plugins/HistoryPlugin';
export { ExaminationPlugin } from './plugins/ExaminationPlugin';
export { InvestigationPlugin } from './plugins/InvestigationPlugin';
export { DiagnosisPlugin } from './plugins/DiagnosisPlugin';
export { TreatmentPlugin } from './plugins/TreatmentPlugin';

// Scoring
export { ClinicalScoringPlugin } from './scoring/ClinicalScoringPlugin';

// Reasoning
export { HypothesisTracker } from './reasoning/HypothesisTracker';
