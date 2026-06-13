// ============================================
// Simulation Snapshot — Save/Restore State
// ============================================

import { EngineState, Action } from './types';
import { SimulationContext } from './SimulationContext';
import { TraceEntry } from './ExecutionTrace';

export interface SimulationSnapshot {
  id: string;
  timestamp: number;
  caseId: string;
  state: {
    phase: string;
    patientState: string;
    vitals: Record<string, any>;
    revealedData: string[];
    score: number;
    timeElapsed: number;
  };
  context: {
    patientState: string;
    revealedCount: number;
    hypothesisCount: number;
    topDiagnosis: string | null;
  };
  randomSeed: number;
  actionCount: number;
  traceIds: string[];
}

export interface ReplayData {
  caseId: string;
  initialSeed: number;
  snapshots: SimulationSnapshot[];
  actions: Array<{
    type: string;
    payload: string;
    timestamp: number;
  }>;
}

export class SnapshotManager {
  private snapshots: SimulationSnapshot[] = [];
  private replayData: ReplayData | null = null;

  // Create a snapshot of current simulation state
  createSnapshot(
    state: EngineState,
    context: SimulationContext | null,
    randomSeed: number,
    caseId: string,
    traceEntries: TraceEntry[]
  ): SimulationSnapshot {
    const snapshot: SimulationSnapshot = {
      id: `snap_${Date.now()}_${this.snapshots.length}`,
      timestamp: Date.now(),
      caseId,
      state: {
        phase: state.phase,
        patientState: state.patientState,
        vitals: { ...state.vitals },
        revealedData: Array.from(state.revealedData),
        score: state.score,
        timeElapsed: state.timeElapsed
      },
      context: {
        patientState: context?.patient.state || 'UNKNOWN',
        revealedCount: context?.revealed.all.length || 0,
        hypothesisCount: context?.reasoning.hypotheses.length || 0,
        topDiagnosis: context?.reasoning.topDiagnosis || null
      },
      randomSeed,
      actionCount: state.actions.length,
      traceIds: traceEntries.map(e => e.id)
    };

    this.snapshots.push(snapshot);
    return snapshot;
  }

  // Get all snapshots
  getAll(): SimulationSnapshot[] {
    return [...this.snapshots];
  }

  // Get last snapshot
  getLast(): SimulationSnapshot | null {
    return this.snapshots.length > 0 ? this.snapshots[this.snapshots.length - 1] : null;
  }

  // Export for replay
  exportReplay(actions: Action[], initialSeed: number, caseId: string): ReplayData {
    return {
      caseId,
      initialSeed,
      snapshots: [...this.snapshots],
      actions: actions.map(a => ({
        type: a.type,
        payload: a.payload,
        timestamp: a.timestamp
      }))
    };
  }

  // Load replay data
  loadReplay(data: ReplayData): void {
    this.replayData = data;
    this.snapshots = [...data.snapshots];
  }

  getReplayData(): ReplayData | null {
    return this.replayData;
  }

  // Compare two snapshots (for diffing)
  diffSnapshots(snap1: SimulationSnapshot, snap2: SimulationSnapshot): string[] {
    const changes: string[] = [];
    
    if (snap1.state.phase !== snap2.state.phase) {
      changes.push(`Phase: ${snap1.state.phase} → ${snap2.state.phase}`);
    }
    if (snap1.state.patientState !== snap2.state.patientState) {
      changes.push(`Patient: ${snap1.state.patientState} → ${snap2.state.patientState}`);
    }
    if (snap1.context.revealedCount !== snap2.context.revealedCount) {
      changes.push(`Revealed: ${snap1.context.revealedCount} → ${snap2.context.revealedCount}`);
    }
    if (snap1.context.topDiagnosis !== snap2.context.topDiagnosis) {
      changes.push(`Diagnosis: ${snap1.context.topDiagnosis || 'none'} → ${snap2.context.topDiagnosis || 'none'}`);
    }
    
    return changes;
  }

  reset(): void {
    this.snapshots = [];
    this.replayData = null;
  }
}

export default SnapshotManager;
