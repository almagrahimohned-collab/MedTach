// ============================================
// Event Bus — Typed Internal Events
// ============================================

import { EngineEvent } from '../core/types';
import { isValidEventType } from './EventRegistry';

type EventHandler = (event: EngineEvent) => void;

export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();
  private history: EngineEvent[] = [];
  private debugMode: boolean = false;

  constructor(debug: boolean = false) {
    this.debugMode = debug;
  }

  on(eventType: string, handler: EventHandler): () => void {
    const existing = this.handlers.get(eventType) || [];
    existing.push(handler);
    this.handlers.set(eventType, existing);
    
    return () => {
      const handlers = this.handlers.get(eventType) || [];
      this.handlers.set(eventType, handlers.filter(h => h !== handler));
    };
  }

  emit(eventType: string, payload?: unknown): void {
    // Validate event type in debug mode
    if (this.debugMode && !isValidEventType(eventType)) {
      console.warn(`[EventBus] Unknown event type: ${eventType}`);
    }

    const event: EngineEvent = {
      type: eventType,
      payload,
      timestamp: Date.now()
    };
    
    this.history.push(event);
    
    // Notify specific handlers
    const handlers = this.handlers.get(eventType) || [];
    handlers.forEach(handler => handler(event));
    
    // Notify wildcard listeners
    const wildcardHandlers = this.handlers.get('*') || [];
    wildcardHandlers.forEach(handler => handler(event));

    if (this.debugMode) {
      console.log(`[EventBus] ${eventType}`, payload ? JSON.stringify(payload).slice(0, 100) : '');
    }
  }

  getHistory(): EngineEvent[] { return [...this.history]; }
  clearHistory(): void { this.history = []; }
  removeAllListeners(): void { this.handlers.clear(); }
  private static instance: EventBus;

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

}

export default EventBus;
