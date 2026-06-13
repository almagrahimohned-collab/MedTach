import { PatientState } from '../../physiology';
import { Scenario } from '../types';

export interface EngineContext {
  state: PatientState;
  scenario: Scenario;
  simTime: number;
}

export interface ScenarioEngine {
  name: string;
  update(ctx: EngineContext): PatientState;
}
