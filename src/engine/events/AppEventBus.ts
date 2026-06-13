// ============================================
// App Event Bus — Typed External Events
// ============================================

import { isValidEventType } from './EventRegistry';

export interface AppEvent {
  type: string;
  payload?: unknown;
  timestamp: number;
}

type AppEventHandler = (event: AppEvent) => void;

export class AppEventBus {
  private handlers: Map<string, AppEventHandler[]> = new Map();
  private static instance: AppEventBus;

  static getInstance(): AppEventBus {
    if (!AppEventBus.instance) AppEventBus.instance = new AppEventBus();
    return AppEventBus.instance;
  }

  on(event: string, handler: AppEventHandler): () => void {
    const existing = this.handlers.get(event) || [];
    existing.push(handler);
    this.handlers.set(event, existing);
    return () => {
      const handlers = this.handlers.get(event) || [];
      this.handlers.set(event, handlers.filter(h => h !== handler));
    };
  }

  emit(event: string, payload?: unknown): void {
    const appEvent: AppEvent = { type: event, payload, timestamp: Date.now() };
    (this.handlers.get(event) || []).forEach(h => h(appEvent));
    (this.handlers.get('*') || []).forEach(h => h(appEvent));
  }

  removeAllListeners(): void { this.handlers.clear(); }
}

export default AppEventBus;
