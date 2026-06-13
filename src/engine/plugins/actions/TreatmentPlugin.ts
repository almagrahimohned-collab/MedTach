import { Action, ActionResult } from '../../core/types';
import { SimulationContext } from '../../core/SimulationContext';
import { PluginContract } from '../../core/PluginRuntime';

export class TreatmentPlugin implements PluginContract {
  name = 'TreatmentPlugin';
  version = '1.0.0';
  metadata = { name: 'TreatmentPlugin', version: '1.0.0', description: 'Handles treatment plans' };

  canHandle(action: Action): boolean { return action.type === 'treatment' || action.payload.startsWith('/treatment'); }

  async handle(action: Action, context: SimulationContext): Promise<ActionResult> {
    const plan = action.payload.replace('/treatment ', '');
    if (plan.length < 5) return { success: false, message: 'Provide more detail.' };
    return {
      success: true,
      message: '✅ Treatment recorded. Case complete!',
      stateChanges: { phase: 'complete', patientState: 'DISCHARGED' },
      events: [{ type: 'CASE_COMPLETED', payload: { plan }, timestamp: Date.now() }]
    };
  }
}
export default TreatmentPlugin;
