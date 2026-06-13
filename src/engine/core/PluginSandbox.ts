// ============================================
// Plugin Sandbox — Isolated Execution
// ============================================

import { Action, ActionResult, EngineState } from './types';
import { SimulationContext } from './SimulationContext';
import { PluginContract } from './PluginRuntime';

export interface SandboxConfig {
  timeoutMs: number;
  maxStateChanges: number;
  readOnlyContext: boolean;
  logErrors: boolean;
  failFast: boolean;
}

const DEFAULT_CONFIG: SandboxConfig = {
  timeoutMs: 5000,
  maxStateChanges: 10,
  readOnlyContext: true,
  logErrors: true,
  failFast: false,
};

export interface SandboxResult {
  success: boolean;
  result?: ActionResult;
  error?: string;
  executionTime: number;
  timeout: boolean;
  stateChangeCount: number;
}

export class PluginSandbox {
  private config: SandboxConfig;

  constructor(config: Partial<SandboxConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async execute(
    plugin: PluginContract,
    action: Action,
    context: SimulationContext,
    currentState: EngineState
  ): Promise<SandboxResult> {
    const startTime = Date.now();

    try {
      // Validate plugin
      if (!plugin.name || !plugin.canHandle || !plugin.handle) {
        return this.failResult('Invalid plugin: missing required properties', startTime);
      }

      // Check if plugin can handle this action
      if (!plugin.canHandle(action)) {
        return this.failResult(`Plugin ${plugin.name} cannot handle action type: ${action.type}`, startTime);
      }

      // Freeze context to prevent mutation
      const frozenContext = this.config.readOnlyContext ? 
        Object.freeze(JSON.parse(JSON.stringify(context))) : context;

      // Execute with timeout
      const result = await this.executeWithTimeout(plugin, action, frozenContext);

      // Validate state changes
      const stateChangeCount = result.stateChanges ? Object.keys(result.stateChanges).length : 0;
      
      if (stateChangeCount > this.config.maxStateChanges) {
        return {
          success: false,
          error: `Too many state changes: ${stateChangeCount} (max: ${this.config.maxStateChanges})`,
          executionTime: Date.now() - startTime,
          timeout: false,
          stateChangeCount,
        };
      }

      // Validate required fields in result
      if (typeof result.success !== 'boolean') {
        return this.failResult('Result must have a success boolean', startTime);
      }

      if (!result.message || typeof result.message !== 'string') {
        return this.failResult('Result must have a message string', startTime);
      }

      return {
        success: true,
        result,
        executionTime: Date.now() - startTime,
        timeout: false,
        stateChangeCount,
      };

    } catch (error: any) {
      if (this.config.logErrors) {
        console.error(`[Sandbox] ${plugin.name} error:`, error.message);
      }

      if (this.config.failFast) {
        throw error;
      }

      return {
        success: false,
        error: error.message || 'Unknown plugin error',
        executionTime: Date.now() - startTime,
        timeout: error.message === 'Plugin execution timeout',
        stateChangeCount: 0,
      };
    }
  }

  private async executeWithTimeout(
    plugin: PluginContract,
    action: Action,
    context: SimulationContext
  ): Promise<ActionResult> {
    return new Promise<ActionResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Plugin execution timeout'));
      }, this.config.timeoutMs);

      plugin.handle(action, context)
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  private failResult(error: string, startTime: number): SandboxResult {
    return {
      success: false,
      error,
      executionTime: Date.now() - startTime,
      timeout: false,
      stateChangeCount: 0,
    };
  }

  updateConfig(config: Partial<SandboxConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): SandboxConfig {
    return { ...this.config };
  }
}

export default PluginSandbox;
