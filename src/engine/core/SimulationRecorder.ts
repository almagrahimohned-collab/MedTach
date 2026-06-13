// ============================================
// Simulation Recorder — Record for Replay
// ============================================

import Kernel from './Kernel';
import { Action } from './types';
import { EventBus } from '../events/EventBus';
import DeterministicRandom from './DeterministicRandom';
import SnapshotManager, { ReplayData } from './SimulationSnapshot';
import ExecutionTrace from './ExecutionTrace';

export class SimulationRecorder {
  private kernel: Kernel;
  private random: DeterministicRandom;
  private snapshots: SnapshotManager;
  private caseId: string;
  private isRecording: boolean = false;
  private recordedActions: Action[] = [];

  constructor(kernel: Kernel, random: DeterministicRandom, caseId: string) {
    this.kernel = kernel;
    this.random = random;
    this.snapshots = new SnapshotManager();
    this.caseId = caseId;
  }

  // Start recording
  start(): void {
    this.isRecording = true;
    this.recordedActions = [];
    
    const bus = EventBus.getInstance();
    bus.on('ACTION_COMPLETED', this.onActionCompleted.bind(this));
    
    console.log('[RECORDER] Recording started for case:', this.caseId);
  }

  // Handle action completion
  private onActionCompleted(event: any): void {
    if (!this.isRecording) return;

    const { action } = event.payload;
    this.recordedActions.push(action);
    this.takeSnapshot();
  }

  // Take a snapshot of current state
  takeSnapshot(): void {
    this.snapshots.createSnapshot(
      this.kernel.getState(),
      this.kernel.getContext(),
      this.random.getSeed(),
      this.caseId,
      this.kernel.getTrace().getAll()
    );
  }

  // Stop recording and export
  stop(): ReplayData {
    this.isRecording = false;
    
    const bus = EventBus.getInstance();
    // Clean up listener — simplified
    
    const replayData = this.snapshots.exportReplay(
      this.recordedActions,
      this.random.getSeed(),
      this.caseId
    );

    console.log('[RECORDER] Recording stopped. Actions:', this.recordedActions.length);
    return replayData;
  }

  // Export to JSON file
  exportToJSON(): string {
    const data = this.snapshots.exportReplay(
      this.recordedActions,
      this.random.getSeed(),
      this.caseId
    );
    return JSON.stringify(data, null, 2);
  }

  // Save to storage
  async saveToStorage(filename?: string): Promise<string> {
    const json = this.exportToJSON();
    const name = filename || `replay_${this.caseId}_${Date.now()}.json`;
    
    // In React Native, use AsyncStorage or FileSystem
    try {
      const FileSystem = require('expo-file-system');
      const path = `${FileSystem.documentDirectory}replays/${name}`;
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}replays/`, { intermediates: true });
      await FileSystem.writeAsStringAsync(path, json);
      console.log('[RECORDER] Saved replay to:', path);
      return path;
    } catch (error) {
      console.error('[RECORDER] Failed to save replay:', error);
      return '';
    }
  }

  isActive(): boolean {
    return this.isRecording;
  }

  getActionCount(): number {
    return this.recordedActions.length;
  }
}

export default SimulationRecorder;
