import { EngineState, Action, ActionResult } from './types';
import { SimulationContext, createSimulationContext } from './SimulationContext';
import { PluginContract, PluginRuntime } from './PluginRuntime';
import { EventBus } from '../events/EventBus';
import { MedicalCase } from '../../content/ContentRepository';
import { HypothesisTracker } from '../../clinical/HypothesisTracker';

export class Kernel {
  private plugins: PluginContract[] = [];
  private state: EngineState;
  private events: EventBus;
  private startTime: number;
  private caseData: MedicalCase | null = null;
  private hypothesisTracker: HypothesisTracker;
  private context: SimulationContext | null = null;

  constructor(initialState: Partial<EngineState> = {}) {
    this.events = new EventBus(); // ← Scoped EventBus
    this.startTime = Date.now();
    this.hypothesisTracker = new HypothesisTracker();
    this.state = {
      phase: 'history',
      patientState: 'INITIAL',
      vitals: { bp: '120/80', hr: 72, rr: 16, spo2: 98, temp: 37.0 },
      revealedData: [],
      actions: [],
      messages: [],
      score: 0,
      timeElapsed: 0,
      ...initialState
    };
  }

  setCase(caseData: MedicalCase): void {
    this.caseData = caseData;
    if (caseData.differential_diagnoses) {
      this.hypothesisTracker.initialize(caseData.differential_diagnoses);
    }
    this.refreshContext();
    this.events.emit('ENGINE_INITIALIZED', { caseId: caseData.id });
  }

  use(plugin: PluginContract): void { this.plugins.push(plugin); }

  async submitAction(action: Action): Promise<ActionResult> {
    if (!action.type || !action.payload) {
      return { success: false, message: 'Invalid action' };
    }
    this.refreshContext();
    const plugin = this.plugins.find(p => p.canHandle(action));
    if (!plugin) return { success: false, message: 'No plugin found' };

    const execution = await PluginRuntime.execute(plugin, action, this.context!);
    if (!execution.success || !execution.result) {
      return { success: false, message: execution.error || 'Plugin failed' };
    }

    const result = execution.result;
    
    // Apply state changes
    if (result.stateChanges) {
      this.state = { ...this.state, ...result.stateChanges };
    }

    // Add to actions
    this.state.actions.push(action);
    this.state.timeElapsed = (Date.now() - this.startTime) / 1000;

    // Kernel builds messages from events
    if (result.message) {
      this.state.messages = [...this.state.messages, {
        role: result.success ? 'system' : 'patient',
        content: result.message
      }];
    }

    if (result.events) {
      result.events.forEach(e => this.events.emit(e.type, e.payload));
    }

    this.events.emit('ACTION_COMPLETED', { action, result });
    return result;
  }

  private refreshContext(): void {
    if (!this.caseData) return;
    this.context = createSimulationContext(this.caseData, this.state, this.hypothesisTracker.getDifferential());
  }

  getState(): EngineState { return { ...this.state }; }
  getContext(): SimulationContext | null { return this.context; }
  getEventBus(): EventBus { return this.events; }
  getHypotheses() { return this.hypothesisTracker.getDifferential(); }
  getPlugins(): PluginContract[] { return [...this.plugins]; }

  removePlugin(name: string): void {
    this.plugins = this.plugins.filter(p => p.name !== name);
  }

  reset(): void {
    this.hypothesisTracker.reset();
    this.startTime = Date.now();
    this.state = {
      phase: 'history', patientState: 'INITIAL',
      vitals: { bp: '120/80', hr: 72, rr: 16, spo2: 98, temp: 37.0 },
      revealedData: [], actions: [], messages: [], score: 0, timeElapsed: 0
    };
    this.refreshContext();
  }

  destroy(): void {
    this.plugins = [];
    this.events.removeAllListeners();
    this.hypothesisTracker.reset();
  }
}

export default Kernel;
