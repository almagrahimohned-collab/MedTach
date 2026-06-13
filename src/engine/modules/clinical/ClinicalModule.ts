// ============================================
// Clinical Cases Module — Registration
// ============================================

import ModuleRegistry from '../ModuleRegistry';
import { HistoryPlugin } from './plugins/HistoryPlugin';
import { ExaminationPlugin } from './plugins/ExaminationPlugin';
import { InvestigationPlugin } from './plugins/InvestigationPlugin';
import { DiagnosisPlugin } from './plugins/DiagnosisPlugin';
import { TreatmentPlugin } from './plugins/TreatmentPlugin';
import { ClinicalScoringPlugin } from './scoring/ClinicalScoringPlugin';

export function registerClinicalModule(): void {
  const registry = ModuleRegistry.getInstance();

  registry.register({
    name: 'clinical',
    version: '1.0.0',
    description: 'Clinical Cases — Diagnostic Simulation',
    plugins: [
      new HistoryPlugin(),
      new ExaminationPlugin(),
      new InvestigationPlugin(),
      new DiagnosisPlugin(),
      new TreatmentPlugin(),
    ],
    scoringPlugin: new ClinicalScoringPlugin(),
    enabled: true,
  });

  console.log('[ClinicalModule] Registered successfully');
}

export default registerClinicalModule;
