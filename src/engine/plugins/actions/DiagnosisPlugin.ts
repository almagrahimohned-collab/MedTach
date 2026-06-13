import { Action, ActionResult } from '../../core/types';
import { SimulationContext } from '../../core/SimulationContext';
import { PluginContract } from '../../core/PluginRuntime';

// Clinical ontology — normalized diagnosis names
const DIAGNOSIS_ONTOLOGY: Record<string, string[]> = {
  'myocardial infarction': ['mi', 'stemi', 'nstemi', 'heart attack', 'acute mi', 'acute coronary syndrome'],
  'pulmonary embolism': ['pe', 'lung clot', 'pulmonary embolus', 'massive pe'],
  'pneumonia': ['pna', 'lung infection', 'chest infection', 'cap', 'hap', 'vap', 'bronchopneumonia', 'lobar pneumonia'],
  'heart failure': ['chf', 'ccf', 'cardiac failure', 'left ventricular failure', 'lvf', 'right heart failure'],
  'aortic dissection': ['dissecting aneurysm', 'type a dissection', 'type b dissection'],
  'pneumothorax': ['ptx', 'collapsed lung', 'tension pneumothorax'],
  'atrial fibrillation': ['af', 'afib', 'arrhythmia'],
  'pericarditis': ['pericardial inflammation', 'inflamed pericardium'],
  'copd exacerbation': ['copd', 'chronic obstructive', 'emphysema'],
  'asthma': ['asthma attack', 'bronchospasm', 'wheezing'],
};

export class DiagnosisPlugin implements PluginContract {
  name = 'DiagnosisPlugin';
  version = '1.1.0';
  metadata = { name: 'DiagnosisPlugin', version: '1.1.0', description: 'Validates diagnosis using clinical ontology' };

  private correctDiagnosis: string = '';
  private differentials: string[] = [];

  setCase(diagnosis: string, differentials: string[]): void {
    this.correctDiagnosis = diagnosis.toLowerCase().trim();
    this.differentials = differentials.map(d => d.toLowerCase().trim());
  }

  canHandle(action: Action): boolean {
    return action.type === 'diagnosis' || action.payload.startsWith('/diagnosis');
  }

  async handle(action: Action, context: SimulationContext): Promise<ActionResult> {
    const submitted = action.payload.replace('/diagnosis ', '').toLowerCase().trim();
    if (!submitted) return { success: false, message: 'Please enter a diagnosis.' };

    // Check exact match
    if (submitted === this.correctDiagnosis) {
      return this.correctResult();
    }

    // Check ontology — submitted matches any variant of correct diagnosis
    const correctVariants = DIAGNOSIS_ONTOLOGY[this.correctDiagnosis] || [this.correctDiagnosis];
    const submittedMatches = correctVariants.some(v => submitted.includes(v) || v.includes(submitted));
    
    if (submittedMatches) {
      return this.correctResult();
    }

    // Check if matches any differential
    if (this.differentials.some(d => submitted.includes(d) || d.includes(submitted))) {
      return {
        success: false,
        message: 'That is in the differential, but not the primary diagnosis.',
        events: [{ type: 'PARTIAL_DIAGNOSIS', payload: { submitted }, timestamp: Date.now() }]
      };
    }

    return {
      success: false,
      message: 'Incorrect diagnosis. Consider the key findings.',
      stateChanges: { patientState: 'DETERIORATING' },
      events: [{ type: 'INCORRECT_DIAGNOSIS', payload: { submitted }, timestamp: Date.now() }]
    };
  }

  private correctResult(): ActionResult {
    return {
      success: true,
      message: '✅ Correct diagnosis!',
      stateChanges: { phase: 'treatment', patientState: 'STABLE' },
      events: [{ type: 'CORRECT_DIAGNOSIS', payload: {}, timestamp: Date.now() }]
    };
  }
}

export default DiagnosisPlugin;
