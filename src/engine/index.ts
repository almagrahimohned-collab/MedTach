// ============================================
// Engine V3 — Complete Public API
// ============================================

// Core
export { Kernel } from './core/Kernel';
export { EventBus } from './events/EventBus';
export { buildCaseEngine } from './core/CaseEngineBuilder';
export { PluginRuntime } from './core/PluginRuntime';
export { PLUGIN_SPEC_VERSION } from './core/PluginSpec';
export { createSimulationContext } from './core/SimulationContext';

// Monitoring & Debug
export { default as ExecutionTrace } from './core/ExecutionTrace';
export { default as PluginHealthMonitor } from './core/PluginHealthMonitor';
export { default as DebugMode } from './core/DebugMode';

// Replay System
export { default as DeterministicRandom } from './core/DeterministicRandom';
export { default as SnapshotManager } from './core/SimulationSnapshot';
export { default as ReplayEngine } from './core/ReplayEngine';
export { default as SimulationRecorder } from './core/SimulationRecorder';

// Scoring
export { ClinicalScoringPlugin } from './plugins/scoring/ClinicalScoringPlugin';

// Types
export type { BuiltEngine } from './core/CaseEngineBuilder';
export type { PluginContract, PluginMetadata, PluginExecutionResult } from './core/PluginRuntime';
export type { SimulationContext, PatientSlice, RevealedSlice, TimelineSlice, ReasoningSlice, ReferencesSlice } from './core/SimulationContext';
export type { Action, ActionResult, EngineState, EngineEvent, EnginePlugin, Patient, VitalSigns, CasePhase, Difficulty, PatientSex } from './core/types';
export type { PatientState } from './core/SimulationContext';
export type { ScoreBreakdown } from './plugins/scoring/ClinicalScoringPlugin';
export type { TraceEntry, TraceSummary } from './core/ExecutionTrace';
export type { PluginStats, HealthReport } from './core/PluginHealthMonitor';
export type { ReplayData, SimulationSnapshot } from './core/SimulationSnapshot';
export type { ReplayState, ReplaySpeed } from './core/ReplayEngine';

// Plugins
export { HistoryPlugin } from './plugins/actions/HistoryPlugin';
export { ExaminationPlugin } from './plugins/actions/ExaminationPlugin';
export { InvestigationPlugin } from './plugins/actions/InvestigationPlugin';
export { DiagnosisPlugin } from './plugins/actions/DiagnosisPlugin';
export { TreatmentPlugin } from './plugins/actions/TreatmentPlugin';
