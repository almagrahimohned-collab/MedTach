import { ScenarioEngine } from './types';
import { septicEngineV3 } from './septicEngineV3';
import { dkaEngineV2 } from './dkaEngineV2';

const registry: Record<string, ScenarioEngine> = {
  septic_shock: septicEngineV3,
  dka: dkaEngineV2,
  default: septicEngineV3,
};

export function getEngineForScenario(scenarioId: string): ScenarioEngine {
  return registry[scenarioId] || registry['default'];
}

export { septicEngineV3, dkaEngineV2 };
