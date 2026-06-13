import { Action, ActionResult } from '../../core/types';
import { SimulationContext } from '../../core/SimulationContext';
import { PluginContract } from '../../core/PluginRuntime';

export class ExaminationPlugin implements PluginContract {
  name = 'ExaminationPlugin';
  version = '1.0.0';
  metadata = { name: 'ExaminationPlugin', version: '1.0.0', description: 'Handles physical examination' };
  private examFindings: Record<string, string> = {};

  setFindings(findings: Record<string, string>): void { this.examFindings = findings; }

  canHandle(action: Action): boolean { return action.type === 'exam'; }

  async handle(action: Action, context: SimulationContext): Promise<ActionResult> {
    const query = action.payload.toLowerCase();
    for (const [key, finding] of Object.entries(this.examFindings)) {
      if (query.includes(key.replace(/_/g, ' '))) {
        return {
          success: true,
          message: `🔍 ${finding}`,
          stateChanges: { revealedData: [...context.revealed.all, key] },
          events: [{ type: 'EXAM_FINDING', payload: { key, finding }, timestamp: Date.now() }]
        };
      }
    }
    return { success: false, message: 'Specify what to examine.' };
  }
}
export default ExaminationPlugin;
