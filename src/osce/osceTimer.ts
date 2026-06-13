// osceTimer.ts - OSCE Timer Module
// Created: 2026-06-11
// Manages reading time, station time, warnings, and auto-transitions

// ============================================================
// TYPES
// ============================================================

export type TimerPhase = 'idle' | 'reading' | 'station' | 'between_stations' | 'paused' | 'expired';

export interface TimerConfig {
  readingTime: number;        // Seconds for reading outside door
  stationTime: number;        // Seconds for station
  betweenStationsTime: number; // Seconds between stations (rest)
  warningThresholds: number[]; // Seconds remaining to trigger warnings (e.g., [120, 60, 30])
}

export interface TimerState {
  phase: TimerPhase;
  totalTime: number;
  timeRemaining: number;
  isWarning: boolean;
  warningLevel: 'none' | 'low' | 'medium' | 'critical';
  elapsed: number;
  startedAt: number | null;
  pausedAt: number | null;
}

export type TimerCallback = (state: TimerState) => void;

// ============================================================
// DEFAULT CONFIG
// ============================================================

const DEFAULT_CONFIG: TimerConfig = {
  readingTime: 60,      // 1 minute outside door
  stationTime: 480,     // 8 minutes station
  betweenStationsTime: 60, // 1 minute between stations
  warningThresholds: [120, 60, 30], // 2 min, 1 min, 30 sec
};

// ============================================================
// OSCE TIMER CLASS
// ============================================================

export class OSCETimer {
  private config: TimerConfig;
  private state: TimerState;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: TimerCallback[] = [];
  private onExpireCallback: (() => void) | null = null;

  constructor(config: Partial<TimerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = this.createInitialState();
  }

  /**
   * Create initial timer state
   */
  private createInitialState(): TimerState {
    return {
      phase: 'idle',
      totalTime: 0,
      timeRemaining: 0,
      isWarning: false,
      warningLevel: 'none',
      elapsed: 0,
      startedAt: null,
      pausedAt: null,
    };
  }

  /**
   * Start reading time (before entering station)
   */
  startReading(): void {
    this.reset();
    this.state.phase = 'reading';
    this.state.totalTime = this.config.readingTime;
    this.state.timeRemaining = this.config.readingTime;
    this.state.startedAt = Date.now();
    this.startInterval();
    this.notifyCallbacks();
  }

  /**
   * Start station time
   */
  startStation(customTime?: number): void {
    this.stopInterval();
    this.state.phase = 'station';
    this.state.totalTime = customTime || this.config.stationTime;
    this.state.timeRemaining = customTime || this.config.stationTime;
    this.state.startedAt = Date.now();
    this.state.isWarning = false;
    this.state.warningLevel = 'none';
    this.state.elapsed = 0;
    this.startInterval();
    this.notifyCallbacks();
  }

  /**
   * Start between-stations rest period
   */
  startBetweenStations(): void {
    this.reset();
    this.state.phase = 'between_stations';
    this.state.totalTime = this.config.betweenStationsTime;
    this.state.timeRemaining = this.config.betweenStationsTime;
    this.state.startedAt = Date.now();
    this.startInterval();
    this.notifyCallbacks();
  }

  /**
   * Pause the timer
   */
  pause(): void {
    if (this.state.phase === 'idle' || this.state.phase === 'expired') return;
    
    this.stopInterval();
    this.state.pausedAt = Date.now();
    this.state.phase = 'paused';
    this.notifyCallbacks();
  }

  /**
   * Resume the timer
   */
  resume(): void {
    if (this.state.phase !== 'paused') return;
    
    // Adjust startedAt to account for pause duration
    if (this.state.pausedAt && this.state.startedAt) {
      const pauseDuration = Date.now() - this.state.pausedAt;
      this.state.startedAt += pauseDuration;
    }
    
    this.state.phase = this.state.totalTime === this.config.readingTime ? 'reading' : 'station';
    this.state.pausedAt = null;
    this.startInterval();
    this.notifyCallbacks();
  }

  /**
   * Reset the timer
   */
  reset(): void {
    this.stopInterval();
    this.state = this.createInitialState();
    this.notifyCallbacks();
  }

  /**
   * Stop the timer (station completed)
   */
  stop(): void {
    this.stopInterval();
    this.state.phase = 'idle';
    this.notifyCallbacks();
  }

  /**
   * Get current state
   */
  getState(): TimerState {
    return { ...this.state };
  }

  /**
   * Get time remaining in seconds
   */
  getTimeRemaining(): number {
    return this.state.timeRemaining;
  }

  /**
   * Get elapsed time in seconds
   */
  getElapsed(): number {
    return this.state.elapsed;
  }

  /**
   * Check if timer is running
   */
  isRunning(): boolean {
    return this.state.phase === 'reading' || this.state.phase === 'station';
  }

  /**
   * Check if timer is in warning state
   */
  isWarning(): boolean {
    return this.state.isWarning;
  }

  /**
   * Get warning level
   */
  getWarningLevel(): 'none' | 'low' | 'medium' | 'critical' {
    return this.state.warningLevel;
  }

  /**
   * Format time remaining as MM:SS
   */
  formatTimeRemaining(): string {
    return this.formatTime(this.state.timeRemaining);
  }

  /**
   * Format time elapsed as MM:SS
   */
  formatTimeElapsed(): string {
    return this.formatTime(this.state.elapsed);
  }

  /**
   * Format seconds to MM:SS
   */
  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  /**
   * Get progress percentage (0-100)
   */
  getProgress(): number {
    if (this.state.totalTime === 0) return 0;
    return Math.round((this.state.elapsed / this.state.totalTime) * 100);
  }

  /**
   * Register callback for timer updates
   */
  onUpdate(callback: TimerCallback): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Register callback for timer expiration
   */
  onExpire(callback: () => void): void {
    this.onExpireCallback = callback;
  }

  /**
   * Add extra time (accommodations)
   */
  addExtraTime(seconds: number): void {
    this.state.timeRemaining += seconds;
    this.state.totalTime += seconds;
    this.notifyCallbacks();
  }

  // ============================================================
  // PRIVATE METHODS
  // ============================================================

  /**
   * Start the interval timer
   */
  private startInterval(): void {
    this.stopInterval();
    this.intervalId = setInterval(() => this.tick(), 1000); // Tick every 1 second
  }

  /**
   * Stop the interval timer
   */
  private stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Handle each tick
   */
  private tick(): void {
    if (this.state.phase === 'idle' || this.state.phase === 'expired') {
      return;
    }

    // Calculate elapsed
    if (this.state.startedAt) {
      this.state.elapsed = Math.round((Date.now() - this.state.startedAt) / 1000);
      this.state.timeRemaining = Math.max(0, this.state.totalTime - this.state.elapsed);
    }

    // Check warnings
    this.updateWarningLevel();

    // Check expiration
    if (this.state.timeRemaining <= 0) {
      this.state.timeRemaining = 0;
      this.state.phase = 'expired';
      this.state.warningLevel = 'critical';
      this.state.isWarning = true;
      this.stopInterval();
      this.notifyCallbacks();
      
      if (this.onExpireCallback) {
        this.onExpireCallback();
      }
      return;
    }

    this.notifyCallbacks();
  }

  /**
   * Update warning level based on thresholds
   */
  private updateWarningLevel(): void {
    const remaining = this.state.timeRemaining;
    const thresholds = this.config.warningThresholds;
    
    this.state.isWarning = remaining <= Math.max(...thresholds);
    
    if (remaining <= 30) {
      this.state.warningLevel = 'critical';
    } else if (remaining <= 60) {
      this.state.warningLevel = 'medium';
    } else if (remaining <= 120) {
      this.state.warningLevel = 'low';
    } else {
      this.state.warningLevel = 'none';
    }
  }

  /**
   * Notify all registered callbacks
   */
  private notifyCallbacks(): void {
    const state = this.getState();
    for (const callback of this.callbacks) {
      try {
        callback(state);
      } catch (error) {
        console.error('Timer callback error:', error);
      }
    }
  }

  /**
   * Cleanup on destroy
   */
  destroy(): void {
    this.stopInterval();
    this.callbacks = [];
    this.onExpireCallback = null;
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Create default timer config
 */
export function createDefaultTimerConfig(): TimerConfig {
  return { ...DEFAULT_CONFIG };
}

/**
 * Create timer config for specific station duration
 */
export function createStationTimerConfig(stationMinutes: number, readingSeconds: number = 60): TimerConfig {
  return {
    readingTime: readingSeconds,
    stationTime: stationMinutes * 60,
    betweenStationsTime: 60,
    warningThresholds: [
      Math.min(120, stationMinutes * 30),  // 2 min or 25% of time
      Math.min(60, stationMinutes * 15),   // 1 min or 12.5% of time
      30,
    ],
  };
}

/**
 * Get warning color based on level
 */
export function getWarningColor(level: 'none' | 'low' | 'medium' | 'critical'): string {
  const colors = {
    'none': '#38BDF8',     // Blue (normal)
    'low': '#F59E0B',      // Amber
    'medium': '#F97316',   // Orange
    'critical': '#EF4444', // Red
  };
  return colors[level];
}

/**
 * Get warning message
 */
export function getWarningMessage(level: 'none' | 'low' | 'medium' | 'critical', remaining: number): string {
  if (level === 'critical' && remaining <= 10) {
    return '⏰ TIME ALMOST UP!';
  }
  
  const messages = {
    'none': '',
    'low': '⚠️ 2 minutes remaining',
    'medium': '⚠️ 1 minute remaining',
    'critical': '🔴 30 seconds!',
  };
  
  return messages[level];
}

export default OSCETimer;
