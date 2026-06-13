// ============================================
// Debug Mode — Fail-Fast for Development
// ============================================

export type DebugLevel = 'off' | 'error' | 'warn' | 'info' | 'verbose';

export interface DebugConfig {
  level: DebugLevel;
  failFast: boolean;
  tracePlugins: boolean;
  validateResults: boolean;
  measurePerformance: boolean;
}

const DEFAULT_CONFIG: DebugConfig = {
  level: 'error',
  failFast: false,
  tracePlugins: false,
  validateResults: false,
  measurePerformance: false,
};

export class DebugMode {
  private config: DebugConfig;
  private static instance: DebugMode;

  private constructor() {
    this.config = { ...DEFAULT_CONFIG };
  }

  static getInstance(): DebugMode {
    if (!DebugMode.instance) DebugMode.instance = new DebugMode();
    return DebugMode.instance;
  }

  configure(config: Partial<DebugConfig>): void {
    this.config = { ...this.config, ...config };
  }

  enable(): void {
    this.configure({ level: 'verbose', failFast: true, tracePlugins: true, validateResults: true, measurePerformance: true });
  }

  disable(): void {
    this.configure(DEFAULT_CONFIG);
  }

  isFailFast(): boolean { return this.config.failFast; }
  shouldTrace(): boolean { return this.config.tracePlugins; }
  shouldValidate(): boolean { return this.config.validateResults; }

  log(level: DebugLevel, message: string, ...args: any[]): void {
    const levels: DebugLevel[] = ['off', 'error', 'warn', 'info', 'verbose'];
    if (levels.indexOf(level) <= levels.indexOf(this.config.level)) {
      const prefix = level === 'error' ? '🔴' : level === 'warn' ? '🟡' : level === 'info' ? '🔵' : '⚪';
      console.log(`[Debug ${prefix}] ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]): void { this.log('error', message, ...args); }
  warn(message: string, ...args: any[]): void { this.log('warn', message, ...args); }
  info(message: string, ...args: any[]): void { this.log('info', message, ...args); }
  verbose(message: string, ...args: any[]): void { this.log('verbose', message, ...args); }

  getConfig(): DebugConfig { return { ...this.config }; }
}

export default DebugMode;
