// ============================================
// Execution Trace — Complete Action Log
// ============================================

import { Action, ActionResult } from './types';

export interface TraceEntry {
  id: string;
  sequence: number;
  timestamp: number;
  plugin: string;
  action: Action;
  result: ActionResult;
  executionTime: number;
  contextSnapshot: {
    phase: string;
    patientState: string;
    revealedCount: number;
  };
}

export interface TraceSummary {
  totalActions: number;
  totalTime: number;
  pluginsUsed: string[];
  successRate: number;
  phaseTransitions: Array<{ from: string; to: string; at: number }>;
  criticalEvents: Array<{ type: string; at: number }>;
}

export class ExecutionTrace {
  private entries: TraceEntry[] = [];
  private sequence: number = 0;
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  record(
    plugin: string,
    action: Action,
    result: ActionResult,
    executionTime: number,
    contextSnapshot: { phase: string; patientState: string; revealedCount: number }
  ): void {
    this.sequence++;
    this.entries.push({
      id: `trace_${this.sequence}`,
      sequence: this.sequence,
      timestamp: Date.now(),
      plugin,
      action,
      result,
      executionTime,
      contextSnapshot
    });
  }

  getAll(): TraceEntry[] {
    return [...this.entries];
  }

  getByPlugin(pluginName: string): TraceEntry[] {
    return this.entries.filter(e => e.plugin === pluginName);
  }

  getByPhase(phase: string): TraceEntry[] {
    return this.entries.filter(e => e.contextSnapshot.phase === phase);
  }

  getFailedActions(): TraceEntry[] {
    return this.entries.filter(e => !e.result.success);
  }

  summarize(): TraceSummary {
    const pluginsUsed = [...new Set(this.entries.map(e => e.plugin))];
    const successfulActions = this.entries.filter(e => e.result.success).length;
    
    // Detect phase transitions
    const phaseTransitions: Array<{ from: string; to: string; at: number }> = [];
    let lastPhase = '';
    for (const entry of this.entries) {
      if (entry.contextSnapshot.phase !== lastPhase) {
        phaseTransitions.push({
          from: lastPhase || 'initial',
          to: entry.contextSnapshot.phase,
          at: entry.sequence
        });
        lastPhase = entry.contextSnapshot.phase;
      }
    }

    // Detect critical events
    const criticalEvents = this.entries
      .filter(e => 
        e.contextSnapshot.patientState === 'DETERIORATING' ||
        e.contextSnapshot.patientState === 'CRITICAL'
      )
      .map(e => ({
        type: e.contextSnapshot.patientState,
        at: e.sequence
      }));

    return {
      totalActions: this.entries.length,
      totalTime: (Date.now() - this.startTime) / 1000,
      pluginsUsed,
      successRate: this.entries.length > 0 ? (successfulActions / this.entries.length) * 100 : 0,
      phaseTransitions,
      criticalEvents
    };
  }

  // Export for replay
  exportForReplay(): string {
    return JSON.stringify({
      startTime: this.startTime,
      entries: this.entries.map(e => ({
        seq: e.sequence,
        plugin: e.plugin,
        actionType: e.action.type,
        actionPayload: e.action.payload,
        timestamp: e.timestamp
      }))
    });
  }

  reset(): void {
    this.entries = [];
    this.sequence = 0;
    this.startTime = Date.now();
  }
}

export default ExecutionTrace;
