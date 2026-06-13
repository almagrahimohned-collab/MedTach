// ============================================
// Plugin Health Monitor — Performance Tracking
// ============================================

export interface PluginStats {
  pluginName: string;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  timeoutCalls: number;
  avgExecutionTime: number;
  maxExecutionTime: number;
  successRate: number;
  lastExecutedAt: number | null;
  health: 'healthy' | 'degraded' | 'unhealthy';
}

export interface HealthReport {
  timestamp: number;
  overallHealth: 'healthy' | 'degraded' | 'unhealthy';
  plugins: PluginStats[];
  summary: {
    totalPlugins: number;
    healthyPlugins: number;
    degradedPlugins: number;
    unhealthyPlugins: number;
    averageSuccessRate: number;
  };
}

export class PluginHealthMonitor {
  private stats: Map<string, {
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
    timeoutCalls: number;
    executionTimes: number[];
    lastExecutedAt: number | null;
  }> = new Map();

  recordExecution(pluginName: string, success: boolean, executionTime: number, timeout: boolean = false): void {
    if (!this.stats.has(pluginName)) {
      this.stats.set(pluginName, {
        totalCalls: 0, successfulCalls: 0, failedCalls: 0,
        timeoutCalls: 0, executionTimes: [], lastExecutedAt: null
      });
    }

    const stat = this.stats.get(pluginName)!;
    stat.totalCalls++;
    stat.executionTimes.push(executionTime);
    stat.lastExecutedAt = Date.now();

    if (timeout) {
      stat.timeoutCalls++;
      stat.failedCalls++;
    } else if (success) {
      stat.successfulCalls++;
    } else {
      stat.failedCalls++;
    }

    if (stat.executionTimes.length > 100) {
      stat.executionTimes = stat.executionTimes.slice(-100);
    }
  }

  getHealthReport(): HealthReport {
    const plugins: PluginStats[] = [];
    
    for (const [name, stat] of this.stats.entries()) {
      const successRate = stat.totalCalls > 0 ? (stat.successfulCalls / stat.totalCalls) * 100 : 0;
      const avgTime = stat.executionTimes.length > 0
        ? stat.executionTimes.reduce((a, b) => a + b, 0) / stat.executionTimes.length : 0;
      const maxTime = stat.executionTimes.length > 0 ? Math.max(...stat.executionTimes) : 0;
      
      const health: 'healthy' | 'degraded' | 'unhealthy' = 
        successRate < 50 || stat.timeoutCalls > 5 ? 'unhealthy' :
        successRate < 80 || stat.timeoutCalls > 0 ? 'degraded' : 'healthy';

      plugins.push({
        pluginName: name,
        totalCalls: stat.totalCalls,
        successfulCalls: stat.successfulCalls,
        failedCalls: stat.failedCalls,
        timeoutCalls: stat.timeoutCalls,
        avgExecutionTime: Math.round(avgTime * 100) / 100,
        maxExecutionTime: maxTime,
        successRate: Math.round(successRate * 100) / 100,
        lastExecutedAt: stat.lastExecutedAt,
        health
      });
    }

    const healthyPlugins = plugins.filter(p => p.health === 'healthy').length;
    const degradedPlugins = plugins.filter(p => p.health === 'degraded').length;
    const unhealthyPlugins = plugins.filter(p => p.health === 'unhealthy').length;

    return {
      timestamp: Date.now(),
      overallHealth: unhealthyPlugins > 0 ? 'unhealthy' : degradedPlugins > 0 ? 'degraded' : 'healthy',
      plugins,
      summary: {
        totalPlugins: plugins.length,
        healthyPlugins,
        degradedPlugins,
        unhealthyPlugins,
        averageSuccessRate: plugins.length > 0
          ? Math.round(plugins.reduce((s, p) => s + p.successRate, 0) / plugins.length * 100) / 100
          : 0
      }
    };
  }

  isSystemHealthy(): boolean {
    return this.getHealthReport().overallHealth !== 'unhealthy';
  }

  reset(): void { this.stats.clear(); }
}

export default PluginHealthMonitor;
