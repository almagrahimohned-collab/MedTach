import { Action, ActionResult } from '../../../../engine/core/types';
import { SimulationContext } from '../../../../engine/core/SimulationContext';
import { PluginContract } from '../../../../engine/core/PluginRuntime';

export class InvestigationPlugin implements PluginContract {
  name = 'InvestigationPlugin';
  version = '1.0.0';
  metadata = { name: 'InvestigationPlugin', version: '1.0.0', description: 'Handles labs and imaging' };
  private labResults: Record<string, string> = {};
  private imagingResults: Record<string, string> = {};

  setLabResults(results: Record<string, string>): void { this.labResults = results; }
  setImagingResults(results: Record<string, string>): void { this.imagingResults = results; }

  canHandle(action: Action): boolean { return action.type === 'lab' || action.type === 'imaging'; }

  async handle(action: Action, context: SimulationContext): Promise<ActionResult> {
    const query = action.payload.toLowerCase();
    const all = { ...this.labResults, ...this.imagingResults };
    for (const [key, result] of Object.entries(all)) {
      if (query.includes(key.replace(/_/g, ' '))) {
        const isLab = key in this.labResults;
        return {
          success: true,
          message: `${isLab ? '🧪' : '📸'} ${key}: ${result}`,
          stateChanges: { revealedData: [...context.revealed.all, key] },
          events: [{ type: 'INVESTIGATION_RESULT', payload: { key, result, isLab }, timestamp: Date.now() }]
        };
      }
    }
    return { success: false, message: 'Test not available.' };
  }
}
export default InvestigationPlugin;
