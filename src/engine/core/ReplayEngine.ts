// ============================================
// Replay Engine — Replay Any Simulation
// ============================================

import Kernel from './Kernel';
import { ReplayData, SimulationSnapshot } from './SimulationSnapshot';
import { Action, ActionResult } from './types';
import { EventBus } from '../events/EventBus';

export type ReplaySpeed = 0.5 | 1 | 2 | 5 | 10;
export type ReplayStatus = 'idle' | 'playing' | 'paused' | 'completed';

export interface ReplayState {
  status: ReplayStatus;
  currentStep: number;
  totalSteps: number;
  currentSnapshot: SimulationSnapshot | null;
  speed: ReplaySpeed;
  progress: number;
}

export class ReplayEngine {
  private replayData: ReplayData | null = null;
  private kernel: Kernel | null = null;
  private state: ReplayState;
  private timer: any = null;
  private listeners: Array<(state: ReplayState) => void> = [];

  constructor() {
    this.state = {
      status: 'idle',
      currentStep: 0,
      totalSteps: 0,
      currentSnapshot: null,
      speed: 1,
      progress: 0
    };
  }

  subscribe(listener: (state: ReplayState) => void): () => void {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }

  // Load replay data
  loadReplay(data: ReplayData): void {
    this.replayData = data;
    this.state = {
      status: 'idle',
      currentStep: 0,
      totalSteps: data.actions.length,
      currentSnapshot: data.snapshots[0] || null,
      speed: 1,
      progress: 0
    };
    this.notify();
  }

  // Start replay
  async start(): Promise<void> {
    if (!this.replayData || this.replayData.actions.length === 0) return;

    this.state.status = 'playing';
    this.state.currentStep = 0;
    this.notify();

    await this.runStep();
  }

  // Run a single step
  private async runStep(): Promise<void> {
    if (!this.replayData || this.state.status !== 'playing') return;

    const step = this.state.currentStep;
    
    if (step >= this.replayData.actions.length) {
      this.state.status = 'completed';
      this.state.progress = 1;
      this.notify();
      return;
    }

    const action = this.replayData.actions[step];
    const snapshot = this.replayData.snapshots[step + 1] || null;

    // Update state
    this.state.currentStep = step + 1;
    this.state.currentSnapshot = snapshot;
    this.state.progress = (step + 1) / this.replayData.actions.length;

    this.notify();

    // Schedule next step based on speed
    const delay = 1000 / this.state.speed;
    this.timer = setTimeout(() => this.runStep(), delay);
  }

  // Pause replay
  pause(): void {
    this.state.status = 'paused';
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  // Resume replay
  resume(): void {
    if (this.state.status !== 'paused') return;
    this.state.status = 'playing';
    this.notify();
    this.runStep();
  }

  // Set replay speed
  setSpeed(speed: ReplaySpeed): void {
    this.state.speed = speed;
    this.notify();
  }

  // Jump to specific step
  jumpTo(step: number): void {
    if (!this.replayData) return;
    
    const wasPlaying = this.state.status === 'playing';
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    step = Math.max(0, Math.min(step, this.replayData.actions.length));
    this.state.currentStep = step;
    this.state.currentSnapshot = this.replayData.snapshots[step] || null;
    this.state.progress = this.replayData.actions.length > 0 ? step / this.replayData.actions.length : 0;

    if (wasPlaying) {
      this.state.status = 'playing';
      this.notify();
      this.runStep();
    } else {
      this.state.status = 'paused';
      this.notify();
    }
  }

  // Get all snapshots for timeline display
  getSnapshots(): SimulationSnapshot[] {
    return this.replayData?.snapshots || [];
  }

  // Get actions for display
  getActions(): Array<{ type: string; payload: string; timestamp: number }> {
    return this.replayData?.actions || [];
  }

  // Get current state
  getState(): ReplayState {
    return { ...this.state };
  }

  // Stop replay
  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.state.status = 'idle';
    this.state.currentStep = 0;
    this.state.progress = 0;
    this.notify();
  }

  // Cleanup
  destroy(): void {
    this.stop();
    this.replayData = null;
    this.listeners = [];
  }
}

export default ReplayEngine;
