// ============================================
// Deterministic Random — Replayable Randomness
// ============================================

export class DeterministicRandom {
  private seed: number;
  private initialState: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed;
    this.initialState = seed;
  }

  // Mulberry32 algorithm — fast, deterministic, good distribution
  next(): number {
    this.seed |= 0;
    this.seed = this.seed + 0x6D2B79F5 | 0;
    let t = Math.imul(this.seed ^ this.seed >>> 15, 1 | this.seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  // Get random integer between min and max (inclusive)
  range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Pick random element from array
  pick<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }

  // Shuffle array (Fisher-Yates with deterministic seed)
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Get current seed (for saving/replay)
  getSeed(): number {
    return this.seed;
  }

  // Reset to initial state
  reset(): void {
    this.seed = this.initialState;
  }

  // Create a snapshot for replay
  snapshot(): { seed: number; initialState: number } {
    return { seed: this.seed, initialState: this.initialState };
  }

  // Restore from snapshot
  restore(snapshot: { seed: number; initialState: number }): void {
    this.seed = snapshot.seed;
    this.initialState = snapshot.initialState;
  }
}

export default DeterministicRandom;
