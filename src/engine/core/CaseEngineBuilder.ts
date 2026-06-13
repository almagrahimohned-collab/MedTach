import Kernel from './Kernel';
import { HistoryPlugin } from '../plugins/actions/HistoryPlugin';
import { ExaminationPlugin } from '../plugins/actions/ExaminationPlugin';
import { InvestigationPlugin } from '../plugins/actions/InvestigationPlugin';
import { DiagnosisPlugin } from '../plugins/actions/DiagnosisPlugin';
import { TreatmentPlugin } from '../plugins/actions/TreatmentPlugin';
import { ClinicalScoringPlugin } from '../plugins/scoring/ClinicalScoringPlugin';
import { MedicalCase } from '../../content/ContentRepository';

export interface BuiltEngine {
  kernel: Kernel;
  plugins: {
    history: HistoryPlugin;
    exam: ExaminationPlugin;
    investigation: InvestigationPlugin;
    diagnosis: DiagnosisPlugin;
    treatment: TreatmentPlugin;
    scoring: ClinicalScoringPlugin;
  };
}

export function buildCaseEngine(caseData: MedicalCase): BuiltEngine {
  if (!caseData || !caseData.id || !caseData.patient_responses || !caseData.correct_diagnosis) {
    throw new Error("Invalid case data: missing required fields");
  }
  // Validate required fields
  if (!caseData) throw new Error('Case data is required');
  if (!caseData.id) throw new Error('Case ID is required');
  if (!caseData.patient_responses) throw new Error('Patient responses required');
  if (!caseData.correct_diagnosis) throw new Error('Correct diagnosis required');

  // Create kernel
  const kernel = new Kernel({
    vitals: (caseData.vitals ? parseVitals(caseData.vitals) : undefined) as any,
    messages: [{
      role: 'system',
      content: `Welcome! ${caseData.patient?.age || '?'}-year-old ${caseData.patient?.gender || 'patient'} presents with: ${caseData.chief_complaint || 'a medical condition'}`
    }]
  });

  kernel.setCase(caseData);

  // Create plugins
  const historyPlugin = new HistoryPlugin();
  historyPlugin.setResponses(caseData.patient_responses || {});

  const examPlugin = new ExaminationPlugin();
  examPlugin.setFindings(caseData.physical_exam || {});

  const investigationPlugin = new InvestigationPlugin();
  const hiddenData = caseData.hidden_data || {};
  const labs: Record<string, string> = {};
  const imaging: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(hiddenData)) {
    if (key.includes('xray') || key.includes('ct') || key.includes('mri') || 
        key.includes('us') || key.includes('echo') || key.includes('ecg')) {
      imaging[key] = value;
    } else {
      labs[key] = value;
    }
  }
  investigationPlugin.setLabResults(labs);
  investigationPlugin.setImagingResults(imaging);

  const diagnosisPlugin = new DiagnosisPlugin();
  diagnosisPlugin.setCase(
    caseData.correct_diagnosis,
    caseData.differential_diagnoses || []
  );

  const treatmentPlugin = new TreatmentPlugin();
  const scoringPlugin = new ClinicalScoringPlugin();

  // Register all plugins
  kernel.use(historyPlugin);
  kernel.use(examPlugin);
  kernel.use(investigationPlugin);
  kernel.use(diagnosisPlugin);
  kernel.use(treatmentPlugin);
  kernel.use(scoringPlugin);

  return {
    kernel,
    plugins: {
      history: historyPlugin,
      exam: examPlugin,
      investigation: investigationPlugin,
      diagnosis: diagnosisPlugin,
      treatment: treatmentPlugin,
      scoring: scoringPlugin
    }
  };
}

function parseVitals(vitals: Record<string, string>): Record<string, any> {
  const parsed: Record<string, any> = {};
  for (const [key, value] of Object.entries(vitals || {})) {
    const num = parseFloat(value);
    parsed[key] = isNaN(num) ? value : num;
  }
  return parsed;
}

export default buildCaseEngine;
