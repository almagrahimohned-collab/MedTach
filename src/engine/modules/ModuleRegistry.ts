// ============================================
// Module Registry — Multi-Module System
// ============================================

import { EnginePlugin } from '../core/types';

export interface ModuleConfig {
  name: string;
  version: string;
  description: string;
  plugins: EnginePlugin[];
  scoringPlugin?: EnginePlugin;
  hooks?: Record<string, any>;
  enabled: boolean;
}

export class ModuleRegistry {
  private modules: Map<string, ModuleConfig> = new Map();
  private static instance: ModuleRegistry;

  static getInstance(): ModuleRegistry {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry();
    }
    return ModuleRegistry.instance;
  }

  register(config: ModuleConfig): void {
    if (this.modules.has(config.name)) {
      console.warn(`[ModuleRegistry] Module already registered: ${config.name}`);
      return;
    }
    this.modules.set(config.name, config);
    console.log(`[ModuleRegistry] Registered: ${config.name} v${config.version}`);
  }

  getModule(name: string): ModuleConfig | undefined {
    return this.modules.get(name);
  }

  getPlugins(name: string): EnginePlugin[] {
    return this.modules.get(name)?.plugins || [];
  }

  getScoringPlugin(name: string): EnginePlugin | undefined {
    return this.modules.get(name)?.scoringPlugin;
  }

  listModules(): ModuleConfig[] {
    return Array.from(this.modules.values());
  }

  isEnabled(name: string): boolean {
    return this.modules.get(name)?.enabled ?? false;
  }

  enable(name: string): void {
    const mod = this.modules.get(name);
    if (mod) mod.enabled = true;
  }

  disable(name: string): void {
    const mod = this.modules.get(name);
    if (mod) mod.enabled = false;
  }

  unregister(name: string): void {
    this.modules.delete(name);
  }
}

export default ModuleRegistry;
