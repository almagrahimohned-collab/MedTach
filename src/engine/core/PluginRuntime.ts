import { EnginePlugin, Action, ActionResult } from './types';
import { SimulationContext } from './SimulationContext';
import { EventBus } from '../events/EventBus';

export interface PluginMetadata {
  name: string;
  version: string;
  author?: string;
  description?: string;
  dependencies?: string[];
}

export interface PluginContract extends EnginePlugin {
  version: string;
  metadata: PluginMetadata;
}

export interface PluginExecutionResult {
  success: boolean;
  result?: ActionResult;
  error?: string;
  executionTime: number;
  timeout: boolean;
}

export class PluginRuntime {
  private static TIMEOUT_MS = 5000;

  static validate(plugin: PluginContract): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!plugin.name) errors.push("Missing name");
    if (!plugin.version) errors.push("Missing version");
    if (!plugin.metadata) errors.push("Missing metadata");
    if (typeof plugin.canHandle !== "function") errors.push("Missing canHandle()");
    if (typeof plugin.handle !== "function") errors.push("Missing handle()");
    return { valid: errors.length === 0, errors };
  }

  static _validate(plugin: PluginContract): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!plugin.name) errors.push('Plugin must have a name');
    if (!plugin.version) errors.push('Plugin must have a version');
    if (typeof plugin.canHandle !== 'function') errors.push('Plugin must implement canHandle()');
    if (typeof plugin.handle !== 'function') errors.push('Plugin must implement handle()');
    return { valid: errors.length === 0, errors };
  }

  static async execute(
    plugin: PluginContract,
    action: Action,
    context: SimulationContext
  ): Promise<PluginExecutionResult> {
    const startTime = Date.now();
    try {
      const timeoutPromise = new Promise<ActionResult>((_, reject) => {
        setTimeout(() => reject(new Error('Plugin execution timeout')), PluginRuntime.TIMEOUT_MS);
      });
      const executionPromise = plugin.handle(action, context);
      const result = await Promise.race([executionPromise, timeoutPromise]);
      return { success: true, result, executionTime: Date.now() - startTime, timeout: false };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error',
        executionTime: Date.now() - startTime,
        timeout: error.message === 'Plugin execution timeout'
      };
    }
  }

  static register(plugin: PluginContract): void {
    plugin.onRegister?.();
    EventBus.getInstance().emit('PLUGIN_REGISTERED', { plugin: plugin.name, version: plugin.version });
  }

  static unregister(plugin: PluginContract): void {
    plugin.onUnregister?.();
    EventBus.getInstance().emit('PLUGIN_UNREGISTERED', { plugin: plugin.name });
  }

  static reset(plugin: PluginContract): void {
    plugin.onReset?.();
  }
}
