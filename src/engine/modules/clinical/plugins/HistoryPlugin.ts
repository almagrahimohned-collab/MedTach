import { Action, EngineState, ActionResult } from '../../../../engine/core/types';
import { SimulationContext } from '../../../../engine/core/SimulationContext';
import { PluginContract } from '../../../../engine/core/PluginRuntime';

export class HistoryPlugin implements PluginContract {
  name = 'HistoryPlugin';
  version = '1.0.0';
  
  metadata = {
    name: 'HistoryPlugin',
    version: '1.0.0',
    description: 'Handles history taking questions and matches patient responses'
  };

  private responses: Record<string, string> = {};

  setResponses(responses: Record<string, string>): void {
    this.responses = responses;
  }

  canHandle(action: Action): boolean {
    return action.type === 'history' || 
           (action.type === 'command' && !action.payload.startsWith('/'));
  }

  async handle(action: Action, context: SimulationContext): Promise<ActionResult> {
    const query = action.payload.toLowerCase();
    
    for (const [key, response] of Object.entries(this.responses)) {
      const keywords = key.replace(/_/g, ' ').split(' ');
      const matchCount = keywords.filter(k => query.includes(k)).length;
      
      if (matchCount >= keywords.length * 0.6) {
        const newRevealed = context.revealed.all;
        newRevealed.add(key);

        return {
          success: true,
          message: response,
          stateChanges: {
            revealedData: newRevealed,
            messages: [...(context as any).messages || [], { role: 'patient', content: response }]
          },
          events: [
            { type: 'HISTORY_RESPONSE', payload: { key, query }, timestamp: Date.now() }
          ]
        };
      }
    }

    return {
      success: false,
      message: 'Try asking differently. Topics: ' + 
        Object.keys(this.responses).map(k => k.replace(/_/g, ' ')).join(', ')
    };
  }
}

export default HistoryPlugin;
