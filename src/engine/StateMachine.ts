export enum PatientState {
  INITIAL = 'INITIAL',
  STABLE = 'STABLE',
  IMPROVING = 'IMPROVING',
  DETERIORATING = 'DETERIORATING',
  CRITICAL = 'CRITICAL',
  DISCHARGED = 'DISCHARGED',
  DECEASED = 'DECEASED'
}

export enum StateEvent {
  CORRECT_DIAGNOSIS = 'CORRECT_DIAGNOSIS',
  CORRECT_TREATMENT = 'CORRECT_TREATMENT',
  INCORRECT_TREATMENT = 'INCORRECT_TREATMENT',
  DELAY = 'DELAY',
  CRITICAL_INTERVENTION = 'CRITICAL_INTERVENTION',
  MISSED_DIAGNOSIS = 'MISSED_DIAGNOSIS'
}

interface StateTransition {
  from: PatientState;
  event: StateEvent;
  to: PatientState;
}

export class StateMachine {
  private currentState: PatientState;
  private transitions: StateTransition[];
  private timeInState: number = 0;
  private eventLog: Array<{ event: StateEvent; timestamp: number; newState: PatientState }> = [];

  constructor(initialState: PatientState = PatientState.INITIAL) {
    this.currentState = initialState;
    this.transitions = [
      { from: PatientState.INITIAL, event: StateEvent.CORRECT_DIAGNOSIS, to: PatientState.STABLE },
      { from: PatientState.INITIAL, event: StateEvent.DELAY, to: PatientState.DETERIORATING },
      { from: PatientState.STABLE, event: StateEvent.CORRECT_TREATMENT, to: PatientState.IMPROVING },
      { from: PatientState.STABLE, event: StateEvent.INCORRECT_TREATMENT, to: PatientState.DETERIORATING },
      { from: PatientState.IMPROVING, event: StateEvent.CORRECT_TREATMENT, to: PatientState.DISCHARGED },
      { from: PatientState.DETERIORATING, event: StateEvent.CRITICAL_INTERVENTION, to: PatientState.STABLE },
      { from: PatientState.DETERIORATING, event: StateEvent.DELAY, to: PatientState.CRITICAL },
      { from: PatientState.CRITICAL, event: StateEvent.CRITICAL_INTERVENTION, to: PatientState.STABLE },
      { from: PatientState.CRITICAL, event: StateEvent.DELAY, to: PatientState.DECEASED },
      { from: PatientState.CRITICAL, event: StateEvent.MISSED_DIAGNOSIS, to: PatientState.DECEASED },
    ];
  }

  getCurrentState(): PatientState { return this.currentState; }
  getTimeInState(): number { return this.timeInState; }
  getEventLog() { return [...this.eventLog]; }
  isTerminal(): boolean { return this.currentState === PatientState.DISCHARGED || this.currentState === PatientState.DECEASED; }
  isAlive(): boolean { return this.currentState !== PatientState.DECEASED; }

  transition(event: StateEvent): PatientState {
    const valid = this.transitions.find(t => t.from === this.currentState && t.event === event);
    if (valid) {
      this.timeInState = 0;
      this.eventLog.push({ event, timestamp: Date.now(), newState: valid.to });
      this.currentState = valid.to;
    }
    return this.currentState;
  }

  canTransition(event: StateEvent): boolean {
    return this.transitions.some(t => t.from === this.currentState && t.event === event);
  }

  getAvailableEvents(): StateEvent[] {
    return this.transitions.filter(t => t.from === this.currentState).map(t => t.event);
  }

  reset(): void {
    this.currentState = PatientState.INITIAL;
    this.timeInState = 0;
    this.eventLog = [];
  }

  tick(deltaTime: number = 1): void { this.timeInState += deltaTime; }
}

export default StateMachine;
